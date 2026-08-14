// Tank.test.js — differential test for the transpiled Tank class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/web/tools/TankProbe.java run against the real
// Java class (output recorded in decompilation/logs/Tank.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields — intentionally NOT asserted (TRANSPILE_SPEC §2d):
//   1. turnat in Tank constructor (Tank.java line 452):
//      this.turnat = (int)(Math.random() * 50.0);
//      Java's unseeded Math.random() makes initial turnat non-deterministic.
//      (Probe printed nondet.init_turnat).
//   2. sx[ns] in dosmokes() (Tank.java line 382):
//      this.sx[this.ns] = conto.x + (int)(Math.random() * 150.0 - 75.0);
//      Java's unseeded Math.random() makes smoke X particle coordinate non-deterministic.
//      (Probe printed nondet.smoke_sx0).
//   3. Explosion randomized deltas (Tank.java lines 130-133) and random targeting
//      branches in preform() (Tank.java lines 278, 281, 289, 295, 326, 445):
//      The probe sets turnat=1000 and conto.exp=false during multi-step simulation,
//      explicitly isolating the deterministic steering, gravity, clamping, and
//      laser updates from the non-deterministic random rolls.
//
// §2 compound-assignment audit (from Tank.js header):
//   Sites 1-2 (preform() Java lines 92, 102):
//     conto.xy += (int)(this.speed / 5.0f);
//     conto.xy -= (int)(this.speed / 5.0f);
//     CASE A (widened to float on LHS, single truncation at end). Confidence: HIGH.
//     Discriminator: speed positive, accumulator non-zero fractional step.
//   Sites 3-5 (preform() Java lines 242, 245, 248):
//     lx[n2] -= (int)(this.lspeed[j2] * (conto.m.cs.getsin(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2])));
//     lz[n3] += (int)(this.lspeed[j2] * (conto.m.cs.getcos(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2])));
//     ly[n4] -= (int)(this.lspeed[j2] * conto.m.cs.getsin(this.lzy[j2]));
//     CASE B (RHS truncated with d2i/f2i before integer add/sub). Confidence: HIGH.
//   Sites 6-8 (preform() Java lines 266, 267, 268):
//     conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
//     conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
//     conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
//     CASE B (RHS velocity components truncated before integer add/sub). Confidence: HIGH.
//   Sites 9-11 (preform() Java lines 282, 285, 289):
//     this.gxz += (int)(70.0 + Math.random() * 20.0);
//     this.gxz -= (int)(70.0 + Math.random() * 20.0);
//     this.gxz += (int)(Math.random() * 40.0 - 20.0);
//     CASE B (d2i before integer add/sub). Confidence: HIGH.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Tank } from './Tank.js';
import { Medium } from './Medium.js';
import { ContO } from './ContO.js';

const REPO = new URL('../', import.meta.url).pathname;
const MODEL = new Uint8Array(readFileSync(REPO + 'objects/rk1.rad'));

function makeMedium() {
  return new Medium();
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

function setControl(tank, left, right, up, down, fire) {
  tank.u.left = left;
  tank.u.right = right;
  tank.u.up = up;
  tank.u.down = down;
  tank.u.fire = fire;
}

// ---------------------------------------------------------------------------
// 1. Constructor and default fields
// ---------------------------------------------------------------------------

test('constructor: default fields match Java (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  // From probe:
  //   init.rspeed = 0
  //   init.ltyp = 0
  //   init.speed = 0.0
  //   init.pexp = false
  //   init.left = false
  //   init.right = false
  //   init.nl = 0
  //   init.skip = false
  //   init.bulkc = 0
  //   init.ns = 0
  //   init.smoke = false
  //   init.tcnt = 0
  //   init.gxz = 0
  //   init.attack = 0
  //   init.responce = false
  //   init.trgxz = 180
  //   init.trgt = 0
  //   init.sms = [-1, -1, -1, -1]
  //   init.lstage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  assert.strictEqual(tank.rspeed, 0);
  assert.strictEqual(tank.ltyp, 0);
  assert.strictEqual(tank.speed, 0.0);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, false);
  assert.strictEqual(tank.tcnt, 0);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 180);
  assert.strictEqual(tank.trgt, 0);

  assert.strictEqual(tank.sms.length, 4);
  for (let i = 0; i < 4; i++) {
    assert.strictEqual(tank.sms[i], -1);
  }

  assert.strictEqual(tank.lstage.length, 20);
  for (let i = 0; i < 20; i++) {
    assert.strictEqual(tank.lstage[i], 0);
  }
});

// ---------------------------------------------------------------------------
// 2. Helper methods (getpy, getcpy) with int32 wrapping
// ---------------------------------------------------------------------------

test('getpy() and getcpy() calculate squared distances with int32 wrapping (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  tank.lx[0] = -35000; tank.ly[0] = 25000; tank.lz[0] = -48000;
  tank.lx[1] = 15000;  tank.ly[1] = -12000; tank.lz[1] = 32000;

  // From probe:
  //   getpy.test1 = 166340000
  //   getpy.test2 = 43490000
  assert.strictEqual(tank.getpy(48000, -38000, 28000, 0), 166340000);
  assert.strictEqual(tank.getpy(-28000, 18000, -8000, 1), 43490000);

  // From probe:
  //   getcpy.test1 = 1490000
  const c1 = new ContO(MODEL, m, 42000, -32000, 22000);
  const c2 = new ContO(MODEL, m, -38000, 28000, -48000);
  assert.strictEqual(tank.getcpy(c1, c2), 1490000);
});

// ---------------------------------------------------------------------------
// 3. reset()
// ---------------------------------------------------------------------------

test('reset() reinitializes rspeed, ltyp, pexp and clears lstage array (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  // reset1: reset(90, 2)
  // From probe:
  //   reset1.rspeed = 90
  //   reset1.speed = 0.0
  //   reset1.ltyp = 2
  //   reset1.pexp = false
  //   reset1.left = false
  //   reset1.right = false
  //   reset1.nl = 0
  //   reset1.skip = false
  //   reset1.bulkc = 0
  //   reset1.ns = 0
  //   reset1.smoke = false
  //   reset1.tcnt = 0
  //   reset1.gxz = 0
  //   reset1.attack = 0
  //   reset1.responce = false
  //   reset1.trgxz = 180
  //   reset1.trgt = 0
  tank.reset(90, 2);
  assert.strictEqual(tank.rspeed, 90);
  assert.strictEqual(tank.speed, 0.0);
  assert.strictEqual(tank.ltyp, 2);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, false);
  assert.strictEqual(tank.tcnt, 0);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 180);
  assert.strictEqual(tank.trgt, 0);
  for (let k = 0; k < 20; k++) {
    assert.strictEqual(tank.lstage[k], 0);
  }

  // reset2: reset(45, 1)
  // From probe:
  //   reset2.rspeed = 45
  //   reset2.speed = 0.0
  //   reset2.ltyp = 1
  //   reset2.pexp = false
  //   reset2.left = false
  //   reset2.right = false
  //   reset2.nl = 0
  //   reset2.skip = false
  //   reset2.bulkc = 0
  //   reset2.ns = 0
  //   reset2.smoke = false
  //   reset2.tcnt = 0
  //   reset2.gxz = 0
  //   reset2.attack = 0
  //   reset2.responce = false
  //   reset2.trgxz = 180
  //   reset2.trgt = 0
  tank.reset(45, 1);
  assert.strictEqual(tank.rspeed, 45);
  assert.strictEqual(tank.speed, 0.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, false);
  assert.strictEqual(tank.tcnt, 0);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 180);
  assert.strictEqual(tank.trgt, 0);
  for (let k = 0; k < 20; k++) {
    assert.strictEqual(tank.lstage[k], 0);
  }
});

// ---------------------------------------------------------------------------
// 4. lasercolid()
// ---------------------------------------------------------------------------

test('lasercolid() tests target collision (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const targetConto = new ContO(MODEL, m, 400, 80, 800);
  targetConto.maxR = 300;
  targetConto.rcol = 1;
  targetConto.maxhits = 80;
  targetConto.nhits = 0;
  targetConto.exp = false;
  targetConto.out = false;

  tank.lx[0] = 405; tank.ly[0] = 82; tank.lz[0] = 805;
  tank.lstage[0] = 5; tank.lhit[0] = 0;
  tank.lx[1] = 8000; tank.ly[1] = 8000; tank.lz[1] = 8000;
  tank.lstage[1] = 5; tank.lhit[1] = 0;

  tank.lasercolid(targetConto);

  // From probe:
  //   lasercolid.lhit0 = 0
  //   lasercolid.lhit1 = 0
  //   lasercolid.conto_hit = false
  //   lasercolid.conto_nhits = 0
  assert.strictEqual(tank.lhit[0], 0);
  assert.strictEqual(tank.lhit[1], 0);
  assert.strictEqual(targetConto.hit, false);
  assert.strictEqual(targetConto.nhits, 0);
});

// ---------------------------------------------------------------------------
// 5. dl() and dosmokes() graphics methods
// ---------------------------------------------------------------------------

test('dl() advances and clears laser hit stages (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);
  const g = makeGraphics();

  tank.lstage[0] = 1; tank.lhit[0] = 0;
  tank.lstage[1] = 1; tank.lhit[1] = 1;
  tank.lstage[2] = 1; tank.lhit[2] = 2;

  tank.dl(g);

  // From probe:
  //   dl.lhit0 = 0
  //   dl.lhit1 = 2
  //   dl.lhit2 = 3
  //   dl.lstage2 = 0
  assert.strictEqual(tank.lhit[0], 0);
  assert.strictEqual(tank.lhit[1], 2);
  assert.strictEqual(tank.lhit[2], 3);
  assert.strictEqual(tank.lstage[2], 0);
});

test('dosmokes() spawns and updates smoke particles (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);
  const g = makeGraphics();

  const smokeConto = new ContO(MODEL, m, 150, 210, 350);
  tank.smoke = true;

  tank.dosmokes(g, smokeConto);

  // From probe:
  //   dosmokes.ns = 1
  //   dosmokes.smoke_flag = false
  //   dosmokes.sms0 = 1
  // (Note: sx[0] is set with Math.random() in Java and excluded per §2d)
  assert.strictEqual(tank.ns, 1);
  assert.strictEqual(tank.smoke, false);
  assert.strictEqual(tank.sms[0], 1);
});

// ---------------------------------------------------------------------------
// 6. preform() multi-step simulation: Scenario A turnleft (steps 0 to 4)
// ---------------------------------------------------------------------------

test('preform() Scenario A: 5-step turnleft simulation (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);

  // Step 0:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -14);
  assert.strictEqual(playerConto.y, 205);
  assert.strictEqual(playerConto.z, 21);
  assert.strictEqual(playerConto.xz, 35);
  assert.strictEqual(playerConto.xy, 5);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 26.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, true);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, false);
  assert.strictEqual(tank.tcnt, 1);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, true);
  assert.strictEqual(tank.trgxz, 180);
  assert.strictEqual(tank.trgt, 0);

  // Step 1:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -31);
  assert.strictEqual(playerConto.y, 210);
  assert.strictEqual(playerConto.z, 41);
  assert.strictEqual(playerConto.xz, 40);
  assert.strictEqual(playerConto.xy, 4);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 27.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, true);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 2);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 40);
  assert.strictEqual(tank.trgt, 0);

  // Step 2:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -47);
  assert.strictEqual(playerConto.y, 215);
  assert.strictEqual(playerConto.z, 63);
  assert.strictEqual(playerConto.xz, 35);
  assert.strictEqual(playerConto.xy, 3);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 28.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 3);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, true);
  assert.strictEqual(tank.trgxz, 40);
  assert.strictEqual(tank.trgt, 0);

  // Step 3:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -61);
  assert.strictEqual(playerConto.y, 220);
  assert.strictEqual(playerConto.z, 88);
  assert.strictEqual(playerConto.xz, 30);
  assert.strictEqual(playerConto.xy, 2);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 29.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 4);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 30);
  assert.strictEqual(tank.trgt, 0);

  // Step 4:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -73);
  assert.strictEqual(playerConto.y, 225);
  assert.strictEqual(playerConto.z, 115);
  assert.strictEqual(playerConto.xz, 25);
  assert.strictEqual(playerConto.xy, 1);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 30.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, false);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 5);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, true);
  assert.strictEqual(tank.trgxz, 30);
  assert.strictEqual(tank.trgt, 0);
});

// ---------------------------------------------------------------------------
// 6. preform() multi-step simulation: Scenario B turnright (steps 0 to 4)
// Continues from Scenario A state matching TankProbe.java sequence.
// ---------------------------------------------------------------------------

test('preform() Scenario B: 5-step turnright simulation (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);

  // Run Scenario A first to bring state to step 4 end
  for (let step = 0; step < 5; step++) {
    tank.preform(playerConto, targets, 0, 0);
  }

  // Switch to right steering
  setControl(tank, false, true, false, false, false);

  // Step 0:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -83);
  assert.strictEqual(playerConto.y, 230);
  assert.strictEqual(playerConto.z, 144);
  assert.strictEqual(playerConto.xz, 20);
  assert.strictEqual(playerConto.xy, -6);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 31.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, true);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 6);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 20);
  assert.strictEqual(tank.trgt, 0);

  // Step 1:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -91);
  assert.strictEqual(playerConto.y, 235);
  assert.strictEqual(playerConto.z, 174);
  assert.strictEqual(playerConto.xz, 15);
  assert.strictEqual(playerConto.xy, -5);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 32.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, true);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 7);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, true);
  assert.strictEqual(tank.trgxz, 20);
  assert.strictEqual(tank.trgt, 0);

  // Step 2:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -96);
  assert.strictEqual(playerConto.y, 240);
  assert.strictEqual(playerConto.z, 206);
  assert.strictEqual(playerConto.xz, 10);
  assert.strictEqual(playerConto.xy, -4);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 33.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, true);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 8);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 10);
  assert.strictEqual(tank.trgt, 0);

  // Step 3:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -98);
  assert.strictEqual(playerConto.y, 241);
  assert.strictEqual(playerConto.z, 239);
  assert.strictEqual(playerConto.xz, 5);
  assert.strictEqual(playerConto.xy, -3);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 34.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, true);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 9);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, true);
  assert.strictEqual(tank.trgxz, 10);
  assert.strictEqual(tank.trgt, 0);

  // Step 4:
  tank.preform(playerConto, targets, 0, 0);
  assert.strictEqual(playerConto.x, -98);
  assert.strictEqual(playerConto.y, 240);
  assert.strictEqual(playerConto.z, 274);
  assert.strictEqual(playerConto.xz, 0);
  assert.strictEqual(playerConto.xy, -2);
  assert.strictEqual(playerConto.zy, 0);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  assert.strictEqual(tank.rspeed, 40);
  assert.strictEqual(tank.speed, 35.0);
  assert.strictEqual(tank.ltyp, 1);
  assert.strictEqual(tank.pexp, false);
  assert.strictEqual(tank.left, false);
  assert.strictEqual(tank.right, true);
  assert.strictEqual(tank.nl, 0);
  assert.strictEqual(tank.skip, false);
  assert.strictEqual(tank.bulkc, 0);
  assert.strictEqual(tank.ns, 0);
  assert.strictEqual(tank.smoke, true);
  assert.strictEqual(tank.tcnt, 10);
  assert.strictEqual(tank.gxz, 0);
  assert.strictEqual(tank.attack, 0);
  assert.strictEqual(tank.responce, false);
  assert.strictEqual(tank.trgxz, 10);
  assert.strictEqual(tank.trgt, 0);
});

// ---------------------------------------------------------------------------
// 6. preform() Scenarios C through H
// ---------------------------------------------------------------------------

test('preform() Scenario C: boundary clamping (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  // The probe sets these once, before Scenario A, and every later scenario
  // inherits them. A replay that omits them diverges from the first step.
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  // Set state after Scenarios A and B
  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  setControl(tank, false, true, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);

  // Scenario C
  playerConto.x = 43000;
  playerConto.z = -42000;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);

  // From probe:
  //   preform.bound.x = 40000
  //   preform.bound.z = -39964
  assert.strictEqual(playerConto.x, 40000);
  assert.strictEqual(playerConto.z, -39964);
});

test('preform() Scenario D: pitch/roll normalisation (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  // The probe sets these once, before Scenario A, and every later scenario
  // inherits them. A replay that omits them diverges from the first step.
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  // Setup through C
  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  setControl(tank, false, true, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  playerConto.x = 43000;
  playerConto.z = -42000;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);

  // Scenario D
  playerConto.zy = 300;
  playerConto.xy = 120;
  tank.preform(playerConto, targets, 0, 0);

  // From probe:
  //   preform.zy_norm.zy = 302
  //   preform.zy_norm.xy = 119
  //   preform.zy_norm.smoke = true
  assert.strictEqual(playerConto.zy, 302);
  assert.strictEqual(playerConto.xy, 119);
  assert.strictEqual(tank.smoke, true);
});

test('preform() Scenario E: gravity behavior (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  // The probe sets these once, before Scenario A, and every later scenario
  // inherits them. A replay that omits them diverges from the first step.
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  // Setup through D
  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  setControl(tank, false, true, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  playerConto.x = 43000;
  playerConto.z = -42000;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);
  playerConto.zy = 300;
  playerConto.xy = 120;
  tank.preform(playerConto, targets, 0, 0);

  // Scenario E
  // y1: y=220
  playerConto.y = 220;
  tank.pexp = false;
  tank.preform(playerConto, targets, 0, 0);
  // From probe: preform.grav.y1 = 256
  assert.strictEqual(playerConto.y, 256);

  // y2: y=237
  playerConto.y = 237;
  tank.preform(playerConto, targets, 0, 0);
  // From probe: preform.grav.y2 = 269
  assert.strictEqual(playerConto.y, 269);

  // y3: y=245
  playerConto.y = 245;
  tank.preform(playerConto, targets, 0, 0);
  // From probe: preform.grav.y3 = 271
  assert.strictEqual(playerConto.y, 271);
});

test('preform() Scenario F: laser firing (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  // The probe sets these once, before Scenario A, and every later scenario
  // inherits them. A replay that omits them diverges from the first step.
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  // Setup through E
  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  setControl(tank, false, true, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  playerConto.x = 43000;
  playerConto.z = -42000;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);
  playerConto.zy = 300;
  playerConto.xy = 120;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 220;
  tank.pexp = false;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 237;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 245;
  tank.preform(playerConto, targets, 0, 0);

  // Scenario F
  playerConto.exp = false;
  tank.pexp = false;
  tank.skip = true;
  tank.bulkc = 0;
  setControl(tank, false, false, false, false, true);
  tank.preform(playerConto, targets, 0, 0);

  // From probe:
  //   preform.fire.nl = 1
  //   preform.fire.lstage0 = 2
  //   preform.fire.lspeed0 = 190
  //   preform.fire.lx0 = 40000
  //   preform.fire.ly0 = 337
  //   preform.fire.lz0 = -39733
  //   preform.fire.lzy0 = 320
  assert.strictEqual(tank.nl, 1);
  assert.strictEqual(tank.lstage[0], 2);
  assert.strictEqual(tank.lspeed[0], 190);
  assert.strictEqual(tank.lx[0], 40000);
  assert.strictEqual(tank.ly[0], 337);
  assert.strictEqual(tank.lz[0], -39733);
  assert.strictEqual(tank.lzy[0], 320);
});

test('preform() Scenario G: laser homing update (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  // The probe sets these once, before Scenario A, and every later scenario
  // inherits them. A replay that omits them diverges from the first step.
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  // Setup through F
  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  setControl(tank, false, true, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  playerConto.x = 43000;
  playerConto.z = -42000;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);
  playerConto.zy = 300;
  playerConto.xy = 120;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 220;
  tank.pexp = false;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 237;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 245;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.exp = false;
  tank.pexp = false;
  tank.skip = true;
  tank.bulkc = 0;
  setControl(tank, false, false, false, false, true);
  tank.preform(playerConto, targets, 0, 0);

  // Scenario G
  tank.lstage[0] = 12; // > 10 triggers homing towards aconto
  tank.nf[0] = 2;      // < 15
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);

  // From probe:
  //   preform.homing.lxz0 = 0
  //   preform.homing.lzy0 = 320
  //   preform.homing.nf0 = 2
  //   preform.homing.lx0 = 40000
  //   preform.homing.ly0 = 337
  //   preform.homing.lz0 = -39733
  assert.strictEqual(tank.lxz[0], 0);
  assert.strictEqual(tank.lzy[0], 320);
  assert.strictEqual(tank.nf[0], 2);
  assert.strictEqual(tank.lx[0], 40000);
  assert.strictEqual(tank.ly[0], 337);
  assert.strictEqual(tank.lz[0], -39733);
});

test('preform() Scenario H: response and steering tracking (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const playerConto = new ContO(MODEL, m, 0, 200, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  // The probe sets these once, before Scenario A, and every later scenario
  // inherits them. A replay that omits them diverges from the first step.
  playerConto.xz = 30;
  playerConto.xy = 0;
  playerConto.zy = 0;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  // Setup through G
  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 25.0;
  setControl(tank, true, false, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  setControl(tank, false, true, false, false, false);
  for (let step = 0; step < 5; step++) tank.preform(playerConto, targets, 0, 0);
  playerConto.x = 43000;
  playerConto.z = -42000;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);
  playerConto.zy = 300;
  playerConto.xy = 120;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 220;
  tank.pexp = false;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 237;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.y = 245;
  tank.preform(playerConto, targets, 0, 0);
  playerConto.exp = false;
  tank.pexp = false;
  tank.skip = true;
  tank.bulkc = 0;
  setControl(tank, false, false, false, false, true);
  tank.preform(playerConto, targets, 0, 0);
  tank.lstage[0] = 12;
  tank.nf[0] = 2;
  setControl(tank, false, false, false, false, false);
  tank.preform(playerConto, targets, 0, 0);

  // Scenario H
  tank.responce = true;
  playerConto.xz = 10;
  tank.gxz = 300;
  tank.preform(playerConto, targets, 0, 0);

  // From probe:
  //   preform.resp.u_right = true
  //   preform.resp.trgxz = 70
  assert.strictEqual(tank.u.right, true);
  assert.strictEqual(tank.trgxz, 70);
});

// ---------------------------------------------------------------------------
// §2e discriminator for the Case A site at Tank.java 102,
// `conto.xy -= (int)(this.speed / 5.0f)` (probe lines 361-362).
//
// Every other test in this file passes under BOTH rules at that site — the
// site fires only at xy == 0 or xy == 180, and for a positive accumulator with
// a positive step the two truncations agree. xy == 180 with a fractional step
// is the only shape that separates them:
//   Case A: trunc(180 - 8.56) = 171     Case B: 180 - trunc(8.56) = 172
// Java prints 171. Flip Tank.js to Case B and this test must go red.
//
// The sibling `+=` site at line 92 has no such shape: it fires only at
// xy == 0 or 180 with a positive step, where both rules agree. It is
// classified from the bytecode (offset 283: i2f ; fdiv ; fadd ; f2i) alone.
// ---------------------------------------------------------------------------
test('preform() Case A discriminator: xy == 180 with a fractional step (from probe)', () => {
  const m = makeMedium();
  const tank = new Tank(m);

  const conto = new ContO(MODEL, m, 0, 200, 0);
  conto.maxhits = 100;
  conto.nhits = 0;
  conto.exp = false;
  conto.xz = 0;
  // zy = 180 keeps the k > 90 branch, which is the one that leaves xy == 180
  // intact instead of normalising it toward 0.
  conto.zy = 180;
  conto.xy = 180;

  const targets = new Array(20);
  for (let e = 0; e < 20; e++) {
    targets[e] = new ContO(MODEL, m, e * 1200 - 9000, 200, e * 1200 - 9000);
    targets[e].maxR = 150;
  }

  tank.reset(40, 1);
  tank.turnat = 1000;
  tank.tcnt = 0;
  tank.speed = 43.0;
  tank.right = false;
  setControl(tank, false, true, false, false, false);
  tank.preform(conto, targets, 0, 0);

  // From probe: caseA.right.xy = 171
  assert.strictEqual(conto.xy, 171);
  // From probe: caseA.right.speed = 42.8
  assert.strictEqual(tank.speed, Math.fround(42.8));
});
