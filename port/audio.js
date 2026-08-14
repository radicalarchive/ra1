// javax.sound.sampled.Clip on WebAudio.
//
// This is the whole audio surface of the game, counted over F51.java:
//   stop (34), start (16), setFramePosition (14), loop (8), close (5), flush (1)
// over ~25 WAV clips and 7 music tracks. There is no SourceDataLine, no
// pitch-shifted PCM stream and no MOD tracker — the sibling nfm port needed a
// software synthesizer transpiled sample by sample; this game needs
// AudioBufferSourceNode.
//
// The one impedance mismatch: a Java Clip is a REUSABLE object with a playback
// position, while an AudioBufferSourceNode is single-use. So a Clip here keeps
// the decoded buffer and spawns a fresh node per start(), tracking the current
// node so stop() can kill it. setFramePosition(n) records an offset; the game
// only ever passes 0, which is "rewind before restarting this sound effect".

let ctx = null;

/**
 * Browsers block audio until a user gesture. Call from the first keypress or
 * click; everything before that decodes fine but plays silently.
 */
export function unlock() {
  if (ctx === null) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function context() {
  return ctx === null ? unlock() : ctx;
}

export class Clip {
  constructor(buffer) {
    this.buffer = buffer;
    this.node = null;
    this.offset = 0;
    this.looping = false;
  }

  /** Clip.start() — play once from the current frame position. */
  start() {
    this._play(false);
  }

  /**
   * Clip.loop(n). The game only ever passes -1 (LOOP_CONTINUOUSLY); a finite
   * count would need a scheduled stop, so it throws rather than silently
   * looping forever if a call site ever changes.
   */
  loop(n) {
    if (n !== -1) throw new Error(`Clip.loop(${n}): only -1 is implemented`);
    this._play(true);
  }

  _play(looping) {
    if (this.buffer === null) return;      // a failed load stays silent, as in Java
    const c = context();
    this.stop();
    const node = c.createBufferSource();
    node.buffer = this.buffer;
    node.loop = looping;
    node.connect(c.destination);
    node.start(0, this.offset / this.buffer.sampleRate);
    this.node = node;
    this.looping = looping;
    node.onended = () => { if (this.node === node) this.node = null; };
  }

  stop() {
    if (this.node !== null) {
      const node = this.node;
      this.node = null;
      node.onended = null;
      try { node.stop(); } catch (e) { /* already stopped */ }
      node.disconnect();
    }
  }

  /** Clip.setFramePosition(n) — where the next start() begins. */
  setFramePosition(n) {
    this.offset = n;
  }

  /** Clip.isRunning(), for anything that wants to poll. */
  isRunning() {
    return this.node !== null;
  }

  close() {
    this.stop();
    this.buffer = null;
  }

  flush() {
    // Java discards queued data; nothing is queued here.
  }
}

/**
 * `AudioSystem.getClip()` + `clip.open(AudioSystem.getAudioInputStream(file))`.
 *
 * F51.getSound catches every exception and returns null, and the call sites
 * then invoke methods on it — so a missing file is an NPE at some later,
 * unrelated frame in the Java. Here a failed load yields a silent Clip and a
 * console warning instead: the failure mode is the same (no sound) without the
 * crash landing somewhere misleading.
 */
export async function getSound(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    const buffer = await context().decodeAudioData(await res.arrayBuffer());
    return new Clip(buffer);
  } catch (e) {
    console.warn(`sound failed to load: ${url} (${e.message})`);
    return new Clip(null);
  }
}
