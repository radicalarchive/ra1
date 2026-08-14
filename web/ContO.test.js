// Differential test for ContO.js.
//
// Expected values come from tools/ContOProbe.java driving the REAL ContO out of
// ra1.jar; its output is committed verbatim as tools/ContOProbe.expected.txt.
// Regenerate with:
//   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe web/tools/ContOProbe.java
//   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.ContOProbe \
//     > web/tools/ContOProbe.expected.txt
//
// The parser half is the important half. ContO's byte[] constructor loads all
// of the game's geometry, its loop is wrapped in `catch (Exception ex) {}`, and
// getvalue() throws in ordinary cases — so a port that throws in different
// places silently loads a different model. Every .rad and .dar in the
// distribution (56 of them) is parsed by both implementations and compared
// field by field.

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { ContO } from './ContO.js';

const REPO = new URL('../', import.meta.url).pathname;

// Expected values, keyed by the probe's own labels.
const expected = new Map();
for (const line of readFileSync(REPO + 'web/tools/ContOProbe.expected.txt', 'utf8').split('\n')) {
  const eq = line.indexOf(' = ');
  if (eq > 0) expected.set(line.slice(0, eq), line.slice(eq + 3));
}

/**
 * ContO stores the Medium and hands it to each Plane; neither touches it while
 * parsing. Medium's own defaults (verified through the probe's xs/ys values:
 * cx=250, cy=150, focus_point=400) are all the arithmetic tests need.
 */
function medium() {
  return { cx: 250, cy: 150, cz: 50, x: 0, y: 0, z: 0, xz: 0, zy: 0, focus_point: 400, ground: 250, w: 500, h: 360 };
}

function modelFiles() {
  const out = [];
  for (const dir of ['objects', 'graphics']) {
    for (const name of readdirSync(REPO + dir)) {
      if (name.endsWith('.rad') || name.endsWith('.dar')) out.push(`${dir}/${name}`);
    }
  }
  return out.sort();
}

test('every model file in the distribution parses identically to Java', () => {
  const files = modelFiles();
  assert.strictEqual(String(files.length), expected.get('model_count'));

  for (const tag of files) {
    const bytes = new Uint8Array(readFileSync(REPO + tag));
    const o = new ContO(bytes, medium(), 100, 200, 300);

    for (const field of ['npl', 'maxR', 'disp', 'shadow', 'loom', 'out',
                         'maxhits', 'colides', 'rcol', 'pcol', 'grounded']) {
      assert.strictEqual(String(o[field]), expected.get(`${tag}.${field}`),
        `${tag}.${field}`);
    }

    // Per-plane shape: vertex counts, colours, and coordinate checksums. The
    // checksums are what catch a wrong `div` scale factor or a dropped vertex.
    const ns = [];
    const cs = [];
    const sums = [];
    for (let i = 0; i < o.npl; i++) {
      const pl = o.p[i];
      let sx = 0, sy = 0, sz = 0;
      for (let k = 0; k < pl.n; k++) { sx += pl.ox[k]; sy += pl.oy[k]; sz += pl.oz[k]; }
      ns.push(pl.n);
      cs.push(`${pl.c[0]}/${pl.c[1]}/${pl.c[2]}`);
      sums.push(`${sx}:${sy}:${sz}`);
    }
    assert.strictEqual(`[${ns.join(', ')}]`, expected.get(`${tag}.plane_n`), `${tag}.plane_n`);
    assert.strictEqual(`[${cs.join(', ')}]`, expected.get(`${tag}.plane_c`), `${tag}.plane_c`);
    assert.strictEqual(`[${sums.join(', ')}]`, expected.get(`${tag}.plane_xyzsum`), `${tag}.plane_xyzsum`);
  }
});

test('getvalue throws exactly where Java throws', () => {
  const o = new ContO(new Uint8Array(0), medium(), 0, 0, 0);

  const cases = [
    ['c', 'c(180,120,60)', 0],
    ['c', 'c(180,120,60)', 1],
    ['c', 'c(180,120,60)', 2],
    ['c', 'c(180,120,60)', 3],       // one past the end -> StringIndexOutOfBounds
    ['colid', 'colid(3)', 0],
    ['colid', 'colid(3)', 1],        // the line holds one value -> throws
    ['p', 'p(-500,20,-33)', 0],
    ['p', 'p(-500,20,-33)', 2],
    ['hits', 'hits(x)', 0],          // not a number -> NumberFormatException
  ];

  for (const [name, line, idx] of cases) {
    const label = `getvalue("${name}", "${line}", ${idx})`;
    const want = expected.get(label);
    let got;
    try {
      got = String(o.getvalue(name, line, idx));
    } catch (e) {
      // The probe prints the Java exception class; the port's messages start
      // with the same names (see java.js charAt / parseIntJava).
      got = e.message.startsWith('StringIndexOutOfBounds')
        ? 'THROWS java.lang.StringIndexOutOfBoundsException'
        : 'THROWS java.lang.NumberFormatException';
    }
    assert.strictEqual(got, want, label);
  }
});

test('getpy wraps at int32 exactly as Java does', () => {
  const o = new ContO(new Uint8Array(0), medium(), 100, 200, 300);
  // From the probe. The third case overflows: Java prints -283082888.
  assert.strictEqual(o.getpy(400, 500, 600), 2700);
  assert.strictEqual(o.getpy(-40000, 50000, -60000), 77241400);
  assert.strictEqual(o.getpy(2000000, 2000000, 2000000), -283082888);
});

test('xs / ys clamp j and wrap, from the probe', () => {
  const o = new ContO(new Uint8Array(0), medium(), 100, 200, 300);
  assert.strictEqual(o.xs(0, 0), -9750);
  assert.strictEqual(o.xs(-500, 800), -125);
  assert.strictEqual(o.xs(-2000000, 49000), -2032083);
  assert.strictEqual(o.ys(0, 0), -5850);
  assert.strictEqual(o.ys(-500, 800), -175);
  assert.strictEqual(o.ys(-2000000, 49000), -2032182);
});

test('reset clears rotation and hit state', () => {
  const o = new ContO(new Uint8Array(0), medium(), 100, 200, 300);
  o.xz = 90; o.xy = 45; o.zy = 30; o.nhits = 7;
  o.reset();
  // From the probe: "after reset: xz=0 xy=0 zy=0 nhits=0 exp=false"
  assert.strictEqual(`xz=${o.xz} xy=${o.xy} zy=${o.zy} nhits=${o.nhits} exp=${o.exp}`,
    'xz=0 xy=0 zy=0 nhits=0 exp=false');
});
