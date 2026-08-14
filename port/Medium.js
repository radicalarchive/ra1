// Transpiled from java-src/Medium.java, line by line.
//
// The camera and the backdrop: view modes (infront / behinde / left / right /
// watch / around), the sky-and-ground fill, and the projection origin every
// other class reads (cx, cy, cz, focus_point, w, h, ground).
//
// Local names kept as procyon emitted them. No restructuring.
//
// --- Compound-assignment audit (TRANSPILE_SPEC §2) ---
// Nine sites, all of the shape `this.<field> += (int)((<int expr>) / 1.5);`
// at Java lines 75, 76, 287, 288, 289, 299, 300, 334, 335.
//
// ALL NINE ARE CASE A. Verified against `javap -p -c` — infront() at offsets
// 375-400 and left() at 118-141 both read:
//
//     getfield z:I ; i2d ; <expr> ; i2d ; ldc2_w 1.5 ; ddiv ; dadd ; d2i ; putfield z:I
//              ^^^^^^^^^ the LHS is widened to double BEFORE the add,
//                        and there is ONE truncation, at the very end.
//
// So `this.z += (int)(expr / 1.5)` is NOT `this.z += trunc(...)`. It is
// `this.z = trunc(this.z + expr / 1.5)`, which differs whenever the fraction
// and the accumulator have opposite signs — exactly the drift §2 describes.
// This is the first Case A found in this port; Plane's four sites were all B.
//
// The `/3`, `/4`, `/5` and `/10` sites next to them are pure int arithmetic
// (`idiv; iadd` in the bytecode) and stay as plain `+=` with idiv().
//
// PAINTER'S ALGORITHM: d() fills sky, then ground, then the horizon band, in
// that order. Never reorder them — the later fills paint over the earlier ones.

import { idiv, i32, trunc, fr, intArray, colorOf } from './java.js';
import { SinCos } from './SinCos.js';

export class Medium {
  constructor() {
    this.isun = false;
    this.cs = new SinCos();
    this.focus_point = 400;
    this.ground = 250;
    this.er = 0;
    this.eg = 0;
    this.eb = 0;
    this.jumping = 0;
    this.cx = 250;
    this.cy = 150;
    this.cz = 50;
    this.xz = 0;
    this.zy = 0;
    this.x = 3000;
    this.y = -1000;
    this.z = -2000;
    this.w = 500;
    this.h = 360;
    this.tart = 0;
    this.yart = -100;
    this.zart = 0;
    this.ztgo = 0;
    this.td = false;
    this.vxz = 0;
    this.adv = -500;
    this.vert = false;
  }

  ys(i, j) {
    if (j < 10) {
      j = 10;
    }
    // §2b: `imul; idiv; iadd` in the bytecode, and the product overflows for
    // far geometry — see Plane.ys(), which is the same expression. d() calls
    // this with j = 70000 and i as a rotated horizon coordinate, so the
    // overflow is on the ordinary path, not an edge case.
    return i32(idiv(Math.imul(j - this.focus_point, this.cy - i), j) + i);
  }

  infront(conto) {
    let i = conto.zy;
    let j = conto.xz;
    while (i > 360) {
      i -= 360;
    }
    while (i < 0) {
      i += 360;
    }
    if (i > 90 && i < 270) {
      this.tart += idiv(180 - this.tart, 3);
      this.yart += idiv(100 - this.yart, 3);
    }
    else {
      this.tart -= idiv(this.tart, 3);
      this.yart += idiv(-100 - this.yart, 3);
    }
    j += this.tart;
    if (i > 90) {
      i = 180 - i;
    }
    if (i < -90) {
      i = -180 - i;
    }
    const k = conto.y + trunc(fr(fr((conto.y + this.yart - conto.y) * this.cs.getcos(conto.zy))
                               - fr((conto.z + 800 - conto.z) * this.cs.getsin(conto.zy))));
    const l = conto.z + trunc(fr(fr((conto.y + this.yart - conto.y) * this.cs.getsin(conto.zy))
                               + fr((conto.z + 800 - conto.z) * this.cs.getcos(conto.zy))));
    const i2 = conto.x + trunc(fr(-(l - conto.z) * this.cs.getsin(conto.xz)));
    const j2 = conto.z + trunc(fr((l - conto.z) * this.cs.getcos(conto.xz)));
    this.zy = i;
    this.xz = -(j + 180);
    this.x += idiv(i2 - this.cx - this.x, 3);
    // §2 Case A — see the audit at the top of this file.
    this.z = trunc(this.z + (j2 - this.cz - this.z) / 1.5);
    this.y = trunc(this.y + (k - this.cy - this.y) / 1.5);
  }

  d(g) {
    if (this.zy > 90) {
      this.zy = 90;
    }
    if (this.zy < -90) {
      this.zy = -90;
    }
    if (this.y > 0) {
      this.y = 0;
    }
    this.ground = 250 - this.y;
    let i = 70000;
    let j = 250;
    if (this.zy !== 0) {
      j = this.cy + trunc(fr(fr((250 - this.cy) * this.cs.getcos(this.zy))
                           - fr((70000 - this.cz) * this.cs.getsin(this.zy))));
      i = this.cz + trunc(fr(fr((250 - this.cy) * this.cs.getsin(this.zy))
                           + fr((70000 - this.cz) * this.cs.getcos(this.zy))));
    }
    const ai = intArray(4);
    const ai2 = intArray(4);
    // Java: ai2[ai[0] = 0] = 0;  — the assignment's value is the index.
    ai[0] = 0;
    ai2[0] = 0;
    ai[1] = this.w;
    ai2[1] = 0;
    ai[2] = this.w;
    ai2[2] = this.ys(j, i);
    if (ai2[2] > this.h) {
      ai2[2] = this.h;
    }
    ai[3] = 0;
    ai2[3] = ai2[2];
    if (ai2[2] > 0) {
      if (this.jumping !== 0) {
        if (this.jumping === 3) {
          ai2[2] = this.h;
          ai2[3] = this.h;
          g.setColor(colorOf(240, 240, 240));
          g.fillPolygon(ai, ai2, 4);
        }
      }
      else {
        if (!this.isun) {
          g.setColor(colorOf(159 + 52 * this.er, 180 + 56 * this.eg, 189 + 58 * this.eb));
        }
        else {
          g.setColor(colorOf(159 + 52 * this.er, 176 + 56 * this.eg, 191 + 58 * this.eb));
        }
        g.fillPolygon(ai, ai2, 4);
      }
    }
    ai[0] = -1;
    ai2[0] = this.ys(j, i);
    if (ai2[0] < 0) {
      ai2[0] = -1;
    }
    ai[1] = -1;
    ai2[1] = this.h;
    ai[2] = this.w;
    ai2[2] = this.h;
    ai[3] = this.w;
    ai2[3] = ai2[0];
    if (ai2[0] < this.h && this.jumping === 0) {
      if (!this.isun) {
        g.setColor(colorOf(177 + 55 * this.er, 154 + 50 * this.eg, 120 + 44 * this.eb));
      }
      else {
        g.setColor(colorOf(175 + 55 * this.er, 151 + 50 * this.eg, 112 + 44 * this.eb));
      }
      g.fillPolygon(ai, ai2, 4);
      ai[1] = -1;
      ai2[1] = ai2[0];
      ai[0] = -1;
      const array = ai2;
      const n = 0;
      array[n] -= 3;
      ai[2] = this.w;
      ai2[2] = ai2[1];
      ai[3] = this.w;
      ai2[3] = ai2[0];
      if (!this.isun) {
        g.setColor(colorOf(169 + 55 * this.er, 171 + 50 * this.eg, 160 + 44 * this.eb));
      }
      else {
        g.setColor(colorOf(167 + 55 * this.er, 164 + 50 * this.eg, 151 + 44 * this.eb));
      }
      g.fillPolygon(ai, ai2, 4);
    }
    if (this.jumping !== 0) {
      --this.jumping;
    }
  }

  watch(conto) {
    if (!this.td) {
      this.y = conto.y + trunc(fr(fr((conto.y - 300 - conto.y) * this.cs.getcos(conto.zy))
                                - fr((conto.z + 3000 - conto.z) * this.cs.getsin(conto.zy))));
      const i = conto.z + trunc(fr(fr((conto.y - 300 - conto.y) * this.cs.getsin(conto.zy))
                                 + fr((conto.z + 3000 - conto.z) * this.cs.getcos(conto.zy))));
      this.x = conto.x + trunc(fr(fr((conto.x + 400 - conto.x) * this.cs.getcos(conto.xz))
                                - fr((i - conto.z) * this.cs.getsin(conto.xz))));
      this.z = conto.z + trunc(fr(fr((conto.x + 400 - conto.x) * this.cs.getsin(conto.xz))
                                + fr((i - conto.z) * this.cs.getcos(conto.xz))));
      this.td = true;
    }
    // §3: these are char literals in the Java and they are NOT typos. 'Z' is
    // 90, '´' is 180 (U+00B4) and 'ｌ' is 65356 (fullwidth small L). The
    // author was reaching for 90/270 and a "flip" constant; 65356 is nonsense
    // as an angle, and SinCos.getsin loops it back into range one 360 at a
    // time. Reproduce the numbers exactly.
    let c = 0;
    if (conto.x - this.x - this.cx > 0) {
      c = 180;      // '´'
    }
    const j = -trunc(90 + c + Math.atan((conto.z - this.z) / (conto.x - this.x - this.cx)) / 0.017453292519943295);
    c = 0;
    if (conto.y - this.y - this.cy < 0) {
      c = 65356;    // 'ｌ'
    }
    const k = trunc(Math.sqrt(Math.imul(conto.z - this.z, conto.z - this.z)
                            + Math.imul(conto.x - this.x - this.cx, conto.x - this.x - this.cx) | 0));
    const l = trunc(90 + c - Math.atan(k / (conto.y - this.y - this.cy)) / 0.017453292519943295);
    this.xz = j;
    this.zy += idiv(l - this.zy, 5);
    if (trunc(Math.sqrt(Math.imul(conto.z - this.z, conto.z - this.z)
                      + Math.imul(conto.x - this.x - this.cx, conto.x - this.x - this.cx)
                      + Math.imul(conto.y - this.y - this.cy, conto.y - this.y - this.cy) | 0)) > 3500) {
      this.td = false;
    }
  }

  around(conto, i) {
    let byte0 = 1;
    if (i === 6000) {
      byte0 = 2;
    }
    this.y = conto.y + this.adv;
    this.x = conto.x + trunc(fr((conto.x - i + this.adv * byte0 - conto.x) * this.cs.getcos(this.vxz)));
    this.z = conto.z + trunc(fr((conto.x - i + this.adv * byte0 - conto.x) * this.cs.getsin(this.vxz)));
    if (i === 6000) {
      if (!this.vert) {
        this.adv -= 10;
      }
      else {
        this.adv += 10;
      }
      if (this.adv < -900) {
        this.vert = true;
      }
      if (this.adv > 1200) {
        this.vert = false;
      }
    }
    else {
      if (!this.vert) {
        this.adv -= 2;
      }
      else {
        this.adv += 2;
      }
      if (this.adv < -500) {
        this.vert = true;
      }
      if (this.adv > 150) {
        this.vert = false;
      }
      if (this.adv > 300) {
        this.adv = 300;
      }
    }
    this.vxz += 2;
    if (this.vxz > 360) {
      this.vxz -= 360;
    }
    let c = 0;
    let j = this.y;
    if (j > 0) {
      j = 0;
    }
    if (conto.y - j - this.cy < 0) {
      c = 65356;    // 'ｌ' — see watch()
    }
    const k = trunc(Math.sqrt(Math.imul(conto.z - this.z, conto.z - this.z)
                            + Math.imul(conto.x - this.x - this.cx, conto.x - this.x - this.cx) | 0));
    const l = trunc(90 + c - Math.atan(k / (conto.y - j - this.cy)) / 0.017453292519943295);
    this.xz = -this.vxz + 90;
    this.zy += idiv(l - this.zy, 10);
  }

  left(conto) {
    const i = conto.y;
    const j = conto.x + trunc(fr((conto.x + 600 - conto.x) * this.cs.getcos(conto.xz)));
    const k = conto.z + trunc(fr((conto.x + 600 - conto.x) * this.cs.getsin(conto.xz)));
    this.zy = 0;
    this.xz = -(conto.xz + 90);
    // §2 Case A, all three.
    this.x = trunc(this.x + (j - this.cx - this.x) / 1.5);
    this.z = trunc(this.z + (k - this.cz - this.z) / 1.5);
    this.y = trunc(this.y + (i - this.cy - this.y) / 1.5);
  }

  right(conto) {
    const i = conto.y;
    const j = conto.x + trunc(fr((conto.x - 600 - conto.x) * this.cs.getcos(conto.xz)));
    const k = conto.z + trunc(fr((conto.x - 600 - conto.x) * this.cs.getsin(conto.xz)));
    this.zy = 0;
    this.xz = -(conto.xz - 90);
    // Note the asymmetry with left(): x here is an INT divide by 3, not a
    // double divide by 1.5. That is what the Java says (`idiv; iadd`), and it
    // is presumably a slip by the author — §3, keep it.
    this.x += idiv(j - this.cx - this.x, 3);
    this.z = trunc(this.z + (k - this.cz - this.z) / 1.5);
    this.y = trunc(this.y + (i - this.cy - this.y) / 1.5);
  }

  behinde(conto) {
    let i = conto.zy;
    let j = conto.xz;
    while (i > 360) {
      i -= 360;
    }
    while (i < 0) {
      i += 360;
    }
    if (i > 90 && i < 270) {
      this.tart += idiv(180 - this.tart, 3);
      this.yart += idiv(100 - this.yart, 4);
    }
    else {
      this.tart -= idiv(this.tart, 3);
      this.yart += idiv(-100 - this.yart, 4);
    }
    j += this.tart;
    if (i > 90) {
      i = 180 - i;
    }
    if (i < -90) {
      i = -180 - i;
    }
    const k = conto.y + trunc(fr(fr((conto.y + this.yart - conto.y) * this.cs.getcos(conto.zy))
                               - fr((conto.z - 600 - conto.z) * this.cs.getsin(conto.zy))));
    const l = conto.z + trunc(fr(fr((conto.y + this.yart - conto.y) * this.cs.getsin(conto.zy))
                               + fr((conto.z - 600 - conto.z) * this.cs.getcos(conto.zy))));
    const i2 = conto.x + trunc(fr(-(l - conto.z) * this.cs.getsin(conto.xz)));
    const j2 = conto.z + trunc(fr((l - conto.z) * this.cs.getcos(conto.xz)));
    this.zy = -i;
    this.xz = -j;
    this.x += idiv(i2 - this.cx - this.x, 3);
    this.z = trunc(this.z + (j2 - this.cz - this.z) / 1.5);
    this.y = trunc(this.y + (k - this.cy - this.y) / 1.5);
  }
}
