// Transpiled from decompilation/java-src/userCraft.java
//
// Compound assignment classification per TRANSPILE_SPEC §2:
//
// Site 1 — Line 60 in preform():
//   conto.zy -= (int)((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy));
//   Bytecode:
//     66: getfield ContO.zy:I
//     ...
//     96: f2i
//     97: isub
//     98: putfield ContO.zy:I
//   LHS not widened (no i2f after getfield). RHS evaluated to float, converted to int with f2i, then isub.
//   CASE B. Confidence: HIGH. Discriminating shape: positive angle, negative fractional step.
//   Correct JS: `conto.zy -= trunc(fr((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy)))`
//
// Site 2 — Line 61 in preform():
//   conto.xz += (int)(byte0 * (2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy));
//   Bytecode:
//     103: getfield ContO.xz:I
//     ...
//     136: f2i
//     137: iadd
//     138: putfield ContO.xz:I
//   LHS not widened (no i2f after getfield). RHS evaluated to float, f2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.xz += trunc(fr(Math.imul(byte0, 2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy)))`
//
// Site 3 — Line 64 in preform():
//   conto.zy += (int)((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy));
//   Bytecode:
//     162: getfield ContO.zy:I
//     ...
//     190: f2i
//     191: iadd
//     192: putfield ContO.zy:I
//   LHS not widened. RHS f2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.zy += trunc(fr((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy)))`
//
// Site 4 — Line 65 in preform():
//   conto.xz -= (int)(byte0 * (2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy));
//   Bytecode:
//     183: getfield ContO.xz:I
//     ...
//     201: f2i
//     202: isub
//     203: putfield ContO.xz:I
//   LHS not widened. RHS f2i, then isub.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.xz -= trunc(fr(Math.imul(byte0, 2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy)))`
//
// Site 5 — Line 107 in preform():
//   conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
//   Bytecode:
//     589: getfield ContO.zy:I
//     ...
//     609: f2i
//     610: iadd
//     611: putfield ContO.zy:I
//   LHS not widened. RHS f2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.zy += trunc(fr(5.0 * conto.m.cs.getcos(conto.xy)))`
//
// Site 6 — Line 142 in preform():
//   conto.y -= (int)this.lift;
//   Bytecode:
//     931: getfield ContO.y:I
//     935: getfield lift:D
//     938: d2i
//     939: isub
//     940: putfield ContO.y:I
//   LHS not widened. RHS d2i, then isub.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.y -= trunc(this.lift)`
//
// Site 7 — Line 217 in preform():
//   conto.xz += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
//   Bytecode:
//     1377: getfield ContO.xz:I
//     ...
//     1401: d2i
//     1402: iadd
//     1403: putfield ContO.xz:I
//   LHS not widened. RHS d2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.xz += trunc(random() * (this.speed / 10.0) - (this.speed / 20.0))`
//
// Site 8 — Line 218 in preform():
//   conto.zy += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
//   Bytecode:
//     1408: getfield ContO.zy:I
//     ...
//     1432: d2i
//     1433: iadd
//     1434: putfield ContO.zy:I
//   LHS not widened. RHS d2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.zy += trunc(random() * (this.speed / 10.0) - (this.speed / 20.0))`
//
// Site 9 — Line 309 in preform():
//   lx[n] -= (int)(this.lspeed[j3] * (conto.m.cs.getsin(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3])));
//   Bytecode:
//     2242: iaload
//     ...
//     2287: f2i
//     2288: isub
//     2289: iastore
//   LHS not widened. RHS f2i, then isub.
//   CASE B. Confidence: HIGH.
//   Correct JS: `lx[n] -= trunc(fr(this.lspeed[j3] * fr(conto.m.cs.getsin(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3]))))`
//
// Site 10 — Line 312 in preform():
//   lz[n2] += (int)(this.lspeed[j3] * (conto.m.cs.getcos(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3])));
//   Bytecode:
//     2274: iaload
//     ...
//     2294: f2i
//     2295: iadd
//     2296: iastore
//   LHS not widened. RHS f2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `lz[n2] += trunc(fr(this.lspeed[j3] * fr(conto.m.cs.getcos(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3]))))`
//
// Site 11 — Line 315 in preform():
//   ly[n3] -= (int)(this.lspeed[j3] * conto.m.cs.getsin(this.lzy[j3]));
//   Bytecode:
//     2305: iaload
//     ...
//     2317: f2i
//     2318: isub
//     2319: iastore
//   LHS not widened. RHS f2i, then isub.
//   CASE B. Confidence: HIGH.
//   Correct JS: `ly[n3] -= trunc(fr(this.lspeed[j3] * conto.m.cs.getsin(this.lzy[j3])))`
//
// Site 12 — Line 334 in preform():
//   conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
//   Bytecode:
//     2460: getfield ContO.x:I
//     ...
//     2497: f2i
//     2498: isub
//     2499: putfield ContO.x:I
//   LHS not widened. RHS f2i, then isub.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.x -= trunc(fr(this.speed * fr(conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy))))`
//
// Site 13 — Line 335 in preform():
//   conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
//   Bytecode:
//     2504: getfield ContO.z:I
//     ...
//     2541: f2i
//     2542: iadd
//     2543: putfield ContO.z:I
//   LHS not widened. RHS f2i, then iadd.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.z += trunc(fr(this.speed * fr(conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy))))`
//
// Site 14 — Line 336 in preform():
//   conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
//   Bytecode:
//     2548: getfield ContO.y:I
//     ...
//     2570: f2i
//     2571: isub
//     2572: putfield ContO.y:I
//   LHS not widened. RHS f2i, then isub.
//   CASE B. Confidence: HIGH.
//   Correct JS: `conto.y -= trunc(fr(this.speed * conto.m.cs.getsin(conto.zy)))`

import { idiv, i32, trunc, fr, intArray, random } from './java.js';
import { Lasers } from './Lasers.js';

export class userCraft {
  constructor(medium) {
    this.maxspeed = intArray([120, 100, 90, 80, 76]);
    this.elev = intArray([1, 2, 1, 1, 1]);
    this.trnn = intArray([0, 0, 1, 2, 1]);
    this.dnjm = intArray([7, 5, 4, 3, 4]);
    this.name = ["E-7 Sky Bullet", "BP-6 Hammer Head", "E-9 Dragon Bird", "EXA-1 Destroyer", "Silver F-51 Legend"];
    this.rspeed = 0;
    this.speed = 0.0;
    this.rlift = 0;
    this.lift = 0.0;
    this.pexp = false;
    this.ltyp = 0;
    this.njumps = 0;
    this.ester = 0;
    this.lx = intArray(20);
    this.ly = intArray(20);
    this.lz = intArray(20);
    this.lxz = intArray(20);
    this.lzy = intArray(20);
    this.lxy = intArray(20);
    this.lstage = intArray(20);
    this.lspeed = intArray(20);
    this.lhit = intArray(20);
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

  preform(control, conto, aconto, ai, i) {
    let j;
    for (j = Math.abs(conto.zy); j > 360; j -= 360) {}
    let byte0 = 1;
    if (j > 90 && j < 270) {
      byte0 = -1;
    }
    if (conto.y < 207) {
      if (control.up) {
        conto.zy -= trunc(fr((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy)));
        conto.xz += trunc(fr(Math.imul(byte0, 2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy)));
      }
      if (control.down) {
        conto.zy += trunc(fr((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy)));
        conto.xz -= trunc(fr(Math.imul(byte0, 2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy)));
      }
    } else {
      let k;
      for (k = Math.abs(conto.zy); k > 90; k -= 180) {}
      let i2;
      for (i2 = Math.abs(conto.xy); i2 > 90; i2 -= 180) {}
      let k2;
      for (k2 = Math.abs(conto.zy); k2 > 270; k2 -= 360) {}
      let i3;
      for (i3 = Math.abs(conto.xy); i3 > 270; i3 -= 360) {}
      const flag = (Math.abs(k2) < 90 && Math.abs(i3) < 90) || (Math.abs(k2) > 90 && Math.abs(i3) > 90);
      const flag2 = Math.abs(k) > 30 || Math.abs(i2) > 30;
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
      } else {
        conto.xy = 0;
      }
      let l3;
      for (l3 = conto.zy; l3 > 90; l3 -= 180) {}
      while (l3 < -90) {
        l3 += 180;
      }
      if (l3 > 0) {
        --conto.zy;
        this.smoke = true;
      }
      if (l3 < 0) {
        ++conto.zy;
        this.smoke = true;
      }
      if (this.speed > 10.0 && control.down) {
        conto.zy += trunc(fr(5.0 * conto.m.cs.getcos(conto.xy)));
      }
    }
    if (control.left) {
      if (conto.y < 207) {
        conto.xy -= 10;
      } else {
        conto.xz += 2;
      }
    }
    if (control.right) {
      if (conto.y < 207) {
        conto.xy += 10;
      } else {
        conto.xz -= 2;
      }
    }
    const m = trunc(fr(Math.imul(byte0, 3 + this.trnn[this.ltyp]) * conto.m.cs.getsin(conto.xy)));
    conto.xz -= m;
    this.rlift = trunc(fr(this.speed * fr(conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy)))) - 40;
    if (this.lift < this.rlift) {
      this.lift += 0.5;
    }
    if (this.lift > this.rlift) {
      this.lift -= 0.5;
    }
    if (this.lift < -(50.0 - fr(this.speed / 2.0))) {
      this.lift = -(50.0 - fr(this.speed / 2.0));
    }
    const j2 = trunc(fr(5.0 * fr(conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy))));
    if (this.lift > j2) {
      this.lift = j2;
    }
    conto.y -= trunc(this.lift);
    if (conto.x < -40000) {
      conto.x = -40000;
      if (m <= 0) {
        conto.xz += 5;
      } else {
        conto.xz -= 5;
      }
    }
    if (conto.x > 40000) {
      conto.x = 40000;
      if (m <= 0) {
        conto.xz += 5;
      } else {
        conto.xz -= 5;
      }
    }
    if (conto.z > 40000) {
      conto.z = 40000;
      if (m <= 0) {
        conto.xz += 5;
      } else {
        conto.xz -= 5;
      }
    }
    if (conto.z < -40000) {
      conto.z = -40000;
      if (m <= 0) {
        conto.xz += 5;
      } else {
        conto.xz -= 5;
      }
    }
    if (!this.pexp && conto.exp) {
      if (this.speed > 40.0) {
        this.speed = -15.0;
        this.pexp = true;
      } else if (conto.nhits > conto.maxhits) {
        this.pexp = true;
      } else {
        conto.exp = false;
        this.speed = -fr(fr(this.rspeed + this.speed) / 2.0);
      }
    }
    if (this.pexp) {
      if (this.speed > 0.0) {
        this.speed = fr(this.speed - 0.3);
      }
      if (this.speed < 0.0) {
        this.speed = fr(this.speed + 0.3);
      }
    } else {
      if (this.speed > this.rspeed) {
        if (this.speed > this.maxspeed[this.ltyp]) {
          this.speed = fr(this.speed - fr(fr(this.speed - this.rspeed) / 20.0));
        } else {
          this.speed = fr(this.speed - 0.5);
        }
      }
      if (this.speed < this.rspeed) {
        this.speed = fr(this.speed + 1.0);
      }
    }
    if (conto.nhits > conto.maxhits - idiv(conto.maxhits, 6) && !conto.exp) {
      if (this.speed > 60.0) {
        this.speed = 60.0;
      }
      conto.xz += trunc(random() * (this.speed / 10.0) - this.speed / 20.0);
      conto.zy += trunc(random() * (this.speed / 10.0) - this.speed / 20.0);
    }
    if (control.plus && this.rspeed < this.maxspeed[this.ltyp]) {
      this.rspeed += 2;
    }
    if (control.mins && this.rspeed > 0) {
      this.rspeed -= 2;
    }
    if (control.jump !== 0 && this.njumps !== 0) {
      if (control.jump === 1) {
        this.speed = 400.0;
        control.jump = 2;
        conto.m.jumping = 5;
      }
      if (conto.m.jumping === 0) {
        this.speed = 800.0;
        control.jump = 0;
        --this.njumps;
      }
    }
    if (control.fire && !conto.exp) {
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
        ++this.nl;
        if (this.nl === 20) {
          this.nl = 0;
        }
        this.skip = false;
      } else if (!this.skip) {
        this.skip = true;
      }
      ++this.bulkc;
      if (this.bulkc > 12) {
        this.bulkc = 0;
      }
    }
    let l4 = 0;
    let j3 = 0;
    do {
      if (this.lstage[j3] !== 0) {
        ++l4;
        if (this.ly[j3] > 240 && this.lhit[j3] === 0) {
          this.lhit[j3] = 1;
        }
        if (this.lhit[j3] !== 0) {
          continue;
        }
        if (this.lstage[j3] > 10) {
          let k3 = 22500;
          let l5 = -1;
          for (let j4 = 1; j4 < i; ++j4) {
            const i5 = this.getpy(aconto[ai[j4]].x, aconto[ai[j4]].y, aconto[ai[j4]].z, j3);
            if (i5 < k3 && i5 > 0 && !aconto[ai[j4]].exp) {
              k3 = i5;
              l5 = j4;
            }
          }
          if (l5 !== -1) {
            if (this.lspeed[j3] > 230) {
              this.lspeed[j3] = 230;
            }
            const k4 = aconto[ai[l5]].x;
            const j5 = aconto[ai[l5]].z;
            const k5 = aconto[ai[l5]].y;
            let c = 0;
            if (k4 - this.lx[j3] > 0) {
              c = 180;
            }
            this.lxz[j3] = trunc(90 + c + Math.atan((j5 - this.lz[j3]) / (k4 - this.lx[j3])) / 0.017453292519943295);
            c = 0;
            if (k5 - this.ly[j3] < 0) {
              c = 65356;
            }
            const l6 = trunc(Math.sqrt(i32(Math.imul(j5 - this.lz[j3], j5 - this.lz[j3]) + Math.imul(k4 - this.lx[j3], k4 - this.lx[j3]))));
            this.lzy[j3] = -trunc(90 + c - Math.atan(l6 / (k5 - this.ly[j3])) / 0.017453292519943295);
          }
        }
        const lx = this.lx;
        const n = j3;
        lx[n] -= trunc(fr(this.lspeed[j3] * fr(conto.m.cs.getsin(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3]))));
        const lz = this.lz;
        const n2 = j3;
        lz[n2] += trunc(fr(this.lspeed[j3] * fr(conto.m.cs.getcos(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3]))));
        const ly = this.ly;
        const n3 = j3;
        ly[n3] -= trunc(fr(this.lspeed[j3] * conto.m.cs.getsin(this.lzy[j3])));
        const lstage = this.lstage;
        const n4 = j3;
        ++lstage[n4];
        if (this.lstage[j3] <= 80) {
          continue;
        }
        this.lstage[j3] = 0;
      }
    } while (++j3 < 20);
    if (l4 !== 0) {
      if (!conto.fire) {
        conto.fire = true;
      }
    } else if (conto.fire) {
      conto.fire = false;
      this.bulkc = 0;
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
    if (this.ester === 0) {
      if (conto.x > 2800 && conto.x < 3200 && conto.z > -2100 && conto.z < -1900 && conto.y > -30) {
        this.ester = 1;
        conto.nhits = 0;
        control.jump = 0;
        this.njumps = this.dnjm[this.ltyp];
      }
    } else {
      if (this.ester < 13) {
        if (this.ltyp === 0) {
          if (conto.m.er === 0) {
            conto.m.er = 1;
          } else {
            conto.m.er = 0;
          }
        }
        if (this.ltyp === 1) {
          if (conto.m.eg === 0) {
            conto.m.eg = 1;
          } else {
            conto.m.eg = 0;
          }
        }
        if (this.ltyp === 2) {
          if (conto.m.eb === 0) {
            conto.m.eb = 1;
          } else {
            conto.m.eb = 0;
          }
        }
        if (this.ltyp === 3) {
          if (conto.m.er === 0) {
            conto.m.er = 1;
            conto.m.eg = 1;
          } else {
            conto.m.er = 0;
            conto.m.eg = 0;
          }
        }
        if (this.ltyp === 4) {
          if (conto.m.eb === 0) {
            conto.m.eb = 1;
            conto.m.eg = 1;
          } else {
            conto.m.eb = 0;
            conto.m.eg = 0;
          }
        }
      }
      if (this.ester === 1) {
        conto.wire = true;
      }
      if (this.ester === 3) {
        conto.wire = false;
      }
      ++this.ester;
      if (this.ester === 45) {
        this.ester = 0;
      }
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
      if (this.smoke && conto.y > 200 && this.sms[this.ns] === -1 && !this.lsr.m.interpolating) {
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

  reset(i) {
    this.rspeed = 0;
    this.speed = 0.0;
    this.rlift = 0;
    this.lift = 0.0;
    this.pexp = false;
    this.ltyp = i;
    this.njumps = this.dnjm[i];
    let j = 0;
    do {
      this.lstage[j] = 0;
    } while (++j < 20);
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
              if (random() > 0.5) {
                conto.nhits += this.lsr.damg[this.ltyp];
              } else {
                conto.nhits += 2;
              }
            }
          }
          if (conto.pcol === 0) {
            continue;
          }
          for (let k = 0; k < conto.npl; ++k) {
            for (let l = 0; l < conto.p[k].n; ++l) {
              if (!conto.hit && i32(i32(Math.imul(i32(this.lx[i] - i32(conto.x + conto.p[k].ox[l])), i32(this.lx[i] - i32(conto.x + conto.p[k].ox[l]))) + Math.imul(i32(this.ly[i] - i32(conto.y + conto.p[k].oy[l])), i32(this.ly[i] - i32(conto.y + conto.p[k].oy[l])))) + Math.imul(i32(this.lz[i] - i32(conto.z + conto.p[k].oz[l])), i32(this.lz[i] - i32(conto.z + conto.p[k].oz[l])))) < Math.imul(idiv(Math.imul(this.lsr.rads[this.ltyp], 10), conto.pcol), idiv(Math.imul(this.lsr.rads[this.ltyp], 10), conto.pcol))) {
                this.lhit[i] = 1;
                if (conto.maxhits !== -1) {
                  conto.hit = true;
                  if (random() > 0.5) {
                    conto.nhits += this.lsr.damg[this.ltyp];
                  } else {
                    conto.nhits += 2;
                  }
                }
              }
            }
          }
        }
      } while (++i < 20);
    }
  }

  getpy(i, j, k, l) {
    const dx = idiv(i - this.lx[l], 10);
    const dy = idiv(j - this.ly[l], 10);
    const dz = idiv(k - this.lz[l], 10);
    return i32(i32(Math.imul(dx, dx) + Math.imul(dy, dy)) + Math.imul(dz, dz));
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
}
