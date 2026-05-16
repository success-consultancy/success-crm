'use client';

import { useEffect } from 'react';

/**
 * Loads the FaceIO browser SDK from cdn.faceio.net.
 *
 * fio.js declares `class faceIO` at the top level of a classic script, which
 * creates a lexical global but does NOT set `window.faceIO`. Our React code
 * runs in an ES module and can only reach `window`/`globalThis` — so after
 * fio.js loads we inject an inline classic-script that copies `faceIO` onto
 * `window.faceIO` for the SDK wrapper in `src/lib/faceio.ts`.
 *
 * Bootstrap state is stored on `window` so HMR / Fast Refresh re-renders
 * cannot re-append the script (a second fio.js would throw a SyntaxError on
 * the already-declared `fioErrCode` top-level const).
 */

const SCRIPT_ID = 'faceio-cdn';
const SCRIPT_SRC = 'https://cdn.faceio.net/fio.js';
const MODAL_ID = 'faceio-modal';
const BRIDGE_ID = 'faceio-bridge';
const BOOTSTRAP_FLAG = '__faceIoBootstrapped';

type FaceIoWindow = Window & { [BOOTSTRAP_FLAG]?: boolean };

const installBridge = () => {
  if (document.getElementById(BRIDGE_ID)) return;
  const bridge = document.createElement('script');
  bridge.id = BRIDGE_ID;
  bridge.textContent =
    '(function(){try{if(typeof faceIO!=="undefined"&&!window.faceIO){window.faceIO=faceIO;}}catch(e){console.error("[faceio] bridge error",e);}})();';
  document.body.appendChild(bridge);
};

const FaceIoLoader = () => {
  useEffect(() => {
    const w = window as FaceIoWindow;

    if (!document.getElementById(MODAL_ID)) {
      const modal = document.createElement('div');
      modal.id = MODAL_ID;
      document.body.appendChild(modal);
    }

    if (w[BOOTSTRAP_FLAG]) {
      installBridge();
      return;
    }
    w[BOOTSTRAP_FLAG] = true;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', installBridge);
    script.addEventListener('error', (e) => {
      console.error('[faceio] failed to load fio.js', e);
    });
    document.body.appendChild(script);
  }, []);

  return null;
};

export default FaceIoLoader;
