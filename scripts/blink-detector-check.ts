/**
 * Offline check for the liveness gate — run with `bun run
 * scripts/blink-detector-check.ts`.
 *
 * Liveness is the only thing standing between the kiosk and someone clocking a
 * colleague in with a photo, and it is gated on a threshold pair that is easy
 * to nudge and hard to test by hand. These traces pin both ends down so a
 * change can be judged without a webcam.
 *
 * The signal is a MediaPipe blink blendshape: a trained "is this eye closed"
 * score, roughly 0.02 open and 0.9 shut. That replaced an Eye Aspect Ratio
 * gate which measurement showed could not work — eyes held deliberately shut
 * moved EAR only 15-19% off baseline, against ~14% of landmark jitter on a
 * static photo. The spoof traces below are written in those terms: whatever a
 * held-up photo does, it cannot produce a genuine open-then-closed transition.
 */
import { detectBlinkInSamples, LIVENESS_THRESHOLDS } from '@/lib/face-liveness';

const open = 0.02;
const shut = 0.9;

/** n samples of an open eye with a little classifier wobble. */
const openRun = (n: number, wobble = 0.03) =>
  Array.from({ length: n }, (_, i) => Math.max(0, open + wobble * Math.abs(Math.sin(i * 2.7))));

const cases: [string, number[], boolean][] = [
  // --- live faces: all of these must pass -------------------------------
  ['one clean blink', [...openRun(20), 0.3, shut, shut, 0.4, ...openRun(20)], true],
  // The closure is the whole test, so a blink whose recovery frames were
  // dropped still counts. Requiring the reopen only added a second chance to
  // lose the blink to a dropped frame.
  ['blink, recovery frames lost', [...openRun(20), 0.3, shut, shut], true],
  ['fast blink, exactly 2 closed frames', [...openRun(20), 0.6, 0.7, ...openRun(20)], true],
  ['blink at the very end of the window', [...openRun(40), 0.5, 0.8], true],

  // --- spoofs and noise: all of these must fail -------------------------
  ['photo of open eyes (never closes)', openRun(60), false],
  ['photo of open eyes, noisy classifier', openRun(60, 0.15), false],
  // A photo of someone with their eyes shut holds one expression forever, so
  // it can show the closed state but never arrive at it from open.
  ['photo of closed eyes (never open)', Array(60).fill(shut), false],
  // One misclassified frame is not a closure; CLOSED_FRAMES exists for this.
  ['single spurious closed frame', [...openRun(20), shut, ...openRun(20)], false],
  ['half-closed squint, held', [...openRun(15), ...Array(25).fill(0.35)], false],
  ['too few samples', [open, shut, shut], false],
];

let bad = 0;
for (const [name, samples, want] of cases) {
  const got = detectBlinkInSamples(samples);
  const ok = got === want;
  if (!ok) bad += 1;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(36)} got=${String(got).padEnd(5)} want=${want}  peak=${Math.max(...samples).toFixed(2)}`,
  );
}
console.log(
  `\nbars: open <= ${LIVENESS_THRESHOLDS.OPEN_SCORE}, closed >= ${LIVENESS_THRESHOLDS.CLOSED_SCORE} for ${LIVENESS_THRESHOLDS.CLOSED_FRAMES} frames`,
);
console.log(bad ? `${bad} failing` : 'all passing');
process.exit(bad ? 1 : 0);
