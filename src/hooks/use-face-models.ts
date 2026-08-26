'use client';

import { useCallback, useEffect, useState } from 'react';
import { areFaceModelsLoaded, loadFaceModels } from '@/lib/face-recognition';
import { isLivenessModelLoaded, loadLivenessModel } from '@/lib/face-liveness';

export type FaceModelStatus = 'idle' | 'loading' | 'ready' | 'error';

const allLoaded = () => areFaceModelsLoaded() && isLivenessModelLoaded();

/**
 * Loads both model sets exactly once per page lifetime (the module-level
 * caches in `lib/face-recognition` and `lib/face-liveness` make this
 * idempotent across mounts). Pass `autoLoad: false` to defer loading until you
 * call `load()` manually — useful if you want to gate it behind a modal.
 *
 * Two sets, because the two jobs need different models and only one of them
 * can be swapped freely. MediaPipe Face Mesh handles liveness, where face-api
 * measurably could not. face-api still owns recognition, because its 128-float
 * descriptors are what the backend stores and matches at a 0.6 threshold —
 * changing that model would invalidate every existing enrollment.
 *
 * Loaded in parallel: they are independent, and the pair is a large enough
 * download that doing it in series would be felt.
 */
export function useFaceModels(autoLoad = true) {
  const [status, setStatus] = useState<FaceModelStatus>(() =>
    allLoaded() ? 'ready' : 'idle',
  );
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (allLoaded()) {
      setStatus('ready');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      await Promise.all([loadFaceModels(), loadLivenessModel()]);
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
