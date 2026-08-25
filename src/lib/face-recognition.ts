'use client';

import * as faceapi from 'face-api.js';

/**
 * Wrapper around face-api.js for our face-login flow.
 *
 *  - Models are loaded once per page lifetime from `/public/models/`.
 *    Use `loadFaceModels()` (idempotent) or the `useFaceModels` hook.
 *  - Descriptors are 128-element Float32Array vectors. The backend stores
 *    them as JSON arrays and matches via Euclidean distance.
 *  - Threshold convention is 0.6 (face-api.js docs / 99.38% on LFW).
 *  - Blink detection uses Eye Aspect Ratio (EAR) on the 68-point landmarks.
 */

export const FACE_DESCRIPTOR_LENGTH = 128;
export const DEFAULT_MATCH_THRESHOLD = 0.6;
export const DEFAULT_MODELS_URL = '/models';

// Adaptive blink detection — see `detectBlinkInSamples`. We don't use a fixed
// EAR cutoff because the absolute baseline varies a lot by person (eye shape,
// glasses, lighting). These ratios are applied against each user's own
// open-eye baseline computed from the rolling sample window.
//
// These used to be far more lenient (0.85) to compensate for a sample rate so
// slow that callers only ever caught the shoulders of a blink, never its
// trough. Now that `detectFaceForTracking` samples fast enough to land inside
// the ~100ms closed phase, a real blink shows its true depth — EAR drops
// 40-60% below baseline — so these are in practice much more forgiving than
// the old values, while staying out of reach of the landmark jitter of a
// printed photo or a phone screen.
const BLINK_DROP_RATIO = 0.85; // dip to ≤85% of baseline counts as "closed"
const BLINK_MIN_ABSOLUTE_DROP = 0.025; // …and the dip must clear landmark noise
const BLINK_OPEN_RATIO = 0.95; // eyes must have been genuinely open first
const BLINK_MIN_SAMPLES = 5;

// Recovery is measured as a rebound from the trough, not as a return to the
// pre-blink baseline. Eyes very often settle a little narrower right after a
// blink, so the old "back to ≥92% of baseline" test could watch a perfectly
// good blink go down and simply never call it back up — the dip then slid out
// of the sample window before the baseline decayed enough to notice. That
// made success depend on how wide someone's eyes happened to reopen, which is
// exactly the "sometimes it works" failure. Half the depth back is
// unmistakably a reopening, and a static photo still never dips at all.
const BLINK_REBOUND_FRACTION = 0.5;

// Tracking-loop resolution. The detector's cost scales with inputSize², so
// 416 → 288 on a downscaled frame is ~2x cheaper per pass; the landmark net
// runs on a fixed 112px crop either way. At the 0.18 face-width ratio callers
// enforce, the face is still ~86px wide here — enough for usable eye
// landmarks.
const TRACKING_CANVAS_WIDTH = 480;
const TRACKING_INPUT_SIZE = 288; // face-api requires a multiple of 32

// Running the detector every pass caps EAR sampling at roughly 14/sec, which
// is only 1-2 samples inside a blink's ~100ms closed phase — and those land on
// the shoulders of the dip rather than its floor, so a full closure measures
// as a shallow 20% drop instead of the ~60% it really is. The face barely
// moves between frames, so we re-detect only occasionally and spend the frames
// in between on the landmark net alone, which reads a small face crop and is
// far cheaper than the detector.
const BOX_REFRESH_MS = 300;
const EYE_CROP_SIZE = 112; // the landmark net's own input resolution

let modelsLoaded = false;
let modelsLoadPromise: Promise<void> | null = null;

// Full-quality options — used wherever a descriptor is extracted.
const detectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 416,
  scoreThreshold: 0.5,
});

// Tracking options — cheaper, and slightly more permissive so one marginal
// frame doesn't drop the face and reset the caller's progress.
const trackingOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: TRACKING_INPUT_SIZE,
  scoreThreshold: 0.4,
});

type FaceInput = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;
type Pt = { x: number; y: number };

export async function loadFaceModels(modelsUrl: string = DEFAULT_MODELS_URL): Promise<void> {
  if (modelsLoaded) return;
  if (modelsLoadPromise) return modelsLoadPromise;
  modelsLoadPromise = (async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrl),
      // Full 68-point landmark net (350 KB). The tiny variant has a
      // compressed EAR dynamic range that breaks blink detection for some
      // users; full landmarks are well worth the extra ~270 KB.
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelsUrl),
    ]);
    modelsLoaded = true;
  })();
  try {
    await modelsLoadPromise;
  } catch (err) {
    modelsLoadPromise = null;
    throw err;
  }
}

export function areFaceModelsLoaded(): boolean {
  return modelsLoaded;
}

/**
 * Which TensorFlow.js backend is in use. 'webgl' is the fast path; a fall back
 * to 'cpu' makes every detection pass an order of magnitude slower, which
 * starves blink detection of samples. Worth checking before blaming the
 * thresholds when the gate feels unreliable on a particular machine.
 */
export function getFaceBackend(): string {
  return faceapi.tf.getBackend() ?? 'unknown';
}

export async function extractDescriptor(input: FaceInput): Promise<Float32Array | null> {
  const result = await faceapi
    .detectSingleFace(input, detectorOptions)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return result?.descriptor ?? null;
}

export async function detectFaceWithLandmarks(input: FaceInput) {
  return faceapi.detectSingleFace(input, detectorOptions).withFaceLandmarks();
}

/**
 * Capture N descriptors from successive frames and average them
 * component-wise. Single captures are sensitive to lighting/pose;
 * averaging tightens the cluster so the stored vector matches future
 * sightings of the same face more reliably.
 */
export async function extractDescriptorAveraged(
  input: FaceInput,
  count = 3,
  delayMs = 200,
): Promise<Float32Array | null> {
  const acc = new Float64Array(FACE_DESCRIPTOR_LENGTH);
  let collected = 0;
  for (let i = 0; i < count; i += 1) {
    const desc = await extractDescriptor(input);
    if (desc) {
      for (let j = 0; j < FACE_DESCRIPTOR_LENGTH; j += 1) acc[j] += desc[j];
      collected += 1;
    }
    if (i < count - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  if (collected === 0) return null;
  const out = new Float32Array(FACE_DESCRIPTOR_LENGTH);
  for (let j = 0; j < FACE_DESCRIPTOR_LENGTH; j += 1) out[j] = acc[j] / collected;
  return out;
}

export function descriptorToArray(d: Float32Array): number[] {
  return Array.from(d);
}

export function arrayToDescriptor(a: number[]): Float32Array {
  return new Float32Array(a);
}

export function euclideanDistance(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

// --- Blink detection (Eye Aspect Ratio) ---------------------------------

function pointDist(a: Pt, b: Pt): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function eyeAspectRatio(eye: Pt[]): number {
  if (eye.length < 6) return 1;
  const vertical = pointDist(eye[1], eye[5]) + pointDist(eye[2], eye[4]);
  const horizontal = 2 * pointDist(eye[0], eye[3]);
  return horizontal === 0 ? 1 : vertical / horizontal;
}

export function computeEyeAspectRatio(landmarks: faceapi.FaceLandmarks68): number {
  const left = eyeAspectRatio(landmarks.getLeftEye() as Pt[]);
  const right = eyeAspectRatio(landmarks.getRightEye() as Pt[]);
  return (left + right) / 2;
}

/**
 * The user's "eyes open" EAR level across a window of samples: the median of
 * the upper half.
 *
 * We used to take the plain maximum, which let a single jittery landmark
 * frame inflate the baseline — that both raised the bar for the dip and put
 * the recovery threshold out of reach, so a genuine blink could register as
 * "closed" and then never as "open again". The upper median tracks the
 * sustained open value and ignores one-frame spikes.
 */
export function openEyeBaseline(samples: number[]): number {
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const upper = sorted.slice(Math.floor(sorted.length / 2));
  return upper[Math.floor(upper.length / 2)] ?? 0;
}

/**
 * Adaptive blink detection. Looks for an open → closed → open sequence
 * relative to the user's own baseline rather than a fixed EAR cutoff:
 * absolute EAR varies a lot by person and lighting, but the *shape* of a
 * blink is stable.
 *
 * Requiring an open sample *before* the dip — not just dip-then-recover —
 * means a face that arrives mid-squint can't be read as a blink, and the
 * absolute-drop floor keeps landmark jitter on a static photo from passing.
 */
export function detectBlinkInSamples(samples: number[]): boolean {
  if (samples.length < BLINK_MIN_SAMPLES) return false;
  const baseline = openEyeBaseline(samples);
  if (baseline <= 0) return false;

  const closeThreshold = Math.min(
    baseline * BLINK_DROP_RATIO,
    baseline - BLINK_MIN_ABSOLUTE_DROP,
  );

  let sawOpen = false;
  let trough: number | null = null;
  for (const ear of samples) {
    // Ignore everything until the eyes have been properly open once, so a
    // face that arrives mid-squint can't have its recovery read as a blink.
    if (!sawOpen) {
      if (ear >= baseline * BLINK_OPEN_RATIO) sawOpen = true;
      continue;
    }
    // Rebound is measured from the trough we actually observed, so how wide
    // the eyes reopen relative to their earlier width doesn't decide the
    // outcome. This has to be tested before the "still closed" check below:
    // when the eyes settle narrower, the recovered samples can themselves sit
    // under closeThreshold (the baseline is held up by the wide-open samples
    // from before the blink), and classifying them as more trough is what
    // swallowed the blink.
    if (trough !== null && ear >= trough + BLINK_REBOUND_FRACTION * (baseline - trough)) {
      return true;
    }
    if (ear <= closeThreshold) trough = trough === null ? ear : Math.min(trough, ear);
  }
  return false;
}

// --- Live tracking ------------------------------------------------------

export interface TrackingSample {
  /** Averaged eye aspect ratio for this frame. */
  ear: number;
  /** Face width as a fraction of the frame width — scale-invariant. */
  faceWidthRatio: number;
}

let trackingCanvas: HTMLCanvasElement | null = null;

function drawScaled(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  targetWidth: number,
): boolean {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return false;
  const scale = Math.min(1, targetWidth / vw);
  const w = Math.round(vw * scale);
  const h = Math.round(vh * scale);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  ctx.drawImage(video, 0, 0, w, h);
  return true;
}

// Face box from the last detector pass, stored normalised (0..1) so it maps
// onto the source frame at any resolution.
let cachedBox: { x: number; y: number; size: number } | null = null;
let cachedBoxAt = 0;
let cachedWidthRatio = 0;
let eyeCanvas: HTMLCanvasElement | null = null;

/** Forget the tracked face — call when starting a fresh capture session. */
export function resetFaceTracking(): void {
  cachedBox = null;
  cachedBoxAt = 0;
  cachedWidthRatio = 0;
}

/**
 * Full detector pass: locates the face and caches its box. Returns the face
 * width as a fraction of the frame, or null if no face is found.
 */
async function locateFace(video: HTMLVideoElement): Promise<number | null> {
  if (!trackingCanvas) trackingCanvas = document.createElement('canvas');
  if (!drawScaled(video, trackingCanvas, TRACKING_CANVAS_WIDTH)) return null;
  // No .withFaceLandmarks() here — this pass exists only to find the box.
  const detection = await faceapi.detectSingleFace(trackingCanvas, trackingOptions);
  if (!detection) return null;

  const { x, y, width, height } = detection.box;
  const cw = trackingCanvas.width;
  const ch = trackingCanvas.height;
  // Square region centred on the box: the landmark net wants a square input,
  // and stretching a tall box into one would distort EAR.
  const side = Math.max(width, height);
  cachedBox = {
    x: (x + width / 2 - side / 2) / cw,
    y: (y + height / 2 - side / 2) / ch,
    size: side / cw,
  };
  cachedBoxAt = Date.now();
  cachedWidthRatio = width / cw;
  return cachedWidthRatio;
}

/**
 * Landmark-only pass over the cached box. This is the cheap frame — it skips
 * the detector entirely, which is what buys the sample rate needed to land
 * inside a blink rather than on its edges.
 */
async function sampleEar(video: HTMLVideoElement): Promise<number | null> {
  if (!cachedBox) return null;
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return null;

  const side = cachedBox.size * vw;
  const sx = cachedBox.x * vw;
  const sy = cachedBox.y * vh;
  // Clamp into frame — drawImage silently yields nothing for an out-of-bounds
  // source rect, and the box can straddle the edge when the face is close.
  const cx = Math.max(0, Math.min(sx, vw - 1));
  const cy = Math.max(0, Math.min(sy, vh - 1));
  const cw = Math.max(1, Math.min(side, vw - cx));
  const chh = Math.max(1, Math.min(side, vh - cy));

  if (!eyeCanvas) eyeCanvas = document.createElement('canvas');
  if (eyeCanvas.width !== EYE_CROP_SIZE) {
    eyeCanvas.width = EYE_CROP_SIZE;
    eyeCanvas.height = EYE_CROP_SIZE;
  }
  const ctx = eyeCanvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(video, cx, cy, cw, chh, 0, 0, EYE_CROP_SIZE, EYE_CROP_SIZE);

  const landmarks = await faceapi.nets.faceLandmark68Net.detectLandmarks(eyeCanvas);
  if (Array.isArray(landmarks)) return null;
  return computeEyeAspectRatio(landmarks);
}

/**
 * One pass of a live detection loop: a cheap landmark-only read of the tracked
 * face, re-running the detector only when the box goes stale or is lost.
 *
 * Every EAR sample comes from this one crop path, so all samples share a
 * geometry and a baseline. Mixing full-frame and cropped readings would put a
 * step change in the series that reads like a blink that never happened.
 */
export async function detectFaceForTracking(
  video: HTMLVideoElement,
): Promise<TrackingSample | null> {
  if (!cachedBox || Date.now() - cachedBoxAt > BOX_REFRESH_MS) {
    if ((await locateFace(video)) === null) {
      resetFaceTracking();
      return null;
    }
  }
  const ear = await sampleEar(video);
  if (ear === null) {
    // The box has drifted off the face — re-detect on the next pass.
    resetFaceTracking();
    return null;
  }
  return { ear, faceWidthRatio: cachedWidthRatio };
}

/**
 * A small ring of recent full-resolution frames.
 *
 * The descriptor has to come from a frame where the face is well framed and
 * the eyes are open — not from whatever the camera happens to show a beat
 * *after* the blink that unlocked capture. Callers keep good frames as they
 * go and extract from them once liveness passes, which also makes capture
 * instant instead of paying for another full detection pass.
 */
export interface FrameBuffer {
  /** Snapshot the current video frame, evicting the oldest. */
  keep(video: HTMLVideoElement): void;
  /** Kept frames, most recent first. */
  frames(): HTMLCanvasElement[];
  clear(): void;
}

export function createFrameBuffer(size = 3): FrameBuffer {
  const canvases: HTMLCanvasElement[] = [];
  let next = 0;
  let count = 0;
  return {
    keep(video) {
      if (canvases.length < size) canvases.push(document.createElement('canvas'));
      if (!drawScaled(video, canvases[next], video.videoWidth)) return;
      next = (next + 1) % size;
      count = Math.min(count + 1, size);
    },
    frames() {
      const out: HTMLCanvasElement[] = [];
      for (let i = 1; i <= count; i += 1) out.push(canvases[(next - i + size) % size]);
      return out;
    },
    clear() {
      next = 0;
      count = 0;
    },
  };
}

/** Average the descriptors of frames already captured into a FrameBuffer. */
export async function extractDescriptorFromFrames(
  frames: HTMLCanvasElement[],
): Promise<Float32Array | null> {
  const acc = new Float64Array(FACE_DESCRIPTOR_LENGTH);
  let collected = 0;
  for (const frame of frames) {
    const desc = await extractDescriptor(frame);
    if (!desc) continue;
    for (let j = 0; j < FACE_DESCRIPTOR_LENGTH; j += 1) acc[j] += desc[j];
    collected += 1;
  }
  if (collected === 0) return null;
  const out = new Float32Array(FACE_DESCRIPTOR_LENGTH);
  for (let j = 0; j < FACE_DESCRIPTOR_LENGTH; j += 1) out[j] = acc[j] / collected;
  return out;
}
