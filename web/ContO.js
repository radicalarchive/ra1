// Transpiled from decompilation/java-src/ContO.java, line by line.
//
// Local names are kept as procyon emitted them (ai, ai2, ai3, ai4, flag, l, f,
// i, j, k, l2, j2, ...) even though they are ugly: the point is that this file
// diffs against the Java side by side. Do not rename or restructure.
//
// Numeric conventions used throughout:
//   idiv(a, b)   every Java int / int
//   trunc(x)     every Java (int) cast of a float or double
//   fr(x)        every Java float-typed intermediate; cs.getsin/getcos return
//                float, so any expression mixing them is float32 in Java and
//                drifts without this
//   Math.imul    int multiplies that can exceed 2^31 (both operands int)
//   i32(x)       wrap after int additions/subtractions that can exceed 2^31
//
// Compound-assignment audit: grep for '+= (int)(' and '-= (int)(' found ZERO
// hits in ContO.java. No compound assignments with (int)() casts exist here.
//
// PAINTER'S ALGORITHM: Plane.s() and Plane.d() are called in the order the
// Java calls them. Never reorder, batch, or hoist draw calls.

import { idiv, i32, trunc, fr, intArray, objArray, charAt, parseIntJava } from './java.js';
import { readLines } from './vfs.js';
import { Plane } from './Plane.js';

export class ContO {
  constructor(arg0, arg1, arg2, arg3, arg4) {
    // Field initialisers — same order procyon lists them
    this.npl = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xz = 0;
    this.xy = 0;
    this.zy = 0;
    this.dist = 0;
    this.maxR = 0;
    this.disp = 0;
    this.shadow = false;
    this.loom = false;
    this.grounded = 1;
    this.colides = false;
    this.rcol = 0;
    this.pcol = 0;
    this.out = false;
    this.fire = false;
    this.hit = false;
    this.nhits = 0;
    this.maxhits = -1;
    this.wire = false;
    this.exp = false;

    // Dispatch to the appropriate constructor overload.
    // ContO(byte[], Medium, int, int, int)  — arg0 is Uint8Array/Buffer
    // ContO(Medium, ContO, int, int, int)   — arg0 is Medium, arg1 is ContO
    if (arg1 && arg1 instanceof ContO) {
      this.#initCopy(arg0, arg1, arg2, arg3, arg4);
    } else {
      this.#initBuf(arg0, arg1, arg2, arg3, arg4);
    }
  }

  // ContO(final byte[] abyte0, final Medium medium, final int i, final int j, final int k)
  #initBuf(abyte0, medium, i, j, k) {
    this.m = medium;
    this.p = objArray(100);
    this.x = i;
    this.y = j;
    this.z = k;
    let flag = false;
    let l = 0;
    let f = 1.0;  // declared float in Java; fr() applied at use site below
    // §5b: Java int[] — use intArray
    const ai  = intArray(100);
    const ai2 = intArray(100);
    const ai3 = intArray(100);
    // Java: final int[] ai4 = { 50, 50, 50 };
    const ai4 = intArray(3);
    ai4[0] = 50; ai4[1] = 50; ai4[2] = 50;
    try {
      // DataInputStream.readLine() over the raw bytes: Latin-1, and \r alone
      // terminates a line as well. readLines() is the shared implementation.
      const lines = readLines(
        typeof abyte0 === 'string' ? Uint8Array.from(abyte0, (c) => c.charCodeAt(0) & 0xff) : abyte0);
      for (const rawLine of lines) {
        const s2 = '' + rawLine.trim();
        if (s2.startsWith('<p>')) {
          flag = true;
          l = 0;
        }
        if (flag) {
          if (s2.startsWith('c')) {
            ai4[0] = this.getvalue('c', s2, 0);
            ai4[1] = this.getvalue('c', s2, 1);
            ai4[2] = this.getvalue('c', s2, 2);
          }
          if (s2.startsWith('p')) {
            // Java: (int)(this.getvalue("p", s2, 0) * f)
            // getvalue() returns int; f is float; int*float = float; (int) = trunc.
            // fr() rounds each multiply to float32 as Java does.
            ai[l]  = trunc(fr(this.getvalue('p', s2, 0) * f));
            ai2[l] = trunc(fr(this.getvalue('p', s2, 1) * f));
            ai3[l] = trunc(fr(this.getvalue('p', s2, 2) * f));
            ++l;
          }
        }
        if (s2.startsWith('</p>')) {
          // Java: new Plane(this.m, ai, ai3, ai2, l, ai4)
          this.p[this.npl] = new Plane(this.m, ai, ai3, ai2, l, ai4);
          ++this.npl;
          flag = false;
        }
        if (s2.startsWith('MaxRadius')) {
          this.maxR = this.getvalue('MaxRadius', s2, 0);
        }
        if (s2.startsWith('disp')) {
          this.disp = this.getvalue('disp', s2, 0);
        }
        if (s2.startsWith('shadow')) {
          this.shadow = true;
        }
        if (s2.startsWith('loom')) {
          this.loom = true;
        }
        if (s2.startsWith('out')) {
          this.out = true;
        }
        if (s2.startsWith('hits')) {
          this.maxhits = this.getvalue('hits', s2, 0);
        }
        if (s2.startsWith('colid')) {
          this.colides = true;
          this.rcol = this.getvalue('colid', s2, 0);
          this.pcol = this.getvalue('colid', s2, 1);
        }
        if (s2.startsWith('grounded')) {
          this.grounded = this.getvalue('grounded', s2, 0);
        }
        if (s2.startsWith('div')) {
          // Java: f = this.getvalue("div", s2, 0) / 10.0f
          // getvalue() returns int; divide by float literal 10.0f → float32.
          f = fr(this.getvalue('div', s2, 0) / 10.0);
        }
      }
      // datainputstream.close() — nothing to do in JS
    }
    catch (ex) {
      // Java: catch (final Exception ex) {} — swallow all exceptions
    }
  }

  // ContO(final Medium medium, final ContO conto, final int i, final int j, final int k)
  #initCopy(medium, conto, i, j, k) {
    this.m = medium;
    this.npl = conto.npl;
    this.maxR = conto.maxR;
    this.disp = conto.disp;
    this.loom = conto.loom;
    this.colides = conto.colides;
    this.maxhits = conto.maxhits;
    this.out = conto.out;
    this.rcol = conto.rcol;
    this.pcol = conto.pcol;
    this.shadow = conto.shadow;
    this.grounded = conto.grounded;
    this.p = objArray(conto.npl);
    this.x = i;
    this.y = j;
    this.z = k;
    for (let l = 0; l < this.npl; ++l) {
      this.p[l] = new Plane(this.m, conto.p[l].ox, conto.p[l].oz, conto.p[l].oy, conto.p[l].n, conto.p[l].c);
    }
  }

  d(g) {
    if (this.dist !== 0) {
      this.dist = 0;
    }
    let i = 0;
    if (!this.m.interpolating) {
      for (let j = 0; j < this.npl; ++j) {
        if (!this.exp) {
          if (this.p[j].exp !== 0) {
            this.p[j].exp = 0;
          }
        }
        else if (this.p[j].exp === 0) {
          this.p[j].exp = 1;
        }
        else if (this.p[j].exp === 7) {
          ++i;
        }
      }
    } else {
      for (let j = 0; j < this.npl; ++j) {
        if (this.p[j].exp === 7) {
          ++i;
        }
      }
    }
    if (!this.out && i !== this.npl) {
      if (this.fire) {
        this.dist = 1;
      }
      // Java: int k = m.cx + (int)((x-m.x-m.cx)*cs.getcos(m.xz) - (z-m.z-m.cz)*cs.getsin(m.xz))
      // cs.getcos/getsin return float → each multiply is float32; subtraction is float32; trunc at end.
      const k = i32(this.m.cx + trunc(fr(fr((this.x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz))
                                      - fr((this.z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz)))));
      // Java: int l = m.cz + (int)((x-m.x-m.cx)*cs.getsin(m.xz) + (z-m.z-m.cz)*cs.getcos(m.xz))
      const l = i32(this.m.cz + trunc(fr(fr((this.x - this.m.x - this.m.cx) * this.m.cs.getsin(this.m.xz))
                                      + fr((this.z - this.m.z - this.m.cz) * this.m.cs.getcos(this.m.xz)))));
      // Java: int i2 = m.cz + (int)((y-m.y-m.cy)*cs.getsin(m.zy) + (l-m.cz)*cs.getcos(m.zy))
      const i2 = i32(this.m.cz + trunc(fr(fr((this.y - this.m.y - this.m.cy) * this.m.cs.getsin(this.m.zy))
                                       + fr((l - this.m.cz) * this.m.cs.getcos(this.m.zy)))));
      if ((this.xs(i32(k + this.maxR), i2) > 0 && this.xs(i32(k - this.maxR), i2) < this.m.w && i2 > -this.maxR && i2 < 50000 && i32(this.xs(i32(k + this.maxR), i2) - this.xs(i32(k - this.maxR), i2)) > this.disp) || this.exp) {
        if (this.shadow || this.exp) {
          // Java: int j2 = m.cy + (int)((m.ground-m.cy)*cs.getcos(m.zy) - (l-m.cz)*cs.getsin(m.zy))
          const j2 = i32(this.m.cy + trunc(fr(fr((this.m.ground - this.m.cy) * this.m.cs.getcos(this.m.zy))
                                           - fr((l - this.m.cz) * this.m.cs.getsin(this.m.zy)))));
          // Java: int l2 = m.cz + (int)((m.ground-m.cy)*cs.getsin(m.zy) + (l-m.cz)*cs.getcos(m.zy))
          const l2 = i32(this.m.cz + trunc(fr(fr((this.m.ground - this.m.cy) * this.m.cs.getsin(this.m.zy))
                                           + fr((l - this.m.cz) * this.m.cs.getcos(this.m.zy)))));
          if ((this.ys(i32(j2 + this.maxR), l2) > 0 && this.ys(i32(j2 - this.maxR), l2) < this.m.h) || this.exp) {
            for (let i3 = 0; i3 < this.npl; ++i3) {
              this.p[i3].s(g, i32(this.x - this.m.x), i32(this.y - this.m.y), i32(this.z - this.m.z), this.xz, this.xy, this.zy, this.loom);
            }
          }
        }
        // Java: int k2 = m.cy + (int)((y-m.y-m.cy)*cs.getcos(m.zy) - (l-m.cz)*cs.getsin(m.zy))
        const k2 = i32(this.m.cy + trunc(fr(fr((this.y - this.m.y - this.m.cy) * this.m.cs.getcos(this.m.zy))
                                         - fr((l - this.m.cz) * this.m.cs.getsin(this.m.zy)))));
        if ((this.ys(i32(k2 + this.maxR), i2) > 0 && this.ys(i32(k2 - this.maxR), i2) < this.m.h) || this.exp) {
          if (this.m.jumping !== 0 && this.m.jumping < 4 && !this.m.interpolating) {
            this.hit = true;
          }
          // §5b: Java int[] ai — use intArray
          const ai = intArray(this.npl);
          for (let j3 = 0; j3 < this.npl; ++j3) {
            ai[j3] = 0;
            for (let l3 = 0; l3 < this.npl; ++l3) {
              if (this.p[j3].av !== this.p[l3].av) {
                if (this.p[j3].av < this.p[l3].av) {
                  const array = ai;
                  const n = j3;
                  ++array[n];
                }
              }
              else if (j3 > l3) {
                const array2 = ai;
                const n2 = j3;
                ++array2[n2];
              }
            }
          }
          for (let k3 = 0; k3 < this.npl; ++k3) {
            for (let i4 = 0; i4 < this.npl; ++i4) {
              if (ai[i4] === k3) {
                this.p[i4].d(g, i32(this.x - this.m.x), i32(this.y - this.m.y), i32(this.z - this.m.z), this.xz, this.xy, this.zy, this.hit, this.wire, this.loom);
              }
            }
          }
          // Java: (int)Math.sqrt( (int)Math.sqrt( squares ) ) * this.grounded
          // Math.sqrt returns double; (int) = trunc(); then * grounded (int) = Math.imul.
          // The squared sums use i32() on the subtracted bases and imul for each square; sum wrapped with i32.
          this.dist = Math.imul(
            trunc(Math.sqrt(
              trunc(Math.sqrt(
                i32(i32(Math.imul(i32(this.m.x + this.m.cx - this.x), i32(this.m.x + this.m.cx - this.x))
                             + Math.imul(i32(this.m.z - this.z), i32(this.m.z - this.z)))
                             + Math.imul(i32(this.m.y + this.m.cy - this.y), i32(this.m.y + this.m.cy - this.y)))
              ))
            )),
            this.grounded
          );
        }
      }
    }
    if (this.hit && !this.m.interpolating) {
      this.hit = false;
      if (this.m.jumping === 0 && this.nhits > this.maxhits) {
        this.exp = true;
      }
    }
  }

  tryexp(conto) {
    if (!conto.exp && !this.out && !this.exp) {
      const i = this.getpy(conto.x, conto.y, conto.z);
      // Java: i < maxR/10*(maxR/10) + conto.maxR/10*(conto.maxR/10) && i > 0
      // All int: idiv for each division, Math.imul for each square, i32 on sum.
      if (i < i32(Math.imul(idiv(this.maxR, 10), idiv(this.maxR, 10)) + Math.imul(idiv(conto.maxR, 10), idiv(conto.maxR, 10))) && i > 0) {
        if (this.pcol !== 0) {
          for (let j = 0; j < this.npl; ++j) {
            for (let k = 0; k < this.p[j].n; ++k) {
              // Java: (conto.x - (x+p[j].ox[k]))^2 + ... < (conto.maxR*10/pcol)^2
              // Differences are int; squares use Math.imul; sum wrapped with i32.
              const dx = i32(conto.x - i32(this.x + this.p[j].ox[k]));
              const dy = i32(conto.y - i32(this.y + this.p[j].oy[k]));
              const dz = i32(conto.z - i32(this.z + this.p[j].oz[k]));
              const rhs = idiv(Math.imul(conto.maxR, 10), this.pcol);
              if (i32(Math.imul(dx, dx) + Math.imul(dy, dy) + Math.imul(dz, dz)) < Math.imul(rhs, rhs)) {
                conto.exp = true;
                break;
              }
            }
          }
        }
        // Java: rcol != 0 && i < maxR/(10*rcol)*(maxR/(10*rcol)) + conto.maxR/10*(conto.maxR/10)
        // 10*rcol: both int, use Math.imul.
        if (this.rcol !== 0 && i < i32(Math.imul(idiv(this.maxR, Math.imul(10, this.rcol)), idiv(this.maxR, Math.imul(10, this.rcol))) + Math.imul(idiv(conto.maxR, 10), idiv(conto.maxR, 10)))) {
          conto.exp = true;
        }
      }
    }
  }

  getpy(i, j, k) {
    // Java: (i-x)/10 * ((i-x)/10) + (j-y)/10 * ((j-y)/10) + (k-z)/10 * ((k-z)/10)
    // All int. idiv for each division. Math.imul for each square (can overflow).
    // i32 on the final sum.
    const dx = idiv(i32(i - this.x), 10);
    const dy = idiv(i32(j - this.y), 10);
    const dz = idiv(i32(k - this.z), 10);
    return i32(Math.imul(dx, dx) + Math.imul(dy, dy) + Math.imul(dz, dz));
  }

  reset() {
    this.exp = false;
    this.nhits = 0;
    this.xz = 0;
    this.xy = 0;
    this.zy = 0;
  }

  loadrots(flag) {
    if (!flag) {
      this.reset();
    }
    for (let i = 0; i < this.npl; ++i) {
      this.p[i].rot(this.p[i].ox, this.p[i].oy, 0, 0, this.xy, this.p[i].n);
      this.p[i].rot(this.p[i].oy, this.p[i].oz, 0, 0, this.zy, this.p[i].n);
      this.p[i].rot(this.p[i].ox, this.p[i].oz, 0, 0, this.xz, this.p[i].n);
      this.p[i].loadprojf();
    }
    if (flag) {
      this.reset();
    }
  }

  getvalue(s, s1, i) {
    let k = 0;
    let s2 = '';
    for (let j = s.length + 1; j < s1.length; ++j) {
      const s3 = '' + charAt(s1, j);
      if (s3 === ',' || s3 === ')') {
        ++k;
        ++j;
      }
      // §5a: the ++j above can push j PAST THE END, and this charAt is then
      // the one that throws in Java — the loop guard does not cover it. That
      // happens whenever the requested index is one past the last value on the
      // line (e.g. `colid(3)` asked for index 1), and #initBuf's catch then
      // abandons the rest of the model file. Reproduce it exactly; a JS
      // charAt() returning '' here would load MORE of the file than the
      // original game does.
      if (k === i) {
        s2 += charAt(s1, j);
      }
    }
    // Java: Integer.valueOf(s2) — throws on empty, on trailing garbage, and on
    // surrounding whitespace, none of which JS's parseInt rejects.
    return parseIntJava(s2);
  }

  xs(i, j) {
    if (j < 10) {
      j = 10;
    }
    // Java: (j - m.focus_point) * (m.cx - i) / j + i
    // All int. j can be up to 50000, (cx-i) up to several hundred or more in
    // bounding-box checks → product can overflow int32.
    // §2b: Math.imul the multiply, idiv the division, i32 the addition.
    return i32(idiv(Math.imul(i32(j - this.m.focus_point), i32(this.m.cx - i)), j) + i);
  }

  ys(i, j) {
    if (j < 10) {
      j = 10;
    }
    // Java: (j - m.focus_point) * (m.cy - i) / j + i
    // Same shape as xs(); same overflow reasoning applies.
    return i32(idiv(Math.imul(i32(j - this.m.focus_point), i32(this.m.cy - i)), j) + i);
  }
}
