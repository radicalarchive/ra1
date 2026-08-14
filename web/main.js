// main.js — boot Radical Aces in the browser.
//
// Bridges the browser's DOM / WebAudio / Event environment to Java's AWT 1.0
// lifecycle (main -> init -> start) and event model.
//
// In original Java (F51.java):
//   1. main() constructs Frame, creates F51 instance, calls f.init(), f.start().
//   2. init() creates offscreen image (500x360), sets up font, loads cookie/keys,
//      and disables focus traversal keys (setFocusTraversalKeysEnabled(false)).
//   3. start() spawns the game thread.
//   4. AWT event callbacks (keyDown, keyUp, mouseDown, lostFocus) dispatch inputs.
//
// Browser differences:
//   - AudioContext requires a user gesture before resuming/starting playback.
//     main.html handles the gesture overlay; boot() unlocks WebAudio immediately.
//   - Fixed 500x360 canvas backing store is styled via CSS for scaling; mouse
//     coordinates from DOM events must be scaled from CSS pixels to 500x360 game space.
//   - DOM KeyboardEvents must be mapped to AWT 1.0 integer constants via input.js.
//   - Browsers use TAB and arrow keys for focus / scrolling; we call preventDefault()
//     only for bound game navigation/action keys to mimic setFocusTraversalKeysEnabled(false),
//     without intercepting browser shortcuts like Ctrl+R or F12.
//   - DOM keydown auto-repeats on held keys; Java's AWT behaves identically and F51's
//     key set mutations are idempotent, while the `enterd` latch in keyDown guards
//     single-trigger keys like Enter across repeat events.

import * as audio from './audio.js';
import { F51 } from './F51.js';
import { awtCode, EVENT_UP, EVENT_DOWN, EVENT_LEFT, EVENT_RIGHT } from './input.js';

/**
 * Boots the game onto the provided canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{scale?: number, smooth?: boolean}} [opts]
 *        scale  — 2 renders the 500x360 game coordinates onto a 1000x720
 *                 backing store: sharper geometry and text, same layout.
 *        smooth — draw interpolated frames between physics ticks. The
 *                 simulation rate is unchanged either way, so this does not
 *                 alter how the game plays.
 * @returns {Promise<{ f: F51, stop: () => void }>}
 */
export async function boot(canvas, opts = {}) {
  // 1. Validate the canvas.
  // The game's coordinates are always 500x360; F51.init resizes the backing
  // store to 500*scale x 360*scale, and CSS handles the display size.
  if (!canvas) throw new Error('boot() needs a canvas');

  // 2. Unlock WebAudio.
  // Browsers block AudioContext creation/playback until a user gesture has occurred.
  // main.html invokes boot() inside a click handler on #gesture, satisfying this.
  audio.unlock();

  // 3. Initialize and start F51.
  // Mirrors Java main(): new F51() -> f.init(canvas) -> f.start().
  // F51.init preloads VFS assets and creates Graphics2D; f.start begins the rAF loop.
  const f = new F51();
  await f.init(canvas, opts);
  f.start();

  // 4. Wire the AWT 1.0 event model onto DOM events.

  // Keys that the game binds which also trigger default browser navigation/scroll actions.
  // In Java, F51.init() calls setFocusTraversalKeysEnabled(false) so TAB does not move
  // focus out of the canvas. In the browser, arrows scroll the page, Space scrolls down,
  // and Tab moves focus. We preventDefault on these specific keys so long as modifier keys
  // (Ctrl, Alt, Meta) are not held (preserving browser shortcuts like Ctrl+Tab, Alt+Left, etc.).
  function isGameNavKey(code) {
    return (
      code === 9 ||                    // Tab
      code === 32 ||                   // Space
      code === EVENT_UP ||             // 1004 ArrowUp
      code === EVENT_DOWN ||           // 1005 ArrowDown
      code === EVENT_LEFT ||           // 1006 ArrowLeft
      code === EVENT_RIGHT             // 1007 ArrowRight
    );
  }

  // Auto-repeat: DOM fires repeated 'keydown' events when a key is held.
  // In Java AWT, holding a key also produces repeated KEY_ACTION/keyDown events.
  // We checked F51's key sets and verified they are idempotent (Set.add is a no-op if present).
  // Special latches like `enterd` (in F51.keyDown for Enter/Esc) explicitly guard against
  // multi-triggering while held, and jump requires u.jump === 0. Passing repeat events
  // through matches Java AWT behavior.
  function onKeyDown(e) {
    const code = awtCode(e);
    if (code === -1) return;

    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      if (isGameNavKey(code)) {
        e.preventDefault();
      }
    }
    f.keyDown(null, code);
  }

  function onKeyUp(e) {
    const code = awtCode(e);
    if (code === -1) return;

    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      if (isGameNavKey(code)) {
        e.preventDefault();
      }
    }
    f.keyUp(null, code);
  }

  // Blur: when the browser window or canvas loses focus (e.g. Alt-Tab or clicking away),
  // clear input state so held keys do not remain stuck down.
  function onBlur() {
    f.lostFocus(null, null);
  }

  // Mouse: convert CSS client coordinates to 500x360 game canvas space.
  // The game's mouseDown handler only uses this as "a click happened" to dismiss
  // "Click here to Start/Continue" prompts and activate u.space when u.canclick is set.
  function onMouseDown(e) {
    // Game pixels, not CSS pixels, and not backing-store pixels either: the
    // game's coordinate space is 500x360 whatever the scale option is.
    const rect = canvas.getBoundingClientRect();
    const x = rect.width > 0 ? Math.floor((e.clientX - rect.left) * (500 / rect.width)) : 0;
    const y = rect.height > 0 ? Math.floor((e.clientY - rect.top) * (360 / rect.height)) : 0;
    f.mouseDown(null, x, y);
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  canvas.addEventListener('mousedown', onMouseDown);

  return {
    f,
    stop() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      canvas.removeEventListener('mousedown', onMouseDown);
      f.stop();
    },
  };
}
