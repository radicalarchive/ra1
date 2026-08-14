// Transpiled from decompilation/java-src/Craft.java, line by line.
//
// Local names are kept as procyon emitted them (i, j, k, l, byte0, i2, k2, ...)
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
// 14 sites found with `+= (int)(` or `-= (int)(`:
//
// Sites 1-5 — Lines 77, 78, 81, 82, 124 in preform():
//   conto.zy -= (int)(5.0f * conto.m.cs.getcos(conto.xy));
//   conto.xz += (int)(byte0 * 3 * conto.m.cs.getsin(conto.xy));
//   conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
//   conto.xz -= (int)(byte0 * 3 * conto.m.cs.getsin(conto.xy));
//   conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
//   LHS is int angle, RHS is float32 expression.
//   CASE B. Confidence: HIGH. Disproved Case A in differential test: step 1 climbing
//   with zy=-24, xy=30 yields -24 + trunc(4.33) = -20 (Java output), whereas Case A
//   trunc(-24 + 4.33) = -19.
//   Correct JS: `conto.zy -= trunc(fr(5.0 * conto.m.cs.getcos(conto.xy)))`, etc.
//
// Sites 6-7 — Lines 154, 155 in preform():
//   conto.xz += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
//   conto.zy += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
//   LHS is int, RHS is double.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.xz += trunc(random() * (this.speed / 10.0) - this.speed / 20.0)`.
//
// Site 8 — Line 171 in preform():
//   conto.y -= (int)this.lift;
//   LHS is int, lift is double. Procyon decompiled `(int)this.lift` (explicit cast
//   on simple field read without expression parentheses).
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.y -= trunc(this.lift)`.
//
// Sites 9-11 — Lines 316, 319, 322 in preform():
//   lx[n2] -= (int)(this.lspeed[l3] * (conto.m.cs.getsin(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3])));
//   lz[n3] += (int)(this.lspeed[l3] * (conto.m.cs.getcos(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3])));
//   ly[n4] -= (int)(this.lspeed[l3] * conto.m.cs.getsin(this.lzy[l3]));
//   LHS is int in Int32Array, RHS is float32 expression.
//   CASE B. Confidence: HIGH.
//   Correct JS: `lx[n2] -= trunc(fr(this.lspeed[l3] * fr(conto.m.cs.getsin(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3]))))`, etc.
//
// Sites 12-14 — Lines 340, 341, 342 in preform():
//   conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
//   conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
//   conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
//   LHS is int, speed and trig results are float.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.x -= trunc(fr(this.speed * fr(conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy))))`, etc.

import { idiv, i32, trunc, fr, intArray, random } from './java.js';
import { cControl } from './cControl.js';
import { Lasers } from './Lasers.js';

export class Craft {
  constructor(medium) {
    this.u = new cControl();
    this.rspeed = 0;
    this.speed = 0.0;
    this.rlift = 0;
    this.lift = 0.0;
    this.pexp = false;
    this.ltyp = 3;
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
    this.szy = intArray(4);
    this.ns = 0;
    this.smoke = false;
    this.dms = intArray(4);
    this.dx = intArray(4);
    this.dy = intArray(4);
    this.dz = intArray(4);
    this.dxz = intArray(4);
    this.dzy = intArray(4);
    this.nd = 0;
    this.gxz = 0;
    this.gzy = 0;
    this.responce = false;
    this.trgxz = 0;
    this.trgzy = 0;
    this.out = 0;
    this.turnat = trunc(random() * 50.0);
    this.tcnt = 0;
    this.engage = true;
    this.enx = 0;
    this.eny = 0;
    this.enz = 0;
    this.ens = 4;
    this.targeting = false;
    this.mode = 0;
    this.m3o = 0;
    this.m3cnt = 0;
    this.m1cnt = 0;
    this.relax = 50;
    this.runn = 30;
    this.liftup = 500;
    this.dracs = false;
    this.lsr = new Lasers(medium);
    let i = 0;
    do {
      this.sms[i] = -1;
    } while (++i < 4);
    i = 0;
    do {
      this.dms[i] = -1;
    } while (++i < 4);
  }

  preform(conto, aconto, ai, i, j, k) {
    let l;
    for (l = Math.abs(conto.zy); l > 360; l -= 360) {}
    let byte0 = 1;
    if (l > 90 && l < 270) {
      byte0 = -1;
    }
    if (conto.y < 207) {
      if (this.u.up) {
        conto.zy -= trunc(fr(5.0 * conto.m.cs.getcos(conto.xy)));
        conto.xz += trunc(fr(fr(byte0 * 3) * conto.m.cs.getsin(conto.xy)));
      }
      if (this.u.down) {
        conto.zy += trunc(fr(5.0 * conto.m.cs.getcos(conto.xy)));
        conto.xz -= trunc(fr(fr(byte0 * 3) * conto.m.cs.getsin(conto.xy)));
      }
    }
    else {
      let i2;
      for (i2 = Math.abs(conto.zy); i2 > 90; i2 -= 180) {}
      let k2;
      for (k2 = Math.abs(conto.xy); k2 > 90; k2 -= 180) {}
      let i3;
      for (i3 = Math.abs(conto.zy); i3 > 270; i3 -= 360) {}
      let k3;
      for (k3 = Math.abs(conto.xy); k3 > 270; k3 -= 360) {}
      const flag = (Math.abs(i3) < 90 && Math.abs(k3) < 90) || (Math.abs(i3) > 90 && Math.abs(k3) > 90);
      const flag2 = Math.abs(i2) > 30 || Math.abs(k2) > 30;
      if ((!flag || flag2) && !conto.exp) {
        conto.exp = true;
        conto.y = 170;
        this.speed = 30.0;
        this.pexp = true;
      }
      let i4;
      for (i4 = Math.abs(conto.zy); i4 > 270; i4 -= 360) {}
      if (i4 > 90) {
        conto.xy = 180;
      }
      else {
        conto.xy = 0;
      }
      let i5;
      for (i5 = conto.zy; i5 > 90; i5 -= 180) {}
      while (i5 < -90) {
        i5 += 180;
      }
      if (i5 > 0) {
        --conto.zy;
        this.smoke = true;
      }
      if (i5 < 0) {
        ++conto.zy;
        this.smoke = true;
      }
      if (this.speed > 10.0 && this.u.down) {
        conto.zy += trunc(fr(5.0 * conto.m.cs.getcos(conto.xy)));
      }
    }
    if (this.u.left) {
      if (conto.y < 207) {
        if (conto.xy > -90) {
          conto.xy -= 10;
        }
      }
      else {
        conto.xz += 2;
      }
    }
    if (this.u.right) {
      if (conto.y < 207) {
        if (conto.xy < 90) {
          conto.xy += 10;
        }
      }
      else {
        conto.xz -= 2;
      }
    }
    const j2 = trunc(fr(fr(byte0 * 4) * conto.m.cs.getsin(conto.xy)));
    conto.xz -= j2;
    if (conto.nhits > conto.maxhits - idiv(conto.maxhits, 6) && !conto.exp) {
      if (this.rspeed > 60) {
        this.rspeed = 60;
        this.speed = 60.0;
      }
      conto.xz += trunc(random() * (this.speed / 10.0) - this.speed / 20.0);
      conto.zy += trunc(random() * (this.speed / 10.0) - this.speed / 20.0);
    }
    this.rlift = trunc(fr(this.speed * fr(conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy)))) - 40;
    if (this.lift < this.rlift) {
      this.lift += 0.5;
    }
    if (this.lift > this.rlift) {
      this.lift -= 0.5;
    }
    if (this.lift < -(50.0 - this.speed / 2.0)) {
      this.lift = -(50.0 - this.speed / 2.0);
    }
    const l2 = trunc(fr(5.0 * fr(conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy))));
    if (this.lift > l2) {
      this.lift = l2;
    }
    conto.y -= trunc(this.lift);
    if (conto.x < -40000) {
      conto.x = -40000;
      if (j2 <= 0) {
        conto.xz += 5;
      }
      else {
        conto.xz -= 5;
      }
    }
    if (conto.x > 40000) {
      conto.x = 40000;
      if (j2 <= 0) {
        conto.xz += 5;
      }
      else {
        conto.xz -= 5;
      }
    }
    if (conto.z > 40000) {
      conto.z = 40000;
      if (j2 <= 0) {
        conto.xz += 5;
      }
      else {
        conto.xz -= 5;
      }
    }
    if (conto.z < -40000) {
      conto.z = -40000;
      if (j2 <= 0) {
        conto.xz += 5;
      }
      else {
        conto.xz -= 5;
      }
    }
    if (!this.pexp && conto.exp) {
      if (this.speed > 30.0) {
        this.speed = -15.0;
        this.pexp = true;
      }
      else if (conto.nhits > conto.maxhits) {
        this.pexp = true;
      }
      else {
        conto.exp = false;
        this.speed = fr(-fr(fr(this.rspeed + this.speed) / 2.0));
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
        this.speed = fr(this.speed - 0.5);
      }
      if (this.speed < this.rspeed) {
        this.speed = fr(this.speed + 1.0);
      }
    }
    if (this.u.fire && !conto.exp) {
      if (this.skip && this.bulkc < this.lsr.srate[this.ltyp]) {
        this.lx[this.nl] = conto.x;
        this.ly[this.nl] = conto.y;
        this.lz[this.nl] = conto.z;
        this.lxz[this.nl] = conto.xz;
        this.lzy[this.nl] = conto.zy;
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
    let j3 = 0;
    let l3 = 0;
    do {
      if (this.lstage[l3] !== 0) {
        ++j3;
        if (this.ly[l3] > 240 && this.lhit[l3] === 0) {
          this.lhit[l3] = 1;
        }
        if (this.lhit[l3] !== 0) {
          continue;
        }
        if (this.lstage[l3] > 10 && this.nf[l3] < 15) {
          let i6 = -1;
          let k4 = -1;
          if (!aconto[j].exp) {
            i6 = this.getpy(aconto[j].x, aconto[j].y, aconto[j].z, l3);
            k4 = j;
          }
          for (let j4 = k; j4 < k + 13; ++j4) {
            const j5 = this.getpy(aconto[j4].x, aconto[j4].y, aconto[j4].z, l3);
            if (j5 < i6 && j5 > 0 && !aconto[j4].exp) {
              i6 = j5;
              k4 = j4;
            }
          }
          if (i6 < 22500 && i6 > 0) {
            if (this.lspeed[l3] > 230) {
              this.lspeed[l3] = 230;
            }
            const k5 = aconto[k4].x;
            const k6 = aconto[k4].z;
            const i7 = aconto[k4].y;
            let c4 = 0;
            if (k5 - this.lx[l3] > 0) {
              c4 = 180;
            }
            this.lxz[l3] = trunc(90 + c4 + Math.atan((k6 - this.lz[l3]) / (k5 - this.lx[l3])) / 0.017453292519943295);
            c4 = 0;
            if (i7 - this.ly[l3] < 0) {
              c4 = 65356;
            }
            const k7 = trunc(Math.sqrt(i32(Math.imul(k6 - this.lz[l3], k6 - this.lz[l3]) + Math.imul(k5 - this.lx[l3], k5 - this.lx[l3]))));
            this.lzy[l3] = -trunc(90 + c4 - Math.atan(k7 / (i7 - this.ly[l3])) / 0.017453292519943295);
            const nf = this.nf;
            const n = l3;
            ++nf[n];
          }
        }
        const lx = this.lx;
        const n2 = l3;
        lx[n2] -= trunc(fr(this.lspeed[l3] * fr(conto.m.cs.getsin(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3]))));
        const lz = this.lz;
        const n3 = l3;
        lz[n3] += trunc(fr(this.lspeed[l3] * fr(conto.m.cs.getcos(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3]))));
        const ly = this.ly;
        const n4 = l3;
        ly[n4] -= trunc(fr(this.lspeed[l3] * conto.m.cs.getsin(this.lzy[l3])));
        const lstage = this.lstage;
        const n5 = l3;
        ++lstage[n5];
        if (this.lstage[l3] <= 80) {
          continue;
        }
        this.lstage[l3] = 0;
      }
    } while (++l3 < 20);
    if (j3 !== 0) {
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
    if (conto.y > 215) {
      conto.y = 215;
    }
    if (conto.y < -25000) {
      conto.y = -25000;
    }
    if (this.tcnt > this.turnat) {
      if (this.targeting) {
        this.targeting = false;
      }
      if (this.mode !== 1 && this.mode !== 3) {
        if (this.engage) {
          let c5 = 0;
          if (aconto[k + this.ens].x - conto.x > 0) {
            c5 = 180;
          }
          this.gxz = trunc(90 + c5 + Math.atan((aconto[k + this.ens].z - conto.z) / (aconto[k + this.ens].x - conto.x)) / 0.017453292519943295);
          c5 = 0;
          if (aconto[k + this.ens].y - conto.y < 0) {
            c5 = 65356;
          }
          const l4 = trunc(Math.sqrt(i32(Math.imul(aconto[k + this.ens].z - conto.z, aconto[k + this.ens].z - conto.z) + Math.imul(aconto[k + this.ens].x - conto.x, aconto[k + this.ens].x - conto.x))));
          this.gzy = -trunc(90 + c5 - Math.atan(l4 / (aconto[k + this.ens].y - conto.y)) / 0.017453292519943295);
          l3 = this.getcpy(conto, aconto[k + this.ens]);
          if (l3 > 0 && l3 < 15000) {
            this.targeting = true;
          }
          if (l3 > 0 && l3 < 200 && random() > 0.7) {
            if (random() > 0.5) {
              this.enx = -6800 + trunc(2000.0 + 30000.0 * random());
            }
            else {
              this.enx = -6800 - trunc(2000.0 + 30000.0 * random());
            }
            if (random() > 0.5) {
              this.enz = -1150 + trunc(2000.0 + 30000.0 * random());
            }
            else {
              this.enz = -1150 - trunc(2000.0 + 30000.0 * random());
            }
            if (random() > 0.7) {
              this.eny = 0;
            }
            else {
              this.eny = -trunc(random() * 23000.0);
            }
            this.engage = false;
            this.targeting = false;
          }
        }
        else {
          let c6 = 0;
          if (this.enx - conto.x > 0) {
            c6 = 180;
          }
          this.gxz = trunc(90 + c6 + Math.atan((this.enz - conto.z) / (this.enx - conto.x)) / 0.017453292519943295);
          c6 = 0;
          if (this.eny - conto.y < 0) {
            c6 = 65356;
          }
          const i8 = trunc(Math.sqrt(i32(Math.imul(this.enz - conto.z, this.enz - conto.z) + Math.imul(this.enx - conto.x, this.enx - conto.x))));
          this.gzy = -trunc(90 + c6 - Math.atan(i8 / (this.eny - conto.y)) / 0.017453292519943295);
          l3 = this.getepy(conto);
          if (l3 > 0 && l3 < 500) {
            this.ens = 4 + trunc(random() * 5.0);
            this.engage = true;
          }
        }
        this.turnat = trunc(random() * 50.0);
      }
      l3 = this.getcpy(aconto[j], conto);
      if (l3 > 0) {
        if (l3 < 20000 && !aconto[j].exp) {
          if (this.mode === 0 && this.mode !== 3) {
            if (random() > 0.5 && conto.maxR !== 151) {
              this.mode = 2;
            }
            else {
              this.mode = 1;
              this.m1cnt = 0;
            }
          }
        }
        else if (this.mode !== 0) {
          this.mode = 0;
        }
      }
      if (this.mode === 1) {
        let c7 = 0;
        if (aconto[j].x - conto.x > 0) {
          c7 = 180;
        }
        this.gxz = trunc(90 + c7 + Math.atan((aconto[j].z - conto.z) / (aconto[j].x - conto.x)) / 0.017453292519943295);
        c7 = 0;
        if (aconto[j].y - conto.y < 0) {
          c7 = 65356;
        }
        const j6 = trunc(Math.sqrt(i32(Math.imul(aconto[j].z - conto.z, aconto[j].z - conto.z) + Math.imul(aconto[j].x - conto.x, aconto[j].x - conto.x))));
        this.gzy = -trunc(90 + c7 - Math.atan(j6 / (aconto[j].y - conto.y)) / 0.017453292519943295);
        this.turnat = trunc(random() * 3.0);
        if (l3 < 7000) {
          this.targeting = true;
        }
        ++this.m1cnt;
        if (this.m1cnt > this.relax) {
          this.mode = 0;
        }
      }
      if (this.mode === 3) {
        let c8 = 0;
        if (aconto[this.m3o].x - conto.x > 0) {
          c8 = 180;
        }
        this.gxz = trunc(90 + c8 + Math.atan((aconto[this.m3o].z - conto.z) / (aconto[this.m3o].x - conto.x)) / 0.017453292519943295);
        c8 = 0;
        if (aconto[this.m3o].y - conto.y < 0) {
          c8 = 65356;
        }
        const k8 = trunc(Math.sqrt(i32(Math.imul(aconto[this.m3o].z - conto.z, aconto[this.m3o].z - conto.z) + Math.imul(aconto[this.m3o].x - conto.x, aconto[this.m3o].x - conto.x))));
        this.gzy = -trunc(90 + c8 - Math.atan(k8 / (aconto[this.m3o].y - conto.y)) / 0.017453292519943295);
        this.turnat = trunc(random() * 10.0);
        ++this.m3cnt;
        if (this.m3cnt === this.runn) {
          this.mode = 0;
        }
      }
      this.tcnt = 0;
    }
    else {
      ++this.tcnt;
    }
    if (this.mode !== 3 && conto.hit && random() > 0.85) {
      if (random() > 0.5) {
        this.m3o = this.nearst(aconto, ai, i, j, conto);
        this.mode = 3;
        this.m3cnt = 0;
      }
      else if (this.mode === 2) {
        if (conto.zy < 15 && random() < 0.5 && conto.maxR !== 151) {
          this.turnat = 20;
          this.gzy = 80;
          this.mode = 0;
        }
        else {
          this.mode = 1;
          this.m1cnt = 0;
        }
      }
      else if (conto.zy < 15 && random() < 0.5) {
        this.turnat = 20;
        this.gzy = 80;
        this.mode = 0;
      }
      else {
        this.mode = 2;
      }
    }
    l3 = 0;
    if (conto.y > fr(100.0 + fr(this.liftup * conto.m.cs.getsin(conto.zy)))) {
      l3 = 1;
    }
    const j7 = conto.y + trunc(fr(-(conto.z + 1000 - conto.z) * conto.m.cs.getsin(conto.zy)));
    const l5 = conto.z + trunc(fr((conto.z + 1000 - conto.z) * conto.m.cs.getcos(conto.zy)));
    const l6 = conto.x + trunc(fr(-(l5 - conto.z) * conto.m.cs.getsin(conto.xz)));
    const l7 = conto.z + trunc(fr((l5 - conto.z) * conto.m.cs.getcos(conto.xz)));
    if (this.myway(aconto, ai, i, j, l6, j7, l7)) {
      l3 = 2;
    }
    if (this.u.left) {
      this.u.left = false;
    }
    if (this.u.right) {
      this.u.right = false;
    }
    if (this.u.up) {
      this.u.up = false;
    }
    if (this.u.down) {
      this.u.down = false;
    }
    if (l3 !== 2) {
      let j8;
      for (j8 = conto.xz; j8 >= 360; j8 -= 360) {}
      while (j8 < 0) {
        j8 += 360;
      }
      if (Math.abs(j8 - this.gxz) > 5 && l3 === 0) {
        if (j8 > 270 && this.gxz < 90) {
          this.u.left = true;
          this.trgxz = 360 - j8 + this.gxz;
        }
        else if (j8 < 90 && this.gxz > 270) {
          this.u.right = true;
          this.trgxz = 360 - this.gxz + j8;
        }
        else if (j8 < this.gxz) {
          this.u.left = true;
          this.trgxz = this.gxz - j8;
        }
        else {
          this.u.right = true;
          this.trgxz = j8 - this.gxz;
        }
        if (this.dracs && Math.abs(conto.xy) > 80) {
          this.u.down = true;
        }
      }
      else {
        if (conto.xy > 0) {
          this.u.left = true;
        }
        if (conto.xy < 0) {
          this.u.right = true;
        }
        if (l3 === 1 && Math.abs(conto.xy) < 30 && conto.zy < -30) {
          this.gzy = 20;
        }
      }
      if (Math.abs(conto.zy - this.gzy) > 5 && Math.abs(conto.xy) < 45) {
        if (this.gzy < conto.zy) {
          this.u.up = true;
        }
        if (this.gzy > conto.zy) {
          this.u.down = true;
        }
        this.trgzy = Math.abs(conto.zy - this.gzy);
      }
    }
    else if (Math.abs(conto.xy) < 60 || conto.zy < 10) {
      if (conto.xy > 0) {
        this.u.left = true;
      }
      if (conto.xy < 0) {
        this.u.right = true;
      }
      if (conto.zy < 80) {
        this.u.down = true;
        this.gzy = 80;
      }
      this.tcnt = 0;
      this.turnat = trunc(random() * 6.0 + 4.0);
    }
    else {
      if (conto.xy > 0) {
        this.u.right = true;
      }
      if (conto.xy < 0) {
        this.u.left = true;
      }
      if (conto.zy < 80) {
        this.u.down = true;
      }
      this.tcnt = 0;
      this.turnat = trunc(random() * 4.0 + 3.0);
    }
    if (this.trgxz < 90 && this.trgzy < 40 && this.targeting) {
      if (!this.u.fire) {
        this.u.fire = true;
      }
    }
    else if (this.u.fire) {
      this.u.fire = false;
    }
  }

  dosmokes(g, conto) {
    if (!conto.exp) {
      if (conto.nhits > conto.maxhits - idiv(conto.maxhits, 3)) {
        if (this.dms[this.nd] === -1 && !this.lsr.m.interpolating) {
          this.dx[this.nd] = conto.x + trunc(random() * 60.0 - 30.0);
          this.dy[this.nd] = conto.y;
          this.dz[this.nd] = conto.z;
          this.dxz[this.nd] = conto.xz;
          this.dzy[this.nd] = conto.zy;
          this.dms[this.nd] = 0;
          ++this.nd;
          if (this.nd === 4) {
            this.nd = 0;
          }
        }
        let i = 0;
        do {
          if (this.dms[i] !== -1) {
            if (this.dms[i] < 4) {
              this.lsr.hsmoke(g, this.dx[i], this.dy[i], this.dz[i], this.dxz[i], this.dzy[i], this.dms[i]);
            }
            if (!this.lsr.m.interpolating) {
              const dy = this.dy;
              const n = i;
              dy[n] -= 15;
              const dms = this.dms;
              const n2 = i;
              ++dms[n2];
              if (this.dms[i] < 7) {
                continue;
              }
              this.dms[i] = -1;
            }
          }
        } while (++i < 4);
      }
      if (conto.y > 200) {
        if (this.smoke && this.sms[this.ns] === -1 && !this.lsr.m.interpolating) {
          this.sx[this.ns] = conto.x + trunc(random() * 80.0 - 40.0);
          this.sy[this.ns] = conto.y + 15;
          this.sz[this.ns] = conto.z;
          this.sxz[this.ns] = conto.xz;
          this.szy[this.ns] = conto.zy;
          this.sms[this.ns] = 0;
          ++this.ns;
          if (this.ns === 4) {
            this.ns = 0;
          }
          this.smoke = false;
        }
        let j = 0;
        do {
          if (this.sms[j] !== -1) {
            if (this.sms[j] < 4) {
              this.lsr.gsmoke(g, this.sx[j], this.sy[j], this.sz[j], this.sxz[j], this.szy[j], this.sms[j]);
            }
            if (!this.lsr.m.interpolating) {
              const sy = this.sy;
              const n3 = j;
              sy[n3] -= 15;
              const sms = this.sms;
              const n4 = j;
              ++sms[n4];
              if (this.sms[j] !== 10) {
                continue;
              }
              this.sms[j] = -1;
            }
          }
        } while (++j < 4);
      }
    }
  }

  nearst(aconto, ai, i, j, conto) {
    let k = this.getcpy(aconto[ai[0]], conto);
    let l = ai[0];
    for (let i2 = 0; i2 < i; ++i2) {
      if (ai[i2] !== j) {
        const j2 = this.getcpy(aconto[ai[i2]], conto);
        if ((j2 > 0 && j2 < k && !aconto[ai[i2]].exp) || k < 0) {
          k = j2;
          l = ai[i2];
        }
      }
    }
    return l;
  }

  reset(i, j, k, l, i1, j1) {
    this.rspeed = i;
    this.speed = fr(i);
    this.rlift = 0;
    this.lift = 0.0;
    this.pexp = false;
    this.ltyp = j;
    this.mode = 0;
    this.relax = k;
    this.runn = l;
    this.liftup = i1;
    if (j1 === 1) {
      this.dracs = true;
    }
    else {
      this.dracs = false;
    }
    let k2 = 0;
    do {
      this.lstage[k2] = 0;
    } while (++k2 < 20);
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

  myway(aconto, ai, i, j, k, l, i1) {
    const flag = false;
    for (let k2 = 0; k2 < i; ++k2) {
      if (ai[k2] !== j) {
        let l2 = Math.imul(idiv(aconto[ai[k2]].maxR, 20), idiv(aconto[ai[k2]].maxR, 20));
        if (l2 < 5000) {
          l2 = 5000;
        }
        const j2 = i32(i32(Math.imul(idiv(aconto[ai[k2]].x - k, 10), idiv(aconto[ai[k2]].x - k, 10)) + Math.imul(idiv(aconto[ai[k2]].y - l, 10), idiv(aconto[ai[k2]].y - l, 10))) + Math.imul(idiv(aconto[ai[k2]].z - i1, 10), idiv(aconto[ai[k2]].z - i1, 10)));
        if (j2 > 0 && j2 < l2 && !aconto[ai[k2]].exp && aconto[ai[k2]].maxR > 75) {
          return true;
        }
      }
    }
    return false;
  }

  dl(g) {
    let i = 0;
    do {
      if (this.lstage[i] !== 0) {
        this.lsr.d(g, this.ltyp, this.lx[i], this.ly[i], this.lz[i], this.lxz[i], this.lzy[i], this.lxy[i], this.lhit[i]);
        if (this.lhit[i] === 0) {
          continue;
        }
        if (!this.lsr.m.interpolating) {
          const lhit = this.lhit;
          const n = i;
          ++lhit[n];
          if (this.lhit[i] <= 2) {
            continue;
          }
          this.lstage[i] = 0;
        }
      }
    } while (++i < 20);
  }

  getepy(conto) {
    return i32(i32(Math.imul(idiv(conto.x - this.enx, 100), idiv(conto.x - this.enx, 100)) + Math.imul(idiv(conto.y - this.eny, 100), idiv(conto.y - this.eny, 100))) + Math.imul(idiv(conto.z - this.enz, 100), idiv(conto.z - this.enz, 100)));
  }
}
