// Transpiled from decompilation/java-src/Tank.java, line by line.
//
// Local names are kept as procyon emitted them (i, j, k, l, i2, j2, ...)
// even though they are ugly: the point is that this file diffs against the Java
// side by side. Do not rename or restructure.
//
// Numeric conventions used throughout:
//   idiv(a, b)   every Java int / int
//   trunc(x)     every Java (int) cast of a float or double
//   fr(x)        every Java float-typed intermediate; cs.getsin/getcos return
//                float, so any expression mixing them is float32 in Java and
//                drifts without this
//   Math.imul    int multiplies that can exceed 2^31 (both operands int)
//   i32(x)       wrap after int additions/subtractions that can exceed 2^31
//   intArray(n)  Int32Array for int[] fields/locals (wrapping + truncation on store)
//   random()     seeded deterministic PRNG matching Math.random()
//
// --- Compound-assignment audit (TRANSPILE_SPEC §2) ---
// 11 sites found with `+= (int)(`, `-= (int)(`:
//
// Sites 1-2 — Lines 92, 102 in preform():
//   conto.xy += (int)(this.speed / 5.0f);
//   conto.xy -= (int)(this.speed / 5.0f);
//   CASE A, verified against `javap`: offsets 283-296 and 365-377 are
//   `getfield ContO.xy ; i2f ; getfield speed ; ldc 5.0f ; fdiv ; fadd ; f2i ; putfield`
//   — the accumulator IS widened, so the truncation happens once, at the end.
//   (The delegated job classified these Case B at HIGH confidence. It was wrong.)
//   Correct JS: `conto.xy = trunc(fr(fr(conto.xy) + fr(this.speed / 5.0)))`
//
// Sites 3-5 — Lines 242, 245, 248 in preform():
//   lx[n2] -= (int)(this.lspeed[j2] * (conto.m.cs.getsin(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2])));
//   lz[n3] += (int)(this.lspeed[j2] * (conto.m.cs.getcos(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2])));
//   ly[n4] -= (int)(this.lspeed[j2] * conto.m.cs.getsin(this.lzy[j2]));
//   RHS trig/speed expression is truncated first, then integer add/sub into Int32Array.
//   CASE B. Confidence: HIGH. Discriminating shape: coordinate positive, step small negative fraction.
//   Correct JS: `lx[n2] -= trunc(fr(this.lspeed[j2] * fr(conto.m.cs.getsin(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2]))))`, etc.
//
// Sites 6-8 — Lines 266, 267, 268 in preform():
//   conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
//   conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
//   conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
//   LHS is int coordinate; RHS float32 velocity component truncated before integer subtraction/addition.
//   CASE B. Confidence: HIGH. Discriminating shape: coordinate positive, step small negative fraction.
//   Correct JS: `conto.x -= trunc(fr(this.speed * fr(conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy))))`, etc.
//
// Sites 9-11 — Lines 282, 285, 289 in preform():
//   this.gxz += (int)(70.0 + Math.random() * 20.0);
//   this.gxz -= (int)(70.0 + Math.random() * 20.0);
//   this.gxz += (int)(Math.random() * 40.0 - 20.0);
//   RHS double random expression is truncated with d2i before integer addition/subtraction.
//   CASE B. Confidence: HIGH. Discriminating shape: angle positive, delta small negative fraction.
//   Correct JS: `this.gxz += trunc(70.0 + random() * 20.0)`, etc.

import { idiv, i32, trunc, fr, intArray, random } from './java.js';
import { cControl } from './cControl.js';
import { Lasers } from './Lasers.js';

export class Tank {
  constructor(medium) {
    this.u = new cControl();
    this.rspeed = 0;
    this.ltyp = 0;
    this.speed = 0.0;
    this.pexp = false;
    this.left = false;
    this.right = false;
    this.lx = intArray(20);
    this.ly = intArray(20);
    this.lz = intArray(20);
    this.lxz = intArray(20);
    this.lzy = intArray(20);
    this.lxy = intArray(20);
    this.lstage = intArray(20);
    this.lspeed = intArray(20);
    this.lhit = intArray(20);
    this.nf = intArray(20);
    this.nl = 0;
    this.skip = false;
    this.bulkc = 0;
    this.sms = intArray(4);
    this.sx = intArray(4);
    this.sy = intArray(4);
    this.sz = intArray(4);
    this.sxz = intArray(4);
    this.ns = 0;
    this.smoke = false;
    this.turnat = trunc(random() * 50.0);
    this.tcnt = 0;
    this.gxz = 0;
    this.attack = 0;
    this.responce = false;
    this.trgxz = 180;
    this.trgt = 0;
    this.lsr = new Lasers(medium);
    let i = 0;
    do {
      this.sms[i] = -1;
    } while (++i < 4);
  }

  preform(conto, aconto, i, j) {
    let k;
    for (k = Math.abs(conto.zy); k > 270; k -= 360) {}
    if (k > 90) {
      if (conto.xy < 180) {
        ++conto.xy;
        this.smoke = true;
      }
      if (conto.xy > 180) {
        --conto.xy;
        this.smoke = true;
      }
    }
    else {
      if (conto.xy < 0) {
        ++conto.xy;
        this.smoke = true;
      }
      if (conto.xy > 0) {
        --conto.xy;
        this.smoke = true;
      }
    }
    let l;
    for (l = conto.zy; l > 90; l -= 180) {}
    while (l < -90) {
      l += 180;
    }
    if (l > 0) {
      if (l > 4) {
        conto.zy -= 2;
      }
      else {
        --conto.zy;
      }
    }
    if (l < 0) {
      if (l < -4) {
        conto.zy += 2;
      }
      else {
        ++conto.zy;
      }
    }
    if (this.u.left) {
      conto.xz += 5;
      if ((conto.xy === 0 || conto.xy === 180) && !this.left) {
        // §2 Case A: 283 getfield xy ; i2f ; speed ; fdiv ; fadd ; f2i ; putfield
        conto.xy = trunc(fr(fr(conto.xy) + fr(this.speed / 5.0)));
        this.left = true;
      }
    }
    else if (this.left) {
      this.left = false;
    }
    if (this.u.right) {
      conto.xz -= 5;
      if ((conto.xy === 0 || conto.xy === 180) && !this.right) {
        // §2 Case A: 365 getfield xy ; i2f ; speed ; fdiv ; fsub ; f2i ; putfield
        conto.xy = trunc(fr(fr(conto.xy) - fr(this.speed / 5.0)));
        this.right = true;
      }
    }
    else if (this.right) {
      this.right = false;
    }
    if (conto.x < -40000) {
      conto.x = -40000;
    }
    if (conto.x > 40000) {
      conto.x = 40000;
    }
    if (conto.z > 40000) {
      conto.z = 40000;
    }
    if (conto.z < -40000) {
      conto.z = -40000;
    }
    if (!this.pexp && conto.exp) {
      if (conto.nhits < conto.maxhits) {
        conto.exp = false;
        if (this.u.left) {
          conto.xz += 5;
        }
        else {
          conto.xz -= 5;
        }
        conto.xy += 15 - trunc(random() * 30.0);
        conto.zy += 5 + trunc(random() * 5.0);
        conto.y -= 30 + trunc(random() * 15.0);
      }
      else {
        this.pexp = true;
      }
    }
    if (this.pexp) {
      if (this.speed > 0.0) {
        this.speed = fr(this.speed - 0.3);
      }
      if (this.speed < 0.0) {
        this.speed = fr(this.speed + 0.3);
      }
    }
    else {
      if (this.speed > this.rspeed) {
        this.speed = fr(this.speed - 0.2);
      }
      if (this.speed < this.rspeed) {
        this.speed = fr(this.speed + 1.0);
      }
      if (conto.y > 240) {
        conto.y = 240;
      }
      else if (conto.y > 235) {
        ++conto.y;
      }
      else {
        conto.y += 5;
      }
    }
    if (this.u.fire && !conto.exp) {
      if (this.skip && this.bulkc < this.lsr.srate[this.ltyp]) {
        this.lx[this.nl] = conto.x;
        this.ly[this.nl] = conto.y;
        this.lz[this.nl] = conto.z;
        this.lxz[this.nl] = conto.xz;
        this.lzy[this.nl] = conto.zy + 10;
        this.lxy[this.nl] = conto.xy;
        if (this.ly[this.nl] > 215) {
          this.ly[this.nl] = 215;
        }
        this.lspeed[this.nl] = trunc(fr(this.lsr.speed[this.ltyp] + this.speed));
        this.lstage[this.nl] = 1;
        this.lhit[this.nl] = 0;
        this.nf[this.nl] = 0;
        ++this.nl;
        if (this.nl === 20) {
          this.nl = 0;
        }
        this.skip = false;
      }
      else if (!this.skip) {
        this.skip = true;
      }
      ++this.bulkc;
      if (this.bulkc > 12) {
        this.bulkc = 0;
      }
    }
    let i2 = 0;
    let j2 = 0;
    do {
      if (this.lstage[j2] !== 0) {
        ++i2;
        if (this.ly[j2] > 240 && this.lhit[j2] === 0) {
          this.lhit[j2] = 1;
        }
        if (this.lhit[j2] !== 0) {
          continue;
        }
        if (this.lstage[j2] > 10 && this.nf[j2] < 15) {
          let i3 = -1;
          let k2 = -1;
          if (!aconto[i].exp) {
            i3 = this.getpy(aconto[i].x, aconto[i].y, aconto[i].z, j2);
            k2 = i;
          }
          for (let l2 = j; l2 < j + 13; ++l2) {
            const j3 = this.getpy(aconto[l2].x, aconto[l2].y, aconto[l2].z, j2);
            if (j3 < i3 && j3 > 0 && !aconto[l2].exp) {
              i3 = j3;
              k2 = l2;
            }
          }
          if (i3 < 22500 && i3 > 0) {
            if (this.lspeed[j2] > 230) {
              this.lspeed[j2] = 230;
            }
            const i4 = aconto[k2].x;
            const k3 = aconto[k2].z;
            const l3 = aconto[k2].y;
            let c2 = 0;
            if (i4 - this.lx[j2] > 0) {
              c2 = 180;
            }
            this.lxz[j2] = trunc(90 + c2 + Math.atan((k3 - this.lz[j2]) / (i4 - this.lx[j2])) / 0.017453292519943295);
            c2 = 0;
            if (l3 - this.ly[j2] < 0) {
              c2 = 65356;
            }
            const i5 = trunc(Math.sqrt(i32(Math.imul(k3 - this.lz[j2], k3 - this.lz[j2]) + Math.imul(i4 - this.lx[j2], i4 - this.lx[j2]))));
            this.lzy[j2] = -trunc(90 + c2 - Math.atan(i5 / (l3 - this.ly[j2])) / 0.017453292519943295);
            const nf = this.nf;
            const n = j2;
            ++nf[n];
          }
        }
        const lx = this.lx;
        const n2 = j2;
        lx[n2] -= trunc(fr(this.lspeed[j2] * fr(conto.m.cs.getsin(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2]))));
        const lz = this.lz;
        const n3 = j2;
        lz[n3] += trunc(fr(this.lspeed[j2] * fr(conto.m.cs.getcos(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2]))));
        const ly = this.ly;
        const n4 = j2;
        ly[n4] -= trunc(fr(this.lspeed[j2] * conto.m.cs.getsin(this.lzy[j2])));
        const lstage = this.lstage;
        const n5 = j2;
        ++lstage[n5];
        if (this.lstage[j2] <= 80) {
          continue;
        }
        this.lstage[j2] = 0;
      }
    } while (++j2 < 20);
    if (i2 !== 0) {
      if (!conto.fire) {
        conto.fire = true;
      }
    }
    else if (conto.fire) {
      conto.fire = false;
    }
    conto.x -= trunc(fr(this.speed * fr(conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy))));
    conto.z += trunc(fr(this.speed * fr(conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy))));
    conto.y -= trunc(fr(this.speed * conto.m.cs.getsin(conto.zy)));
    if (this.tcnt > this.turnat) {
      if (this.trgt !== 0) {
        this.trgt = 0;
      }
      let c3 = 0;
      if (aconto[j + 4].x - conto.x > 0) {
        c3 = 180;
      }
      this.gxz = trunc(90 + c3 + Math.atan((aconto[j + 4].z - conto.z) / (aconto[j + 4].x - conto.x)) / 0.017453292519943295);
      this.turnat = trunc(random() * 200.0);
      let k4 = this.getcpy(aconto[j + 4], conto);
      if (k4 < 1500 && k4 > 0) {
        if (random() > 0.5) {
          this.gxz += trunc(70.0 + random() * 20.0);
        }
        else {
          this.gxz -= trunc(70.0 + random() * 20.0);
        }
      }
      else {
        this.gxz += trunc(random() * 40.0 - 20.0);
        this.trgt = 1;
      }
      k4 = this.getcpy(aconto[i], conto);
      if (k4 < 15000 && k4 > 0 && !aconto[i].exp) {
        if (this.attack === 0) {
          if (random() > 0.5) {
            this.attack = 1;
          }
          else {
            this.attack = 2;
          }
        }
        if (this.attack === 1) {
          let c4 = 0;
          if (aconto[i].x - conto.x > 0) {
            c4 = 180;
          }
          this.gxz = trunc(90 + c4 + Math.atan((aconto[i].z - conto.z) / (aconto[i].x - conto.x)) / 0.017453292519943295);
          this.turnat = trunc(random() * 3.0);
          this.trgt = 2;
        }
      }
      else if (this.attack !== 0) {
        this.attack = 0;
      }
      if (this.gxz >= 360) {
        this.gxz -= 360;
      }
      if (this.gxz < 0) {
        this.gxz += 360;
      }
      this.tcnt = 0;
    }
    else {
      ++this.tcnt;
    }
    if (conto.hit && random() > 0.5) {
      this.attack = 1;
      this.turnat = trunc(random() * 10.0);
    }
    if (this.u.fire) {
      this.u.fire = false;
    }
    if (this.trgt === 1 && this.trgxz < 90) {
      const l4 = this.getcpy(aconto[j + 4], conto);
      if (l4 > 0 && l4 < 10000) {
        this.u.fire = true;
      }
    }
    if (this.trgt === 2 && this.trgxz < 90) {
      this.u.fire = true;
    }
    if (this.responce) {
      if (this.u.left) {
        this.u.left = false;
      }
      if (this.u.right) {
        this.u.right = false;
      }
      let j4;
      for (j4 = conto.xz; j4 >= 360; j4 -= 360) {}
      while (j4 < 0) {
        j4 += 360;
      }
      if (Math.abs(j4 - this.gxz) > 5) {
        if (j4 > 270 && this.gxz < 90) {
          this.u.left = true;
          this.trgxz = 360 - j4 + this.gxz;
        }
        else if (j4 < 90 && this.gxz > 270) {
          this.u.right = true;
          this.trgxz = 360 - this.gxz + j4;
        }
        else if (j4 < this.gxz) {
          this.u.left = true;
          this.trgxz = this.gxz - j4;
        }
        else {
          this.u.right = true;
          this.trgxz = j4 - this.gxz;
        }
      }
      this.responce = false;
    }
    else {
      this.responce = true;
    }
  }

  dosmokes(g, conto) {
    if (conto.y > 200) {
      if (this.smoke && !conto.exp && this.sms[this.ns] === -1) {
        this.sx[this.ns] = conto.x + trunc(random() * 150.0 - 75.0);
        this.sy[this.ns] = conto.y + 10;
        this.sz[this.ns] = conto.z;
        this.sxz[this.ns] = conto.xz;
        this.sms[this.ns] = 0;
        ++this.ns;
        if (this.ns === 4) {
          this.ns = 0;
        }
        this.smoke = false;
      }
      let i = 0;
      do {
        if (this.sms[i] !== -1) {
          if (this.sms[i] < 5) {
            this.lsr.gsmoke(g, this.sx[i], this.sy[i], this.sz[i], this.sxz[i], 0, this.sms[i]);
          }
          const sy = this.sy;
          const n = i;
          sy[n] -= 10;
          const sms = this.sms;
          const n2 = i;
          ++sms[n2];
          if (this.sms[i] !== 10) {
            continue;
          }
          this.sms[i] = -1;
        }
      } while (++i < 4);
    }
  }

  reset(i, j) {
    this.rspeed = i;
    this.pexp = false;
    this.ltyp = j;
    let k = 0;
    do {
      this.lstage[k] = 0;
    } while (++k < 20);
  }

  lasercolid(conto) {
    if (!conto.exp && !conto.out) {
      let i = 0;
      do {
        if (this.lstage[i] !== 0 && this.lhit[i] === 0) {
          const j = this.getpy(conto.x, conto.y, conto.z, i);
          if (j >= Math.imul(idiv(conto.maxR, 10), idiv(conto.maxR, 10)) || j <= 0) {
            continue;
          }
          if (conto.rcol !== 0 && j < i32(Math.imul(idiv(conto.maxR, Math.imul(10, conto.rcol)), idiv(conto.maxR, Math.imul(10, conto.rcol))) + Math.imul(idiv(this.lsr.rads[this.ltyp], 10), idiv(this.lsr.rads[this.ltyp], 10)))) {
            this.lhit[i] = 1;
            if (conto.maxhits !== -1) {
              conto.hit = true;
              conto.nhits += this.lsr.damg[this.ltyp];
            }
          }
          if (conto.pcol === 0) {
            continue;
          }
          for (let k = 0; k < conto.npl; ++k) {
            for (let l = 0; l < conto.p[k].n; ++l) {
              if (!conto.hit && i32(i32(Math.imul(this.lx[i] - (conto.x + conto.p[k].ox[l]), this.lx[i] - (conto.x + conto.p[k].ox[l])) + Math.imul(this.ly[i] - (conto.y + conto.p[k].oy[l]), this.ly[i] - (conto.y + conto.p[k].oy[l]))) + Math.imul(this.lz[i] - (conto.z + conto.p[k].oz[l]), this.lz[i] - (conto.z + conto.p[k].oz[l]))) < Math.imul(idiv(Math.imul(this.lsr.rads[this.ltyp], 10), conto.pcol), idiv(Math.imul(this.lsr.rads[this.ltyp], 10), conto.pcol))) {
                this.lhit[i] = 1;
                if (conto.maxhits !== -1) {
                  conto.hit = true;
                  conto.nhits += this.lsr.damg[this.ltyp];
                }
              }
            }
          }
        }
      } while (++i < 20);
    }
  }

  getpy(i, j, k, l) {
    return i32(i32(Math.imul(idiv(i - this.lx[l], 10), idiv(i - this.lx[l], 10)) + Math.imul(idiv(j - this.ly[l], 10), idiv(j - this.ly[l], 10))) + Math.imul(idiv(k - this.lz[l], 10), idiv(k - this.lz[l], 10)));
  }

  getcpy(conto, conto1) {
    return i32(i32(Math.imul(idiv(conto.x - conto1.x, 100), idiv(conto.x - conto1.x, 100)) + Math.imul(idiv(conto.y - conto1.y, 100), idiv(conto.y - conto1.y, 100))) + Math.imul(idiv(conto.z - conto1.z, 100), idiv(conto.z - conto1.z, 100)));
  }

  dl(g) {
    let i = 0;
    do {
      if (this.lstage[i] !== 0) {
        this.lsr.d(g, this.ltyp, this.lx[i], this.ly[i], this.lz[i], this.lxz[i], this.lzy[i], this.lxy[i], this.lhit[i]);
        if (this.lhit[i] === 0) {
          continue;
        }
        const lhit = this.lhit;
        const n = i;
        ++lhit[n];
        if (this.lhit[i] <= 2) {
          continue;
        }
        this.lstage[i] = 0;
      }
    } while (++i < 20);
  }
}
