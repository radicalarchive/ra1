// Everything the game reads, in one list.
//
// The desktop build opens each file at the moment it needs it, inside a
// synchronous loader. The browser cannot do that, so vfs.preload() fetches the
// text/binary assets up front and F51's loaders then read them synchronously —
// unchanged, line by line.
//
// Transcribed from F51.downloadall(), F51.loadbase(), F51.loadobjects() and
// F51.loadmovers(). Keep it in step with those: a file missing here fails the
// boot with a clear error, which is better than the Java's behaviour of
// swallowing the IOException and running on with half-loaded state.

/** Images, loaded through graphics.loadImage (not the byte VFS). */
export const IMAGES = [
  'graphics/radar.gif',
  'graphics/stube.gif',
  'graphics/select.jpg',
  'graphics/destroyed.gif',
  'graphics/failed.jpg',      // pixel-grabbed into xtGraphics.bpix
  'graphics/mission.jpg',     // -> mpix
  'graphics/over.jpg',        // -> opix
  'graphics/paused.jpg',      // -> ppix
  'graphics/layout.gif',
  'graphics/comp.gif',
  'graphics/main.gif',
  'graphics/radicalplay.gif',
  'graphics/a0.gif', 'graphics/a1.gif', 'graphics/a2.gif',
  'graphics/a3.gif', 'graphics/a4.gif',
  'graphics/inst1.gif', 'graphics/inst2.gif', 'graphics/inst3.gif',
  'graphics/text.gif',
  'graphics/mars.jpg',
];

/** Music tracks. Long, so audio.js streams these rather than the VFS holding them. */
export const MUSIC = [
  'music/intro.wav',
  'music/mission.wav',
  'music/select.wav',
  'music/main.wav',
  // The seven in-race tracks, played by index (F51 cycles mtrak[]).
  'music/0.wav', 'music/1.wav', 'music/2.wav', 'music/3.wav',
  'music/4.wav', 'music/5.wav', 'music/6.wav',
];

/**
 * Sound effects, under sounds/<sndfrm>/. `sndfrm` is "default" unless the old
 * Sun-JVM path set it to "newsun" — F51.run() tests `"".startsWith("sun.")`,
 * which is always false, so this build always takes "default". The newsun
 * directory ships .au files and is dead weight in the browser; ported as-is.
 */
export function sounds(sndfrm = 'default') {
  return [
    'up', 'hitl', 'down', 'low', 'med', 'jump', 'grnd', 'exp', 'exph', 'hit',
    'l0', 'l1', 'l2', 'l3', 'l4', 'charged',
  ].map((n) => `sounds/${sndfrm}/${n}.wav`);
}

/** The zip of base models, read by F51.loadbase with ZipInputStream. */
export const MODELS_ZIP = 'graphics/models.zrad';

/**
 * Object-placement lists, read by F51.loadobjects.
 *
 * ⚠ The game asks for `clmap<random 0..4>.txt` and the distribution ships only
 * clmap0 and clmap3. The other three throw FileNotFoundException, which
 * loadobjects swallows — so on 3 runs in 5 the cloud layer is simply absent.
 * That is the original's behaviour and the port reproduces it, which is why
 * only the two files that exist are preloaded: a missing one must stay
 * missing. See TRANSPILE_SPEC §3.
 */
export const SITERS = [
  'siters/aces.txt',
  'siters/base.txt',
  'siters/smap.txt',
  'siters/clmap0.txt',
  'siters/clmap3.txt',
];

/** The 16 stages, read one at a time by F51.loadmovers as the game advances. */
export const LEVELS = Array.from({ length: 16 }, (_, i) => `levels/${i}.txt`);

/** Everything vfs.preload() must hold before the loaders run. */
export const VFS_FILES = [MODELS_ZIP, ...SITERS, ...LEVELS];
