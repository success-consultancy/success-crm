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

// Adaptive blink detection — see `detectBlinkInSamples`. We no longer use a
// fixed EAR cutoff because the absolute baseline varies a lot by person
// (eye shape, glasses, lighting). These ratios are applied against each
// user's own open-eye baseline computed from the rolling sample window.
// Calibrated against a small sample of users with the full landmark model.
// Real blinks reliably produce ≥15% EAR drop; tighter ratios (0.78) reject
// users with shallow / partial blinks. A printed photo can't produce *any*
// dip + recovery, so leniency here doesn't meaningfully weaken anti-spoof.
const BLINK_DROP_RATIO = 0.85; // dip to ≤85% of baseline counts as "closed"
const BLINK_RECOVER_RATIO = 0.92; // …then back to ≥92% of baseline = "open"
const BLINK_MIN_SAMPLES = 6;

let modelsLoaded = false;
let modelsLoadPromise: Promise<void> | null = null;

const detectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 416,
  scoreThreshold: 0.5,
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
 * Adaptive blink detection. Treats each user's own running maximum EAR as
 * the "open" baseline and looks for a dip to BLINK_DROP_RATIO of that
 * baseline (eyes closed), followed by a recovery to BLINK_RECOVER_RATIO
 * (eyes open again).
 *
 * This avoids the fixed-threshold trap: absolute EAR values vary a lot by
 * person and lighting; the *shape* of a blink (sharp dip + recovery
 * relative to baseline) is much more stable.
 */
export function detectBlinkInSamples(samples: number[]): boolean {
  if (samples.length < BLINK_MIN_SAMPLES) return false;
  const baseline = Math.max(...samples);
  if (baseline <= 0) return false;
  const closeThreshold = baseline * BLINK_DROP_RATIO;
  const recoverThreshold = baseline * BLINK_RECOVER_RATIO;
  let sawClosed = false;
  for (const ear of samples) {
    if (!sawClosed && ear < closeThreshold) sawClosed = true;
    else if (sawClosed && ear > recoverThreshold) return true;
  }
  return false;
}
