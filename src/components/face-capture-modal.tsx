'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Eye, EyeOff, ScanFace } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFaceModels } from '@/hooks/use-face-models';
import {
  areFaceModelsLoaded,
  createFrameBuffer,
  descriptorToArray,
  detectBlinkInSamples,
  detectFaceForTracking,
  extractDescriptorFromFrames,
  openEyeBaseline,
  resetFaceTracking,
  type FrameBuffer,
} from '@/lib/face-recognition';

type Mode = 'enroll' | 'auth';
type Phase = 'loading' | 'align' | 'liveness' | 'capturing' | 'error';

interface Props {
  mode: Mode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Called once a descriptor has been captured. Throw (or reject) to surface
   * an error inside the modal — the user can then retry without re-opening.
   * Resolve to close the modal.
   */
  onCapture: (descriptor: number[]) => Promise<void> | void;
}

// The detection loop is self-scheduling: each pass starts only once the
// previous one has resolved, with this much breathing room in between. A fixed
// setInterval fired regardless of whether the previous detection had finished,
// so passes piled up on the same TF.js backend and each got slower.
//
// Keep this just large enough to yield to the browser. A pass now costs ~20ms
// (landmark-only on the tracked box), so every extra millisecond here is lost
// sample rate — at 30ms it was capping the loop near 20/sec.
const TICK_GAP_MS = 10;

// Continuous good framing required before we start watching for a blink.
// Time-based rather than frame-based: the loop now runs as fast as the device
// allows, so a frame count would mean different things on different hardware.
const ALIGN_STABLE_MS = 700;

// Face must occupy at least this fraction of the video width — keeps very
// small / far faces from passing the stability check with a noisy descriptor.
const MIN_FACE_WIDTH_RATIO = 0.18;

// How long detection may keep failing before an attempt is abandoned. A brief
// miss (a glance away, a hand through frame) keeps the EAR window and the
// liveness clock intact instead of restarting the whole gauntlet. Expressed in
// time, not passes: as a count it silently shrank from ~430ms to ~115ms when
// the loop got faster, which would abandon an attempt on a momentary hiccup.
const MISS_GRACE_MS = 500;

// Rolling EAR window — must span a whole blink plus open frames either side,
// and be long enough that a couple of blinks can't dominate the open-eye
// baseline. ~3s at the measured ~35-50 passes/sec.
const EAR_WINDOW = 160;

// Frames kept for descriptor extraction. Enroll averages over all of them to
// tighten the stored vector; auth only needs the freshest.
const KEPT_FRAMES = 3;

// A stably-framed face alone doesn't prove a live person is present — a
// printed photo or a phone screen held in front of the camera passes that
// check trivially, so we require a real blink (detectBlinkInSamples,
// EAR-based) before capturing. This never hard-fails: the loop keeps
// scanning until the user blinks or cancels, and these thresholds only
// escalate the on-screen wording.
const HINT_NUDGE_MS = 3500;
const HINT_HELP_MS = 9000;

const COPY: Record<Mode, { title: string; sub: string; capturing: string }> = {
  enroll: {
    title: 'Enroll your face',
    sub: 'Center your face in the circle, then blink once. We capture automatically.',
    capturing: 'Capturing…',
  },
  auth: {
    title: 'Scan your face',
    sub: 'Center your face in the circle, then blink once. We sign you in automatically.',
    capturing: 'Identifying…',
  },
};

const FaceCaptureModal = ({ mode, open, onOpenChange, onCapture }: Props) => {
  const webcamRef = useRef<Webcam | null>(null);
  const { status: modelStatus, error: modelError, load: loadModels } = useFaceModels(false);

  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 stability progress for UI
  const [hint, setHint] = useState<string>('Looking for your face…');

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const hintRef = useRef(hint);
  const alignStartRef = useRef<number | null>(null);
  const captureStartedRef = useRef(false);
  const earSamplesRef = useRef<number[]>([]);
  const livenessStartRef = useRef<number | null>(null);
  const missSinceRef = useRef<number | null>(null);
  const framesRef = useRef<FrameBuffer | null>(null);
  if (!framesRef.current) framesRef.current = createFrameBuffer(KEPT_FRAMES);

  // The loop writes a hint on every pass; skip the re-render when it's the
  // same text it already shows.
  const showHint = useCallback((text: string) => {
    if (hintRef.current === text) return;
    hintRef.current = text;
    setHint(text);
  }, []);

  const resetCaptureState = useCallback(() => {
    setErrorMsg(null);
    setProgress(0);
    hintRef.current = 'Looking for your face…';
    setHint('Looking for your face…');
    alignStartRef.current = null;
    captureStartedRef.current = false;
    earSamplesRef.current = [];
    livenessStartRef.current = null;
    missSinceRef.current = null;
    framesRef.current?.clear();
    resetFaceTracking();
  }, []);

  // Kick off model load on open; transition to 'align' once they're ready.
  useEffect(() => {
    if (!open) return;
    resetCaptureState();
    setPhase(areFaceModelsLoaded() ? 'align' : 'loading');
    void loadModels();
  }, [open, loadModels, resetCaptureState]);

  useEffect(() => {
    if (!open) return;
    if (modelStatus === 'ready') setPhase((p) => (p === 'loading' ? 'align' : p));
    if (modelStatus === 'error') {
      setPhase('error');
      setErrorMsg(modelError?.message ?? 'Could not load face models. Refresh and try again.');
    }
  }, [open, modelStatus, modelError]);

  // Alternates the eye icon next to the prompt so the instruction can be
  // followed without reading it — the icon demonstrates the blink. The text
  // alone assumes the user knows what "blink once" means here, which is
  // exactly the assumption that trips up someone doing this for the first
  // time.
  const [demoClosed, setDemoClosed] = useState(false);
  useEffect(() => {
    if (phase !== 'liveness') return;
    const id = window.setInterval(() => setDemoClosed((c) => !c), 600);
    return () => window.clearInterval(id);
  }, [phase]);

  const triggerCapture = useCallback(async () => {
    // Extract from the frames we already kept while the face was well framed
    // and the eyes open, rather than detecting afresh on whatever the camera
    // shows now — that costs another full pass and can land on a frame where
    // the eyes are still half-closed from the blink, which shifts the
    // descriptor away from the enrolled one.
    const kept = framesRef.current?.frames() ?? [];
    setPhase('capturing');
    try {
      const desc = await extractDescriptorFromFrames(mode === 'enroll' ? kept : kept.slice(0, 1));
      if (!desc) {
        throw new Error('Could not capture a clear face. Improve lighting and try again.');
      }
      await onCapture(descriptorToArray(desc));
      onOpenChange(false);
    } catch (e) {
      setPhase('error');
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }, [mode, onCapture, onOpenChange]);

  // Detection loop — runs through two gates before we ever extract a
  // descriptor: 'align' (face continuously detected and large enough for
  // ALIGN_STABLE_MS) then 'liveness' (a real blink). It reads the phase from
  // a ref rather than taking it as a dependency, so moving between gates
  // doesn't tear down and restart the loop mid-scan.
  useEffect(() => {
    if (!open || modelStatus !== 'ready') return;
    let cancelled = false;
    let timer = 0;

    // A miss is only fatal to the current attempt once MISS_GRACE of them
    // stack up; until then we keep whatever progress the user has made.
    const onMiss = (message: string) => {
      showHint(message);
      if (missSinceRef.current === null) missSinceRef.current = Date.now();
      if (Date.now() - missSinceRef.current < MISS_GRACE_MS) return;
      alignStartRef.current = null;
      setProgress(0);
      if (phaseRef.current === 'liveness') {
        earSamplesRef.current = [];
        livenessStartRef.current = null;
        framesRef.current?.clear();
        setPhase('align');
      }
    };

    const tick = async () => {
      const active = phaseRef.current;
      if (active !== 'align' && active !== 'liveness') return;
      const video = webcamRef.current?.video;
      if (!video || video.readyState < 2) return;

      const sample = await detectFaceForTracking(video);
      if (cancelled) return;

      if (!sample) return onMiss('Center your face in the circle');
      if (sample.faceWidthRatio < MIN_FACE_WIDTH_RATIO) return onMiss('Move closer to the camera');
      missSinceRef.current = null;

      // One rolling EAR window spanning both gates. We used to clear it when
      // entering 'liveness', which threw away any blink the user made while
      // framing up — then asked them to blink again. Most people blink during
      // that hold on their own, so carrying the window means liveness is
      // usually already satisfied the moment framing is stable. Every sample
      // in it was still taken with the face well framed, so nothing is
      // conceded on the anti-spoof side.
      const samples = [...earSamplesRef.current, sample.ear].slice(-EAR_WINDOW);
      earSamplesRef.current = samples;

      // Only bank a frame while the eyes are open, so the descriptor is never
      // taken from the middle of the blink we're waiting for.
      const baseline = openEyeBaseline(samples);
      if (baseline <= 0 || sample.ear >= baseline * 0.95) framesRef.current?.keep(video);

      if (phaseRef.current === 'align') {
        if (alignStartRef.current === null) alignStartRef.current = Date.now();
        const held = Date.now() - alignStartRef.current;
        // Quantised so a steady hold doesn't re-render on every pass.
        setProgress(Math.round(Math.min(1, held / ALIGN_STABLE_MS) * 20) / 20);
        // Deliberately not "hold still" — told to hold still, people freeze
        // their eyes open too, and then the blink gate has nothing to catch.
        showHint('Keep looking at the camera');
        if (held >= ALIGN_STABLE_MS) {
          livenessStartRef.current = Date.now();
          setPhase('liveness');
        }
        return;
      }

      if (!captureStartedRef.current && detectBlinkInSamples(samples)) {
        captureStartedRef.current = true;
        void triggerCapture();
        return;
      }

      // No timeout: keep scanning and escalate the wording instead of
      // dead-ending on an error the user has to dismiss before retrying.
      // "Blink once" rather than "blink naturally" — nobody can blink
      // naturally on command, but anyone can blink once.
      const waiting = Date.now() - (livenessStartRef.current ?? Date.now());
      if (waiting > HINT_HELP_MS) {
        showHint('Move any hair or glare off your eyes, then blink once');
      } else if (waiting > HINT_NUDGE_MS) {
        showHint('Close your eyes and open them again');
      } else {
        showHint('Now blink once');
      }
    };

    // Self-scheduling: the next pass is queued only after this one settles,
    // so detections can never overlap and starve each other.
    const loop = async () => {
      try {
        await tick();
      } catch {
        // Transient detector failure — just try again on the next pass.
      }
      if (cancelled) return;
      timer = window.setTimeout(() => void loop(), TICK_GAP_MS);
    };
    void loop();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, modelStatus, showHint, triggerCapture]);

  const handleRetry = useCallback(() => {
    resetCaptureState();
    // If the weights are what failed, retrying the scan alone would sit there
    // doing nothing — the detection loop only runs once models are ready.
    if (areFaceModelsLoaded()) {
      setPhase('align');
    } else {
      setPhase('loading');
      void loadModels();
    }
  }, [loadModels, resetCaptureState]);

  const handleCameraError = useCallback((err: unknown) => {
    const msg =
      typeof err === 'string'
        ? err
        : err instanceof Error
          ? err.message
          : 'Could not access your camera. Check permissions and try again.';
    setPhase('error');
    setErrorMsg(msg);
  }, []);

  const copy = COPY[mode];
  const scanning = phase === 'align' || phase === 'liveness';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanFace className="w-5 h-5" />
            {copy.title}
          </DialogTitle>
          <DialogDescription>{copy.sub}</DialogDescription>
        </DialogHeader>

        <div className="aspect-video w-full overflow-hidden rounded-md border bg-black relative">
          {/* Kept mounted through the error phase — unmounting drops the
              camera stream, so retrying would pay for getUserMedia again. */}
          {open && (
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
              onUserMediaError={handleCameraError}
              className="w-full h-full object-cover"
            />
          )}
          {scanning && (
            <>
              {/* Where to put your face. A first-time user has no idea how
                  close or centred to be, and "move closer" in caption text
                  under the video never gets read — they're watching
                  themselves on screen, not the caption. */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className={`h-[80%] aspect-[3/4] rounded-[50%] border-4 transition-colors duration-300 ${
                    phase === 'liveness'
                      ? 'border-amber-400'
                      : progress > 0
                        ? 'border-green-400'
                        : 'border-white/40'
                  }`}
                />
              </div>

              {/* The instruction, on the video where the user is already
                  looking, over a scrim so it stays readable against any
                  background. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/85 to-transparent px-3 pt-10 pb-4">
                <p className="flex items-center gap-2 text-center text-sm font-semibold text-white">
                  {phase === 'liveness' &&
                    (demoClosed ? (
                      <EyeOff className="w-5 h-5 shrink-0" />
                    ) : (
                      <Eye className="w-5 h-5 shrink-0" />
                    ))}
                  {hint}
                </p>
                <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/25">
                  {/* Liveness has no deadline to count down, so its bar shows
                      that we're still watching rather than filling toward a
                      failure. */}
                  {phase === 'liveness' ? (
                    <div className="h-full w-full animate-pulse bg-amber-400" />
                  ) : (
                    <div
                      className="h-full bg-green-400 transition-[width] duration-150"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-gray-600 min-h-[1.25rem]">
          {phase === 'loading' && 'Loading face models (~7 MB)…'}
          {scanning && 'Face data is processed on your device.'}
          {phase === 'capturing' && copy.capturing}
          {phase === 'error' && (errorMsg ?? 'Something went wrong.')}
        </div>

        <div className="flex justify-end gap-2">
          {phase === 'error' && (
            <Button variant="outline" onClick={handleRetry}>
              Try again
            </Button>
          )}
          {phase !== 'capturing' && (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaceCaptureModal;
