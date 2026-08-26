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
import { createYielder, MIN_TIMER_MS, TARGET_PASS_INTERVAL_MS } from '@/lib/scheduler';
import {
  areFaceModelsLoaded,
  createFrameBuffer,
  descriptorToArray,
  extractDescriptorFromFrames,
  type FrameBuffer,
} from '@/lib/face-recognition';
import {
  detectBlinkInSamples,
  detectLiveness,
  eyesOpen,
  isLivenessModelLoaded,
  resetLivenessTracking,
} from '@/lib/face-liveness';

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
// previous one has resolved. A fixed setInterval fired regardless of whether
// the previous detection had finished, so passes piled up on the same TF.js
// backend and each got slower.
//
// Target cycle time, not a gap. A pass costs ~10ms (landmark-only on the
// tracked box), so this settles a fast device at ~60 passes/sec — six samples
// inside a blink's ~100ms closed phase, with enough headroom left that the
// browser can still paint the preview. On a slower device the pass alone
// exceeds this and the loop simply runs as fast as it can.
//
// Asking setTimeout for a 10ms gap was really costing 29ms, so the loop ran at
// 25 passes/sec instead of the ~90 the same detection path reaches in a tight
// loop. That left 2.5 samples inside a closure: two land on the way down and
// the way up, never the floor, so a full blink measured as a shallow dip and
// the liveness gate was right to reject it. That was the whole "I had to blink
// four times" bug — not the thresholds, and not the detector, but the clock.

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

// …and how long it must keep failing before the EAR window is thrown away.
// Deliberately much longer than MISS_GRACE_MS. Those samples are readings of
// the same face a fraction of a second ago, so discarding them the moment
// framing wobbles is what made a user blink, lose the face for two frames, and
// be asked to blink all over again. Dropping back to the align gate is enough
// of a reset for a wobble; a clean slate is for someone actually walking away.
const FACE_LOST_MS = 1800;

// Rolling window of blink scores. Only needs to span an open frame plus the
// closure that follows it, but a few seconds of slack costs nothing and lets a
// blink made during the framing hold still count once liveness starts.
const BLINK_WINDOW = 160;

// Frames kept for descriptor extraction. Enroll averages over all of them to
// tighten the stored vector; auth only needs the freshest.
const KEPT_FRAMES = 3;

// Minimum spacing between banked frames.
//
// Averaging only tightens the stored vector if the frames it averages differ:
// the point is to cancel out sensor noise and a moment's pose and lighting.
// A frame was previously banked on every open-eye pass, and once the loop
// reached ~90 passes/sec that made the three frames in the ring ~32ms apart —
// the same instant three times, averaged to no effect while paying for three
// descriptor extractions. Enrollment is the one capture that has to last, and
// every future clock-in is matched against it, so it's worth spreading.
// Spacing also stops the buffer copying a full-resolution frame ~90 times a
// second for the sake of keeping three.
const KEEP_FRAME_GAP_MS = 150;

// A stably-framed face alone doesn't prove a live person is present — a
// printed photo or a phone screen held in front of the camera passes that
// check trivially, so we require a real blink (detectBlinkInSamples,
// EAR-based) before capturing. This never hard-fails: the loop keeps
// scanning until the user blinks or cancels, and these thresholds only
// escalate the on-screen wording.
const HINT_NUDGE_MS = 3500;
const HINT_HELP_MS = 9000;

// Passes/sec below which the loop can no longer land inside a blink. /face-test
// draws the same line in red at 8; this is a little above it, because at the
// shallow EAR dips real cameras produce, catching only the shoulders of a
// closure is already a miss well before the sampling gets that bad.
const MIN_USABLE_PASS_RATE = 15;

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
  const [passRate, setPassRate] = useState(0);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  // Held in refs, not closed over, so `triggerCapture` — and through it the
  // detection loop's effect — keeps a stable identity. Both callers define
  // their `onCapture` inline, so it is a new function on every render of the
  // parent, and the loop was being torn down and restarted each time. On the
  // kiosk the parent almost never re-renders and this was invisible; on the
  // profile page it sits under the dashboard shell and a refetch of `useGetMe`
  // is enough to do it. Each restart drops the in-flight pass and the gap
  // between passes, which is how a blink ends up sampled only on its
  // shoulders.
  const onCaptureRef = useRef(onCapture);
  onCaptureRef.current = onCapture;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const hintRef = useRef(hint);
  const alignStartRef = useRef<number | null>(null);
  const captureStartedRef = useRef(false);
  const blinkSamplesRef = useRef<number[]>([]);
  const livenessStartRef = useRef<number | null>(null);
  const missSinceRef = useRef<number | null>(null);
  const lastKeptAtRef = useRef(0);
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
    blinkSamplesRef.current = [];
    livenessStartRef.current = null;
    missSinceRef.current = null;
    lastKeptAtRef.current = 0;
    framesRef.current?.clear();
    resetLivenessTracking();
  }, []);

  // Kick off model load on open; transition to 'align' once they're ready.
  useEffect(() => {
    if (!open) return;
    resetCaptureState();
    setPhase(areFaceModelsLoaded() && isLivenessModelLoaded() ? 'align' : 'loading');
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
      await onCaptureRef.current(descriptorToArray(desc));
      onOpenChangeRef.current(false);
    } catch (e) {
      setPhase('error');
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }, [mode]);

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
      const missedFor = Date.now() - missSinceRef.current;
      if (missedFor < MISS_GRACE_MS) return;
      alignStartRef.current = null;
      setProgress(0);
      if (missedFor >= FACE_LOST_MS) {
        blinkSamplesRef.current = [];
        lastKeptAtRef.current = 0;
        framesRef.current?.clear();
      }
      if (phaseRef.current === 'liveness') {
        livenessStartRef.current = null;
        setPhase('align');
      }
    };

    const tick = async () => {
      const active = phaseRef.current;
      if (active !== 'align' && active !== 'liveness') return;
      const video = webcamRef.current?.video;
      if (!video || video.readyState < 2) return;

      const result = detectLiveness(video);
      if (cancelled) return;

      // The loop deliberately runs faster than the camera, so most passes see
      // a frame they have already read. That is not a lost face and must not
      // touch the miss clock, or the grace period would expire while the user
      // sits perfectly still in front of the lens.
      if (result.status === 'stale') return;
      if (result.status === 'noface') return onMiss('Center your face in the circle');

      const { sample } = result;
      if (sample.faceWidthRatio < MIN_FACE_WIDTH_RATIO) return onMiss('Move closer to the camera');
      missSinceRef.current = null;

      // One rolling window of blink scores spanning both gates. We used to
      // clear it when entering 'liveness', which threw away any blink the user
      // made while framing up — then asked them to blink again. Most people
      // blink during that hold on their own, so carrying the window means
      // liveness is usually already satisfied the moment framing is stable.
      // Every sample in it was still taken with the face well framed, so
      // nothing is conceded on the anti-spoof side.
      const samples = [...blinkSamplesRef.current, sample.blink].slice(-BLINK_WINDOW);
      blinkSamplesRef.current = samples;

      // Only bank a frame while the eyes are open, so the descriptor is never
      // taken from the middle of the blink we're waiting for — and no more
      // often than KEEP_FRAME_GAP_MS, so the three in the ring are three
      // genuinely different moments rather than one moment three times.
      if (eyesOpen(sample) && Date.now() - lastKeptAtRef.current >= KEEP_FRAME_GAP_MS) {
        lastKeptAtRef.current = Date.now();
        framesRef.current?.keep(video);
      }

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
    let passes = 0;
    let rateWindowStart = performance.now();
    const yieldToEventLoop = createYielder();

    const loop = async () => {
      while (!cancelled) {
        const startedAt = performance.now();
        try {
          await tick();
        } catch {
          // Transient detector failure — just try again on the next pass.
        }
        if (cancelled) return;

        passes += 1;
        const elapsed = performance.now() - rateWindowStart;
        if (elapsed >= 1000) {
          setPassRate(Math.round((passes / elapsed) * 1000));
          passes = 0;
          rateWindowStart = performance.now();
        }

        // Sleep only when we're genuinely ahead of the target and the wait is
        // long enough for a timer to be honest about it; otherwise hand back
        // to the event loop and start the next pass immediately.
        const remaining = TARGET_PASS_INTERVAL_MS - (performance.now() - startedAt);
        if (remaining >= MIN_TIMER_MS) {
          await new Promise<void>((resolve) => {
            timer = window.setTimeout(resolve, remaining);
          });
        } else {
          await yieldToEventLoop();
        }
      }
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
    if (areFaceModelsLoaded() && isLivenessModelLoaded()) {
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
  // A blink's closed phase lasts ~100ms. Below this the loop samples it once
  // or twice at most, on the way down and the way up rather than at the floor,
  // and a real closure reads as a shallow dip the gate is right to reject.
  // That is a starved main thread, not a user who blinked wrong, and saying so
  // beats letting them blink a fourth time.
  const tooSlow = scanning && passRate > 0 && passRate < MIN_USABLE_PASS_RATE;

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
              // 60fps where the camera offers it: liveness samples can only
              // be as dense as the frames arriving, and a blink's closed phase
              // is ~100ms — three frames at 30fps, six at 60. Falls back to
              // whatever the device does.
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: 'user',
                frameRate: { ideal: 60 },
              }}
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
          {phase === 'loading' && 'Loading face models (~22 MB, cached after the first time)…'}
          {scanning && (
            <span className={tooSlow ? 'text-amber-700' : undefined}>
              {tooSlow
                ? `Camera loop is slow (${passRate}/sec) — close other tabs if this keeps missing.`
                : 'Face data is processed on your device.'}
              {passRate > 0 && !tooSlow && (
                <span className="text-gray-400"> · {passRate}/sec</span>
              )}
            </span>
          )}
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
