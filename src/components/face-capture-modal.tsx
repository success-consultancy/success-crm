'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ScanFace } from 'lucide-react';

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
  computeEyeAspectRatio,
  descriptorToArray,
  detectBlinkInSamples,
  detectFaceWithLandmarks,
  extractDescriptor,
  extractDescriptorAveraged,
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

const SAMPLE_INTERVAL_MS = 150;

// Auto-capture once the face has been detected on this many consecutive
// frames. At 150ms per tick that's ~1.2s of continuous, in-frame, large-
// enough face — equivalent to Face ID / FaceIO's "hold still" gating.
const STABILITY_FRAMES = 8;

// Face must occupy at least this fraction of the video width — keeps very
// small / far faces from passing the stability check with a noisy descriptor.
const MIN_FACE_WIDTH_RATIO = 0.18;

// A stably-framed face alone doesn't prove a live person is present — a
// printed photo or a phone screen held in front of the camera passes that
// check trivially. Once framing is stable we require a real blink
// (detectBlinkInSamples, EAR-based) before capturing. A person blinks every
// few seconds on their own; a static photo never will, so it just times out.
const LIVENESS_TIMEOUT_MS = 8000;

const COPY: Record<Mode, { title: string; sub: string; capturing: string }> = {
  enroll: {
    title: 'Enroll your face',
    sub: 'Look at the camera, hold still, then blink naturally — we capture automatically.',
    capturing: 'Capturing — hold still…',
  },
  auth: {
    title: 'Scan your face',
    sub: 'Look at the camera, hold still, then blink naturally — we sign you in automatically.',
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
  const stableFramesRef = useRef(0);
  const captureStartedRef = useRef(false);
  const earSamplesRef = useRef<number[]>([]);
  const livenessStartRef = useRef<number | null>(null);

  const resetCaptureState = useCallback(() => {
    setErrorMsg(null);
    setProgress(0);
    setHint('Looking for your face…');
    stableFramesRef.current = 0;
    captureStartedRef.current = false;
    earSamplesRef.current = [];
    livenessStartRef.current = null;
  }, []);

  // Kick off model load on open; transition to 'align' once they're ready.
  useEffect(() => {
    if (!open) return;
    resetCaptureState();
    if (modelStatus === 'ready') {
      setPhase('align');
    } else {
      setPhase('loading');
      void loadModels();
    }
  }, [open, modelStatus, loadModels, resetCaptureState]);

  useEffect(() => {
    if (phase === 'loading' && modelStatus === 'ready') setPhase('align');
    if (modelStatus === 'error' && phaseRef.current !== 'error') {
      setPhase('error');
      setErrorMsg(modelError?.message ?? 'Could not load face models. Refresh and try again.');
    }
  }, [phase, modelStatus, modelError]);

  const triggerCapture = useCallback(async () => {
    if (phaseRef.current !== 'liveness') return;
    const video = webcamRef.current?.video;
    if (!video || video.readyState < 2) return;
    setPhase('capturing');
    try {
      const desc =
        mode === 'enroll'
          ? await extractDescriptorAveraged(video, 3, 200)
          : await extractDescriptor(video);
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
  // descriptor: 'align' (face continuously detected, frontal-ish, and large
  // enough for ~1.2s) then 'liveness' (a real blink observed within
  // LIVENESS_TIMEOUT_MS). Losing the face during liveness drops back to
  // align rather than resetting the whole modal, so a person who just moved
  // isn't punished with a full restart.
  useEffect(() => {
    if (!open || (phase !== 'align' && phase !== 'liveness')) return;
    let cancelled = false;
    const tick = async () => {
      const video = webcamRef.current?.video;
      if (cancelled || !video || video.readyState < 2) return;
      let result;
      try {
        result = await detectFaceWithLandmarks(video);
      } catch {
        return;
      }
      if (cancelled) return;

      const backToAlign = () => {
        stableFramesRef.current = 0;
        earSamplesRef.current = [];
        setProgress(0);
        if (phaseRef.current === 'liveness') setPhase('align');
      };

      if (!result) {
        backToAlign();
        setHint('Looking for your face…');
        return;
      }
      const faceWidth = result.detection.box.width;
      const videoWidth = video.videoWidth || video.clientWidth || 640;
      if (faceWidth / videoWidth < MIN_FACE_WIDTH_RATIO) {
        backToAlign();
        setHint('Move closer to the camera.');
        return;
      }

      if (phaseRef.current === 'align') {
        stableFramesRef.current += 1;
        const ratio = Math.min(1, stableFramesRef.current / STABILITY_FRAMES);
        setProgress(ratio);
        setHint(ratio < 1 ? 'Hold still…' : 'Now blink naturally…');
        if (stableFramesRef.current >= STABILITY_FRAMES) {
          earSamplesRef.current = [];
          livenessStartRef.current = Date.now();
          setPhase('liveness');
        }
        return;
      }

      // phase === 'liveness'
      earSamplesRef.current = [...earSamplesRef.current, computeEyeAspectRatio(result.landmarks)].slice(-40);
      const elapsed = Date.now() - (livenessStartRef.current ?? Date.now());
      setProgress(Math.min(1, elapsed / LIVENESS_TIMEOUT_MS));
      setHint('Blink naturally to confirm it’s really you…');

      if (detectBlinkInSamples(earSamplesRef.current) && !captureStartedRef.current) {
        captureStartedRef.current = true;
        void triggerCapture();
        return;
      }
      if (elapsed > LIVENESS_TIMEOUT_MS) {
        setPhase('error');
        setErrorMsg("We couldn't confirm you're really there. Blink naturally and try again.");
      }
    };
    const id = window.setInterval(() => void tick(), SAMPLE_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [open, phase, triggerCapture]);

  const handleRetry = useCallback(() => {
    resetCaptureState();
    setPhase('align');
  }, [resetCaptureState]);

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
          {open && phase !== 'error' && (
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
              onUserMediaError={handleCameraError}
              className="w-full h-full object-cover"
            />
          )}
          {(phase === 'align' || phase === 'liveness') && (
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/40">
              <div
                className="h-full bg-green-400 transition-[width] duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="text-xs text-gray-600 min-h-[1.25rem]">
          {phase === 'loading' && 'Loading face models (~7 MB)…'}
          {(phase === 'align' || phase === 'liveness') && hint}
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
