// Lasers.test.js — differential test for the transpiled Lasers class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/web/tools/LasersProbe.java run against the real
// Java class (output recorded in decompilation/logs/Lasers.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields & paths — intentionally NOT asserted (TRANSPILE_SPEC §2d):
//   dt() with l1 != 0: uses Math.random() to jitter vertices.
//   d() with i in (2, 3, 9, 11): uses Math.random() for laser coordinates.
//   gsmoke() and hsmoke(): use Math.random() for smoke particle offsets.
// All asserted values come from deterministic paths (l1 == 0, types 0,1,4,5,6,7,8,10).
//
// §2 compound-assignment audit (reproduced from Lasers.js header):
//   Site 1 (dt() Java line 91):
//     ai[n4] += (int)(i - this.m.x + (Math.random() * 50.0 - 25.0));
//     Case A (accumulator widened to double at offset 75, one d2i at offset 100).
//   Site 2 (dt() Java line 93):
//     ai1[n5] += (int)(j - this.m.y + (Math.random() * 50.0 - 25.0));
//     Case A (accumulator widened to double at offset 107, one d2i at offset 132).
//   Site 3 (dt() Java line 95):
//     ai2[n6] += (int)(k - this.m.z + (Math.random() * 50.0 - 25.0));
//     Case A (accumulator widened to double at offset 140, one d2i at offset 165).

import test from 'node:test';
import assert from 'node:assert/strict';
import { Lasers } from './Lasers.js';
import { Medium } from './Medium.js';
import { intArray, colorRed, colorGreen, colorBlue } from './java.js';

function makeMedium() {
  const m = new Medium();
  m.focus_point = 400;
  m.ground = 250;
  m.cx = 250;
  m.cy = 150;
  m.cz = 50;
  m.xz = 45;
  m.zy = 30;
  m.x = 1200;
  m.y = -800;
  m.z = 3500;
  m.w = 500;
  m.h = 360;
  return m;
}

function makeGraphics() {
  return {
    color: 0,
    filledPolygons: [],
    setColor(c) {
      this.color = c;
    },
    fillPolygon(ox, oy, n) {
      this.filledPolygons.push({
        color: this.color,
        ox: Array.from(ox.subarray ? ox.subarray(0, n) : ox.slice(0, n)),
        oy: Array.from(oy.subarray ? oy.subarray(0, n) : oy.slice(0, n)),
        n,
      });
    },
  };
}

// ---------------------------------------------------------------------------
// 1. Constructor fields
// ---------------------------------------------------------------------------
test('Lasers constructor initializes speed, rads, srate, damg arrays', () => {
  const m = makeMedium();
  const l = new Lasers(m);

  // Probe: ctor.speed = [200, 150, 120, 120, 100, 100, 140, 100, 150, 120, 150, 150]
  assert.deepStrictEqual(
    Array.from(l.speed),
    [200, 150, 120, 120, 100, 100, 140, 100, 150, 120, 150, 150]
  );
  // Probe: ctor.rads = [200, 200, 300, 300, 200, 150, 160, 160, 160, 200, 200, 300]
  assert.deepStrictEqual(
    Array.from(l.rads),
    [200, 200, 300, 300, 200, 150, 160, 160, 160, 200, 200, 300]
  );
  // Probe: ctor.srate = [8, 8, 10, 10, 8, 6, 8, 6, 10, 10, 10, 10]
  assert.deepStrictEqual(
    Array.from(l.srate),
    [8, 8, 10, 10, 8, 6, 8, 6, 10, 10, 10, 10]
  );
  // Probe: ctor.damg = [3, 2, 2, 3, 2, 1, 1, 2, 2, 2, 3, 7]
  assert.deepStrictEqual(
    Array.from(l.damg),
    [3, 2, 2, 3, 2, 1, 1, 2, 2, 2, 3, 7]
  );
});

// ---------------------------------------------------------------------------
// 2. xs() and ys() screen projection helpers
// ---------------------------------------------------------------------------
test('xs() and ys() screen projection calculations and overflow wrapping', () => {
  const m = makeMedium();
  const l = new Lasers(m);

  // Normal values
  // Probe: xs.normal1 = 130
  assert.strictEqual(l.xs(100, 500), 130);
  // Probe: xs.normal2 = -350
  assert.strictEqual(l.xs(-200, 300), -350);
  // Probe: ys.normal1 = 94
  assert.strictEqual(l.ys(80, 500), 94);
  // Probe: ys.normal2 = -250
  assert.strictEqual(l.ys(-150, 300), -250);

  // j < 10 clamped branch
  // Probe: xs.clamped_j = -5750
  assert.strictEqual(l.xs(100, 5), -5750);
  // Probe: xs.neg_j = -5750
  assert.strictEqual(l.xs(100, -50), -5750);
  // Probe: ys.clamped_j = -2650
  assert.strictEqual(l.ys(80, 5), -2650);
  // Probe: ys.neg_j = -2650
  assert.strictEqual(l.ys(80, -50), -2650);

  // Large values that test 32-bit int overflow wrapping
  // Probe: xs.overflow1 = 96135
  assert.strictEqual(l.xs(50000, 45000), 96135);
  // Probe: xs.overflow2 = -78278
  assert.strictEqual(l.xs(-60000, 55000), -78278);
  // Probe: ys.overflow1 = 505
  assert.strictEqual(l.ys(40000, 45000), 505);
  // Probe: ys.overflow2 = -78450
  assert.strictEqual(l.ys(-70000, 55000), -78450);
});

// ---------------------------------------------------------------------------
// 3. rot() 2D rotation helper
// ---------------------------------------------------------------------------
test('rot() 2D rotation helper with float32 trigonometric rounding', () => {
  const m = makeMedium();
  const l = new Lasers(m);

  // Test k == 0 (no-op)
  const ai_k0 = intArray([10, -20, 30, -40]);
  const ai1_k0 = intArray([50, -60, 70, -80]);
  l.rot(ai_k0, ai1_k0, 0, 0, 0, 4);
  // Probe: rot.k0_ai = [10, -20, 30, -40]
  assert.deepStrictEqual(Array.from(ai_k0), [10, -20, 30, -40]);
  // Probe: rot.k0_ai1 = [50, -60, 70, -80]
  assert.deepStrictEqual(Array.from(ai1_k0), [50, -60, 70, -80]);

  // Test k == 45 with center (0, 0)
  const ai_45 = intArray([100, -200, 300, -400]);
  const ai1_45 = intArray([150, -250, 350, -450]);
  l.rot(ai_45, ai1_45, 0, 0, 45, 4);
  // Probe: rot.k45_ai = [-35, 35, -35, 35]
  assert.deepStrictEqual(Array.from(ai_45), [-35, 35, -35, 35]);
  // Probe: rot.k45_ai1 = [176, -318, 459, -601]
  assert.deepStrictEqual(Array.from(ai1_45), [176, -318, 459, -601]);

  // Test k == 120 with non-zero center (250, 150)
  const ai_center = intArray([500, -100, 250, 0]);
  const ai1_center = intArray([300, 400, 150, -200]);
  l.rot(ai_center, ai1_center, 250, 150, 120, 4);
  // Probe: rot.center_ai = [-4, 209, 250, 678]
  assert.deepStrictEqual(Array.from(ai_center), [-4, 209, 250, 678]);
  // Probe: rot.center_ai1 = [291, -278, 150, 109]
  assert.deepStrictEqual(Array.from(ai1_center), [291, -278, 150, 109]);

  // Test large negative coordinates and k == 270
  const ai_large = intArray([-15000, 25000, -32000, 18000]);
  const ai1_large = intArray([12000, -28000, 31000, -19000]);
  l.rot(ai_large, ai1_large, -1000, 2000, 270, 4);
  // Probe: rot.large_ai = [9000, -31000, 28000, -22000]
  assert.deepStrictEqual(Array.from(ai_large), [9000, -31000, 28000, -22000]);
  // Probe: rot.large_ai1 = [16000, -24000, 33000, -17000]
  assert.deepStrictEqual(Array.from(ai1_large), [16000, -24000, 33000, -17000]);
});

// ---------------------------------------------------------------------------
// 4. dt() 3D transform and polygon render (deterministic: l1 == 0)
// ---------------------------------------------------------------------------
test('dt() 3D transform mutates coordinates in-place and renders polygon', () => {
  const m = makeMedium();
  const l = new Lasers(m);
  const g = makeGraphics();

  // Case 1: Simple laser quad transformed through Medium
  const ai1 = intArray([-20, 20, 20, -20]);
  const ai2 = intArray([-10, -10, 10, 10]);
  const ai3 = intArray([0, 0, 100, 100]);
  l.dt(g, ai1, ai2, ai3, 1000, -500, 4000, 15, 30, 45, 4, 0, 200, 255, 240);
  // Probe: dt.case1_ai = [-381, -378, -466, -467]
  assert.deepStrictEqual(Array.from(ai1), [-381, -378, -466, -467]);
  // Probe: dt.case1_ai1 = [269, 275, 226, 219]
  assert.deepStrictEqual(Array.from(ai2), [269, 275, 226, 219]);
  // Probe: dt.case1_ai2 = [107, 144, 156, 116]
  assert.deepStrictEqual(Array.from(ai3), [107, 144, 156, 116]);
  // Probe: dt.case1_draws = 0
  assert.strictEqual(g.filledPolygons.length, 0);

  // Case 2: Negative coordinates and different angles
  const ai1_b = intArray([-100, 100, 100, -100]);
  const ai2_b = intArray([-50, -50, 50, 50]);
  const ai3_b = intArray([-200, -200, -100, -100]);
  l.dt(g, ai1_b, ai2_b, ai3_b, -500, 300, 2000, 90, 180, 270, 4, 0, 100, 150, 200);
  // Probe: dt.case2_ai = [-138, -138, -138, -138]
  assert.deepStrictEqual(Array.from(ai1_b), [-138, -138, -138, -138]);
  // Probe: dt.case2_ai1 = [2211, 2384, 2314, 2141]
  assert.deepStrictEqual(Array.from(ai2_b), [2211, 2384, 2314, 2141]);
  // Probe: dt.case2_ai2 = [-1820, -1720, -1598, -1698]
  assert.deepStrictEqual(Array.from(ai3_b), [-1820, -1720, -1598, -1698]);

  // Case 3: Triangle (k1 = 3)
  const ai1_c = intArray([0, 30, -30]);
  const ai2_c = intArray([-40, 20, 20]);
  const ai3_c = intArray([50, 50, 50]);
  l.dt(g, ai1_c, ai2_c, ai3_c, 800, -200, 3000, 0, 0, 0, 3, 0, 255, 255, 255);
  // Probe: dt.case3_ai = [144, 166, 123]
  assert.deepStrictEqual(Array.from(ai1_c), [144, 166, 123]);
  // Probe: dt.case3_ai1 = [911, 952, 974]
  assert.deepStrictEqual(Array.from(ai2_c), [911, 952, 974]);
  // Probe: dt.case3_ai2 = [-449, -400, -437]
  assert.deepStrictEqual(Array.from(ai3_c), [-449, -400, -437]);

  // Case 4: Laser rendered directly in front of camera (frustum pass)
  const m4 = new Medium();
  m4.x = 0;
  m4.y = 0;
  m4.z = 0;
  m4.xz = 0;
  m4.zy = 0;
  const l4 = new Lasers(m4);
  const g4 = makeGraphics();
  const ai1_d = intArray([240, 260, 260, 240]);
  const ai2_d = intArray([140, 140, 160, 160]);
  const ai3_d = intArray([200, 200, 200, 200]);
  l4.dt(g4, ai1_d, ai2_d, ai3_d, 0, 0, 0, 0, 0, 0, 4, 0, 200, 255, 240);
  // Probe: dt.case4_draws = 1
  assert.strictEqual(g4.filledPolygons.length, 1);
  // Probe: dt.case4_draw0 = color=[200,255,240], xs=[230, 270, 270, 230], ys=[130, 130, 170, 170]
  assert.deepStrictEqual(
    [colorRed(g4.filledPolygons[0].color), colorGreen(g4.filledPolygons[0].color), colorBlue(g4.filledPolygons[0].color)],
    [200, 255, 240]
  );
  assert.deepStrictEqual(g4.filledPolygons[0].ox, [230, 270, 270, 230]);
  assert.deepStrictEqual(g4.filledPolygons[0].oy, [130, 130, 170, 170]);
});

// ---------------------------------------------------------------------------
// 5. d() deterministic laser drawing calls (l1 == 0, types without random)
// ---------------------------------------------------------------------------
test('d() draws deterministic laser types 0, 1, 4, 5, 6, 7, 8, 10 without error', () => {
  const g = makeGraphics();
  const m = makeMedium();
  m.x = 0;
  m.y = 0;
  m.z = 0;
  m.xz = 0;
  m.zy = 0;
  const l = new Lasers(m);

  // Type 0 (deterministic)
  g.filledPolygons = [];
  l.d(g, 0, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type0_draws = 3
  assert.strictEqual(g.filledPolygons.length, 3);

  // Type 1 (deterministic)
  g.filledPolygons = [];
  l.d(g, 1, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type1_draws = 3
  assert.strictEqual(g.filledPolygons.length, 3);

  // Type 4 (deterministic)
  g.filledPolygons = [];
  l.d(g, 4, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type4_draws = 3
  assert.strictEqual(g.filledPolygons.length, 3);

  // Type 5 (deterministic)
  g.filledPolygons = [];
  l.d(g, 5, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type5_draws = 5
  assert.strictEqual(g.filledPolygons.length, 5);

  // Type 6 (deterministic)
  g.filledPolygons = [];
  l.d(g, 6, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type6_draws = 2
  assert.strictEqual(g.filledPolygons.length, 2);

  // Type 7 (deterministic)
  g.filledPolygons = [];
  l.d(g, 7, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type7_draws = 3
  assert.strictEqual(g.filledPolygons.length, 3);

  // Type 8 (deterministic)
  g.filledPolygons = [];
  l.d(g, 8, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type8_draws = 3
  assert.strictEqual(g.filledPolygons.length, 3);

  // Type 10 (deterministic)
  g.filledPolygons = [];
  l.d(g, 10, 0, 0, 500, 0, 0, 0, 0);
  // Probe: d.type10_draws = 4
  assert.strictEqual(g.filledPolygons.length, 4);
});

// ---------------------------------------------------------------------------
// 6. §2e Discriminating test for Case A compound assignment sites
// ---------------------------------------------------------------------------
// §2 COVERAGE NOTE — the three compound-assignment sites in dt() (Java lines
// 91, 93, 95) are NOT covered by a differential test, and cannot be.
//
// Each one adds `Math.random() * 50.0 - 25.0` to the accumulator, so the Java
// side has no reproducible value to assert (§2d) and there is no input shape
// that separates Case A from Case B without one. They are classified from the
// bytecode alone, which is unambiguous:
//   70: iaload ; 75: i2d ; ... ; 98: dadd ; 99: dadd ; 100: d2i ; 101: iastore
// The accumulator is widened with i2d before the arithmetic and truncated once
// at the end — Case A. `web/Lasers.js` implements
//   ai[n4] = trunc(ai[n4] + (i - this.m.x + (random() * 50.0 - 25.0)))
//
// (A test asserting `Math.trunc(10 - 0.4) !== 10 + Math.trunc(-0.4)` stood here
// and was removed: it exercised no line of Lasers.js and would pass with the
// port broken.)
