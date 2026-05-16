/**
 * Thin wrapper around FaceIO's official browser SDK (fio.js).
 *
 * Per https://faceio.net/integration-guide, the fio.js script must be loaded
 * from cdn.faceio.net (self-hosting is not supported) and a host element
 * `<div id="faceio-modal"></div>` must exist in the DOM before fio.js
 * initializes. Both are mounted in the root layout (src/app/layout.tsx).
 */

const READY_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 100;

export interface EnrollResult {
  facialId: string;
  timestamp: string;
  details?: { gender?: string; age?: string };
}

export interface AuthenticateResult {
  facialId: string;
  payload?: unknown;
}

type FaceIOInstance = {
  enroll: (params: Record<string, unknown>) => Promise<EnrollResult>;
  authenticate: (params: Record<string, unknown>) => Promise<AuthenticateResult>;
};

type FaceIOClass = new (publicId: string) => FaceIOInstance;

declare global {
  interface Window {
    faceIO?: FaceIOClass;
    fioErrCode?: Record<string, number>;
  }
}

const getPublicId = (): string => {
  const id = process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID;
  if (!id) {
    throw new Error('FaceIO is not configured. Set NEXT_PUBLIC_FACEIO_PUBLIC_ID in your environment.');
  }
  return id;
};

const waitForFaceIO = (): Promise<FaceIOClass> =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('FaceIO can only be used in the browser.'));
      return;
    }
    const start = Date.now();
    const check = () => {
      const ctor = window.faceIO;
      if (typeof ctor === 'function') {
        resolve(ctor);
        return;
      }
      if (Date.now() - start > READY_TIMEOUT_MS) {
        reject(new Error('FaceIO script did not load. Check your network, ad-blocker, or CSP settings.'));
        return;
      }
      window.setTimeout(check, POLL_INTERVAL_MS);
    };
    check();
  });

let instance: FaceIOInstance | null = null;

const getInstance = async (): Promise<FaceIOInstance> => {
  if (!instance) {
    const FaceIO = await waitForFaceIO();
    instance = new FaceIO(getPublicId());
  }
  return instance;
};

const ERROR_MESSAGES: Record<string, string> = {
  PERMISSION_REFUSED: 'Camera access was denied. Allow camera access and try again.',
  NO_FACES_DETECTED: 'No face was detected. Position your face inside the frame.',
  UNRECOGNIZED_FACE: 'We could not recognize your face. Try again or use a code.',
  MANY_FACES: 'Multiple faces detected. Please make sure only you are in the frame.',
  PAD_ATTACK: 'Anti-spoofing check failed. Please try again in person.',
  FACE_DUPLICATION: 'This face is already enrolled.',
  MINORS_NOT_ALLOWED: 'Minors are not allowed by the FaceIO terms of service.',
  TERMS_NOT_ACCEPTED: 'You must accept the FaceIO terms to continue.',
  TIMEOUT: 'Face login timed out. Please try again.',
  TOO_MANY_REQUESTS: 'Too many attempts. Please wait a moment and try again.',
  EMPTY_ORIGIN: 'FaceIO request blocked: empty origin.',
  FORBIDDEN_ORIGIN: 'This site is not authorized to use the configured FaceIO app.',
  FORBIDDEN_COUNTRY: 'Face login is not available in your region.',
  SESSION_EXPIRED: 'Face login session expired. Please try again.',
  SESSION_IN_PROGRESS: 'A face login session is already in progress.',
  UI_NOT_READY: 'Face login UI is not ready yet. Please try again.',
  NETWORK_IO: 'Network error while reaching FaceIO. Check your connection.',
  WRONG_PIN_CODE: 'The PIN you entered is incorrect.',
  PROCESSING_ERR: 'Face login failed during processing. Please try again.',
  UNAUTHORIZED: 'FaceIO rejected this request as unauthorized.',
  ABORTED_BY_USER: 'Face login was cancelled.',
};

// fio.js exposes a `fioErrCode` enum on window mapping name -> numeric code,
// and rejects promises with the numeric code. Translate back to the name to
// look up a friendly message.
const codeName = (code: unknown): string | null => {
  if (typeof code !== 'number' || typeof window === 'undefined') return null;
  const errCodes = window.fioErrCode;
  if (!errCodes) return null;
  const entry = Object.entries(errCodes).find(([, value]) => value === code);
  return entry?.[0] ?? null;
};

export const describeFaceIOError = (err: unknown): string => {
  const name = codeName(err);
  if (name && ERROR_MESSAGES[name]) return ERROR_MESSAGES[name];
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Face login failed. Please try again.';
};

export const enrollFace = async (payload: Record<string, unknown>): Promise<EnrollResult> => {
  const fio = await getInstance();
  return fio.enroll({ locale: 'auto', payload });
};

export const authenticateFace = async (): Promise<AuthenticateResult> => {
  const fio = await getInstance();
  return fio.authenticate({ locale: 'auto' });
};

export const isFaceIOConfigured = (): boolean => Boolean(process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID);
