// smoke.mjs — boot the port in a real Chromium and report what happened.
//
//   python3 -m http.server 8123          # from the repo root
//   node port/tools/smoke.mjs [seconds] [out.png]
//
// Why not `chromium --headless --screenshot`: that mode drives the page with
// VIRTUAL time, and virtual time does not advance across createImageBitmap or
// WebAudio decodeAudioData. The boot appears to hang for exactly the
// --virtual-time-budget and then completes the instant it expires, which looks
// identical to a real deadlock in the port. Driving the DevTools protocol
// instead gives the page ordinary wall-clock time.
//
// Prints every console message and page error, then whether the canvas has
// non-blank pixels — a boot that throws halfway still leaves a black canvas,
// so "it rendered" has to be measured, not assumed.

import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SECONDS = Number(process.argv[2] || 12);
const OUT = process.argv[3] || join(tmpdir(), 'ra1-smoke.png');
const URL_ = process.env.SMOKE_URL || 'http://localhost:8123/port/tools/boot-smoke.html';
const PORT = 9333;

const profile = mkdtempSync(join(tmpdir(), 'ra1-chrome-'));
const chrome = spawn('chromium-browser', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--mute-audio',
  '--autoplay-policy=no-user-gesture-required',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  '--window-size=500,360',
  'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] });
chrome.stderr.on('data', () => {});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetWs() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
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
const logs = [];
const failures = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const line = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
    logs.push(line);
    // The harness page reports thrown errors and rejected promises through
    // console. Anything that looks like one is a FAILURE, not a log line:
    // grepping this output for the interesting numbers and missing an
    // exception in among it is exactly how a broken build gets called green.
    if (/^(ERROR|REJECT|BOOT THREW)/.test(line)) failures.push(line);
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails;
    const line = 'PAGE ERROR ' + (d.exception?.description || d.text);
    logs.push(line);
    failures.push(line);
  }
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const id = nextId++;
    pending.set(id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });

await send('Runtime.enable');
await send('Page.enable');
// SMOKE_OPTS='{"scale":2}' reaches boot() through the harness page.
if (process.env.SMOKE_OPTS) {
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__opts = ${process.env.SMOKE_OPTS};`,
  });
}
await send('Page.navigate', { url: URL_ });
await sleep(1500);
// main.html gates the boot behind a click (WebAudio needs a gesture); the
// smoke harness page boots straight away. Click the overlay if it is there.
await send('Runtime.evaluate', {
  expression: `document.getElementById('gesture')?.click()`,
});
await sleep(SECONDS * 1000);

const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(OUT, Buffer.from(shot.data, 'base64'));

// The game opens on "Click here to Start" (F51.mon), so a smoke run that never
// clicks only ever proves the loading path. Click, wait, and shoot again.
if (process.env.SMOKE_CLICK !== '0') {
  await send('Runtime.evaluate', {
    expression: `document.getElementById('screen').dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, clientX: 250, clientY: 180 }))`,
  });
  await sleep(Number(process.env.SMOKE_CLICK_WAIT || 6) * 1000);

  // Optional key presses: SMOKE_KEYS="10,10" sends those AWT codes through the
  // page's real keydown/keyup listeners, a few seconds apart.
  for (const code of (process.env.SMOKE_KEYS || '').split(',').filter(Boolean)) {
    const key = code === '10' ? 'Enter' : code === '32' ? ' ' : String.fromCharCode(Number(code));
    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(key)}, bubbles: true }));
                   setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: ${JSON.stringify(key)}, bubbles: true })), 120);`,
    });
    await sleep(Number(process.env.SMOKE_KEY_WAIT || 4) * 1000);
  }
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(OUT.replace(/\.png$/, '-after-click.png'), Buffer.from(shot2.data, 'base64'));
}

// Game-loop rate: F51.run() repaints once per iteration. The Java pacer aims
// at ~56ms/iteration in a race and ~40ms in the menus, so anything near the
// display's 60Hz means the sleep is not being honoured and the game is running
// several times too fast.
// TICKS are the simulation (the game's speed, ~18/s in a race and ~25/s in the
// menus); DRAWS are frames put on screen, which with smooth motion on run at
// the display's rate instead. Counting one for the other makes a working
// interpolation look like a 3x speedup.
const COUNTERS = ['cnt', 'cnts', 'cntf', 'cnty', 'wcnt', 'rcnt', 'tcnt', 'fase', 'selected'];
const probe = `(() => {
  const f = window.__game?.f, x = f?._xt;
  const c = {};
  for (const k of ${JSON.stringify(COUNTERS)}) c[k] = x ? x[k] : -1;
  return { ticks: f?._ticks ?? -1, draws: f?._draws ?? -1, c };
})()`;
if (process.env.SMOKE_FORCE_INTERP) {
  await send('Runtime.evaluate', {
    expression: `window.__game.f._forceInterp = ${Number(process.env.SMOKE_FORCE_INTERP)}`,
  });
}
const a = (await send('Runtime.evaluate', { expression: probe, returnByValue: true })).result.value;
await sleep(4000);
const b = (await send('Runtime.evaluate', { expression: probe, returnByValue: true })).result.value;
console.log('--- game loop ---');
console.log(`ticks ${((b.ticks - a.ticks) / 4).toFixed(1)}/sec   draws ${((b.draws - a.draws) / 4).toFixed(1)}/sec`);
// Absolute values as well as the delta: an unreachable handle reads -1 in both
// samples, whose difference is 0 — indistinguishable from "nothing advanced".
// Per TICK, not per second: that is the number the guards must hold constant.
console.log('per tick: ' + COUNTERS.map((k) =>
  `${k} ${((b.c[k] - a.c[k]) / Math.max(1, b.ticks - a.ticks)).toFixed(2)}`).join('  '));
console.log('xtGraphics counters (value, advance over 4s): ' +
  COUNTERS.map((k) => `${k}=${b.c[k]} +${b.c[k] - a.c[k]}`).join('  '));

const pixels = await send('Runtime.evaluate', {
  expression: `(() => {
    const c = document.getElementById('screen');
    if (!c) return 'no canvas';
    const px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let nonBlank = 0, colors = new Set();
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] || px[i+1] || px[i+2]) nonBlank++;
      if (colors.size < 12) colors.add(px[i] + ',' + px[i+1] + ',' + px[i+2]);
    }
    return nonBlank + ' / ' + (px.length / 4) + ' non-blank; sample colours: ' + [...colors].join(' | ');
  })()`,
  returnByValue: true,
});

console.log('--- console ---');
console.log(logs.join('\n') || '(nothing)');
console.log('--- canvas ---');
console.log(pixels.result.value);
console.log('--- screenshot ---');
console.log(OUT);

console.log('--- result ---');
if (failures.length > 0) {
  console.log(`FAILED: ${failures.length} page error(s)`);
  for (const f of failures.slice(0, 10)) console.log('  ' + f);
} else {
  console.log('no page errors');
}

ws.close();
chrome.kill();
process.exit(failures.length > 0 ? 1 : 0);
