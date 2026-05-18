'use client';

import { useCallback, useEffect, useState } from 'react';
import { areFaceModelsLoaded, loadFaceModels } from '@/lib/face-recognition';

export type FaceModelStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Loads the face-api.js model weights exactly once per page lifetime
 * (the module-level cache in `lib/face-recognition` makes this idempotent
 * across mounts). Pass `autoLoad: false` to defer loading until you call
 * `load()` manually — useful if you want to gate it behind a modal.
 */
export function useFaceModels(autoLoad = true) {
  const [status, setStatus] = useState<FaceModelStatus>(() =>
    areFaceModelsLoaded() ? 'ready' : 'idle',
  );
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (areFaceModelsLoaded()) {
      setStatus('ready');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      await loadFaceModels();
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  useEffect(() => {
    if (autoLoad && status === 'idle') void load();
  }, [autoLoad, status, load]);

  return { status, error, load };
}
