// userCraft.test.js — differential test for the transpiled userCraft class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/port/tools/userCraftProbe.java run against the real
// Java class (output recorded in decompilation/logs/userCraft.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields — intentionally NOT asserted (TRANSPILE_SPEC §2d):
//   1. dosmokes() random smoke particles and coordinates (userCraft.java lines 415, 447).
//   2. lasercolid() random damage rolls (userCraft.java lines 558, 575) when maxhits != -1.
//   3. Heavily damaged steering jitter in preform() (userCraft.java lines 217, 218).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { userCraft } from './userCraft.js';
import { Medium } from './Medium.js';
import { ContO } from './ContO.js';
import { Control } from './Control.js';

const REPO = new URL('../', import.meta.url).pathname;
const MODEL = new Uint8Array(readFileSync(REPO + 'objects/rk1.rad'));

function makeMedium() {
  return new Medium();
}

function makeContO(m, x, y, z) {
  const c = new ContO(MODEL, m, x, y, z);
  c.maxhits = 100;
  c.nhits = 0;
  return c;
}

function makeControl() {
  return new Control();
}

function makeGraphics() {
  return {
    setColor() {},
    fillPolygon() {},
    drawPolygon() {},
    drawLine() {},
    fillRect() {},
  };
}

// ---------------------------------------------------------------------------
// 1. Constructor and default fields
// ---------------------------------------------------------------------------

test('constructor: default fields match Java (from probe)', () => {
  const m = makeMedium();
  const uc = new userCraft(m);

  // Probe lines 1-22:
  assert.strictEqual(uc.rspeed, 0);
  assert.strictEqual(uc.speed, 0.0);
  assert.strictEqual(uc.rlift, 0);
  assert.strictEqual(uc.lift, 0.0);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, false);
  assert.strictEqual(uc.nd, 0);
  assert.deepStrictEqual(Array.from(uc.maxspeed), [120, 100, 90, 80, 76]);
  assert.deepStrictEqual(Array.from(uc.elev), [1, 2, 1, 1, 1]);
  assert.deepStrictEqual(Array.from(uc.trnn), [0, 0, 1, 2, 1]);
  assert.deepStrictEqual(Array.from(uc.dnjm), [7, 5, 4, 3, 4]);
  assert.deepStrictEqual(uc.name, ["E-7 Sky Bullet", "BP-6 Hammer Head", "E-9 Dragon Bird", "EXA-1 Destroyer", "Silver F-51 Legend"]);
  assert.deepStrictEqual(Array.from(uc.sms), [-1, -1, -1, -1]);
  assert.deepStrictEqual(Array.from(uc.dms), [-1, -1, -1, -1]);
  assert.deepStrictEqual(Array.from(uc.lstage), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

// ---------------------------------------------------------------------------
// 2. Reset method
// ---------------------------------------------------------------------------

test('reset: clears velocities and sets craft type and njumps', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  uc.rspeed = 50;
  uc.speed = 45.5;
  uc.rlift = 12;
  uc.lift = 10.5;
  uc.pexp = true;
  uc.lstage[0] = 5;
  uc.lstage[1] = 10;

  uc.reset(2);

  // Probe lines 23-31:
  assert.strictEqual(uc.rspeed, 0);
  assert.strictEqual(uc.speed, 0.0);
  assert.strictEqual(uc.rlift, 0);
  assert.strictEqual(uc.lift, 0.0);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 2);
  assert.strictEqual(uc.njumps, 4);
  assert.strictEqual(uc.lstage[0], 0);
  assert.strictEqual(uc.lstage[1], 0);
});

// ---------------------------------------------------------------------------
// 3. getpy (Large, negative, and wrapping coordinates)
// ---------------------------------------------------------------------------

test('getpy: distance calculation with integer wrapping', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  uc.lx[0] = -30000; uc.ly[0] = 40000; uc.lz[0] = -50000;
  uc.lx[1] = 25000;  uc.ly[1] = -15000; uc.lz[1] = 35000;

  // Probe lines 32-34:
  assert.strictEqual(uc.getpy(10000, -20000, 30000, 0), 116000000);
  assert.strictEqual(uc.getpy(-40000, 50000, -60000, 1), 174750000);
  assert.strictEqual(uc.getpy(70000, 80000, 90000, 0), 312000000);
});

// ---------------------------------------------------------------------------
// 4. preform - Air flight (conto.y < 207)
// ---------------------------------------------------------------------------

test('preform: air flight with up and left controls', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 0, 100, 0);
  const ctl = makeControl();
  ctl.up = true;
  ctl.left = true;
  uc.speed = 50.0;
  uc.rspeed = 50;
  c.zy = 180;
  c.xy = 89;
  c.xz = 180;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 35-59:
  assert.strictEqual(c.x, 0);
  assert.strictEqual(c.y, 100);
  assert.strictEqual(c.z, 50);
  assert.strictEqual(c.xz, 180);
  assert.strictEqual(c.xy, 79);
  assert.strictEqual(c.zy, 180);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, false);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 50);
  assert.strictEqual(uc.speed, 50.0);
  assert.strictEqual(uc.rlift, -49);
  assert.strictEqual(uc.lift, -0.5);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, false);
  assert.strictEqual(uc.nd, 0);
});

test('preform: air flight with down, right, and plus controls', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 500, 50, -500);
  const ctl = makeControl();
  ctl.down = true;
  ctl.right = true;
  ctl.plus = true;
  uc.speed = 20.0;
  uc.rspeed = 20;
  c.zy = 45;
  c.xy = -45;
  c.xz = 90;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 60-84:
  assert.strictEqual(c.x, 487);
  assert.strictEqual(c.y, 36);
  assert.strictEqual(c.z, -500);
  assert.strictEqual(c.xz, 93);
  assert.strictEqual(c.xy, -35);
  assert.strictEqual(c.zy, 48);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, false);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 22);
  assert.strictEqual(uc.speed, 20.0);
  assert.strictEqual(uc.rlift, -30);
  assert.strictEqual(uc.lift, -0.5);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, false);
  assert.strictEqual(uc.nd, 0);
});

test('preform: air flight with down key and xy=95 (discriminator Sites 3 & 4)', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 0, 100, 0);
  const ctl = makeControl();
  ctl.down = true;
  uc.speed = 50.0;
  uc.rspeed = 50;
  c.zy = 45;
  c.xy = 95;
  c.xz = 180;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 85-109:
  assert.strictEqual(c.x, -2);
  assert.strictEqual(c.y, 65);
  assert.strictEqual(c.z, -35);
  assert.strictEqual(c.xz, 176);
  assert.strictEqual(c.xy, 95);
  assert.strictEqual(c.zy, 45);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, false);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 50);
  assert.strictEqual(uc.speed, 50.0);
  assert.strictEqual(uc.rlift, -43);
  assert.strictEqual(uc.lift, -0.5);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, false);
  assert.strictEqual(uc.nd, 0);
});

// ---------------------------------------------------------------------------
// 5. preform - Ground flight (conto.y >= 207)
// ---------------------------------------------------------------------------

test('preform: ground crash triggers explosion and aligns xy', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 100, 210, 100);
  const ctl = makeControl();
  c.zy = 120;
  c.xy = 45;
  uc.speed = 60.0;
  uc.rspeed = 60;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 110-134:
  assert.strictEqual(c.x, 100);
  assert.strictEqual(c.y, 145);
  assert.strictEqual(c.z, 85);
  assert.strictEqual(c.xz, 0);
  assert.strictEqual(c.xy, 180);
  assert.strictEqual(c.zy, 121);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, true);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 60);
  assert.strictEqual(uc.speed, 29.700000762939453);
  assert.strictEqual(uc.rlift, -25);
  assert.strictEqual(uc.lift, -0.5);
  assert.strictEqual(uc.pexp, true);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, true);
  assert.strictEqual(uc.nd, 0);
});

test('preform: ground upright flight with down key and mins', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 200, 208, 200);
  const ctl = makeControl();
  ctl.down = true;
  ctl.mins = true;
  c.zy = 10;
  c.xy = 0;
  uc.speed = 25.0;
  uc.rspeed = 25;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 135-159:
  assert.strictEqual(c.x, 200);
  assert.strictEqual(c.y, 202);
  assert.strictEqual(c.z, 224);
  assert.strictEqual(c.xz, 0);
  assert.strictEqual(c.xy, 0);
  assert.strictEqual(c.zy, 14);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, false);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 23);
  assert.strictEqual(uc.speed, 25.0);
  assert.strictEqual(uc.rlift, -16);
  assert.strictEqual(uc.lift, -0.5);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, true);
  assert.strictEqual(uc.nd, 0);
});

test('preform: ground flight with down key and xy=95 (discriminator Site 5)', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 200, 208, 200);
  const ctl = makeControl();
  ctl.down = true;
  c.zy = 10;
  c.xy = 95;
  uc.speed = 25.0;
  uc.rspeed = 25;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 160-184:
  assert.strictEqual(c.x, 200);
  assert.strictEqual(c.y, 163);
  assert.strictEqual(c.z, 228);
  assert.strictEqual(c.xz, 0);
  assert.strictEqual(c.xy, 0);
  assert.strictEqual(c.zy, 14);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, true);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 25);
  assert.strictEqual(uc.speed, 29.700000762939453);
  assert.strictEqual(uc.rlift, -11);
  assert.strictEqual(uc.lift, -0.5);
  assert.strictEqual(uc.pexp, true);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, true);
  assert.strictEqual(uc.nd, 0);
});

// ---------------------------------------------------------------------------
// 6. preform - Lift clamping and arena boundaries
// ---------------------------------------------------------------------------

test('preform: lift upper clamp and negative x / positive z boundary clamping', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, -45000, 150, 45000);
  const ctl = makeControl();
  uc.lift = 100.0;
  uc.speed = 40.0;
  c.zy = 0;
  c.xy = 0;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 185-209:
  assert.strictEqual(c.x, -40006);
  assert.strictEqual(c.y, 145);
  assert.strictEqual(c.z, 40038);
  assert.strictEqual(c.xz, 10);
  assert.strictEqual(c.xy, 0);
  assert.strictEqual(c.zy, 0);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, false);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 0);
  assert.strictEqual(uc.speed, 39.5);
  assert.strictEqual(uc.rlift, 0);
  assert.strictEqual(uc.lift, 5.0);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, false);
  assert.strictEqual(uc.nd, 0);
});

test('preform: lift lower clamp and positive x / negative z boundary clamping', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 45000, 150, -45000);
  const ctl = makeControl();
  uc.lift = -100.0;
  uc.speed = 10.0;
  c.zy = 0;
  c.xy = 180;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 210-234:
  assert.strictEqual(c.x, 39999);
  assert.strictEqual(c.y, 195);
  assert.strictEqual(c.z, -39991);
  assert.strictEqual(c.xz, 10);
  assert.strictEqual(c.xy, 180);
  assert.strictEqual(c.zy, 0);
  assert.strictEqual(c.fire, false);
  assert.strictEqual(c.hit, false);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(c.exp, false);
  assert.strictEqual(c.wire, false);

  assert.strictEqual(uc.rspeed, 0);
  assert.strictEqual(uc.speed, 9.5);
  assert.strictEqual(uc.rlift, -50);
  assert.strictEqual(uc.lift, -45.0);
  assert.strictEqual(uc.pexp, false);
  assert.strictEqual(uc.ltyp, 0);
  assert.strictEqual(uc.njumps, 0);
  assert.strictEqual(uc.ester, 0);
  assert.strictEqual(uc.nl, 0);
  assert.strictEqual(uc.skip, false);
  assert.strictEqual(uc.bulkc, 0);
  assert.strictEqual(uc.ns, 0);
  assert.strictEqual(uc.smoke, false);
  assert.strictEqual(uc.nd, 0);
});

// ---------------------------------------------------------------------------
// 7. preform - Jump mechanics
// ---------------------------------------------------------------------------

test('preform: jump charge and launch', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 0, 100, 0);
  const ctl = makeControl();
  uc.njumps = 3;
  ctl.jump = 1;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 235-237:
  assert.strictEqual(uc.speed, 400.0);
  assert.strictEqual(ctl.jump, 2);
  assert.strictEqual(c.m.jumping, 5);

  // Jumping reaches 0 -> launch
  c.m.jumping = 0;
  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 238-240:
  assert.strictEqual(uc.speed, 800.0);
  assert.strictEqual(ctl.jump, 0);
  assert.strictEqual(uc.njumps, 2);
});

// ---------------------------------------------------------------------------
// 8. preform - Weapons and Laser tracking
// ---------------------------------------------------------------------------

test('preform: laser spawning and enemy tracking atan/sqrt orientation', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 1000, 100, 2000);
  c.xz = 45;
  c.zy = 15;
  c.xy = 0;

  const ctl = makeControl();
  ctl.fire = true;
  uc.skip = true;
  uc.bulkc = 2;
  uc.speed = 50.0;

  const cEnemy = makeContO(m, 1500, 50, 2500);
  const aconto = [c, cEnemy];
  const ai = new Int32Array([0, 1]);

  uc.preform(ctl, c, aconto, ai, 2);

  // Probe lines 241-246:
  assert.strictEqual(uc.nl, 1);
  assert.strictEqual(uc.lx[0], 830);
  assert.strictEqual(uc.ly[0], 36);
  assert.strictEqual(uc.lz[0], 2170);
  assert.strictEqual(uc.lspeed[0], 249);
  assert.strictEqual(uc.lstage[0], 2);

  // Tracking when lstage > 10
  uc.lstage[0] = 12;
  uc.preform(ctl, c, aconto, ai, 2);

  // Probe lines 247-252:
  assert.strictEqual(uc.lxz[0], 296);
  assert.strictEqual(uc.lzy[0], -1);
  assert.strictEqual(uc.lx[0], 1036);
  assert.strictEqual(uc.ly[0], 40);
  assert.strictEqual(uc.lz[0], 2270);
  assert.strictEqual(uc.lstage[0], 13);
});

// ---------------------------------------------------------------------------
// 9. preform - Easter egg sequence and color switching
// ---------------------------------------------------------------------------

test('preform: easter egg trigger and medium color channel swaps', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const c = makeContO(m, 3000, 0, -2000);
  const ctl = makeControl();
  uc.ester = 0;
  c.nhits = 50;

  const aconto = [c, c];
  const ai = new Int32Array([0, 0]);

  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 253-256:
  assert.strictEqual(uc.ester, 1);
  assert.strictEqual(c.nhits, 0);
  assert.strictEqual(uc.njumps, 7);
  assert.strictEqual(c.wire, false);

  // Advance ester to 3
  uc.ester = 2;
  uc.preform(ctl, c, aconto, ai, 1);

  // Probe lines 257-258:
  assert.strictEqual(uc.ester, 3);
  assert.strictEqual(c.wire, false);

  // Color switches for ltyp 0..4
  const expectedColors = [
    { er: 1, eg: 0, eb: 0 },
    { er: 0, eg: 1, eb: 0 },
    { er: 0, eg: 0, eb: 1 },
    { er: 1, eg: 1, eb: 0 },
    { er: 0, eg: 1, eb: 1 },
  ];

  for (let t = 0; t < 5; t++) {
    const ucT = new userCraft(m);
    ucT.ltyp = t;
    ucT.ester = 5;
    const cT = makeContO(m, 0, 100, 0);
    cT.m.er = 0;
    cT.m.eg = 0;
    cT.m.eb = 0;
    const ctlT = makeControl();
    ucT.preform(ctlT, cT, aconto, ai, 1);

    // Probe lines 259-273:
    assert.strictEqual(cT.m.er, expectedColors[t].er);
    assert.strictEqual(cT.m.eg, expectedColors[t].eg);
    assert.strictEqual(cT.m.eb, expectedColors[t].eb);
  }
});

// ---------------------------------------------------------------------------
// 10. lasercolid - Collision detection
// ---------------------------------------------------------------------------

test('lasercolid: laser hit registration', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const cTarget = makeContO(m, 1000, 500, 1000);
  cTarget.maxR = 5000;
  cTarget.rcol = 1;
  cTarget.maxhits = -1;

  // Exact position (j == 0 -> skipped)
  uc.lstage[0] = 5;
  uc.lhit[0] = 0;
  uc.lx[0] = 1000;
  uc.ly[0] = 500;
  uc.lz[0] = 1000;

  uc.lasercolid(cTarget);
  // Probe line 274:
  assert.strictEqual(uc.lhit[0], 0);

  // Offset position within radius (j > 0 -> registered hit)
  const uc2 = new userCraft(m);
  uc2.lstage[0] = 5;
  uc2.lhit[0] = 0;
  uc2.lx[0] = 990;
  uc2.ly[0] = 500;
  uc2.lz[0] = 1000;

  uc2.lasercolid(cTarget);
  // Probe line 275:
  assert.strictEqual(uc2.lhit[0], 1);
});

// ---------------------------------------------------------------------------
// 11. dl - Laser rendering and hit state lifecycle
// ---------------------------------------------------------------------------

test('dl: laser animation and completion lifecycle', () => {
  const m = makeMedium();
  const uc = new userCraft(m);
  const g = makeGraphics();

  uc.lstage[0] = 10;
  uc.lhit[0] = 1;
  uc.lstage[1] = 15;
  uc.lhit[1] = 0;

  uc.dl(g);
  // Probe lines 276-279:
  assert.strictEqual(uc.lhit[0], 2);
  assert.strictEqual(uc.lstage[0], 10);
  assert.strictEqual(uc.lhit[1], 0);
  assert.strictEqual(uc.lstage[1], 15);

  uc.dl(g);
  // Probe lines 280-281:
  assert.strictEqual(uc.lhit[0], 3);
  assert.strictEqual(uc.lstage[0], 0);

  uc.dl(g);
  // Probe lines 282-283:
  assert.strictEqual(uc.lhit[0], 3);
  assert.strictEqual(uc.lstage[0], 0);
});
