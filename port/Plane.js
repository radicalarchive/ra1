// Transpiled from java-src/Plane.java, line by line.
//
// Local names kept as procyon emitted them (ai, ai2, ai3, k2, l2, ...) even
// though they are ugly: the point is that this file diffs against the Java
// side by side. Do not rename or restructure.
//
// Numeric conventions used throughout:
//   idiv(a, b)   every Java int / int
//   trunc(x)     every Java (int) cast of a float or double
//   fr(x)        every Java float-typed intermediate; cs.getsin/getcos return
//                float, so any expression mixing them is float32 in Java and
//                drifts without this
//   Math.imul    int multiplies that can exceed 2^31 (distance, projf)
//   i32(x)       int adds that can exceed 2^31
//
// PAINTER'S ALGORITHM: drawing calls are in the same order as the Java.
// There is no depth buffer. Never reorder fillPolygon / drawPolygon calls.
//
// --- Compound-assignment audit (TRANSPILE_SPEC §2) ---
// Searched for `+= (int)(` and `-= (int)(` in Plane.java.
//
// Site 1 — Java line 158 (also 473):  this.ofy += (int)this.ady;
//   ady is declared `double`. `(int)this.ady` is an explicit narrowing cast on
//   a simple field read — no float expression to the right of the cast. The
//   bytecode would be: dload ady; d2i; iload ofy; iadd; istore ofy — the LHS
//   is NOT converted to double before the add; the RHS is truncated first, then
//   integer-added. CASE B. Confidence: HIGH (the rhs has no arithmetic, only
//   a field read through a d2i gate). Correct JS: `this.ofy += trunc(this.ady)`.
//
// Site 2 — Java line 204:  sy[n5] += (int)this.sdy;
//   sdy is declared `double`. Same structure as Site 1. CASE B. Confidence: HIGH.
//   Correct JS: `sy[n5] += trunc(this.sdy)`.
//
// Site 3 — Java line 414:  this.av += (int)Math.sqrt(...);
//   Math.sqrt returns double; `(int)` truncates the result to int; av is int.
//   This is a plain integer add of a pre-truncated int value. CASE B.
//   Confidence: HIGH. Correct JS: `this.av += trunc(Math.sqrt(...))`.
//
// No Case A sites were found in this file.

import { idiv, i32, trunc, fr, intArray, at, colorOf, random } from './java.js';

export class Plane {
  constructor(medium, ai, ai1, ai2, i, ai3) {
    this.c = intArray(3);
    this.deltaf = 1.0;
    this.projf = 1.0;
    this.av = 0;
    this.exp = 0;
    this.ofx = 0;
    this.adx = 0;
    this.ofy = 0;
    this.adz = 0;
    this.ofz = 0;
    this.ady = 0.0;
    this.ofcx = 0;
    this.ofcy = 0;
    this.ofcz = 0;
    this.nx = 0;
    this.ny = 0;
    this.nz = 0;
    this.ezy = 0;
    this.exy = 0;
    this.azy = 0;
    this.axy = 0;
    this.sx = intArray(4);
    this.sy = intArray(4);
    this.sz = intArray(4);
    this.sdx = 0;
    this.sdz = 0;
    this.sdy = 0.0;
    this.sr = 255;
    this.sg = 220;
    this.m = medium;
    this.n = i;
    this.ox = intArray(this.n);
    this.oz = intArray(this.n);
    this.oy = intArray(this.n);
    for (let j = 0; j < this.n; ++j) {
      this.ox[j] = ai[j];
      this.oy[j] = ai2[j];
      this.oz[j] = ai1[j];
    }
    let k = 0;
    do {
      this.c[k] = ai3[k];
    } while (++k < 3);
    k = 0;
    do {
      let l = 0;
      do {
        if (l !== k) {
          // at() reproduces the JVM's implicit bounds check: these do/while
          // loops run 0..2 whatever `n` is, and the game HAS faces with only
          // two vertices (graphics/bebs.rad). Java throws here, ContO's parser
          // catches it and abandons the rest of the file, and the model ends up
          // with fewer faces. Plain indexing would build extra NaN faces.
          this.deltaf = fr(this.deltaf * fr(Math.sqrt(
            i32(i32(Math.imul(at(this.ox, l) - at(this.ox, k), at(this.ox, l) - at(this.ox, k)) +
                 Math.imul(at(this.oy, l) - at(this.oy, k), at(this.oy, l) - at(this.oy, k))) +
                 Math.imul(at(this.oz, l) - at(this.oz, k), at(this.oz, l) - at(this.oz, k)))) / 100.0));
        }
      } while (++l < 3);
    } while (++k < 3);
    this.deltaf = fr(this.deltaf / 3.0);
  }

  loadprojf() {
    this.projf = 1.0;
    let i = 0;
    do {
      let j = 0;
      do {
        if (j !== i) {
          // at(): same implicit bounds check as the constructor above — this
          // loop also runs 0..2 regardless of n.
          this.projf = fr(this.projf * fr(Math.sqrt(
            i32(Math.imul(at(this.ox, i) - at(this.ox, j), at(this.ox, i) - at(this.ox, j)) +
                Math.imul(at(this.oz, i) - at(this.oz, j), at(this.oz, i) - at(this.oz, j)))) / 100.0));
        }
      } while (++j < 3);
    } while (++i < 3);
    this.projf = fr(this.projf / 3.0);
  }

  ys(i, j) {
    if (j < 10) {
      j = 10;
    }
    // §2b: the product overflows int32 for far vertices (j runs to 50000 and
    // the game's world coordinates are tens of thousands), and Java wraps it.
    return i32(idiv(Math.imul(j - this.m.focus_point, this.m.cy - i), j) + i);
  }

  d(g, i, j, k, l, i1, j1, flag, flag1, flag2) {
    if (this.exp !== 7) {
      const ai = intArray(this.n);
      const ai2 = intArray(this.n);
      const ai3 = intArray(this.n);
      for (let k2 = 0; k2 < this.n; ++k2) {
        ai[k2] = this.ox[k2] + i;
        ai3[k2] = this.oy[k2] + j;
        ai2[k2] = this.oz[k2] + k;
      }
      this.rot(ai, ai3, i, j, i1, this.n);
      this.rot(ai3, ai2, j, k, j1, this.n);
      this.rot(ai, ai2, i, k, l, this.n);
      if (this.exp === 2 && !this.m.interpolating) {
        this.sdx = trunc(random() * 100.0 - 50.0);
        this.sdz = trunc(random() * 100.0 - 50.0);
        this.sdy = random() * 100.0 - 50.0;
        this.sx[0] = this.ofcx + ai[this.nx] + 2 - i;
        this.sx[1] = this.ofcx + ai[this.nx] - 2 - i;
        this.sy[0] = this.ofcy + ai3[this.ny] + 2 - j;
        this.sy[1] = this.ofcy + ai3[this.ny] - 2 - j;
        this.sz[0] = this.ofcz + ai2[this.nx] + 2 - k;
        this.sz[1] = this.ofcz + ai2[this.nx] - 2 - k;
        this.sx[2] = this.sx[1] - this.sdx;
        this.sx[3] = this.sx[0] - this.sdx;
        this.sy[2] = trunc(this.sy[1] - this.sdy);
        this.sy[3] = trunc(this.sy[0] - this.sdy);
        this.sz[2] = this.sz[1] - this.sdz;
        this.sz[3] = this.sz[0] - this.sdz;
        this.sr = 255;
        this.sg = 220;
        this.exp = 3;
      }
      if (this.exp !== 0) {
        if (!this.m.interpolating) {
          this.ofx += this.adx;
          this.ofz += this.adz;
          this.ofy += trunc(this.ady);   // §2 Case B: explicit (int) cast of double field
        }
        for (let l2 = 0; l2 < this.n; ++l2) {
          const array = ai;
          const n = l2;
          array[n] += this.ofx;
          const array2 = ai2;
          const n2 = l2;
          array2[n2] += this.ofz;
          const array3 = ai3;
          const n3 = l2;
          array3[n3] += this.ofy;
        }
        this.rot(ai3, ai2, this.ofcy + ai3[this.ny], this.ofcz + ai2[this.nx], this.ezy, this.n);
        this.rot(ai, ai3, this.ofcx + ai[this.nx], this.ofcy + ai3[this.ny], this.exy, this.n);
        if (!this.m.interpolating) {
          for (let i2 = 0; i2 < this.n; ++i2) {
            if (ai3[i2] > this.m.ground) {
              this.exp = 7;
            }
          }
          this.ezy += this.azy;
          this.exy += this.axy;
          this.ady += 0.5;
        }
        if (this.sy[3] < this.m.ground) {
          const ai4 = intArray(4);
          const ai5 = intArray(4);
          const ai6 = intArray(4);
          let l3 = 0;
          do {
            if (this.exp < 6) {
              ai4[l3] = this.sx[l3] + i + trunc(random() * 50.0 - 25.0);
              ai5[l3] = this.sy[l3] + j + trunc(random() * 50.0 - 25.0);
              ai6[l3] = this.sz[l3] + k + trunc(random() * 50.0 - 25.0);
              if (this.exp >= 4 && !this.m.interpolating) {
                ++this.exp;
              }
            }
            else {
              ai4[l3] = this.sx[l3] + i;
              ai5[l3] = this.sy[l3] + j;
              ai6[l3] = this.sz[l3] + k;
            }
            if (!this.m.interpolating) {
              const sx = this.sx;
              const n4 = l3;
              sx[n4] += this.sdx;
              const sy = this.sy;
              const n5 = l3;
              sy[n5] += trunc(this.sdy);   // §2 Case B: explicit (int) cast of double field
              const sz = this.sz;
              const n6 = l3;
              sz[n6] += this.sdz;
            }
          } while (++l3 < 4);
          if (!this.m.interpolating) {
            this.sdy += 0.5;
          }
          this.rot(ai4, ai6, this.m.cx, this.m.cz, this.m.xz, 4);
          this.rot(ai5, ai6, this.m.cy, this.m.cz, this.m.zy, 4);
          const ai7 = intArray(4);
          const ai8 = intArray(4);
          let flag3 = false;
          let i3 = 0;
          do {
            ai7[i3] = this.xs(ai4[i3], ai6[i3]);
            ai8[i3] = this.ys(ai5[i3], ai6[i3]);
            if (ai8[i3] > 0 && ai8[i3] < this.m.h && ai7[i3] > 0 && ai7[i3] < this.m.w && ai6[i3] > 10 && ai5[i3] < this.m.ground) {
              flag3 = true;
            }
          } while (++i3 < 4);
          if (flag3 && this.sr > 111) {
            g.setColor(colorOf(this.sr, this.sg, 111));
            if (this.exp === 3) {
              g.setColor(colorOf(255, 255, 255));
              if (!this.m.interpolating) {
                this.exp = 4;
              }
            }
            g.fillPolygon(ai7, ai8, 4);
            if (!this.m.interpolating) {
              if (this.sr > 111) {
                this.sr -= 2;
              }
              if (this.sg > 111) {
                this.sg -= 2;
              }
            }
          }
        }
      }
      if (i1 !== 0 || j1 !== 0 || this.exp !== 0 || l !== 0) {
        this.projf = 1.0;
        let j2 = 0;
        do {
          let k3 = 0;
          do {
            if (k3 !== j2) {
              this.projf = fr(this.projf * fr(Math.sqrt(
                i32(Math.imul(ai[j2] - ai[k3], ai[j2] - ai[k3]) +
                    Math.imul(ai2[j2] - ai2[k3], ai2[j2] - ai2[k3]))) / 100.0));
            }
          } while (++k3 < 3);
        } while (++j2 < 3);
        this.projf = fr(this.projf / 3.0);
      }
      this.rot(ai, ai2, this.m.cx, this.m.cz, this.m.xz, this.n);
      let flag4 = false;
      const ai9 = intArray(this.n);
      const ai10 = intArray(this.n);
      let i4 = 500;
      for (let j3 = 0; j3 < this.n; ++j3) {
        ai9[j3] = this.xs(ai[j3], ai2[j3]);
        ai10[j3] = this.ys(ai3[j3], ai2[j3]);
      }
      let k4 = 0;
      let l4 = 1;
      for (let j4 = 0; j4 < this.n; ++j4) {
        for (let i5 = 0; i5 < this.n; ++i5) {
          if (j4 !== i5 && Math.abs(ai9[j4] - ai9[i5]) - Math.abs(ai10[j4] - ai10[i5]) < i4) {
            l4 = j4;
            k4 = i5;
            i4 = Math.abs(ai9[j4] - ai9[i5]) - Math.abs(ai10[j4] - ai10[i5]);
          }
        }
      }
      if (ai10[k4] < ai10[l4]) {
        const k5 = k4;
        k4 = l4;
        l4 = k5;
      }
      if (this.spy(ai[k4], ai2[k4]) > this.spy(ai[l4], ai2[l4])) {
        flag4 = true;
        let l5 = 0;
        for (let j5 = 0; j5 < this.n; ++j5) {
          if (ai2[j5] < 50 && ai3[j5] > this.m.cy) {
            flag4 = false;
          }
          else if (ai3[j5] === ai3[0]) {
            ++l5;
          }
        }
        if (l5 === this.n && ai3[0] > this.m.cy) {
          flag4 = false;
        }
      }
      this.rot(ai3, ai2, this.m.cy, this.m.cz, this.m.zy, this.n);
      let flag5 = true;
      let flag6 = false;
      const ai11 = intArray(this.n);
      const ai12 = intArray(this.n);
      let k6 = 0;
      let l6 = 0;
      let i6 = 0;
      let j6 = 0;
      let k7 = 0;
      for (let l7 = 0; l7 < this.n; ++l7) {
        ai11[l7] = this.xs(ai[l7], ai2[l7]);
        ai12[l7] = this.ys(ai3[l7], ai2[l7]);
        if (ai12[l7] < 0 || ai2[l7] < 10) {
          ++k6;
        }
        if (ai12[l7] > this.m.h || ai2[l7] < 10) {
          ++l6;
        }
        if (ai11[l7] < 0 || ai2[l7] < 10) {
          ++i6;
        }
        if (ai11[l7] > this.m.w || ai2[l7] < 10) {
          ++j6;
        }
        if (ai2[l7] > 50000) {
          ++k7;
        }
      }
      if (i6 === this.n || k6 === this.n || l6 === this.n || j6 === this.n || k7 === this.n) {
        flag5 = false;
      }
      if (i6 !== 0 || k6 !== 0 || l6 !== 0 || j6 !== 0 || ai2[0] > 2000) {
        flag6 = true;
      }
      if (flag5) {
        // projf and deltaf are float fields; float/float+double -> double -> (float) cast
        let f = fr(fr(this.projf) / fr(this.deltaf) + 0.5);
        if (f > 1.2) {
          f = 1.2;
        }
        if (!flag2) {
          if (f < 0.5 || flag4) {
            f = 0.5;
          }
        }
        else if (f < 0.9 || flag4) {
          f = 0.9;
        }
        let j7;
        let k8;
        let l8;
        if (!flag) {
          if (this.m.er === 0) {
            j7 = trunc(fr(this.c[0] * f));
          }
          else {
            j7 = this.c[0];
          }
          if (j7 > 225) {
            j7 = 225;
          }
          if (this.m.eg === 0) {
            k8 = trunc(fr(this.c[1] * f));
          }
          else {
            k8 = this.c[1];
          }
          if (k8 > 225) {
            k8 = 225;
          }
          if (this.m.eb === 0) {
            l8 = trunc(fr(this.c[2] * f));
          }
          else {
            l8 = this.c[2];
          }
          if (l8 > 225) {
            l8 = 225;
          }
        }
        else {
          // 400.0f is a float literal; f is float; float * float -> float; fr() on the product
          j7 = trunc(fr(fr(400.0) * f));
          if (j7 > 255) {
            j7 = 255;
          }
          k8 = trunc(fr(fr(400.0) * f));
          if (k8 > 255) {
            k8 = 255;
          }
          l8 = trunc(fr(fr(400.0) * f));
          if (l8 > 255) {
            l8 = 255;
          }
        }
        g.setColor(colorOf(j7, k8, l8));
        if (!flag1) {
          g.fillPolygon(ai11, ai12, this.n);
        }
        if (!flag6) {
          if (!flag1) {
            j7 -= 15;
            if (j7 < 0) {
              j7 = 0;
            }
            k8 -= 15;
            if (k8 < 0) {
              k8 = 0;
            }
            l8 -= 15;
            if (l8 < 0) {
              l8 = 0;
            }
            g.setColor(colorOf(j7, k8, l8));
          }
          else {
            // Java: new Color(j7 / 2, (k8 + 255) / 2, l8 / 2) — int divisions
            g.setColor(colorOf(idiv(j7, 2), idiv(k8 + 255, 2), idiv(l8, 2)));
          }
          g.drawPolygon(ai11, ai12, this.n);
        }
      }
      this.av = 0;
      for (let i7 = 0; i7 < this.n; ++i7) {
        // §2 Case B: (int)Math.sqrt gives an int; plain integer add
        this.av += trunc(Math.sqrt(
          i32(i32(Math.imul(this.m.cy - ai12[i7], this.m.cy - ai12[i7]) +
                  Math.imul(this.m.cx - ai11[i7], this.m.cx - ai11[i7])) +
              Math.imul(ai2[i7], ai2[i7]))));
      }
      this.av = idiv(this.av, this.n);
    }
  }

  rot(ai, ai1, i, j, k, l) {
    if (k !== 0) {
      for (let i2 = 0; i2 < l; ++i2) {
        const j2 = ai[i2];
        const k2 = ai1[i2];
        // getcos/getsin return float; each binary op rounded with fr()
        ai[i2] = i + trunc(fr(fr((j2 - i) * this.m.cs.getcos(k)) - fr((k2 - j) * this.m.cs.getsin(k))));
        ai1[i2] = j + trunc(fr(fr((j2 - i) * this.m.cs.getsin(k)) + fr((k2 - j) * this.m.cs.getcos(k))));
      }
    }
  }

  xs(i, j) {
    if (j < 10) {
      j = 10;
    }
    // §2b, as in ys() above.
    return i32(idiv(Math.imul(j - this.m.focus_point, this.m.cx - i), j) + i);
  }

  s(g, i, j, k, l, i1, j1, flag) {
    if (this.exp !== 7) {
      const ai = intArray(this.n);
      const ai2 = intArray(this.n);
      const ai3 = intArray(this.n);
      for (let k2 = 0; k2 < this.n; ++k2) {
        ai[k2] = this.ox[k2] + i;
        ai3[k2] = this.oy[k2] + j;
        ai2[k2] = this.oz[k2] + k;
      }
      this.rot(ai, ai3, i, j, i1, this.n);
      this.rot(ai3, ai2, j, k, j1, this.n);
      this.rot(ai, ai2, i, k, l, this.n);
      if (this.exp === 1 && !this.m.interpolating) {
        this.adx = trunc(random() * 30.0 - 15.0);
        this.adz = trunc(random() * 30.0 - 15.0);
        this.ady = -(random() * 20.0);
        this.ofcx = trunc(random() * 10.0 - 5.0);
        this.ofcy = trunc(random() * 10.0 - 5.0);
        this.ofcz = trunc(random() * 10.0 - 5.0);
        this.nx = trunc(random() * this.n);
        this.ny = trunc(random() * this.n);
        this.nz = trunc(random() * this.n);
        this.azy = trunc(random() * 30.0 - 15.0);
        this.axy = trunc(random() * 30.0 - 15.0);
        this.exy = 0;
        this.ezy = 0;
        this.ofx = 0;
        this.ofy = 0;
        this.ofz = 0;
        this.exp = 2;
      }
      if (this.exp !== 0) {
        if (!this.m.interpolating) {
          this.ofx += this.adx;
          this.ofz += this.adz;
          this.ofy += trunc(this.ady);   // §2 Case B: explicit (int) cast of double field
        }
        for (let l2 = 0; l2 < this.n; ++l2) {
          const array = ai;
          const n = l2;
          array[n] += this.ofx;
          const array2 = ai2;
          const n2 = l2;
          array2[n2] += this.ofz;
          const array3 = ai3;
          const n3 = l2;
          array3[n3] += this.ofy;
        }
        this.rot(ai3, ai2, this.ofcy + ai3[this.ny], this.ofcz + ai2[this.nz], this.ezy, this.n);
        this.rot(ai, ai3, this.ofcx + ai[this.nx], this.ofcy + ai3[this.nx], this.exy, this.n);
      }
      let i2 = 0;
      for (let j2 = 0; j2 < this.n; ++j2) {
        if (ai3[j2] >= this.m.ground) {
          ++i2;
        }
        else {
          ai3[j2] = this.m.ground;
        }
      }
      if (i2 !== this.n) {
        this.rot(ai, ai2, this.m.cx, this.m.cz, this.m.xz, this.n);
        this.rot(ai3, ai2, this.m.cy, this.m.cz, this.m.zy, this.n);
        let flag2 = false;
        const ai4 = intArray(this.n);
        const ai5 = intArray(this.n);
        for (let k3 = 0; k3 < this.n; ++k3) {
          ai4[k3] = this.xs(ai[k3], ai2[k3]);
          ai5[k3] = this.ys(ai3[k3], ai2[k3]);
          if (ai5[k3] > 0 && ai5[k3] < this.m.h && ai4[k3] > 0 && ai4[k3] < this.m.w && ai2[k3] > 10 && ai2[k3] < 50000) {
            flag2 = true;
          }
        }
        if (flag2) {
          if (!flag) {
            g.setColor(colorOf(60, 54, 42));
          }
          else {
            g.setColor(colorOf(60, 60, 60));
          }
          g.fillPolygon(ai4, ai5, this.n);
        }
      }
    }
  }

  spy(i, j) {
    return trunc(Math.sqrt(i32(Math.imul(i - this.m.cx, i - this.m.cx) + Math.imul(j, j))));
  }
}
