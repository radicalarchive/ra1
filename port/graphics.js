// The java.awt.Graphics surface Radical Aces actually uses, on Canvas2D.
//
// The whole game draws through ELEVEN methods (measured over java-src/):
//   setColor drawImage fillRect drawString fillPolygon drawRect drawLine
//   drawPolygon setFont getFontMetrics dispose
// plus the offscreen-image plumbing at the bottom of this file.
//
// ⚠ PAINTER'S ALGORITHM. There is no depth buffer anywhere in this engine.
// Occlusion is submission order and nothing else: F51.run() depth-sorts the
// ContOs, and Plane.d() sorts faces within one object. Canvas2D gives that for
// free — which is most of the reason this backend is Canvas2D and not WebGL.
// If this is ever swapped for WebGL, colour must be a vertex attribute and the
// frame must stay ONE ordered buffer; see nfm's web/graphics.js, which did it.
//
// Why Canvas2D at all, when the nfm port needed WebGL: nfm was fill-bound at
// 800x450 with a much heavier scene. Radical Aces draws a 500x360 frame, and
// its menus round-trip the WHOLE framebuffer through JS per-pixel every frame
// (xtGraphics.drawefimg/drawpimg/drawop/drawl/cmback do `new Color(pix[i])`
// 180,000 times). Canvas2D makes that readback a getImageData; under WebGL the
// same effect is a readPixels stall. Measure before changing this.
//
// Colours are PACKED INTS, not objects. `new Color(r,g,b)` transpiles to
// `colorOf(r,g,b)` (which throws out of range, exactly as Java does) and
// `new Color(this.pix[i])` transpiles to the raw grabbed pixel. So every
// setColor call takes one packed argument.

import { colorRed, colorGreen, colorBlue } from './java.js';

/** Java's default Font("SansSerif", Font.BOLD, 11) as a CSS font spec. */
const BOLD = 1;
const ITALIC = 2;

function cssFont(name, style, size) {
  const family = name === 'SansSerif' ? 'sans-serif'
    : name === 'Serif' ? 'serif'
    : name === 'Monospaced' ? 'monospace'
    : name;
  let prefix = '';
  if (style & ITALIC) prefix += 'italic ';
  if (style & BOLD) prefix += 'bold ';
  return `${prefix}${size}px ${family}`;
}

export class Graphics2D {
  /**
   * `scale` renders the same 500x360 game coordinates onto a backing store
   * `scale` times larger. Every coordinate the game computes is unchanged —
   * only the rasterisation is finer, so polygons, lines and menu text come out
   * crisp. It cannot make the pixel effects sharper: those walk a 500x360
   * int[] by construction (see grabPixels).
   */
  constructor(ctx, scale = 1) {
    this.scale = scale;
    // Set while a tick draws under smooth motion: the geometry still runs (it
    // computes ContO.dist, which feeds the next depth sort) but nothing is
    // rasterised, because the interpolated passes that follow are what the
    // player actually sees. Without this the tick paints state N and the
    // interpolated frames then replay N-1 -> N over the same window, so every
    // tick visibly rewinds.
    this.mute = false;
    if (scale !== 1) ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.ctx = ctx;
    this.ctx.textBaseline = 'alphabetic';   // Java's drawString y IS the baseline
    this.ctx.font = cssFont('SansSerif', BOLD, 11);
    this.color = 0;
    // Scratch path buffers, reused: fillPolygon runs thousands of times a frame
    // and allocating there shows up in a profile.
    this._fm = null;
  }

  setColor(packed) {
    this.color = packed;
    const s = `rgb(${colorRed(packed)},${colorGreen(packed)},${colorBlue(packed)})`;
    this.ctx.fillStyle = s;
    this.ctx.strokeStyle = s;
  }

  setFont(name, style, size) {
    this.ctx.font = cssFont(name, style, size);
    this._fm = null;
  }

  getFontMetrics() {
    if (this._fm === null) this._fm = new FontMetrics(this.ctx);
    return this._fm;
  }

  _path(xs, ys, n) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < n; i++) ctx.lineTo(xs[i], ys[i]);
    ctx.closePath();
  }

  /**
   * Java fills polygons with the EVEN-ODD rule; canvas defaults to nonzero.
   * The difference is visible on the self-intersecting shapes the flame and
   * smoke effects emit, so the rule is not optional.
   */
  fillPolygon(xs, ys, n) {
    if (this.mute) return;
    this._path(xs, ys, n);
    this.ctx.fill('evenodd');
  }

  drawPolygon(xs, ys, n) {
    if (this.mute) return;
    this._path(xs, ys, n);
    this.ctx.stroke();
  }

  // Java's drawLine/drawRect are 1px wide and hit the pixel whose top-left
  // corner is (x,y); canvas strokes are centred on the path, so a whole-number
  // coordinate straddles two pixel rows. The +0.5 puts the line back where AWT
  // draws it.
  drawLine(x0, y0, x1, y1) {
    if (this.mute) return;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x0 + 0.5, y0 + 0.5);
    ctx.lineTo(x1 + 0.5, y1 + 0.5);
    ctx.stroke();
  }

  fillRect(x, y, w, h) {
    if (this.mute) return;
    this.ctx.fillRect(x, y, w, h);
  }

  drawRect(x, y, w, h) {
    if (this.mute) return;
    this.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
  }

  clearRect(x, y, w, h) {
    if (this.mute) return;
    this.ctx.clearRect(x, y, w, h);
  }

  drawString(s, x, y) {
    if (this.mute) return;
    this.ctx.fillText(s, x, y);
  }

  /** `g.drawImage(img, x, y, observer)` and the 5-arg scaled form. */
  drawImage(img, x, y, w, h) {
    if (this.mute) return;
    if (img === null) return;
    const src = img.canvas !== undefined ? img.canvas : img;
    if (w === undefined) this.ctx.drawImage(src, x, y);
    else this.ctx.drawImage(src, x, y, w, h);
  }

  /** AWT lets you dispose a Graphics; nothing to release here. */
  dispose() {}
}

class FontMetrics {
  constructor(ctx) {
    this.ctx = ctx;
    const m = ctx.measureText('Hg');
    // Java's FontMetrics.getHeight() is ascent+descent+leading. TextMetrics
    // exposes the font's own ascent/descent, which is the same quantity.
    this.height = Math.ceil(m.fontBoundingBoxAscent + m.fontBoundingBoxDescent);
  }

  getHeight() {
    return this.height;
  }

  stringWidth(s) {
    return Math.round(this.ctx.measureText(s).width);
  }
}

// --- Images -----------------------------------------------------------------
//
// java.awt.Image, plus the three pieces of image plumbing the menus rest on:
//   Panel.createImage(w,h)                 -> the 500x360 offscreen buffer
//   PixelGrabber(image,...,int[] pix,...)  -> xtGraphics.saveit
//   createImage(new MemoryImageSource(...)) -> the blended effect frames
//
// Pixels are packed 0xAARRGGBB ints, as PixelGrabber produces. The game only
// ever reads r/g/b out of them.

export class JImage {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this._g = null;
  }

  getGraphics(scale = 1) {
    if (this._g === null) {
      this._g = new Graphics2D(
        this.canvas.getContext('2d', { willReadFrequently: true }), scale);
    }
    return this._g;
  }

  getWidth() { return this.width; }
  getHeight() { return this.height; }
}

function newCanvas(w, h) {
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  // node --test: OffscreenCanvas is absent, so image-producing code is not
  // exercised there. Fail loudly rather than returning something half-working.
  throw new Error('no canvas backend (this path is browser-only)');
}

/** `Panel.createImage(w, h)`. */
export function createImage(w, h) {
  return new JImage(newCanvas(w, h));
}

/** `createImage(new MemoryImageSource(w, h, pix, 0, w))`. */
export function imageFromPixels(w, h, pix) {
  const canvas = newCanvas(w, h);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const data = ctx.createImageData(w, h);
  const buf = data.data;
  for (let i = 0, j = 0; i < w * h; i++, j += 4) {
    const p = pix[i];
    buf[j] = (p >> 16) & 0xff;
    buf[j + 1] = (p >> 8) & 0xff;
    buf[j + 2] = p & 0xff;
    buf[j + 3] = 255;   // MemoryImageSource here is always opaque
  }
  ctx.putImageData(data, 0, 0);
  return new JImage(canvas);
}

/**
 * `new PixelGrabber(image, 0, 0, w, h, pix, 0, w).grabPixels()`.
 * Writes 0xFFRRGGBB into `pix`, which is what the AWT grabber yields for the
 * opaque images this game feeds it.
 */
export function grabPixels(img, pix, w = 500, h = 360) {
  const src = img.canvas !== undefined ? img.canvas : img;
  let ctx;
  if (src.getContext && src.width === w && src.height === h) {
    ctx = src.getContext('2d', { willReadFrequently: true });
  } else {
    // Either a bare image, or the screen at 2x: the game's pixel effects are
    // written against a 500x360 int[], so a larger surface is RESAMPLED down
    // to that rather than read as its top-left corner. The effect then draws
    // back through the scaled context and lands upscaled, which is the
    // documented compromise for `?res=2` — geometry and text gain resolution,
    // the per-pixel effects do not.
    const c = newCanvas(w, h);
    ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, src.width || w, src.height || h, 0, 0, w, h);
  }
  const buf = ctx.getImageData(0, 0, w, h).data;
  for (let i = 0, j = 0; i < w * h; i++, j += 4) {
    pix[i] = (0xff << 24) | (buf[j] << 16) | (buf[j + 1] << 8) | buf[j + 2];
  }
  return pix;
}

/** Loads graphics/*.gif|jpg|png as a JImage. */
export async function loadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`missing image: ${url}`);
  const bitmap = await createImageBitmap(await res.blob());
  const canvas = newCanvas(bitmap.width, bitmap.height);
  canvas.getContext('2d', { willReadFrequently: true }).drawImage(bitmap, 0, 0);
  return new JImage(canvas);
}
