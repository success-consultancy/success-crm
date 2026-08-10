'use client';

import { useEffect, useState } from 'react';

/**
 * Re-renders on an interval so derived "time ago" labels stay current without
 * refetching. Pass `enabled: false` to stop the timer while a panel is closed.
 */
export const useTicker = (intervalMs: number, enabled = true) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);

  return tick;
};
