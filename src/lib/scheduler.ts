/**
 * Event-loop scheduling helpers for tight async loops.
 *
 * Extracted so the face-capture modal and the /face-test diagnostics run on
 * identical cadence: a diagnostic that samples at a different rate than the
 * flow it is diagnosing reports the wrong answer, which is exactly how a
 * scheduler bug stayed hidden behind plausible thresholds.
 */

/**
 * Yield to the event loop without going through a timer.
 *
 * `setTimeout(fn, 10)` does not mean 10ms: nested timeouts are clamped, and
 * the callback queues behind the browser's rendering work — measured at ~29ms
 * per hop inside a modal that was also painting a video preview. A
 * MessageChannel message is delivered as a task with no clamping, so the
 * browser still paints and handles input between passes while the handover
 * costs microseconds.
 *
 * Each returned yielder holds one pending resolve, so use one per loop.
 */
export function createYielder(): () => Promise<void> {
  if (typeof MessageChannel === 'undefined') {
    return () => new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  const channel = new MessageChannel();
  let pending: (() => void) | null = null;
  channel.port1.onmessage = () => {
    const resolve = pending;
    pending = null;
    resolve?.();
  };
  return () =>
    new Promise<void>((resolve) => {
      pending = resolve;
      channel.port2.postMessage(null);
    });
}

/** Target cycle time for the detection loop — ~60 passes/sec on a fast device. */
export const TARGET_PASS_INTERVAL_MS = 16;

/** Below this a timer isn't honest about its delay; yield instead. */
export const MIN_TIMER_MS = 4;
