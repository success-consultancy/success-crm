'use client';

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

/**
 * Liveness detection via MediaPipe Face Mesh.
 *
 * This exists because face-api.js's 68-point landmark model cannot resolve
 * eyelid closure well enough to gate on. Measured on real hardware, eyes held
 * deliberately shut for three seconds moved EAR only 15-19% off its open
 * baseline - against landmark jitter that reaches ~14% on a static photo, and
 * with 4 points of run-to-run spread on the measurement itself. No threshold
 * separated a live blink from noise, and the crop was not at fault either:
 * face-api's own full-frame path read shallower (11%) than our tracking crop.
 *
 * MediaPipe replaces the geometric proxy with a trained one. eyeBlinkLeft and
 * eyeBlinkRight are blendshape outputs - a classifier for "is this eye closed"
 * rather than a ratio of landmark distances - so the signal spans nearly the
 * full 0..1 range instead of fifteen percent of it.
 *
 * Scope: liveness only. Face recognition still runs through face-api
 * (face-recognition.ts), because the stored descriptors and the backend's 0.6
 * distance threshold are built on it, and every existing enrollment would be
 * invalidated by a change there.
 */

export const DEFAULT_WASM_URL = '/mediapipe';
export const DEFAULT_LANDMARKER_URL = '/models/face_landmarker.task';

// Blendshape scores for a closed and an open eye. The gap between these is
// what the whole gate rests on, and unlike EAR there is plenty of it: an open
// eye sits near 0.02 and a closed one near 0.9. Deliberately asymmetric - the
// open bar is strict because it guards the "was ever open" precondition, and
// the closed bar is loose because it only has to beat classifier wobble.
const CLOSED_SCORE = 0.45;
const OPEN_SCORE = 0.2;

// Consecutive closed frames required. Webcams deliver 30fps, so a ~100ms
// closure is about three frames; two guards against a single misclassified
// frame without needing the closure to be held.
const CLOSED_FRAMES = 2;
const MIN_SAMPLES = 4;

let landmarker: FaceLandmarker | null = null;
let loadPromise: Promise<void> | null = null;
let usingDelegate: 'GPU' | 'CPU' | 'unloaded' = 'unloaded';
let lastTimestamp = -1;
let lastVideoTime = -1;

/** One reading of the blink classifier. */
export interface LivenessSample {
  /** Mean of both eyes, 0 (wide open) to 1 (shut). */
  blink: number;
  blinkLeft: number;
  blinkRight: number;
  /** Face width as a fraction of the frame width - scale-invariant. */
  faceWidthRatio: number;
}

/**
 * A pass either produced a reading, saw no face, or found that the camera had
 * not delivered a new frame yet.
 *
 * 'stale' is not 'noface'. The detection loop runs faster than the camera, so
 * repeat frames are normal and constant; treating them as a lost face would
 * fire the caller's miss handling several times a second.
 */
export type LivenessResult =
  | { status: 'sample'; sample: LivenessSample }
  | { status: 'stale' }
  | { status: 'noface' };

export async function loadLivenessModel(
  wasmUrl: string = DEFAULT_WASM_URL,
  modelUrl: string = DEFAULT_LANDMARKER_URL,
): Promise<void> {
  if (landmarker) return;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const fileset = await FilesetResolver.forVisionTasks(wasmUrl);
    const create = (delegate: 'GPU' | 'CPU') =>
      FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: modelUrl, delegate },
        runningMode: 'VIDEO',
        numFaces: 1,
        // The only output we actually use. The mesh comes along anyway and
        // gives us the framing check for free.
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: false,
      });
    try {
      landmarker = await create('GPU');
      usingDelegate = 'GPU';
    } catch {
      // Locked-down or headless GPU stacks fall back rather than hard-fail.
      // CPU is slower, but this model is small enough to stay usable.
      landmarker = await create('CPU');
      usingDelegate = 'CPU';
    }
  })();
  try {
    await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

export function isLivenessModelLoaded(): boolean {
  return landmarker !== null;
}

/**
 * Which delegate the model ended up on. 'CPU' means the GPU path was refused
 * and every pass costs several times more - worth checking before blaming the
 * thresholds when the gate feels sluggish on one machine.
 */
export function getLivenessDelegate(): string {
  return usingDelegate;
}

/** Forget per-session tracking state. Call when starting a fresh capture. */
export function resetLivenessTracking(): void {
  lastVideoTime = -1;
}

function scoreOf(categories: { categoryName: string; score: number }[], name: string): number {
  for (const c of categories) if (c.categoryName === name) return c.score;
  return 0;
}

/**
 * One pass of the live detection loop.
 *
 * MediaPipe tracks the face across frames internally, so there is no box to
 * cache, refresh, or lose here - the whole class of "the detector blinked at
 * the wrong moment and we dropped the face" bugs does not exist on this path.
 */
export function detectLiveness(video: HTMLVideoElement): LivenessResult {
  if (!landmarker) return { status: 'noface' };
  if (!video.videoWidth || !video.videoHeight) return { status: 'stale' };
  if (video.currentTime === lastVideoTime) return { status: 'stale' };
  lastVideoTime = video.currentTime;

  // detectForVideo rejects a timestamp that does not advance.
  const timestamp = Math.max(performance.now(), lastTimestamp + 1);
  lastTimestamp = timestamp;

  const result = landmarker.detectForVideo(video, timestamp);
  const landmarks = result.faceLandmarks?.[0];
  const blendshapes = result.faceBlendshapes?.[0]?.categories;
  if (!landmarks || !blendshapes) return { status: 'noface' };

  const blinkLeft = scoreOf(blendshapes, 'eyeBlinkLeft');
  const blinkRight = scoreOf(blendshapes, 'eyeBlinkRight');

  // Landmarks are normalised to the frame, so the spread in x is the face
  // width as a fraction of the frame.
  let minX = 1;
  let maxX = 0;
  for (const p of landmarks) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }

  return {
    status: 'sample',
    sample: {
      // Mean of both eyes: a real blink closes both, and a single
      // misclassified eye cannot carry the gate on its own.
      blink: (blinkLeft + blinkRight) / 2,
      blinkLeft,
      blinkRight,
      faceWidthRatio: Math.max(0, maxX - minX),
    },
  };
}

/**
 * Looks for an open then closed sequence in a window of blink scores.
 *
 * Requiring the eyes to have been seen open first is what carries the
 * anti-spoof: a photograph holds one expression forever, so it can present
 * open eyes or closed eyes but never the transition between them. Under EAR
 * that precondition was doing double duty, propping up a depth test that
 * barely cleared the noise. Here the transition is the whole test, and it is
 * measured on a classifier whose two states sit half the range apart.
 *
 * The reopen is not required. It added a second chance to lose the blink to a
 * dropped frame and bought nothing - nothing that is not a live face produces
 * a genuine open to closed transition in the first place.
 */
export function detectBlinkInSamples(samples: number[]): boolean {
  if (samples.length < MIN_SAMPLES) return false;
  let sawOpen = false;
  let closedRun = 0;
  for (const score of samples) {
    if (!sawOpen) {
      if (score <= OPEN_SCORE) sawOpen = true;
      continue;
    }
    if (score >= CLOSED_SCORE) {
      closedRun += 1;
      if (closedRun >= CLOSED_FRAMES) return true;
    } else {
      closedRun = 0;
    }
  }
  return false;
}

/** True when the eyes are open enough to take a descriptor from this frame. */
export function eyesOpen(sample: LivenessSample): boolean {
  return sample.blink <= OPEN_SCORE;
}

export const LIVENESS_THRESHOLDS = { CLOSED_SCORE, OPEN_SCORE, CLOSED_FRAMES };
