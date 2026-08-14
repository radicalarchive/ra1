// Differential test for Medium.js — the camera.
//
// Expected values come from tools/MediumProbe.java driving the REAL Medium out
// of ra1.jar; its output is committed as tools/MediumProbe.expected.txt.
// Regenerate with:
//   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe port/tools/MediumProbe.java
//   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.MediumProbe \
//     > port/tools/MediumProbe.expected.txt
//
// Each view mode is driven for EIGHT steps from a negative starting position.
// That is deliberate: Medium's nine `+= (int)(expr / 1.5)` sites are §2 Case A
// (the LHS is widened to double before the add), and Case A and Case B agree
// for a step or two before drifting apart. A single-step test would pass on a
// wrong port.

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { Medium } from './Medium.js';
import { ContO } from './ContO.js';

const REPO = new URL('../', import.meta.url).pathname;

const expected = new Map();
for (const line of readFileSync(REPO + 'port/tools/MediumProbe.expected.txt', 'utf8').split('\n')) {
  const eq = line.indexOf(' = ');
  if (eq > 0) expected.set(line.slice(0, eq), line.slice(eq + 3));
}

const MODEL = new Uint8Array(readFileSync(REPO + 'objects/rk1.rad'));

function target(m, zy, xz, tx = 4000, ty = -1200, tz = 5000) {
  const o = new ContO(MODEL, m, tx, ty, tz);
  o.zy = zy;
  o.xz = xz;
  return o;
}

function state(m) {
  return `x=${m.x} y=${m.y} z=${m.z} xz=${m.xz} zy=${m.zy} tart=${m.tart} yart=${m.yart}`;
}

test('constructor defaults match the real class', () => {
  const m = new Medium();
  assert.strictEqual(
    `${state(m)} focus_point=${m.focus_point} ground=${m.ground} cx=${m.cx} cy=${m.cy} cz=${m.cz}`
      + ` w=${m.w} h=${m.h} adv=${m.adv}`,
    expected.get('ctor'));
});

test('ys clamps j and wraps at int32', () => {
  const m = new Medium();
  // ys(1000000, 70000) and ys(-2000000, 49000) overflow the int multiply; the
  // first is on d()'s ordinary path, which passes j = 70000 every frame.
  for (const [i, j] of [[250, 70000], [0, 0], [-500, 800], [200, 5], [-2000000, 49000], [1000000, 70000]]) {
    assert.strictEqual(String(m.ys(i, j)), expected.get(`ys(${i}, ${j})`), `ys(${i}, ${j})`);
  }
});

// The §2 Case A gauntlet: eight steps per view mode, two target orientations
// for the two that branch on conto.zy.
// The _neg rows are the ones that actually test Case A: they put the target
// behind and below the camera, so every step is NEGATIVE, and `trunc(z + q)`
// and `z + trunc(q)` only disagree for negative fractional q. Verified by
// mutation — with the forward targets alone, swapping the rule changed nothing.
for (const [label, method, zy, xz, tx, ty, tz, camx, camy, camz] of [
  ['infront_a', 'infront', 30, 45],
  ['infront_b', 'infront', 200, -70],
  ['behinde_a', 'behinde', 30, 45],
  ['behinde_b', 'behinde', 200, -70],
  ['left', 'left', 30, 45],
  ['right', 'right', 30, 45],
  ['watch', 'watch', 30, 45],
  ['infront_neg', 'infront', 30, 45, -6000, 2500, -9000],
  ['behinde_neg', 'behinde', 30, 45, -6000, 2500, -9000],
  ['left_neg', 'left', 30, 45, -6000, 2500, -9000],
  ['right_neg', 'right', 30, 45, -6000, 2500, -9000],
  ['watch_neg', 'watch', 30, 45, -6000, 2500, -9000],
  // The _ab rows put the camera at POSITIVE coordinates with the target far
  // behind it, so the accumulator is positive while every step is negative.
  // That is the only shape where Case A and Case B disagree: trunc(5 - 0.4) is
  // 4, while 5 + trunc(-0.4) is 5. Confirmed by mutation — swapping the rule
  // fails these four and nothing else.
  ['infront_ab', 'infront', 30, 45, -9000, 4000, -12000, 7000, 3000, 9000],
  ['behinde_ab', 'behinde', 30, 45, -9000, 4000, -12000, 7000, 3000, 9000],
  ['left_ab', 'left', 30, 45, -9000, 4000, -12000, 7000, 3000, 9000],
  ['right_ab', 'right', 30, 45, -9000, 4000, -12000, 7000, 3000, 9000],
  // The _cv rows are the ones with teeth: the camera converges DOWNWARD onto a
  // positive target, so the accumulator stays positive while every step is a
  // small negative fraction — trunc(5000 - 0.67) is 4999, 5000 + trunc(-0.67)
  // is 5000. Mutation-checked: swapping any Case A site for Case B fails these.
  ['infront_cv', 'infront', 0, 0, 3000, 900, 4000, 6000, 2600, 9000],
  ['behinde_cv', 'behinde', 0, 0, 3000, 900, 4000, 6000, 2600, 9000],
  ['left_cv', 'left', 0, 0, 3000, 900, 4000, 6000, 2600, 9000],
  ['right_cv', 'right', 0, 0, 3000, 900, 4000, 6000, 2600, 9000],
]) {
  test(`${method} (${label}) tracks Java for eight steps`, () => {
    const m = new Medium();
    if (camx !== undefined) { m.x = camx; m.y = camy; m.z = camz; }
    const o = target(m, zy, xz, tx, ty, tz);
    for (let step = 1; step <= 8; step++) {
      m[method](o);
      assert.strictEqual(state(m), expected.get(`${label}.step${step}`), `${label}.step${step}`);
    }
  });
}

for (const arg of [3000, 6000]) {
  test(`around(${arg}) tracks Java for eight steps`, () => {
    const m = new Medium();
    const o = target(m, 0, 0);
    for (let step = 1; step <= 8; step++) {
      m.around(o, arg);
      assert.strictEqual(`${state(m)} adv=${m.adv} vxz=${m.vxz} vert=${m.vert}`,
        expected.get(`around${arg}.step${step}`), `around${arg}.step${step}`);
    }
  });
}

test('d() clamps zy and y, recomputes ground, decrements jumping', () => {
  // A Graphics stub: d() is being checked for the fields it mutates, not the
  // pixels. It must still accept every call in the original order — §4 says
  // the order is the depth, and a stub that swallowed calls silently would
  // hide a reordering.
  const calls = [];
  const g = {
    setColor: (c) => calls.push(['setColor', c]),
    fillPolygon: (xs, ys, n) => calls.push(['fillPolygon', n]),
  };

  for (const [zy, y, jumping] of [[0, 0, 0], [120, -800, 0], [-120, 500, 3], [45, -1000, 1]]) {
    const m = new Medium();
    m.zy = zy;
    m.y = y;
    m.jumping = jumping;
    m.d(g);
    assert.strictEqual(
      `zy=${m.zy} y=${m.y} ground=${m.ground} jumping=${m.jumping}`,
      expected.get(`d(zy=${zy},y=${y},jumping=${jumping})`),
      `d(zy=${zy},y=${y},jumping=${jumping})`);
  }

  // Sky is filled before ground, ground before the horizon band. Every fill is
  // preceded by its own setColor.
  for (let i = 0; i < calls.length; i++) {
    if (calls[i][0] === 'fillPolygon') {
      assert.strictEqual(calls[i - 1][0], 'setColor', 'every fill has its own colour, in order');
    }
  }
});
