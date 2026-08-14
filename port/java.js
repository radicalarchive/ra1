// Java numeric + library semantics for the transpiled game code.
//
// The three hazards from PORT_SPEC, made explicit:
//   idiv() - Java int division truncates toward zero; JS `/` yields a float.
//   i32()  - Java int wraps at 32 bits; JS numbers are doubles.
//   fr()   - Java float is 32-bit; JS has only doubles, so physics drifts
//            silently without rounding at each step.
//
// Field arrays are declared as Int32Array / Float32Array wherever the Java
// declared int[] / float[]. That buys wrapping and float32 rounding on every
// store for free, and is the reason most transpiled code needs no explicit
// call to these helpers.

/** Java `(int)` cast of an already-int expression, or wrap after arithmetic. */
export function i32(x) {
  return x | 0;
}

/** Java int division: truncates toward zero. `-7/2 === -3`. */
export function idiv(a, b) {
  return (a / b) | 0;
}

/**
 * Java `(int)` cast applied to a float/double.
 * Truncates toward zero, maps NaN to 0, and *saturates* at the int32 bounds
 * rather than wrapping — this is the one place `| 0` would be wrong.
 */
export function trunc(x) {
  if (Number.isNaN(x)) return 0;
  if (x >= 2147483647) return 2147483647;
  if (x <= -2147483648) return -2147483648;
  return Math.trunc(x);
}

/** Java 32-bit float rounding. */
export const fr = Math.fround;

/** Java `Math.round(float)` -> int: floor(x + 0.5). */
export function jround(x) {
  return Math.floor(x + 0.5) | 0;
}

/** Allocate the Java `new int[n]` — zero-filled, wrapping on store. */
export function intArray(n) {
  return new Int32Array(n);
}

/** Allocate the Java `new float[n]` — zero-filled, float32 on store. */
export function floatArray(n) {
  return new Float32Array(n);
}

/** Java `new T[n]` for object arrays, null-filled. */
export function objArray(n) {
  return new Array(n).fill(null);
}

// --- Deterministic PRNG -----------------------------------------------------
//
// Replaces java.lang.Math.random(), which is unseeded. Seeding it makes a run
// reproducible, which is what lets a probe produce a stable expected value for
// anything downstream of a random roll (TRANSPILE_SPEC §2d).
//
// One stream, unlike the nfm port: Radical Aces has no netplay, so there is no
// reason to separate the draw rolls from the simulation rolls.

let _seed = 0x2545f491;

export function setSeed(s) {
  _seed = s >>> 0 || 1;
}

// Float64, not Float32: a replayed value must be BIT-IDENTICAL to the one the
// tick consumed, or the effect it drives lands somewhere fractionally else on
// every interpolated frame — which is the shimmer the replay exists to remove.
let _rlog = new Float64Array(8192);
let _rn = 0;
let _rp = 0;
let _recording = false;
let _replaying = false;

export function startRandomRecording() {
  _rn = 0;
  _recording = true;
  _replaying = false;
}

export function startRandomReplay() {
  _rp = 0;
  _recording = false;
  _replaying = true;
}

export function stopRandom() {
  _recording = false;
  _replaying = false;
}

/** Uniform in [0,1), matching the contract of java.lang.Math.random(). */
export function random() {
  if (_replaying && _rn !== 0) {
    return _rlog[_rp++ % _rn];
  }
  // xorshift32
  let x = _seed;
  x ^= x << 13; x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5;  x >>>= 0;
  _seed = x;
  const v = x / 4294967296;
  if (_recording) {
    if (_rn === _rlog.length) {
      const grown = new Float64Array(_rn * 2);
      grown.set(_rlog);
      _rlog = grown;
    }
    _rlog[_rn++] = v;
  }
  return v;
}

// --- java.lang.String / Integer, where Java throws and JS shrugs -------------
//
// This is not pedantry. ContO's model parser and F51's level parser walk a line
// character by character and are wrapped in `catch (Exception ex) {}`, so a
// throw does not crash the game — it ABANDONS THE REST OF THE FILE. Whether
// these throw therefore decides how much of a model or a stage gets loaded.
// Silently returning "" or NaN would load more than the original does.

/**
 * A Java array read, WITH the JVM's implicit bounds check.
 *
 * Use this wherever a loop can run past the end of an array — JS returns
 * `undefined` and poisons the arithmetic with NaN, while the JVM throws, and
 * in this codebase the throw is caught by a parser and ABANDONS THE FILE.
 *
 * Measured case: `graphics/bebs.rad` has two 2-vertex faces, and Plane's
 * constructor walks indices 0..2 unconditionally. Java throws on the seventh
 * face and ContO ends with npl=6; without this check the port cheerfully built
 * all 8 and the model had two extra faces made of NaN.
 */
export function at(arr, i) {
  if (i < 0 || i >= arr.length) {
    throw new Error(`ArrayIndexOutOfBoundsException: Index ${i} out of bounds for length ${arr.length}`);
  }
  return arr[i];
}

/** `String.charAt(i)` — throws past either end, as Java does. */
export function charAt(s, i) {
  if (i < 0 || i >= s.length) {
    throw new Error(`StringIndexOutOfBoundsException: index ${i}, length ${s.length}`);
  }
  return s[i];
}

/**
 * `Integer.valueOf(s)` / `Integer.parseInt(s)`.
 *
 * Stricter than JS parseInt in three ways that all matter here: it rejects
 * trailing garbage ("12abc"), rejects an empty string, and rejects surrounding
 * whitespace. Leading '+'/'-' are allowed, and the result must fit in an int.
 */
export function parseIntJava(s) {
  if (!/^[+-]?\d+$/.test(s)) {
    throw new Error(`NumberFormatException: For input string: "${s}"`);
  }
  const n = Number(s);
  if (n > 2147483647 || n < -2147483648) {
    throw new Error(`NumberFormatException: For input string: "${s}"`);
  }
  return n | 0;
}

// --- java.awt.Color ---------------------------------------------------------
//
// Radical Aces uses exactly two things from Color: the (r,g,b) constructor and
// unpacking a packed pixel with getRed/getGreen/getBlue. xtGraphics' fullscreen
// effects do `new Color(this.pix[i])` on a PixelGrabber result and average the
// components, so the accessors below are on the hot path of every menu frame.
//
// getRGB()/the int constructor carry the alpha byte in Java; these drop it,
// which every call site here already does by only reading r/g/b.

export function colorRed(packed)   { return (packed >> 16) & 0xff; }
export function colorGreen(packed) { return (packed >> 8) & 0xff; }
export function colorBlue(packed)  { return packed & 0xff; }

/**
 * Pack (r,g,b) the way `new Color(r,g,b)` does.
 *
 * Java THROWS IllegalArgumentException when any component is outside 0..255,
 * and so does this. Do not clamp instead: the effect routines in xtGraphics
 * compute components arithmetically and each one is followed by an explicit
 * clamp in the game's own code. If a clamp is ever missed the Java crashes,
 * and a silently clamping port would hide a real divergence.
 */
export function colorOf(r, g, b) {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error(`Color parameter outside of expected range: ${r},${g},${b}`);
  }
  return (r << 16) | (g << 8) | b;
}
