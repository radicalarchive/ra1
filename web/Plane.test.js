// Plane.test.js — differential test for the transpiled Plane class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/web/tools/PlaneProbe.java run against the real
// Java class (output recorded in decompilation/logs/Plane.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields — intentionally NOT asserted (TRANSPILE_SPEC §2d):
//   sdx, sdz, sdy, sx[], sy[], sz[]
//     Set in d() when exp==2 via Math.random(); non-deterministic in Java.
//   adx, adz, ady, ofcx, ofcy, ofcz, nx, ny, nz, azy, axy
//     Set in s() when exp==1 via Math.random(); non-deterministic in Java.
//   All explosion-animation field mutations in d()/s() when exp != 0.
// The probe explicitly avoids these paths (PlaneProbe.java NONDETERMINISTIC
// section). §2d forbids asserting values that cannot be stable in the Java.
// All asserted values come from paths where exp=0.
//
// §2 compound-assignment audit (reproduced from Plane.js header):
//   Site 1 (d() Java line 158 / s() Java line 473):
//     this.ofy += (int)this.ady; — Case B (d2i before integer add). HIGH confidence.
//   Site 2 (d() Java line 204):
//     sy[n5] += (int)this.sdy; — Case B (d2i before integer add). HIGH confidence.
//   Site 3 (d() Java line 414):
//     this.av += (int)Math.sqrt(...); — Case B (d2i before integer add). HIGH confidence.
//   No Case A sites found.

import test from 'node:test';
import assert from 'node:assert/strict';
import { Plane } from './Plane.js';
import { SinCos } from './SinCos.js';

// ---------------------------------------------------------------------------
// Stubs
// ---------------------------------------------------------------------------

/** Minimal Medium stub matching the default Medium() Java constructor values,
 *  plus xz=45 and zy=30 as set by PlaneProbe.newMedium(). */
function makeMedium() {
  const cs = new SinCos();
  return {
    cs,
    focus_point: 400,
    ground: 250,
    er: 0,
    eg: 0,
    eb: 0,
    cx: 250,
    cy: 150,
    cz: 50,
    xz: 45,
    zy: 30,
    w: 500,
    h: 360,
  };
}

/** No-op Graphics stub. Plane.d() / Plane.s() call setColor, fillPolygon,
 *  drawPolygon — we only care about field mutations (av, projf, exp). */
function makeGraphics() {
  return {
    setColor() {},
    fillPolygon() {},
    drawPolygon() {},
  };
}

/** Construct a Plane the same way PlaneProbe does:
 *    new Plane(medium, ai=ox, ai1=oz, ai2=oy, i=n, ai3=c)
 *  The Java constructor parameter order is ox, oz, oy (ai, ai1, ai2). */
function makePlane(medium, ox, oz, oy, n, c) {
  return new Plane(medium, ox, oz, oy, n, c);
}

// ---------------------------------------------------------------------------
// Shared inputs (from PlaneProbe "PLANE setup" section)
// ---------------------------------------------------------------------------
const OX = [-5000, 5000, 2000];
const OZ = [-3000, 3000, 1500];  // ai1 in probe (oz)
const OY = [100, -200, 50];      // ai2 in probe (oy)
const N  = 3;
const C  = [180, 120, 60];

// ---------------------------------------------------------------------------
// 1. Constructor post-conditions
// (probe lines: n, ox, oy, oz, c, deltaf_after_ctor, projf_after_ctor,
//               sr, sg, exp_after_ctor)
// ---------------------------------------------------------------------------

test('constructor: n, ox, oy, oz, c fields (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);

  // n = 3
  assert.strictEqual(p.n, 3);
  // ox = [-5000, 5000, 2000]
  assert.strictEqual(p.ox[0], -5000);
  assert.strictEqual(p.ox[1],  5000);
  assert.strictEqual(p.ox[2],  2000);
  // oy = [100, -200, 50]
  assert.strictEqual(p.oy[0],  100);
  assert.strictEqual(p.oy[1], -200);
  assert.strictEqual(p.oy[2],   50);
  // oz = [-3000, 3000, 1500]
  assert.strictEqual(p.oz[0], -3000);
  assert.strictEqual(p.oz[1],  3000);
  assert.strictEqual(p.oz[2],  1500);
  // c = [180, 120, 60]
  assert.strictEqual(p.c[0], 180);
  assert.strictEqual(p.c[1], 120);
  assert.strictEqual(p.c[2],  60);
});

test('constructor: deltaf_after_ctor = 3.5538489E10 (from probe)', () => {
  // From probe: deltaf_after_ctor = 3.5538489E10
  // deltaf is a float field; probe prints it via System.out.println(float).
  // Compare using Math.fround to match Java float32 precision.
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  assert.strictEqual(p.deltaf, Math.fround(3.5538489e10));
});

test('constructor: projf_after_ctor = 1.0 (from probe)', () => {
  // From probe: projf_after_ctor = 1.0
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  assert.strictEqual(p.projf, 1.0);
});

test('constructor: sr=255, sg=220, exp=0 (from probe)', () => {
  // From probe: sr = 255, sg = 220, exp_after_ctor = 0
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  assert.strictEqual(p.sr,  255);
  assert.strictEqual(p.sg,  220);
  assert.strictEqual(p.exp,   0);
});

// ---------------------------------------------------------------------------
// 2. loadprojf()
// (probe line: projf_after_loadprojf = 3.5317494E10)
// ---------------------------------------------------------------------------

test('loadprojf: projf = 3.5317494E10 (from probe)', () => {
  // From probe: projf_after_loadprojf = 3.5317494E10
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  p.loadprojf();
  assert.strictEqual(p.projf, Math.fround(3.5317494e10));
});

// ---------------------------------------------------------------------------
// 3. xs() — perspective X projection
// (probe lines: xs(...) = ...)
// ---------------------------------------------------------------------------

test('xs(3000, 2000) = 800 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: xs(3000, 2000) = 800
  assert.strictEqual(p.xs(3000, 2000), 800);
});

test('xs(-500, 800) = -125 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: xs(-500, 800) = -125
  assert.strictEqual(p.xs(-500, 800), -125);
});

test('xs(200, 5) = -1750 — j<10 clamped to 10 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: xs(200, 5) = -1750  (j clamped to 10)
  assert.strictEqual(p.xs(200, 5), -1750);
});

test('xs(200, -100) = -1750 — negative j clamped to 10 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: xs(200, -100) = -1750  (j clamped to 10)
  assert.strictEqual(p.xs(200, -100), -1750);
});

test('xs(0, 0) = -9750 — j==0 clamped to 10 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: xs(0, 0) = -9750  (j clamped to 10)
  assert.strictEqual(p.xs(0, 0), -9750);
});

// ---------------------------------------------------------------------------
// 4. ys() — perspective Y projection
// (probe lines: ys(...) = ...)
// ---------------------------------------------------------------------------

test('ys(3000, 2000) = 720 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: ys(3000, 2000) = 720
  assert.strictEqual(p.ys(3000, 2000), 720);
});

test('ys(-500, 800) = -175 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: ys(-500, 800) = -175
  assert.strictEqual(p.ys(-500, 800), -175);
});

test('ys(200, 5) = 2150 — j<10 clamped to 10 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: ys(200, 5) = 2150  (j clamped to 10)
  assert.strictEqual(p.ys(200, 5), 2150);
});

test('ys(200, -100) = 2150 — negative j clamped to 10 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: ys(200, -100) = 2150  (j clamped to 10)
  assert.strictEqual(p.ys(200, -100), 2150);
});

test('ys(0, 0) = -5850 — j==0 clamped to 10 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: ys(0, 0) = -5850  (j clamped to 10)
  assert.strictEqual(p.ys(0, 0), -5850);
});

// ---------------------------------------------------------------------------
// 5. spy() — squared-distance to camera with int32 wrap
// (probe lines: spy(...) = ...)
// ---------------------------------------------------------------------------

test('spy(250, 0) = 0 — on-centre (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: spy(250, 0) = 0  (i == cx == 250, j == 0)
  assert.strictEqual(p.spy(250, 0), 0);
});

test('spy(0, 0) = 250 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: spy(0, 0) = 250  (distance from cx=250)
  assert.strictEqual(p.spy(0, 0), 250);
});

test('spy(1000, 1000) = 1250 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: spy(1000, 1000) = 1250
  // (1000-250)^2 + 1000^2 = 562500+1000000 = 1562500; sqrt == 1250 exactly.
  assert.strictEqual(p.spy(1000, 1000), 1250);
});

test('spy(50000, 60000) = 42191 — int32 overflow, wrapped (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: spy(50000, 60000) = 42191
  // (50000-250)^2 = 2475062500 overflows int32; i32() wraps; game wraps too.
  assert.strictEqual(p.spy(50000, 60000), 42191);
});

test('spy(-30000, -40000) = 0 — wrapped sum is negative, sqrt(neg)=NaN, trunc(NaN)=0 (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe: spy(-30000, -40000) = 0
  // i32-wrapped sum is negative; Math.sqrt(neg) = NaN; trunc(NaN) = 0.
  assert.strictEqual(p.spy(-30000, -40000), 0);
});

// ---------------------------------------------------------------------------
// 6. rot() — in-place rotation of two int arrays
// (probe lines: rot_ai_after, rot_ai1_after, rot_noop_ai, rot_noop_ai1)
// ---------------------------------------------------------------------------

test('rot k=45: arrays rotated in place (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe:
  //   rotA=[-5000,5000,2000], rotB=[-3000,3000,1500], i=0, j=0, k=45, l=3
  //   rot_ai_after  = [-1414, 1414, 353]
  //   rot_ai1_after = [-5656, 5656, 2474]
  const rotA = [-5000, 5000, 2000];
  const rotB = [-3000, 3000, 1500];
  p.rot(rotA, rotB, 0, 0, 45, 3);
  assert.strictEqual(rotA[0], -1414);
  assert.strictEqual(rotA[1],  1414);
  assert.strictEqual(rotA[2],   353);
  assert.strictEqual(rotB[0], -5656);
  assert.strictEqual(rotB[1],  5656);
  assert.strictEqual(rotB[2],  2474);
});

test('rot k=0 is a no-op: arrays unchanged (from probe)', () => {
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  // From probe:
  //   rotC=[100,200,300], rotD=[400,500,600], i=10, j=20, k=0 => no change
  //   rot_noop_ai  = [100, 200, 300]
  //   rot_noop_ai1 = [400, 500, 600]
  const rotC = [100, 200, 300];
  const rotD = [400, 500, 600];
  p.rot(rotC, rotD, 10, 20, 0, 3);
  assert.strictEqual(rotC[0], 100);
  assert.strictEqual(rotC[1], 200);
  assert.strictEqual(rotC[2], 300);
  assert.strictEqual(rotD[0], 400);
  assert.strictEqual(rotD[1], 500);
  assert.strictEqual(rotD[2], 600);
});

// ---------------------------------------------------------------------------
// 7. d() with exp=0, flag=false (deterministic path)
// (probe: av_after_d=4382, projf_after_d=2.89187738E10, exp_after_d=0)
// ---------------------------------------------------------------------------

test('d() exp=0 flag=false: av=4382, projf=2.89187738E10, exp=0 (from probe)', () => {
  // From probe:
  //   invokeD(plane, g, 3000, -500, 2000, 0, 45, 30, false, false, false)
  //   av_after_d    = 4382
  //   projf_after_d = 2.89187738E10
  //   exp_after_d   = 0
  //
  // NONDETERMINISTIC paths NOT exercised: exp remains 0 throughout this call,
  // so no Math.random() is invoked.
  const m = makeMedium();
  const p = makePlane(m, OX, OZ, OY, N, C);
  assert.strictEqual(p.exp, 0);  // confirm starting state matches probe

  const g = makeGraphics();
  p.d(g, 3000, -500, 2000, 0, 45, 30, false, false, false);

  assert.strictEqual(p.av, 4382);
  // projf is a float field; Math.fround gives the nearest float32.
  assert.strictEqual(p.projf, Math.fround(2.89187738e10));
  assert.strictEqual(p.exp, 0);
});

// ---------------------------------------------------------------------------
// 8. d() with exp=0, flag=true (exercises the 400.0f * f colour branch)
// (probe: av_after_d_flag=4233, projf_after_d_flag=28754.979)
// Fresh smaller plane matching the probe's SECOND_PLANE section.
// ---------------------------------------------------------------------------

test('d() exp=0 flag=true: av=4233, projf=28754.979 (from probe)', () => {
  // From probe (SECOND_PLANE):
  //   ox2=[-500,500,200], oz2=[-300,300,150], oy2=[10,-20,5], c2=[100,150,200]
  //   invokeD(plane2, g2, 500, -100, 400, 0, 45, 30, true, false, false)
  //   av_after_d_flag    = 4233
  //   projf_after_d_flag = 28754.979
  //
  // NONDETERMINISTIC paths NOT exercised: exp=0 throughout.
  const ox2 = [-500, 500, 200];
  const oz2 = [-300, 300, 150];
  const oy2 = [10, -20, 5];
  const c2  = [100, 150, 200];
  const m = makeMedium();
  const p2 = makePlane(m, ox2, oz2, oy2, 3, c2);
  assert.strictEqual(p2.exp, 0);

  const g = makeGraphics();
  p2.d(g, 500, -100, 400, 0, 45, 30, true, false, false);

  assert.strictEqual(p2.av, 4233);
  // projf_after_d_flag = 28754.979; Math.fround matches Java float32.
  assert.strictEqual(p2.projf, Math.fround(28754.979));
});

// ---------------------------------------------------------------------------
// 9. s() with exp=0 — shadow drawing, deterministic paths
// (probe: exp_after_s_allaboveground=0, exp_after_s_belowground=0)
// ---------------------------------------------------------------------------

test('s() exp=0 all oy>ground: exp unchanged (from probe: exp_after_s_allaboveground=0)', () => {
  // From probe: ox3=[-200,300,100], oz3=[-150,200,80], oy3=[400,450,420]
  //   All oy > ground(250) => i2 == n => skip draw block.
  //   invokeS(plane3, g3, 500, -100, 400, 0, 45, 30, false)
  //   exp_after_s_allaboveground = 0
  //
  // NONDETERMINISTIC: exp=0 throughout; s() skips the Math.random() path.
  const ox3 = [-200, 300, 100];
  const oz3 = [-150, 200, 80];
  const oy3 = [400, 450, 420];
  const c3  = [80, 100, 60];
  const m = makeMedium();
  const p3 = makePlane(m, ox3, oz3, oy3, 3, c3);
  assert.strictEqual(p3.exp, 0);

  const g = makeGraphics();
  p3.s(g, 500, -100, 400, 0, 45, 30, false);

  assert.strictEqual(p3.exp, 0);
});

test('s() exp=0 all oy<ground: shadow drawn, exp unchanged (from probe: exp_after_s_belowground=0)', () => {
  // From probe: ox4=[-200,300,100], oz4=[-150,200,80], oy4=[-100,-50,-200]
  //   All oy < ground(250) => all clamped, i2==0 => draw branch entered.
  //   invokeS(plane4, g4, 500, -100, 400, 0, 45, 30, false)
  //   exp_after_s_belowground = 0
  //
  // NONDETERMINISTIC: exp=0 throughout; no Math.random() called.
  const ox4 = [-200, 300, 100];
  const oz4 = [-150, 200, 80];
  const oy4 = [-100, -50, -200];
  const c4  = [80, 100, 60];
  const m = makeMedium();
  const p4 = makePlane(m, ox4, oz4, oy4, 3, c4);
  assert.strictEqual(p4.exp, 0);

  const g = makeGraphics();
  p4.s(g, 500, -100, 400, 0, 45, 30, false);

  assert.strictEqual(p4.exp, 0);
});
