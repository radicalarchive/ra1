// Craft.test.js — differential test for the transpiled Craft class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/port/tools/CraftProbe.java run against the real
// Java class (output recorded in decompilation/logs/Craft.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields — intentionally NOT asserted (TRANSPILE_SPEC §2d):
//   craft.turnat:
//     Initialized in constructor via `Math.random() * 50.0`. In Java this uses
//     unseeded Math.random(), producing non-deterministic values across runs.
//     (The probe explicitly overwrites turnat=100 during preform deterministic tests).
//   craft.dx[0], craft.sx[0] (and corresponding smoke coordinates):
//     Generated in dosmokes() using unseeded `Math.random() * 60.0 - 30.0` and
//     `Math.random() * 80.0 - 40.0`.
//   Random AI mode shifts and evasive turn targets in preform():
//     Paths where tcnt > turnat, conto.hit triggering m3o/mode changes, or
//     close-range random evasions roll Math.random(). The deterministic multi-step
//     scenarios keep tcnt <= turnat or set controlled test conditions.
// §2d forbids asserting values that cannot be stable in the Java.
// All asserted values come from deterministic paths.
//
// §2 compound-assignment audit (reproduced from Craft.js header):
//   Sites 1-5 — Lines 77, 78, 81, 82, 124 in preform():
//     conto.zy -= (int)(5.0f * conto.m.cs.getcos(conto.xy));
//     conto.xz += (int)(byte0 * 3 * conto.m.cs.getsin(conto.xy));
//     conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
//     conto.xz -= (int)(byte0 * 3 * conto.m.cs.getsin(conto.xy));
//     conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
//     LHS is int angle, RHS is float32 expression.
//     CASE B (explicit cast in source before integer add/sub). Confidence: HIGH.
//     Disproved Case A in differential test: step 1 climbing with zy=-24, xy=30
//     yields -24 + trunc(4.33) = -20 (Java output), whereas Case A trunc(-24 + 4.33) = -19.
//   Sites 6-7 — Lines 154, 155 in preform():
//     conto.xz += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
//     conto.zy += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
//     LHS is int, RHS is double. CASE B. Confidence: HIGH.
//   Site 8 — Line 171 in preform():
//     conto.y -= (int)this.lift;
//     LHS is int, lift is double. CASE B. Confidence: HIGH.
//   Sites 9-11 — Lines 316, 319, 322 in preform():
//     lx[n2] -= (int)(this.lspeed[l3] * (conto.m.cs.getsin(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3])));
//     lz[n3] += (int)(this.lspeed[l3] * (conto.m.cs.getcos(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3])));
//     ly[n4] -= (int)(this.lspeed[l3] * conto.m.cs.getsin(this.lzy[l3]));
//     LHS is int in Int32Array, RHS is float32 expression. CASE B. Confidence: HIGH.
//   Sites 12-14 — Lines 340, 341, 342 in preform():
//     conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
//     conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
//     conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
//     LHS is int, speed and trig results are float. CASE B. Confidence: HIGH.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Medium } from './Medium.js';
import { ContO } from './ContO.js';
import { Craft } from './Craft.js';

const REPO = new URL('../', import.meta.url).pathname;
const MODEL = new Uint8Array(readFileSync(REPO + 'objects/rk1.rad'));

function setControl(craft, left, right, up, down, fire) {
  craft.u.left = left;
  craft.u.right = right;
  craft.u.up = up;
  craft.u.down = down;
  craft.u.fire = fire;
}

// ---------------------------------------------------------------------------
// 1. CONSTRUCTOR AND DEFAULT FIELDS
// (from probe lines 1-36: init.*)
// ---------------------------------------------------------------------------

test('1. Constructor and default field initialisation (from probe lines 1-36)', () => {
  const m = new Medium();
  const craft = new Craft(m);

  // From probe:
  // init.rspeed = 0
  assert.strictEqual(craft.rspeed, 0);
  // init.speed = 0.0
  assert.strictEqual(craft.speed, 0.0);
  // init.rlift = 0
  assert.strictEqual(craft.rlift, 0);
  // init.lift = 0.0
  assert.strictEqual(craft.lift, 0.0);
  // init.pexp = false
  assert.strictEqual(craft.pexp, false);
  // init.ltyp = 3
  assert.strictEqual(craft.ltyp, 3);
  // init.nl = 0
  assert.strictEqual(craft.nl, 0);
  // init.skip = false
  assert.strictEqual(craft.skip, false);
  // init.bulkc = 0
  assert.strictEqual(craft.bulkc, 0);
  // init.ns = 0
  assert.strictEqual(craft.ns, 0);
  // init.smoke = false
  assert.strictEqual(craft.smoke, false);
  // init.nd = 0
  assert.strictEqual(craft.nd, 0);
  // init.gxz = 0
  assert.strictEqual(craft.gxz, 0);
  // init.gzy = 0
  assert.strictEqual(craft.gzy, 0);
  // init.responce = false
  assert.strictEqual(craft.responce, false);
  // init.trgxz = 0
  assert.strictEqual(craft.trgxz, 0);
  // init.trgzy = 0
  assert.strictEqual(craft.trgzy, 0);
  // init.out = 0
  assert.strictEqual(craft.out, 0);
  // init.tcnt = 0
  assert.strictEqual(craft.tcnt, 0);
  // init.engage = true
  assert.strictEqual(craft.engage, true);
  // init.enx = 0
  assert.strictEqual(craft.enx, 0);
  // init.eny = 0
  assert.strictEqual(craft.eny, 0);
  // init.enz = 0
  assert.strictEqual(craft.enz, 0);
  // init.ens = 4
  assert.strictEqual(craft.ens, 4);
  // init.targeting = false
  assert.strictEqual(craft.targeting, false);
  // init.mode = 0
  assert.strictEqual(craft.mode, 0);
  // init.m3o = 0
  assert.strictEqual(craft.m3o, 0);
  // init.m3cnt = 0
  assert.strictEqual(craft.m3cnt, 0);
  // init.m1cnt = 0
  assert.strictEqual(craft.m1cnt, 0);
  // init.relax = 50
  assert.strictEqual(craft.relax, 50);
  // init.runn = 30
  assert.strictEqual(craft.runn, 30);
  // init.liftup = 500
  assert.strictEqual(craft.liftup, 500);
  // init.dracs = false
  assert.strictEqual(craft.dracs, false);
  // init.sms = [-1, -1, -1, -1]
  assert.deepStrictEqual(Array.from(craft.sms), [-1, -1, -1, -1]);
  // init.dms = [-1, -1, -1, -1]
  assert.deepStrictEqual(Array.from(craft.dms), [-1, -1, -1, -1]);
  // init.lstage = [0, 0, ..., 0] (length 20)
  assert.deepStrictEqual(Array.from(craft.lstage), new Array(20).fill(0));
});

// ---------------------------------------------------------------------------
// 2. HELPER METHODS (getpy, getcpy, getepy, nearst, myway)
// (from probe lines 37-43)
// ---------------------------------------------------------------------------

test('2. Helper methods: getpy, getcpy, getepy, nearst, myway (from probe lines 37-43)', () => {
  const m = new Medium();
  const craft = new Craft(m);

  craft.lx[0] = -25000; craft.ly[0] = 35000; craft.lz[0] = -45000;
  craft.lx[1] = 12000;  craft.ly[1] = -18000; craft.lz[1] = 22000;

  // From probe: getpy.test1 = 168750000
  assert.strictEqual(craft.getpy(50000, -40000, 30000, 0), 168750000);
  // From probe: getpy.test2 = 42320000
  assert.strictEqual(craft.getpy(-30000, 20000, -10000, 1), 42320000);

  const c1 = new ContO(MODEL, m, 45000, -35000, 25000);
  const c2 = new ContO(MODEL, m, -40000, 30000, -50000);
  // From probe: getcpy.test1 = 1707500
  assert.strictEqual(craft.getcpy(c1, c2), 1707500);

  craft.enx = -15000;
  craft.eny = 5000;
  craft.enz = -25000;
  // From probe: getepy.test1 = 770000
  assert.strictEqual(craft.getepy(c1), 770000);

  const contoArray = [
    new ContO(MODEL, m, 1000, 200, 3000),
    new ContO(MODEL, m, 5000, -1000, 8000),
    new ContO(MODEL, m, 200, 100, 500),
    new ContO(MODEL, m, -3000, -200, -4000),
    new ContO(MODEL, m, 1500, 300, 2500),
  ];
  const aiNear = [0, 1, 2, 3, 4];
  // From probe: nearst.target = 1
  assert.strictEqual(craft.nearst(contoArray, aiNear, 5, 2, c1), 1);

  // From probe: myway.obstacle = false
  assert.strictEqual(craft.myway(contoArray, aiNear, 5, 0, 1000, 200, 3000), false);
  // From probe: myway.clear = false
  assert.strictEqual(craft.myway(contoArray, aiNear, 5, 0, 40000, -30000, 40000), false);
});

// ---------------------------------------------------------------------------
// 3. RESET
// (from probe lines 44-109: reset1.*, reset2.*)
// ---------------------------------------------------------------------------

test('3. reset() field resets (from probe lines 44-109)', () => {
  const m = new Medium();
  const craft = new Craft(m);
  craft.enx = -15000;
  craft.eny = 5000;
  craft.enz = -25000;

  // reset1: reset(120, 2, 40, 25, 600, 1)
  craft.reset(120, 2, 40, 25, 600, 1);
  assert.strictEqual(craft.rspeed, 120);
  assert.strictEqual(craft.speed, 120.0);
  assert.strictEqual(craft.rlift, 0);
  assert.strictEqual(craft.lift, 0.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 2);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 0);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 0);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, -15000);
  assert.strictEqual(craft.eny, 5000);
  assert.strictEqual(craft.enz, -25000);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 40);
  assert.strictEqual(craft.runn, 25);
  assert.strictEqual(craft.liftup, 600);
  assert.strictEqual(craft.dracs, true);

  // reset2: reset(80, 1, 60, 35, 400, 0)
  craft.reset(80, 1, 60, 35, 400, 0);
  assert.strictEqual(craft.rspeed, 80);
  assert.strictEqual(craft.speed, 80.0);
  assert.strictEqual(craft.rlift, 0);
  assert.strictEqual(craft.lift, 0.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 1);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 0);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 0);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, -15000);
  assert.strictEqual(craft.eny, 5000);
  assert.strictEqual(craft.enz, -25000);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 60);
  assert.strictEqual(craft.runn, 35);
  assert.strictEqual(craft.liftup, 400);
  assert.strictEqual(craft.dracs, false);
});

// ---------------------------------------------------------------------------
// 4. LASER COLLISION (lasercolid)
// (from probe lines 110-113: lasercolid.*)
// ---------------------------------------------------------------------------

test('4. lasercolid() laser-to-target collision (from probe lines 110-113)', () => {
  const m = new Medium();
  const craft = new Craft(m);
  // The probe reaches this section with ltyp = 1, left by section 3's second
  // reset; lasercolid's damage comes from lsr.damg[ltyp], so a fresh Craft
  // (ltyp = 3) would deal 3 instead of the probe's 2.
  craft.reset(120, 2, 40, 25, 600, 1);
  craft.reset(80, 1, 60, 35, 400, 0);
  const targetConto = new ContO(MODEL, m, 500, 100, 1000);
  targetConto.maxR = 400;
  targetConto.rcol = 1;
  targetConto.maxhits = 100;
  targetConto.nhits = 0;
  targetConto.exp = false;
  targetConto.out = false;

  craft.lx[0] = 510; craft.ly[0] = 105; craft.lz[0] = 1010;
  craft.lstage[0] = 5; craft.lhit[0] = 0;
  craft.lx[1] = 5000; craft.ly[1] = 5000; craft.lz[1] = 5000;
  craft.lstage[1] = 5; craft.lhit[1] = 0;

  craft.lasercolid(targetConto);
  // From probe: lasercolid.lhit0 = 1
  assert.strictEqual(craft.lhit[0], 1);
  // From probe: lasercolid.lhit1 = 0
  assert.strictEqual(craft.lhit[1], 0);
  // From probe: lasercolid.conto_hit = true
  assert.strictEqual(targetConto.hit, true);
  // From probe: lasercolid.conto_nhits = 2
  assert.strictEqual(targetConto.nhits, 2);
});

// ---------------------------------------------------------------------------
// 5. GRAPHICS METHODS: dl and dosmokes
// (from probe lines 114-122: dl.*, dosmokes.*)
// ---------------------------------------------------------------------------

test('5. Graphics methods: dl and dosmokes (from probe lines 114-122)', () => {
  const m = new Medium();
  const craft = new Craft(m);
  const g = {};

  craft.lstage[0] = 1; craft.lhit[0] = 0;
  craft.lstage[1] = 1; craft.lhit[1] = 1;
  craft.lstage[2] = 1; craft.lhit[2] = 2;

  craft.dl(g);
  // From probe: dl.lhit0 = 0
  assert.strictEqual(craft.lhit[0], 0);
  // From probe: dl.lhit1 = 2
  assert.strictEqual(craft.lhit[1], 2);
  // From probe: dl.lhit2 = 3
  assert.strictEqual(craft.lhit[2], 3);
  // From probe: dl.lstage2 = 0
  assert.strictEqual(craft.lstage[2], 0);

  const smokeConto = new ContO(MODEL, m, 200, 220, 400);
  smokeConto.maxhits = 60;
  smokeConto.nhits = 50;
  craft.smoke = true;

  craft.dosmokes(g, smokeConto);
  // From probe: dosmokes.nd = 1
  assert.strictEqual(craft.nd, 1);
  // From probe: dosmokes.ns = 1
  assert.strictEqual(craft.ns, 1);
  // From probe: dosmokes.smoke_flag = false
  assert.strictEqual(craft.smoke, false);
  // From probe: dosmokes.dms0 = 1
  assert.strictEqual(craft.dms[0], 1);
  // From probe: dosmokes.sms0 = 1
  assert.strictEqual(craft.sms[0], 1);
});

// ---------------------------------------------------------------------------
// 6. PREFORM METHOD — MULTI-STEP SIMULATION (DETERMINISTIC PATHS)
// (from probe lines 123-670: preform.*)
// ---------------------------------------------------------------------------

test('6. preform() Scenario A: Climbing in air (from probe lines 123-337)', () => {
  const m = new Medium();
  let craft = new Craft(m);

  const playerConto = new ContO(MODEL, m, 0, 100, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  playerConto.xz = 45;
  playerConto.xy = 30;
  playerConto.zy = -20;

  const enemies = [];
  const aiEnemies = new Int32Array(15);
  for (let e = 0; e < 15; e++) {
    enemies[e] = new ContO(MODEL, m, e * 1000 - 7000, 100, e * 1000 - 7000);
    enemies[e].maxR = 100;
    aiEnemies[e] = e;
  }

  craft.reset(60, 3, 50, 30, 500, 0);
  craft.turnat = 100;
  craft.tcnt = 0;
  setControl(craft, false, false, true, false, false);

  // Step 0 (lines 123-165)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -38);
  assert.strictEqual(playerConto.y, 124);
  assert.strictEqual(playerConto.z, 39);
  assert.strictEqual(playerConto.xz, 44);
  assert.strictEqual(playerConto.xy, 30);
  assert.strictEqual(playerConto.zy, -24);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 60);
  assert.strictEqual(craft.speed, 60.0);
  assert.strictEqual(craft.rlift, 7);
  assert.strictEqual(craft.lift, 0.5);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 24);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 1);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 1 (lines 166-208)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -75);
  assert.strictEqual(playerConto.y, 143);
  assert.strictEqual(playerConto.z, 80);
  assert.strictEqual(playerConto.xz, 42);
  assert.strictEqual(playerConto.xy, 20);
  assert.strictEqual(playerConto.zy, -20);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 60);
  assert.strictEqual(craft.speed, 60.0);
  assert.strictEqual(craft.rlift, 12);
  assert.strictEqual(craft.lift, 1.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 20);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 2);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 2 (lines 209-251)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -112);
  assert.strictEqual(playerConto.y, 158);
  assert.strictEqual(playerConto.z, 123);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 10);
  assert.strictEqual(playerConto.zy, -16);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 60);
  assert.strictEqual(craft.speed, 60.0);
  assert.strictEqual(craft.rlift, 16);
  assert.strictEqual(craft.lift, 1.5);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 16);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 3);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 3 (lines 252-294)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -150);
  assert.strictEqual(playerConto.y, 168);
  assert.strictEqual(playerConto.z, 167);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -12);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 60);
  assert.strictEqual(craft.speed, 60.0);
  assert.strictEqual(craft.rlift, 18);
  assert.strictEqual(craft.lift, 2.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 12);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 4);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 4 (lines 295-337)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -189);
  assert.strictEqual(playerConto.y, 173);
  assert.strictEqual(playerConto.z, 211);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -7);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 60);
  assert.strictEqual(craft.speed, 60.0);
  assert.strictEqual(craft.rlift, 19);
  assert.strictEqual(craft.lift, 2.5);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 5);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);
});

test('6. preform() Scenario B: Diving with down key and high speed (from probe lines 338-552)', () => {
  const m = new Medium();
  const craft = new Craft(m);

  const playerConto = new ContO(MODEL, m, 0, 100, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  playerConto.xz = 45;
  playerConto.xy = 30;
  playerConto.zy = -20;

  const enemies = [];
  const aiEnemies = new Int32Array(15);
  for (let e = 0; e < 15; e++) {
    enemies[e] = new ContO(MODEL, m, e * 1000 - 7000, 100, e * 1000 - 7000);
    enemies[e].maxR = 100;
    aiEnemies[e] = e;
  }

  // Precondition: run Scenario A (5 steps)
  craft.reset(60, 3, 50, 30, 500, 0);
  craft.turnat = 100;
  craft.tcnt = 0;
  setControl(craft, false, false, true, false, false);
  for (let step = 0; step < 5; step++) {
    craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  }

  // Scenario B setup
  setControl(craft, false, false, false, true, false);
  craft.speed = 70.0;
  craft.rspeed = 70;
  craft.lift = 10.5;

  // Step 0 (lines 338-380)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -234);
  assert.strictEqual(playerConto.y, 171);
  assert.strictEqual(playerConto.z, 263);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 70);
  assert.strictEqual(craft.speed, 70.0);
  assert.strictEqual(craft.rlift, 29);
  assert.strictEqual(craft.lift, 4.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 6);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 1 (lines 381-423)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -279);
  assert.strictEqual(playerConto.y, 169);
  assert.strictEqual(playerConto.z, 315);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 70);
  assert.strictEqual(craft.speed, 70.0);
  assert.strictEqual(craft.rlift, 29);
  assert.strictEqual(craft.lift, 4.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 7);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 2 (lines 424-466)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -324);
  assert.strictEqual(playerConto.y, 167);
  assert.strictEqual(playerConto.z, 367);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 70);
  assert.strictEqual(craft.speed, 70.0);
  assert.strictEqual(craft.rlift, 29);
  assert.strictEqual(craft.lift, 4.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 8);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 3 (lines 467-509)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -369);
  assert.strictEqual(playerConto.y, 165);
  assert.strictEqual(playerConto.z, 419);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 70);
  assert.strictEqual(craft.speed, 70.0);
  assert.strictEqual(craft.rlift, 29);
  assert.strictEqual(craft.lift, 4.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 9);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // Step 4 (lines 510-552)
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -414);
  assert.strictEqual(playerConto.y, 163);
  assert.strictEqual(playerConto.z, 471);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);
  assert.strictEqual(craft.rspeed, 70);
  assert.strictEqual(craft.speed, 70.0);
  assert.strictEqual(craft.rlift, 29);
  assert.strictEqual(craft.lift, 4.0);
  assert.strictEqual(craft.pexp, false);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, false);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 0);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 10);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);
});

test('6. preform() Scenarios C through G: Banking, bounds, ground, fire, homing (from probe lines 553-670)', () => {
  const m = new Medium();
  const craft = new Craft(m);

  const playerConto = new ContO(MODEL, m, 0, 100, 0);
  playerConto.maxhits = 100;
  playerConto.nhits = 0;
  playerConto.exp = false;
  playerConto.xz = 45;
  playerConto.xy = 30;
  playerConto.zy = -20;

  const enemies = [];
  const aiEnemies = new Int32Array(15);
  for (let e = 0; e < 15; e++) {
    enemies[e] = new ContO(MODEL, m, e * 1000 - 7000, 100, e * 1000 - 7000);
    enemies[e].maxR = 100;
    aiEnemies[e] = e;
  }

  // Precondition: run Scenario A (5 steps) and Scenario B (5 steps)
  craft.reset(60, 3, 50, 30, 500, 0);
  craft.turnat = 100;
  craft.tcnt = 0;
  setControl(craft, false, false, true, false, false);
  for (let step = 0; step < 5; step++) {
    craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  }
  setControl(craft, false, false, false, true, false);
  craft.speed = 70.0;
  craft.rspeed = 70;
  craft.lift = 10.5;
  for (let step = 0; step < 5; step++) {
    craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  }

  // --- Scenario C: Banking left and right ---
  // Bank left (lines 553-582)
  setControl(craft, true, false, false, false, false);

  // bankleft step 0
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -459);
  assert.strictEqual(playerConto.y, 161);
  assert.strictEqual(playerConto.z, 523);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, -10);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  // bankleft step 1
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -504);
  assert.strictEqual(playerConto.y, 159);
  assert.strictEqual(playerConto.z, 575);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  // bankleft step 2
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -549);
  assert.strictEqual(playerConto.y, 157);
  assert.strictEqual(playerConto.z, 627);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  // Bank right (lines 583-612)
  setControl(craft, false, true, false, false, false);

  // bankright step 0
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -594);
  assert.strictEqual(playerConto.y, 155);
  assert.strictEqual(playerConto.z, 679);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 10);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  // bankright step 1
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -639);
  assert.strictEqual(playerConto.y, 153);
  assert.strictEqual(playerConto.z, 731);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  // bankright step 2
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  assert.strictEqual(playerConto.x, -684);
  assert.strictEqual(playerConto.y, 151);
  assert.strictEqual(playerConto.z, 783);
  assert.strictEqual(playerConto.xz, 41);
  assert.strictEqual(playerConto.xy, 0);
  assert.strictEqual(playerConto.zy, -2);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, false);

  // --- Scenario D: Boundary clamping (lines 613-615) ---
  playerConto.x = 42000;
  playerConto.z = -43000;
  setControl(craft, false, false, false, false, false);
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  // From probe:
  // preform.bound.x = 39946
  assert.strictEqual(playerConto.x, 39946);
  // preform.bound.z = -39956
  assert.strictEqual(playerConto.z, -39956);
  // preform.bound.xz = 51
  assert.strictEqual(playerConto.xz, 51);

  // --- Scenario E: Ground contact / crash (lines 616-658) ---
  playerConto.y = 220;
  playerConto.zy = 120;
  playerConto.xy = 120;
  craft.speed = 50.0;
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  // From probe:
  assert.strictEqual(playerConto.x, 39957);
  assert.strictEqual(playerConto.y, 143);
  assert.strictEqual(playerConto.z, -39965);
  assert.strictEqual(playerConto.xz, 51);
  assert.strictEqual(playerConto.xy, 180);
  assert.strictEqual(playerConto.zy, 121);
  assert.strictEqual(playerConto.fire, false);
  assert.strictEqual(playerConto.hit, false);
  assert.strictEqual(playerConto.nhits, 0);
  assert.strictEqual(playerConto.exp, true);
  assert.strictEqual(craft.rspeed, 70);
  assert.strictEqual(craft.speed, Math.fround(29.7));
  assert.strictEqual(craft.rlift, -25);
  assert.strictEqual(craft.lift, 2.0);
  assert.strictEqual(craft.pexp, true);
  assert.strictEqual(craft.ltyp, 3);
  assert.strictEqual(craft.nl, 0);
  assert.strictEqual(craft.skip, false);
  assert.strictEqual(craft.bulkc, 0);
  assert.strictEqual(craft.ns, 0);
  assert.strictEqual(craft.smoke, true);
  assert.strictEqual(craft.nd, 0);
  assert.strictEqual(craft.gxz, 0);
  assert.strictEqual(craft.gzy, 0);
  assert.strictEqual(craft.responce, false);
  assert.strictEqual(craft.trgxz, 51);
  assert.strictEqual(craft.trgzy, 7);
  assert.strictEqual(craft.out, 0);
  assert.strictEqual(craft.tcnt, 18);
  assert.strictEqual(craft.engage, true);
  assert.strictEqual(craft.enx, 0);
  assert.strictEqual(craft.eny, 0);
  assert.strictEqual(craft.enz, 0);
  assert.strictEqual(craft.ens, 4);
  assert.strictEqual(craft.targeting, false);
  assert.strictEqual(craft.mode, 0);
  assert.strictEqual(craft.m3o, 0);
  assert.strictEqual(craft.m3cnt, 0);
  assert.strictEqual(craft.m1cnt, 0);
  assert.strictEqual(craft.relax, 50);
  assert.strictEqual(craft.runn, 30);
  assert.strictEqual(craft.liftup, 500);
  assert.strictEqual(craft.dracs, false);

  // --- Scenario F: Laser firing (lines 659-664) ---
  playerConto.y = 150;
  playerConto.exp = false;
  craft.pexp = false;
  craft.skip = true;
  craft.bulkc = 0;
  setControl(craft, false, false, false, false, true);
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  // From probe:
  // preform.fire.nl = 1
  assert.strictEqual(craft.nl, 1);
  // preform.fire.lstage0 = 2
  assert.strictEqual(craft.lstage[0], 2);
  // preform.fire.lspeed0 = 150
  assert.strictEqual(craft.lspeed[0], 150);
  // preform.fire.lx0 = 40017
  assert.strictEqual(craft.lx[0], 40017);
  // preform.fire.ly0 = 21
  assert.strictEqual(craft.ly[0], 21);
  // preform.fire.lz0 = -40013
  assert.strictEqual(craft.lz[0], -40013);

  // --- Scenario G: Laser homing update (lines 665-670) ---
  craft.lstage[0] = 12;
  craft.nf[0] = 2;
  setControl(craft, false, false, false, false, false);
  craft.preform(playerConto, enemies, aiEnemies, 15, 0, 0);
  // From probe:
  // preform.homing.lxz0 = 51
  assert.strictEqual(craft.lxz[0], 51);
  // preform.homing.lzy0 = 121
  assert.strictEqual(craft.lzy[0], 121);
  // preform.homing.nf0 = 2
  assert.strictEqual(craft.nf[0], 2);
  // preform.homing.lx0 = 40077
  assert.strictEqual(craft.lx[0], 40077);
  // preform.homing.ly0 = -107
  assert.strictEqual(craft.ly[0], -107);
  // preform.homing.lz0 = -40061
  assert.strictEqual(craft.lz[0], -40061);
});
