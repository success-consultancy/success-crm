'use client';

import * as faceapi from 'face-api.js';

/**
 * Face recognition via face-api.js.
 *
 *  - Models are loaded once per page lifetime from `/public/models/`.
 *    Use `loadFaceModels()` (idempotent) or the `useFaceModels` hook.
 *  - Descriptors are 128-element Float32Array vectors. The backend stores
 *    them as JSON arrays and matches via Euclidean distance.
 *  - Threshold convention is 0.6 (face-api.js docs / 99.38% on LFW).
 *
 * Recognition only. Liveness lives in `face-liveness.ts` and runs on
 * MediaPipe, because face-api's landmark model could not resolve eyelid
 * closure well enough to gate on — measured, not assumed; that file carries
 * the numbers. face-api stays here because the descriptors it produces are
 * what the backend has stored for every enrolled user, so this model cannot
 * be swapped without invalidating all of them.
 */

export const FACE_DESCRIPTOR_LENGTH = 128;
export const DEFAULT_MATCH_THRESHOLD = 0.6;
export const DEFAULT_MODELS_URL = '/models';

let modelsLoaded = false;
let modelsLoadPromise: Promise<void> | null = null;

// Full-quality options — used wherever a descriptor is extracted.
const detectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 416,
  scoreThreshold: 0.5,
});

type FaceInput = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

export async function loadFaceModels(modelsUrl: string = DEFAULT_MODELS_URL): Promise<void> {
  if (modelsLoaded) return;
  if (modelsLoadPromise) return modelsLoadPromise;
  modelsLoadPromise = (async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrl),
      // The descriptor path runs detect -> landmarks -> recognise, so the
      // landmark net is still required here even though liveness no longer
      // uses it: face-api aligns the face crop from these points before
      // handing it to the recognition net.
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
 * Which TensorFlow.js backend is in use. 'webgl' is the fast path; falling
 * back to 'cpu' makes every descriptor extraction an order of magnitude
 * slower, which shows up as a long pause after the blink rather than as an
 * error. Worth checking before hunting elsewhere when capture feels sluggish
 * on one machine.
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

export function euclideanDistance(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

// --- Frame buffer -------------------------------------------------------

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
