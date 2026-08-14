// The file IO seam. ~40 accesses in F51, all relative paths from the game
// directory, all of them either line-oriented text or one zip of line-oriented
// text.
//
// The loaders are SYNCHRONOUS top-to-bottom inside F51.run() — loadbase,
// loadobjects, loadmovers, loadsaved all read a file and parse it inline — so
// the port preloads everything into memory at boot and then serves reads
// synchronously. That keeps the transpiled loaders line-by-line identical to
// the Java instead of turning every one of them into an async function, which
// would then infect the main loop.
//
// It is affordable: levels 68K, siters 64K, objects 248K, graphics 308K. The
// 15.6M of music and sound is NOT preloaded — audio.js streams that.

let fpath = '';
const files = new Map();     // path -> Uint8Array

export function setFpath(p) {
  fpath = p;
}

/**
 * Fetch a list of paths into the cache. Call before the loaders run.
 * Missing files reject: the game's own loaders swallow IOException and carry
 * on with half-loaded state, which is far harder to debug than a failed boot.
 */
export async function preload(paths) {
  await Promise.all(paths.map(async (p) => {
    const res = await fetch(fpath + p);
    if (!res.ok) throw new Error(`missing asset: ${p} (${res.status})`);
    files.set(p, new Uint8Array(await res.arrayBuffer()));
  }));
}

export function has(path) {
  return files.has(path);
}

export function readBytes(path) {
  const b = files.get(path);
  if (b === undefined) throw new Error(`not preloaded: ${path}`);
  return b;
}

/**
 * `DataInputStream.readLine()` over a byte stream, as the game uses it.
 *
 * That method is deprecated in Java precisely because it does NOT decode
 * UTF-8: it takes the low byte of each char, i.e. Latin-1. The .rad and .txt
 * files are ASCII, but decoding them as UTF-8 would turn any stray high byte
 * into U+FFFD and silently corrupt a model, so Latin-1 it is.
 *
 * Returns lines with the terminator stripped, handling \n, \r and \r\n.
 */
export function readLines(bytesOrPath) {
  const bytes = typeof bytesOrPath === 'string' ? readBytes(bytesOrPath) : bytesOrPath;
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  const lines = s.split(/\r\n|\r|\n/);
  // A trailing newline yields one empty element; readLine() would have
  // returned null there rather than "".
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * `new ZipInputStream(...)` over graphics/models.zrad — a plain zip of the
 * base models. Returns [{name, bytes}] in stored order, which matters: F51's
 * loadbase indexes ContOs by the order entries come out of the stream.
 */
export async function readZip(bytesOrPath) {
  const bytes = typeof bytesOrPath === 'string' ? readBytes(bytesOrPath) : bytesOrPath;
  const path = typeof bytesOrPath === 'string' ? bytesOrPath : '<bytes>';
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out = [];

  // Walk the central directory backwards from the End Of Central Directory
  // record. Reading the local headers forward instead would work too, but the
  // local header's size fields are allowed to be zero with a data descriptor.
  let eocd = bytes.length - 22;
  while (eocd >= 0 && view.getUint32(eocd, true) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error(`not a zip: ${path}`);

  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);

  for (let i = 0; i < count; i++) {
    if (view.getUint32(p, true) !== 0x02014b50) throw new Error(`bad central header in ${path}`);
    const method = view.getUint16(p + 10, true);
    const csize = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const localOff = view.getUint32(p + 42, true);

    let name = '';
    for (let k = 0; k < nameLen; k++) name += String.fromCharCode(bytes[p + 46 + k]);

    // The local header repeats the name and extra fields, at its own lengths.
    const lNameLen = view.getUint16(localOff + 26, true);
    const lExtraLen = view.getUint16(localOff + 28, true);
    const dataOff = localOff + 30 + lNameLen + lExtraLen;
    const raw = bytes.subarray(dataOff, dataOff + csize);

    out.push({ name, method, raw });
    p += 46 + nameLen + extraLen + commentLen;
  }

  return Promise.all(out.map(async (e) => ({
    name: e.name,
    bytes: e.method === 0 ? e.raw : await inflateRaw(e.raw),
  })));
}

// The zip is inflated once at boot and held here, because F51.loadbase reads
// it synchronously inside run() like every other loader. readZip is async
// (DecompressionStream is), so the async part happens at boot and the loader
// gets a synchronous accessor.
const zips = new Map();      // path -> [{name, bytes}]

export async function preloadZip(path) {
  zips.set(path, await readZip(path));
}

export function zipEntries(path) {
  const e = zips.get(path);
  if (!e) throw new Error(`zip not preloaded: ${path} — call preloadZip() at boot`);
  return e;
}

async function inflateRaw(raw) {
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([raw]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// --- cookies/ ---------------------------------------------------------------
//
// The game's save format is one file per key under cookies/, each holding a
// single integer: radxv (progress), raddest0..4 (destroyed targets). README
// says "delete the cookies folder to reset", so localStorage under one prefix
// keeps that gesture available as a single clear.

const COOKIE_PREFIX = 'ra1:cookie:';

export function savecookie(name, value) {
  try {
    localStorage.setItem(COOKIE_PREFIX + name, String(value));
  } catch (e) {
    // F51.savecookie swallows every exception; a full or blocked localStorage
    // must not take the game down either.
  }
}

/** F51.readcookie returns 0 when the file is missing or unparseable. */
export function readcookie(name) {
  try {
    const v = localStorage.getItem(COOKIE_PREFIX + name);
    if (v === null) return 0;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
  } catch (e) {
    return 0;
  }
}

export function clearcookies() {
  const doomed = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k !== null && k.startsWith(COOKIE_PREFIX)) doomed.push(k);
  }
  for (const k of doomed) localStorage.removeItem(k);
}
