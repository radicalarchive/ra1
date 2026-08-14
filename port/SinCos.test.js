// SinCos.test.js — differential test for the transpiled SinCos class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/port/tools/SinCosProbe.java run against the real
// Java class (output recorded in decompilation/logs/SinCos.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields: NONE.  SinCos contains no Math.random() calls and
// no non-deterministic paths (confirmed in SinCosProbe.java comments and in
// the Java source).  Every output is deterministic and every output is asserted.
//
// §2 compound-assignment audit: SinCos.js contains `i -= 360` and `i += 360`.
// Both operands are pure int (the parameter `i` is int, 360 is int literal);
// there is no `+= (int)(` or `-= (int)(` pattern in this file.
// No §2/§2b sites exist.

import test from 'node:test';
import assert from 'node:assert/strict';
import { SinCos } from './SinCos.js';

// Single shared instance — constructor is deterministic; no state between tests.
const sc = new SinCos();

// ---------------------------------------------------------------------------
// Table construction: spot-check tsin and tcos arrays
// (values from probe block "tsin.length = 360" / "tcos.length = 360")
// ---------------------------------------------------------------------------

test('tsin and tcos arrays have length 360', () => {
  // From probe: tsin.length = 360, tcos.length = 360
  assert.strictEqual(sc.tsin.length, 360);
  assert.strictEqual(sc.tcos.length, 360);
});

test('tsin table spot-checks — first five entries (from probe)', () => {
  // From probe:
  //   tsin[0] = 0.0
  //   tsin[1] = 0.017452406
  //   tsin[2] = 0.034899496
  //   tsin[3] = 0.052335955
  //   tsin[4] = 0.06975647
  assert.strictEqual(sc.tsin[0], 0.0);
  assert.strictEqual(sc.tsin[1], Math.fround(0.017452406));
  assert.strictEqual(sc.tsin[2], Math.fround(0.034899496));
  assert.strictEqual(sc.tsin[3], Math.fround(0.052335955));
  assert.strictEqual(sc.tsin[4], Math.fround(0.06975647));
});

test('tsin table spot-checks — boundary angles (from probe)', () => {
  // From probe:
  //   tsin[90]  = 1.0
  //   tsin[180] = 1.2246469E-16
  //   tsin[270] = -1.0
  //   tsin[359] = -0.017452406
  assert.strictEqual(sc.tsin[90],  1.0);
  assert.strictEqual(sc.tsin[180], Math.fround(1.2246469e-16));
  assert.strictEqual(sc.tsin[270], -1.0);
  assert.strictEqual(sc.tsin[359], Math.fround(-0.017452406));
});

test('tcos table spot-checks — first five entries (from probe)', () => {
  // From probe:
  //   tcos[0] = 1.0
  //   tcos[1] = 0.9998477
  //   tcos[2] = 0.99939084
  //   tcos[3] = 0.9986295
  //   tcos[4] = 0.9975641
  assert.strictEqual(sc.tcos[0], 1.0);
  assert.strictEqual(sc.tcos[1], Math.fround(0.9998477));
  assert.strictEqual(sc.tcos[2], Math.fround(0.99939084));
  assert.strictEqual(sc.tcos[3], Math.fround(0.9986295));
  assert.strictEqual(sc.tcos[4], Math.fround(0.9975641));
});

test('tcos table spot-checks — boundary angles (from probe)', () => {
  // From probe:
  //   tcos[90]  = 6.123234E-17
  //   tcos[180] = -1.0
  //   tcos[270] = -1.8369701E-16
  //   tcos[359] = 0.9998477
  assert.strictEqual(sc.tcos[90],  Math.fround(6.123234e-17));
  assert.strictEqual(sc.tcos[180], -1.0);
  assert.strictEqual(sc.tcos[270], Math.fround(-1.8369701e-16));
  assert.strictEqual(sc.tcos[359], Math.fround(0.9998477));
});

test('tsin/tcos mid-table entries at 45 and 135 (from probe)', () => {
  // From probe:
  //   tsin[45]  = 0.70710677
  //   tcos[45]  = 0.70710677
  //   tsin[135] = 0.70710677
  //   tcos[135] = -0.70710677
  assert.strictEqual(sc.tsin[45],  Math.fround(0.70710677));
  assert.strictEqual(sc.tcos[45],  Math.fround(0.70710677));
  assert.strictEqual(sc.tsin[135], Math.fround(0.70710677));
  assert.strictEqual(sc.tcos[135], Math.fround(-0.70710677));
});

// ---------------------------------------------------------------------------
// getsin() — in-range inputs
// ---------------------------------------------------------------------------

test('getsin in-range inputs (from probe)', () => {
  // From probe:
  //   getsin(0)   = 0.0
  //   getsin(90)  = 1.0
  //   getsin(180) = 1.2246469E-16
  //   getsin(270) = -1.0
  //   getsin(359) = -0.017452406
  assert.strictEqual(sc.getsin(0),   0.0);
  assert.strictEqual(sc.getsin(90),  1.0);
  assert.strictEqual(sc.getsin(180), Math.fround(1.2246469e-16));
  assert.strictEqual(sc.getsin(270), -1.0);
  assert.strictEqual(sc.getsin(359), Math.fround(-0.017452406));
});

// ---------------------------------------------------------------------------
// getcos() — in-range inputs
// ---------------------------------------------------------------------------

test('getcos in-range inputs (from probe)', () => {
  // From probe:
  //   getcos(0)   = 1.0
  //   getcos(90)  = 6.123234E-17
  //   getcos(180) = -1.0
  //   getcos(270) = -1.8369701E-16
  //   getcos(359) = 0.9998477
  assert.strictEqual(sc.getcos(0),   1.0);
  assert.strictEqual(sc.getcos(90),  Math.fround(6.123234e-17));
  assert.strictEqual(sc.getcos(180), -1.0);
  assert.strictEqual(sc.getcos(270), Math.fround(-1.8369701e-16));
  assert.strictEqual(sc.getcos(359), Math.fround(0.9998477));
});

// ---------------------------------------------------------------------------
// getsin/getcos — angles >= 360 (exercises the i -= 360 while-loop branch)
// ---------------------------------------------------------------------------

test('getsin wraps angles >= 360 (from probe)', () => {
  // From probe:
  //   getsin(360)  = 0.0       (360 - 360 = 0)
  //   getsin(450)  = 1.0       (450 - 360 = 90)
  //   getsin(720)  = 0.0       (720 - 360 - 360 = 0)
  //   getsin(1441) = 0.017452406  (1441 mod 360 = 1)
  assert.strictEqual(sc.getsin(360),  0.0);
  assert.strictEqual(sc.getsin(450),  1.0);
  assert.strictEqual(sc.getsin(720),  0.0);
  assert.strictEqual(sc.getsin(1441), Math.fround(0.017452406));
});

test('getcos wraps angles >= 360 (from probe)', () => {
  // From probe:
  //   getcos(360)  = 1.0       (360 - 360 = 0)
  //   getcos(450)  = 6.123234E-17  (450 - 360 = 90)
  //   getcos(720)  = 1.0       (720 - 360 - 360 = 0)
  //   getcos(1441) = 0.9998477    (1441 mod 360 = 1)
  assert.strictEqual(sc.getcos(360),  1.0);
  assert.strictEqual(sc.getcos(450),  Math.fround(6.123234e-17));
  assert.strictEqual(sc.getcos(720),  1.0);
  assert.strictEqual(sc.getcos(1441), Math.fround(0.9998477));
});

// ---------------------------------------------------------------------------
// getsin/getcos — negative angles (exercises the i += 360 while-loop branch)
// ---------------------------------------------------------------------------

test('getsin wraps negative angles (from probe)', () => {
  // From probe:
  //   getsin(-1)    = -0.017452406  (-1 + 360 = 359)
  //   getsin(-90)   = -1.0          (-90 + 360 = 270)
  //   getsin(-359)  = 0.017452406   (-359 + 360 = 1)
  //   getsin(-360)  = 0.0           (-360 + 360 = 0)
  //   getsin(-720)  = 0.0           (-720 + 360 + 360 = 0)
  //   getsin(-1081) = -0.017452406  (-1081 + 360*3 = -1081+1080 = -1, -1+360=359)
  assert.strictEqual(sc.getsin(-1),    Math.fround(-0.017452406));
  assert.strictEqual(sc.getsin(-90),   -1.0);
  assert.strictEqual(sc.getsin(-359),  Math.fround(0.017452406));
  assert.strictEqual(sc.getsin(-360),  0.0);
  assert.strictEqual(sc.getsin(-720),  0.0);
  assert.strictEqual(sc.getsin(-1081), Math.fround(-0.017452406));
});

test('getcos wraps negative angles (from probe)', () => {
  // From probe:
  //   getcos(-1)    = 0.9998477        (-1 + 360 = 359)
  //   getcos(-90)   = -1.8369701E-16   (-90 + 360 = 270)
  //   getcos(-359)  = 0.9998477        (-359 + 360 = 1)
  //   getcos(-360)  = 1.0              (-360 + 360 = 0)
  //   getcos(-720)  = 1.0              (-720 + 360 + 360 = 0)
  //   getcos(-1081) = 0.9998477        (-1081 + 360*3 = 359 -> tcos[359])
  assert.strictEqual(sc.getcos(-1),    Math.fround(0.9998477));
  assert.strictEqual(sc.getcos(-90),   Math.fround(-1.8369701e-16));
  assert.strictEqual(sc.getcos(-359),  Math.fround(0.9998477));
  assert.strictEqual(sc.getcos(-360),  1.0);
  assert.strictEqual(sc.getcos(-720),  1.0);
  assert.strictEqual(sc.getcos(-1081), Math.fround(0.9998477));
});

// ---------------------------------------------------------------------------
// Fractional angles — the smooth-motion path (not Java behaviour).
//
// Java's getsin/getcos index an int[] table, so an int argument must return the
// table entry unchanged; every assertion above pins that. Smooth motion blends
// headings and passes a FRACTIONAL angle, which the table cannot answer, so
// these lerp between the two neighbouring entries.
//
// This test exists because that path shipped with `fr` not imported: nothing
// called it with a non-integer, so 129 tests and a headless smoke run of the
// menus all stayed green while the game threw ReferenceError the moment an
// object turned on screen.
// ---------------------------------------------------------------------------
test('fractional angles lerp between table entries (smooth motion)', () => {
  const cs = new SinCos();

  // Exactly halfway between two entries is the mean of them.
  assert.strictEqual(cs.getsin(30.5), Math.fround((cs.getsin(30) + cs.getsin(31)) / 2));
  assert.strictEqual(cs.getcos(30.5), Math.fround((cs.getcos(30) + cs.getcos(31)) / 2));

  // Monotonic across an entry, and never equal to either endpoint.
  const a = cs.getsin(10), q = cs.getsin(10.25), b = cs.getsin(11);
  assert.ok(q > a && q < b, `${a} < ${q} < ${b}`);

  // 359.5 wraps to the 359 -> 0 pair rather than reading past the end.
  assert.strictEqual(cs.getsin(359.5), Math.fround((cs.getsin(359) + cs.getsin(0)) / 2));
  assert.strictEqual(cs.getcos(359.5), Math.fround((cs.getcos(359) + cs.getcos(0)) / 2));

  // Negative fractional angles normalise the same way integers do.
  assert.strictEqual(cs.getsin(-90.5), cs.getsin(269.5));
});
