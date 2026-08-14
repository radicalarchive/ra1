// The Java 1.0 event model, on DOM key events.
//
// F51 overrides `keyDown(Event, int)` / `keyUp(Event, int)` — the deprecated
// AWT 1.0 handlers — and compares the int against Set<Integer>s built from
// KeySettings.txt (the format is documented in README.TXT). So the port needs
// to produce the SAME integers the AWT `Event` class produced, or every user's
// existing KeySettings.txt would silently mean something else.
//
// For printable keys that integer is the ASCII code of the character. For the
// rest it is a java.awt.Event constant, and the ones this game's default
// bindings use are:
//
//   Event.UP    1004    Event.DOWN  1005    Event.LEFT  1006   Event.RIGHT 1007
//   \n (enter)    10    ESC           27    TAB            9   BACKSPACE     8
//
// The defaults, transcribed from README.TXT's KeySettings.txt listing:
//   views 1-5 = '1'..'5' (49-53), nomusic = m/M, switchmusic = t/T,
//   nosound = s/S, radar = r/R, tab = TAB, plus = '+'/'=', mins = '-'/BACKSPACE,
//   jump = j/J, enter = ENTER/ESC, fire = SPACE, arrows = the four constants.

export const EVENT_UP = 1004;
export const EVENT_DOWN = 1005;
export const EVENT_LEFT = 1006;
export const EVENT_RIGHT = 1007;

/**
 * DOM KeyboardEvent -> the int AWT would have passed to keyDown/keyUp, or -1
 * for a key the AWT 1.0 model had no code for.
 *
 * `event.key` is the right input, not `keyCode`: the game's codes are
 * character codes for printable keys, and `key` is already the character the
 * layout produced. Shift is therefore handled for free — '+' arrives as '+'.
 */
export function awtCode(e) {
  switch (e.key) {
    case 'ArrowUp': return EVENT_UP;
    case 'ArrowDown': return EVENT_DOWN;
    case 'ArrowLeft': return EVENT_LEFT;
    case 'ArrowRight': return EVENT_RIGHT;
    case 'Enter': return 10;
    case 'Escape': return 27;
    case 'Tab': return 9;
    case 'Backspace': return 8;
    case 'Delete': return 127;
    default:
      if (e.key.length === 1) return e.key.charCodeAt(0);
      return -1;
  }
}

/**
 * The default bindings, as action -> Set of codes, matching
 * F51.initDefaultKeySettings(). A KeySettings.txt in localStorage (or one
 * shipped beside the game) can replace these through parseKeySettings.
 */
export function defaultKeySettings() {
  return {
    viewOne: new Set([49]),
    viewTwo: new Set([50]),
    viewThree: new Set([51]),
    viewFour: new Set([52]),
    viewFive: new Set([53]),
    nomusic: new Set([109, 77]),
    switchmusic: new Set([116, 84]),
    nosound: new Set([115, 83]),
    radar: new Set([114, 82]),
    tab: new Set([9]),
    plus: new Set([43, 61]),
    mins: new Set([45, 8]),
    jump: new Set([106, 74]),
    enter: new Set([10, 27]),
    fire: new Set([32]),
    left: new Set([EVENT_LEFT]),
    right: new Set([EVENT_RIGHT]),
    down: new Set([EVENT_DOWN]),
    up: new Set([EVENT_UP]),
  };
}

/**
 * Parse a KeySettings.txt — one `action(code)` per line. Multiple lines may
 * bind the same action (several keys for one action) or the same key (a
 * macro), which is why every action holds a Set.
 *
 * Unknown action names are ignored, as F51 ignores any line that matches none
 * of its startsWith checks.
 */
export function parseKeySettings(text) {
  const bindings = defaultKeySettings();
  for (const name of Object.keys(bindings)) bindings[name] = new Set();

  for (const line of text.split(/\r\n|\r|\n/)) {
    const m = /^([A-Za-z]+)\((-?\d+)\)/.exec(line.trim());
    if (m === null) continue;
    const action = m[1];
    if (!Object.prototype.hasOwnProperty.call(bindings, action)) continue;
    bindings[action].add(parseInt(m[2], 10));
  }

  // An empty file would otherwise leave the game unplayable; F51 falls back to
  // the defaults when the file cannot be read at all, so do the same when it
  // bound nothing.
  const any = Object.values(bindings).some((s) => s.size > 0);
  return any ? bindings : defaultKeySettings();
}
