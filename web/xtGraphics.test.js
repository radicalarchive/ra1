// xtGraphics.test.js — differential test for the transpiled xtGraphics class.
//
// Every expected value below is the LITERAL output of
// /home/evan/resources/ra1/web/tools/xtGraphicsProbe.java run against the real
// Java class (output recorded in decompilation/logs/xtGraphics.probe.txt).
// Nothing here is derived by hand; if a value disagrees with the probe, the
// code is wrong (TRANSPILE_SPEC §2c).
//
// NONDETERMINISTIC fields — intentionally NOT asserted (TRANSPILE_SPEC §2d):
//   1. Lightning line coordinates in fase -5 (xtGraphics.java lines 160-163).
//   2. Enemy rotation angle randomized in fase -2 (xtGraphics.java line 337).
//   3. Random plane choice in credits (xtGraphics.java line 621).
//   4. Mission complete flash box color (xtGraphics.java line 1136).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { intArray } from './java.js';
import { xtGraphics } from './xtGraphics.js';
import { Medium } from './Medium.js';
import { ContO } from './ContO.js';
import { Control } from './Control.js';
import { userCraft } from './userCraft.js';

// Minimal canvas backend mock for image operations in Node environment
globalThis.document = {
  createElement(tag) {
    if (tag === 'canvas') {
      let buf = new Uint8ClampedArray(500 * 360 * 4);
      return {
        width: 500,
        height: 360,
        getContext() {
          return {
            createImageData(w, h) {
              return { data: new Uint8ClampedArray(w * h * 4) };
            },
            putImageData(data) {
              buf.set(data.data);
            },
            getImageData() {
              return { data: buf };
            },
            drawImage() {},
            beginPath() {},
            moveTo() {},
            lineTo() {},
            closePath() {},
            fill() {},
            stroke() {}
          };
        }
      };
    }
  }
};

const REPO = new URL('../', import.meta.url).pathname;
const MODEL = new Uint8Array(readFileSync(REPO + 'objects/air1.rad'));

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

function makeUserCraft(m) {
  return new userCraft(m);
}

function makeGraphics() {
  return {
    setColor() {},
    fillPolygon() {},
    drawPolygon() {},
    drawLine() {},
    drawRect() {},
    fillRect() {},
    drawString() {},
    drawImage() {},
    getFontMetrics() {
      return {
        stringWidth(s) {
          return s.length * 6;
        }
      };
    }
  };
}

function makeTestImage() {
  const data = new Uint8ClampedArray(500 * 360 * 4);
  for (let i = 0; i < 500 * 360; i++) {
    data[i * 4] = 120;
    data[i * 4 + 1] = 80;
    data[i * 4 + 2] = 200;
    data[i * 4 + 3] = 255;
  }
  return {
    width: 500,
    height: 360,
    getContext() {
      return {
        getImageData() {
          return { data };
        }
      };
    }
  };
}

// ---------------------------------------------------------------------------
// 1. Constructor and default fields
// ---------------------------------------------------------------------------

test('1. Constructor and default field initialisation (from probe lines 1-35)', () => {
  const m = makeMedium();
  const g = makeGraphics();
  const xt = new xtGraphics(m, g);

  // Probe lines 1-35:
  assert.deepStrictEqual(Array.from(xt.ws), [62, 73, 59, 40, 50]);
  assert.strictEqual(xt.goodsun, false);
  assert.strictEqual(xt.cl, 1);
  assert.strictEqual(xt.as.length, 5);
  assert.strictEqual(xt.pix.length, 180000);
  assert.strictEqual(xt.bpix.length, 180000);
  assert.strictEqual(xt.mpix.length, 180000);
  assert.strictEqual(xt.opix.length, 180000);
  assert.strictEqual(xt.ppix.length, 180000);
  assert.strictEqual(xt.cnt, 0);
  assert.strictEqual(xt.flik, false);
  assert.strictEqual(xt.cnts, 10);
  assert.strictEqual(xt.mname.length, 19);
  assert.strictEqual(xt.cnte.length, 19);
  assert.strictEqual(xt.cntf, 0);
  assert.strictEqual(xt.left, false);
  assert.strictEqual(xt.wcnt, 0);
  assert.strictEqual(xt.rcnt, 0);
  assert.strictEqual(xt.cnty, 0);
  assert.strictEqual(xt.fase, -8);
  assert.strictEqual(xt.selected, 4);
  assert.strictEqual(xt.select, 0);
  assert.strictEqual(xt.frst, false);
  assert.strictEqual(xt.oldfase, -5);
  assert.strictEqual(xt.nb, 0);
  assert.strictEqual(xt.ob.length, 3);
  assert.strictEqual(xt.nam.length, 3);
  assert.strictEqual(xt.tnk.length, 3);
  assert.strictEqual(xt.obx.length, 3);
  assert.strictEqual(xt.oby.length, 3);
  assert.strictEqual(xt.obz.length, 3);
  assert.strictEqual(xt.sgame, -1);
  assert.strictEqual(xt.level, 0);
  assert.strictEqual(xt.dest.length, 10);
  assert.strictEqual(xt.mcomp, false);
  assert.strictEqual(xt.tcnt, 1);
});

// ---------------------------------------------------------------------------
// 2. Mathematical helper methods: xs, ys, getcpy
// ---------------------------------------------------------------------------

test('2. Screen projection and distance calculations (from probe lines 36-53)', () => {
  const m = makeMedium();
  const g = makeGraphics();
  const xt = new xtGraphics(m, g);

  // xs (probe lines 36-42):
  assert.strictEqual(xt.xs(100, 200), -50);
  assert.strictEqual(xt.xs(-500, 800), -125);
  assert.strictEqual(xt.xs(300, -100), 2250);
  assert.strictEqual(xt.xs(200, 5), -1750);
  assert.strictEqual(xt.xs(0, 0), -9750);
  assert.strictEqual(xt.xs(50000, 20000), 1245);
  assert.strictEqual(xt.xs(-60000, 40000), -107726);

  // ys (probe lines 43-49):
  assert.strictEqual(xt.ys(100, 200), 50);
  assert.strictEqual(xt.ys(-500, 800), -175);
  assert.strictEqual(xt.ys(300, -100), 6150);
  assert.strictEqual(xt.ys(200, 5), 2150);
  assert.strictEqual(xt.ys(0, 0), -5850);
  assert.strictEqual(xt.ys(50000, 20000), 1147);
  assert.strictEqual(xt.ys(-60000, 40000), -107825);

  // getcpy (probe lines 50-53):
  const c1 = makeContO(m, 0, 0, 0);
  const c2 = makeContO(m, 0, 0, 0);
  assert.strictEqual(xt.getcpy(c1, c2), 0);

  c1.x = 1000; c1.y = 2000; c1.z = 3000;
  c2.x = 500;  c2.y = 1000; c2.z = 1500;
  assert.strictEqual(xt.getcpy(c1, c2), 350);

  c1.x = -5000; c1.y = -3000; c1.z = -2000;
  c2.x = 2000;  c2.y = 1000;  c2.z = 4000;
  assert.strictEqual(xt.getcpy(c1, c2), 10100);

  c1.x = 50000;  c1.y = 60000;  c1.z = 70000;
  c2.x = -50000; c2.y = -60000; c2.z = -70000;
  assert.strictEqual(xt.getcpy(c1, c2), 4400000);

  c1.x = 5000000;  c1.y = 5000000;  c1.z = 5000000;
  c2.x = 0;        c2.y = 0;        c2.z = 0;
  assert.strictEqual(xt.getcpy(c1, c2), -1089934592);
});

// ---------------------------------------------------------------------------
// 3. Reset and state checking methods: alldest, reset, creset
// ---------------------------------------------------------------------------

test('3. Reset and alldest state transitions (from probe lines 54-69)', () => {
  const m = makeMedium();
  const g = makeGraphics();
  const xt = new xtGraphics(m, g);

  // alldest (probe lines 54-55):
  xt.dest[0] = true; xt.dest[1] = true; xt.dest[2] = true; xt.dest[3] = true; xt.dest[4] = true;
  assert.strictEqual(xt.alldest(), true);
  xt.dest[2] = false;
  assert.strictEqual(xt.alldest(), false);

  // reset (probe lines 56-58):
  xt.level = 7;
  xt.reset();
  assert.strictEqual(xt.level, 0);
  assert.strictEqual(xt.dest[0], false);
  assert.strictEqual(xt.dest[4], false);

  // creset (probe lines 59-66):
  xt.cnt = 42;
  xt.flik = true;
  xt.cnts = 99;
  xt.cntf = 12;
  xt.left = true;
  xt.wcnt = 5;
  xt.rcnt = 3;
  xt.cnty = 100;
  xt.creset();
  assert.strictEqual(xt.cnt, 0);
  assert.strictEqual(xt.flik, false);
  assert.strictEqual(xt.cnts, 10);
  assert.strictEqual(xt.cntf, 0);
  assert.strictEqual(xt.left, false);
  assert.strictEqual(xt.wcnt, 0);
  assert.strictEqual(xt.rcnt, 0);
  assert.strictEqual(xt.cnty, 0);
});

// ---------------------------------------------------------------------------
// 4. Pixel blending operations: drawefimg, drawpimg, drawop, drawl, drawovimg, cmback
// ---------------------------------------------------------------------------

test('4. Pixel blending algorithms and buffer updates (from probe lines 67-76)', () => {
  const m = makeMedium();
  const g = makeGraphics();
  const xt = new xtGraphics(m, g);
  const testImg = makeTestImage();

  // drawefimg (probe lines 67-68):
  xt.bpix.fill((255 << 24) | (100 << 16) | (140 << 8) | 60);
  xt.drawefimg(testImg);
  assert.strictEqual(xt.pix[0], 7237250);
  assert.strictEqual(xt.pix[90000], 7237250);

  // drawpimg (probe lines 69-70):
  xt.ppix.fill((255 << 24) | (200 << 16) | (100 << 8) | 50);
  xt.drawpimg(testImg);
  assert.strictEqual(xt.pix[200 + 150 * 500], 5254462);
  assert.strictEqual(xt.pix[10 + 10 * 500], 10508925);

  // drawop (probe line 71):
  xt.drawop(g, testImg);
  assert.strictEqual(xt.pix[0], 8892215);

  // drawl (probe line 72):
  xt.drawl(g, testImg);
  assert.strictEqual(xt.pix[0], 3416942);

  // drawovimg (probe line 73):
  xt.opix.fill((255 << 24) | (80 << 16) | (160 << 8) | 40);
  xt.drawovimg(testImg);
  assert.strictEqual(xt.pix[0], 4941646);

  // cmback (probe lines 74-76):
  xt.mpix.fill((255 << 24) | (50 << 16) | (60 << 8) | 70);
  xt.cmback(2);
  assert.strictEqual(xt.pix[10 + 10 * 500] & 0xFFFFFF, 3292230);
  assert.strictEqual(xt.pix[100 + 100 * 500], 8944180);
  assert.strictEqual(xt.pix[100 + 180 * 500], 8944180);
});

// ---------------------------------------------------------------------------
// 5. dtrakers tracking and HUD rendering
// ---------------------------------------------------------------------------

test('5. dtrakers tracking scenarios (from probe lines 77-81)', () => {
  const m = makeMedium();
  const g = makeGraphics();
  const xt = new xtGraphics(m, g);
  const uc = makeUserCraft(m);
  const ctrl = makeControl();

  const aconto = [
    makeContO(m, 0, 0, 500),
    makeContO(m, 200, 0, 800),
    makeContO(m, 400, 0, 1100),
    makeContO(m, 600, 0, 1400),
    makeContO(m, 800, 0, 1700),
  ];

  const ai = intArray(5);
  ai.set([0, 1, 0, 1, 0]);
  const ai1 = intArray(5);
  ai1.set([0, 1, 2, 3, 4]);

  // Target acquisition (probe lines 77-78):
  xt.dtrakers(g, ai, ai1, 5, aconto, uc, ctrl);
  assert.strictEqual(xt.cl, 1);
  assert.strictEqual(xt.mcomp, false);

  // All enemies destroyed (probe lines 79-80):
  for (let k = 1; k < 5; k++) {
    aconto[k].exp = true;
    aconto[k].nhits = 200;
    aconto[k].maxhits = 100;
  }
  xt.dtrakers(g, ai, ai1, 5, aconto, uc, ctrl);
  assert.strictEqual(xt.mcomp, false);
  assert.strictEqual(xt.cntf, 1);

  // Speedometer and radar triggers (probe line 81):
  ctrl.radar = true;
  ctrl.plus = true;
  uc.rspeed = 50;
  xt.dtrakers(g, ai, ai1, 5, aconto, uc, ctrl);
  assert.strictEqual(xt.cnts, 0);
});

// ---------------------------------------------------------------------------
// 6. denter menu and game phase transitions
// ---------------------------------------------------------------------------

test('6. denter phase transitions (from probe lines 82-120)', () => {
  const m = makeMedium();
  const g = makeGraphics();
  const uc = makeUserCraft(m);
  const ctrl = makeControl();
  const aconto = [
    makeContO(m, 0, 0, 0),
    makeContO(m, 0, 0, 0),
    makeContO(m, 0, 0, 0),
    makeContO(m, 0, 0, 0),
    makeContO(m, 0, 0, 0),
  ];

  // Scenario 6A: fase = 4 (probe lines 82-87)
  const xt6a = new xtGraphics(m, g);
  xt6a.fase = 4;
  xt6a.oldfase = 0;
  xt6a.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6a.fase, 5);
  assert.strictEqual(m.x, -100);
  assert.strictEqual(m.y, 0);
  assert.strictEqual(m.ground, 950);

  xt6a.fase = 4;
  xt6a.oldfase = 7;
  xt6a.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6a.fase, 7);
  assert.strictEqual(xt6a.oldfase, 0);

  // Scenario 6B: fase = -8 (probe lines 88-93)
  const xt6b = new xtGraphics(m, g);
  xt6b.fase = -8;
  xt6b.cnty = 10;
  xt6b.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6b.cnty, 11);

  xt6b.cnty = 350;
  xt6b.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6b.cnty, 351);

  ctrl.space = true;
  xt6b.sgame = 1;
  xt6b.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6b.fase, -5);
  assert.strictEqual(xt6b.select, 1);
  assert.strictEqual(ctrl.space, false);

  // Scenario 6C: instructions (probe lines 94-96)
  const xt6c = new xtGraphics(m, g);
  xt6c.fase = -7;
  ctrl.space = true;
  xt6c.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6c.fase, -6);

  ctrl.space = true;
  xt6c.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6c.fase, -55);

  xt6c.oldfase = -5;
  ctrl.space = true;
  xt6c.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6c.fase, -5);

  // Scenario 6D: main menu navigation (probe lines 97-101)
  const xt6d = new xtGraphics(m, g);
  xt6d.fase = -5;
  xt6d.select = 0;
  ctrl.down = true;
  xt6d.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6d.select, 1);

  ctrl.up = true;
  xt6d.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6d.select, 0);

  ctrl.up = true;
  xt6d.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6d.select, 4);

  xt6d.select = 2;
  ctrl.space = true;
  xt6d.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6d.fase, -7);
  assert.strictEqual(xt6d.oldfase, -5);

  // Scenario 6E: mission debriefing / save (probe lines 102-103)
  const xt6e = new xtGraphics(m, g);
  const aconto20 = new Array(20).fill(null).map(() => {
    const c = makeContO(m, 0, 0, 0);
    c.nhits = 50;
    c.maxhits = 100;
    return c;
  });
  xt6e.fase = -4;
  xt6e.frst = true;
  xt6e.select = 0;
  ctrl.right = true;
  xt6e.denter(g, 0, aconto20, uc, ctrl);
  assert.strictEqual(xt6e.select, 1);

  ctrl.space = true;
  xt6e.denter(g, 0, aconto20, uc, ctrl);
  assert.strictEqual(xt6e.fase, -3);

  // Scenario 6F: vehicle setup (probe lines 104-107)
  const xt6f = new xtGraphics(m, g);
  xt6f.fase = -2;
  xt6f.selected = 2;
  xt6f.nb = 0;
  xt6f.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6f.fase, -1);
  assert.strictEqual(aconto[0].x, -1000);
  assert.strictEqual(aconto[2].x, 0);
  assert.strictEqual(aconto[4].x, 1000);

  // Scenario 6G: ship selection (probe lines 108-111)
  const xt6g = new xtGraphics(m, g);
  xt6g.fase = 0;
  xt6g.selected = 0;
  xt6g.rcnt = 0;
  ctrl.left = true;
  xt6g.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6g.left, true);
  assert.strictEqual(xt6g.rcnt, 1);

  xt6g.rcnt = 5;
  xt6g.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6g.selected, 1);
  assert.strictEqual(xt6g.rcnt, 0);

  // Scenario 6H: gameover & pause menu (probe lines 112-117)
  const xt6h = new xtGraphics(m, g);
  xt6h.fase = 2;
  xt6h.dest.fill(true);
  xt6h.sgame = 1;
  ctrl.space = true;
  xt6h.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6h.fase, -5);
  assert.strictEqual(xt6h.select, 1);

  xt6h.fase = 3;
  xt6h.select = 1;
  ctrl.space = true;
  xt6h.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6h.fase, -7);
  assert.strictEqual(xt6h.oldfase, 3);

  xt6h.fase = 3;
  xt6h.select = 2;
  ctrl.space = true;
  xt6h.sgame = 0;
  xt6h.denter(g, 0, aconto, uc, ctrl);
  assert.strictEqual(xt6h.fase, -5);
  assert.strictEqual(xt6h.select, 0);
});
