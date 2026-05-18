'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import {
  computeEyeAspectRatio,
  detectBlinkInSamples,
  detectFaceWithLandmarks,
  extractDescriptor,
  extractDescriptorAveraged,
  euclideanDistance,
} from '@/lib/face-recognition';
import { useFaceModels } from '@/hooks/use-face-models';

/**
 * Smoke-test page for the face-api.js foundation. Not user-facing — exists so
 * we can verify model loading, single / averaged descriptor extraction, and
 * blink detection work before wiring the real enroll/auth flows.
 *
 * Routes:  /face-test
 */
const FaceTestPage = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const { status, error, load } = useFaceModels();
  const [busy, setBusy] = useState(false);
  const [ear, setEar] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [lastDescriptor, setLastDescriptor] = useState<Float32Array | null>(null);

  const appendLog = useCallback((line: string) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()}  ${line}`, ...prev].slice(0, 30));
  }, []);

  // Live EAR readout — samples every 250ms whenever models + video are ready.
  useEffect(() => {
    if (status !== 'ready') return;
    let cancelled = false;
    const tick = async () => {
      const video = webcamRef.current?.video;
      if (!cancelled && video && video.readyState >= 2) {
        try {
          const result = await detectFaceWithLandmarks(video);
          if (!cancelled) setEar(result ? computeEyeAspectRatio(result.landmarks) : null);
        } catch {
          if (!cancelled) setEar(null);
        }
      }
    };
    const id = window.setInterval(tick, 250);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [status]);

  const getVideo = (): HTMLVideoElement | null => {
    const video = webcamRef.current?.video ?? null;
    if (!video || video.readyState < 2) {
      appendLog('Webcam not ready yet.');
      return null;
    }
    return video;
  };

  const handleSingleCapture = useCallback(async () => {
    const video = getVideo();
    if (!video) return;
    setBusy(true);
    try {
      const t0 = performance.now();
      const desc = await extractDescriptor(video);
      const ms = (performance.now() - t0).toFixed(0);
      if (!desc) {
        appendLog(`No face detected (${ms}ms).`);
        return;
      }
      const preview = Array.from(desc.slice(0, 5))
        .map((n) => n.toFixed(4))
        .join(', ');
      appendLog(`Single: len=${desc.length} in ${ms}ms — [${preview}, ...]`);
      if (lastDescriptor) {
        const d = euclideanDistance(desc, lastDescriptor).toFixed(4);
        appendLog(`Distance to previous: ${d}  (< 0.6 = match)`);
      }
      setLastDescriptor(desc);
    } finally {
      setBusy(false);
    }
  }, [appendLog, lastDescriptor]);

  const handleAveragedCapture = useCallback(async () => {
    const video = getVideo();
    if (!video) return;
    setBusy(true);
    try {
      const t0 = performance.now();
      const desc = await extractDescriptorAveraged(video, 3, 200);
      const ms = (performance.now() - t0).toFixed(0);
      if (!desc) {
        appendLog(`Averaged x3: no face detected (${ms}ms).`);
        return;
      }
      appendLog(`Averaged x3: len=${desc.length} in ${ms}ms (tighter cluster than single).`);
      if (lastDescriptor) {
        const d = euclideanDistance(desc, lastDescriptor).toFixed(4);
        appendLog(`Distance to previous: ${d}  (< 0.6 = match)`);
      }
      setLastDescriptor(desc);
    } finally {
      setBusy(false);
    }
  }, [appendLog, lastDescriptor]);

  const handleBlinkTest = useCallback(async () => {
    const video = getVideo();
    if (!video) return;
    setBusy(true);
    appendLog('Blink test: blink within the next 3 seconds…');
    try {
      const samples: number[] = [];
      const deadline = performance.now() + 3000;
      while (performance.now() < deadline) {
        const r = await detectFaceWithLandmarks(video);
        if (r) samples.push(computeEyeAspectRatio(r.landmarks));
        await new Promise((r2) => setTimeout(r2, 100));
      }
      const ok = detectBlinkInSamples(samples);
      const min = samples.length ? Math.min(...samples).toFixed(3) : '—';
      const max = samples.length ? Math.max(...samples).toFixed(3) : '—';
      appendLog(`Blink test ${ok ? 'PASSED' : 'failed'} — ${samples.length} samples, EAR range ${min}..${max}`);
    } finally {
      setBusy(false);
    }
  }, [appendLog]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <header>
          <h1 className="text-xl font-semibold">face-api.js smoke test</h1>
          <p className="text-sm text-gray-500">
            Verifies model loading, descriptor extraction, and blink detection. Not user-facing.
          </p>
        </header>

        <div className="rounded-md border bg-white p-3 text-sm flex items-center gap-3">
          <span className="font-medium">Models:</span>
          {status === 'idle' && <span className="text-gray-500">idle</span>}
          {status === 'loading' && <span className="text-blue-600">loading… (~7 MB)</span>}
          {status === 'ready' && <span className="text-green-600">ready</span>}
          {status === 'error' && (
            <span className="text-red-600">error: {error?.message ?? 'unknown'}</span>
          )}
          {status === 'error' && (
            <button
              type="button"
              onClick={() => void load()}
              className="ml-auto rounded bg-red-600 text-white px-2 py-1 text-xs"
            >
              Retry
            </button>
          )}
        </div>

        <div className="rounded-md border bg-black overflow-hidden aspect-video">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-sm">
          Live EAR:&nbsp;
          <span className="font-mono">{ear === null ? '—' : ear.toFixed(3)}</span>
          <span className="text-gray-500"> &nbsp;(eyes closed ≈ 0.18, open ≈ 0.30+)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={status !== 'ready' || busy}
            onClick={handleSingleCapture}
            className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Capture single
          </button>
          <button
            type="button"
            disabled={status !== 'ready' || busy}
            onClick={handleAveragedCapture}
            className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Capture averaged x3
          </button>
          <button
            type="button"
            disabled={status !== 'ready' || busy}
            onClick={handleBlinkTest}
            className="rounded-md bg-indigo-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Run blink test (3s)
          </button>
        </div>

        <div className="rounded-md border bg-white p-3">
          <h2 className="text-sm font-medium mb-2">Log</h2>
          {log.length === 0 ? (
            <p className="text-xs text-gray-500">No events yet.</p>
          ) : (
            <ul className="text-xs font-mono space-y-1 max-h-80 overflow-y-auto">
              {log.map((line, i) => (
                <li key={`${i}-${line}`} className="text-gray-700">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceTestPage;
