/**
 * Copies the MediaPipe vision WASM runtime out of node_modules and into
 * `public/mediapipe/`, where FilesetResolver can fetch it at runtime.
 *
 * Self-hosted rather than pulled from a CDN: the clock-in kiosk has to come up
 * on a flaky or locked-down network, and a liveness check that silently stops
 * working when jsdelivr is unreachable is worse than no liveness check.
 *
 * Copied at build time rather than committed because it is ~23 MB of binaries
 * that are already pinned by the lockfile. Both the SIMD and the no-SIMD build
 * go over: FilesetResolver picks between them from a runtime capability check,
 * and if it picks the one we didn't ship the failure is a 404 during model
 * load with nothing useful in it.
 *
 * Wired into `predev` / `prebuild`, so it runs before anything serves.
 */
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
const dest = join(root, 'public', 'mediapipe');

// The `*_module_internal` pair serves a loading mode we don't use; skipping it
// halves what we copy.
const wanted = (name) => name.startsWith('vision_wasm_') && !name.includes('_module_');

const main = async () => {
  let names;
  try {
    names = (await readdir(src)).filter(wanted);
  } catch {
    console.error(`[mediapipe] ${src} not found — run install first.`);
    process.exit(1);
  }
  if (names.length === 0) {
    console.error('[mediapipe] no wasm assets matched; package layout changed?');
    process.exit(1);
  }

  await mkdir(dest, { recursive: true });
  let copied = 0;
  for (const name of names) {
    const from = join(src, name);
    const to = join(dest, name);
    // Skip files already copied at the same size — this runs on every dev
    // start and the payload is tens of megabytes.
    const [a, b] = await Promise.all([stat(from), stat(to).catch(() => null)]);
    if (b && a.size === b.size) continue;
    await copyFile(from, to);
    copied += 1;
  }
  console.log(`[mediapipe] ${names.length} wasm asset(s) in public/mediapipe (${copied} copied).`);
};

await main();
