// Drive web/tools/thumb.html in a real Chromium and write the frames out.
//
//   sh serve.sh &
//   node web/tools/render-thumb.mjs --out /tmp/frames [--model spit.rad]
//                                   [--yaw 45] [--elev 45] [--dist 620]
//                                   [--zoom 1] [--frames 36] [--measure]
//
// --measure prints the model's on-screen bounding box instead of rendering, so
// the framing can be tuned without eyeballing screenshots.
//
// Chromium is driven over the DevTools protocol rather than with
// `--headless --screenshot`: that mode uses virtual time, which does not
// advance across createImageBitmap, so the backdrop never finishes loading.

import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).join(' ').split('--').filter(Boolean)
    .map((s) => s.trim().split(/\s+/)).map(([k, v]) => [k, v === undefined ? true : v]),
);

const URL_ = args.url || 'http://localhost:8123/web/tools/thumb.html';
const OUT = args.out || join(tmpdir(), 'ra1-frames');
const FRAMES = Number(args.frames || 36);
const PORT = Number(args.port || 9444);
const cfg = {
  panx: Number(args.panx || 0),
  pany: Number(args.pany || 0),
  model: args.model || 'spit.rad',
  elev: Number(args.elev || 45),
  dist: Number(args.dist || 620),
  lift: Number(args.lift || 0),
  zoom: Number(args.zoom || 1),
};

const profile = mkdtempSync(join(tmpdir(), 'thumb-chrome-'));
const chrome = spawn('chromium-browser', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--window-size=600,480', 'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] });
chrome.stderr.on('data', () => {});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetWs() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chromium did not expose a debugging target');
}

const ws = new WebSocket(await targetWs());
await new Promise((r) => (ws.onopen = r));
let nextId = 1;
const pending = new Map();
const errors = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
  if (msg.method === 'Runtime.exceptionThrown') {
    errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  }
};
const send = (method, params = {}) => new Promise((r) => {
  const id = nextId++;
  pending.set(id, r);
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

await send('Runtime.enable');
await send('Page.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__cfg = ${JSON.stringify(cfg)};` });
await send('Page.navigate', { url: URL_ });

for (let i = 0; i < 80; i++) {
  if (await evaluate('!!window.__ready')) break;
  await sleep(250);
}
if (!(await evaluate('!!window.__ready'))) {
  throw new Error(`page never became ready: ${errors.join(' | ') || 'no exception reported'}`);
}

// --- auto-framing --------------------------------------------------------
// The model is centred and scaled from its MEASURED bounding box, taken across
// the whole turn so the spin never clips: a .rad model's origin is wherever its
// author put it, and its silhouette changes width as it yaws.
async function unionBox(yaws) {
  let b = { minx: 1e9, miny: 1e9, maxx: -1e9, maxy: -1e9, polys: 0 };
  for (const y of yaws) {
    const m = JSON.parse(await evaluate(`__measure(${y})`));
    if (!m.polys) continue;
    b.polys += m.polys;
    b.minx = Math.min(b.minx, m.bbox[0]); b.miny = Math.min(b.miny, m.bbox[1]);
    b.maxx = Math.max(b.maxx, m.bbox[2]); b.maxy = Math.max(b.maxy, m.bbox[3]);
  }
  return b;
}

if (args.autoframe) {
  const W = 600, H = 480;
  const FILL = Number(args.fill || 0.72);          // of the shorter side
  const yaws = [0, 45, 90, 135, 180, 225, 270, 315];
  const centre = (b) => [(b.minx + b.maxx) / 2, (b.miny + b.maxy) / 2];

  // Iterative, with the response MEASURED each time rather than derived from
  // the projection: the two games parameterise their cameras differently, and
  // a pan's effect on screen position is not 1:1 in this projection anyway
  // (the principal point also skews perspective). A probe move per axis costs
  // two extra measurements and removes every assumption.
  for (let it = 0; it < 7; it++) {
    const box = await unionBox(yaws);
    if (!box.polys) throw new Error('nothing drawn — the model is outside the frustum');
    const [cx, cy] = centre(box);
    const w = box.maxx - box.minx, h = box.maxy - box.miny;
    const errx = W / 2 - cx, erry = H / 2 - cy;
    const fill = Math.max(w, h) / (Math.min(W, H) * FILL);

    // --nopan: frame by zoom alone. The nfm side draws its backdrop through
    // the same projection, so panning the principal point would carry the
    // horizon out of frame along with the car.
    if (args.nopan) {
      if (Math.abs(fill - 1) < 0.02) break;
      cfg.zoom /= fill;
      await evaluate(`__cam(${JSON.stringify({ zoom: cfg.zoom })})`);
      continue;
    }

    if (Math.abs(errx) < 2 && Math.abs(erry) < 2 && Math.abs(fill - 1) < 0.02) break;

    const PROBE = 40;
    await evaluate(`__cam({ panx: ${cfg.panx + PROBE} })`);
    const rx = (centre(await unionBox([0]))[0] - centre(await unionBox([0]))[0]) || 0;
    const bx = await unionBox([0]);
    await evaluate(`__cam({ panx: ${cfg.panx} })`);
    const b0 = await unionBox([0]);
    const respx = (centre(bx)[0] - centre(b0)[0]) / PROBE || 1;

    await evaluate(`__cam({ pany: ${cfg.pany + PROBE} })`);
    const by = await unionBox([0]);
    await evaluate(`__cam({ pany: ${cfg.pany} })`);
    const respy = (centre(by)[1] - centre(b0)[1]) / PROBE || 1;

    cfg.panx += errx / respx;
    cfg.pany += erry / respy;
    cfg.zoom /= fill;
    await evaluate(`__cam(${JSON.stringify({ panx: Math.round(cfg.panx), pany: Math.round(cfg.pany), zoom: cfg.zoom })})`);
  }

  const box = await unionBox(yaws);
  console.log(`framed: ${box.maxx - box.minx}x${box.maxy - box.miny}` +
              ` centre ${centre(box).map((v) => v.toFixed(0)).join(',')}` +
              `   cfg ${JSON.stringify({ panx: Math.round(cfg.panx), pany: Math.round(cfg.pany), zoom: +cfg.zoom.toFixed(4) })}`);
}

if (args.measure) {
  const yaws = args.yaw !== undefined ? [Number(args.yaw)] : [0, 45, 90, 135, 180, 225, 270, 315];
  for (const y of yaws) console.log(`yaw ${String(y).padStart(3)}: ${await evaluate(`__measure(${y})`)}`);
} else if (args.yaw !== undefined && !args.frames) {
  const data = await evaluate(`__render(${Number(args.yaw)})`);
  mkdirSync(OUT, { recursive: true });
  const f = join(OUT, args.name || 'frame.png');
  writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));
  console.log(f);
} else {
  mkdirSync(OUT, { recursive: true });
  const step = 360 / FRAMES;
  for (let i = 0; i < FRAMES; i++) {
    // The spin STARTS at --yaw (default 0), so frame 0 is the hero pose and
    // the still and the animation come out of one framing pass.
    const data = await evaluate(`__render(${(Number(args.yaw || 0) + i * step).toFixed(3)})`);
    writeFileSync(join(OUT, `f${String(i).padStart(3, '0')}.png`),
                  Buffer.from(data.split(',')[1], 'base64'));
  }
  console.log(`${FRAMES} frames -> ${OUT}`);
}

if (errors.length) console.log('page errors:\n  ' + errors.join('\n  '));
ws.close();
chrome.kill();
process.exit(errors.length ? 1 : 0);
