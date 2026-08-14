// Transpiled from decompilation/java-src/xtGraphics.java, line by line.
//
// Local names kept as procyon emitted them.
// No restructuring, renaming, or simplifying.
//
// Numeric conventions used throughout:
//   idiv(a, b)   every Java int / int
//   trunc(x)     every Java (int) cast of a float or double
//   fr(x)        every Java float-typed intermediate; cs.getsin/getcos return
//                float, so any expression mixing them is float32 in Java and
//                drifts without this
//   Math.imul    int multiplies that can exceed 2^31
//   i32(x)       int adds / full expressions that can exceed 2^31
//   intArray(n)  Int32Array for all int[] fields and locals
//   floatArray(n) Float32Array for all float[] fields and locals
//   objArray(n)  null-filled Array for Object[]
//
// PAINTER'S ALGORITHM: drawing calls are in the same order as Java.
// There is no depth buffer. Never reorder or batch fillPolygon/drawPolygon calls.
//
// --- Compound-assignment audit (TRANSPILE_SPEC §2) ---
// Searched for `+= (int)(` and `-= (int)(` in xtGraphics.java: 0 hits.
// All additions/subtractions in xtGraphics are integer operations.

import {
  idiv,
  i32,
  trunc,
  fr,
  intArray,
  objArray,
  random,
  colorOf,
  colorRed,
  colorGreen,
  colorBlue
} from './java.js';
import {
  createImage,
  imageFromPixels,
  grabPixels
} from './graphics.js';

export class xtGraphics {
  constructor(medium, g) {
    this.ws = Int32Array.of(62, 73, 59, 40, 50);
    this.goodsun = false;
    this.cl = 1;
    this.radar = null;
    this.stube = null;
    this.sback = null;
    this.destr = null;
    this.mback = null;
    this.lay = null;
    this.complete = null;
    this.main = null;
    this.rad = null;
    this.inst1 = null;
    this.inst2 = null;
    this.inst3 = null;
    this.mars = null;
    this.text = null;
    this.as = objArray(5);
    this.pix = intArray(180000);
    this.bpix = intArray(180000);
    this.mpix = intArray(180000);
    this.opix = intArray(180000);
    this.ppix = intArray(180000);
    this.cnt = 0;
    this.flik = false;
    this.cnts = 10;
    this.mname = new Array(19).fill(null);
    this.cnte = intArray(19);
    this.cntf = 0;
    this.left = false;
    this.wcnt = 0;
    this.rcnt = 0;
    this.cnty = 0;
    this.fase = -8;
    this.selected = 4;
    this.select = 0;
    this.frst = false;
    this.oldfase = -5;
    this.nb = 0;
    this.ob = intArray(3);
    this.nam = new Array(3).fill(null);
    this.tnk = new Array(3).fill(false);
    this.obx = intArray(3);
    this.oby = intArray(3);
    this.obz = intArray(3);
    this.sgame = -1;
    this.level = 0;
    this.dest = new Array(10).fill(false);
    this.mcomp = false;
    this.tcnt = 1;
    this.m = medium;
    this.ftm = g.getFontMetrics();
  }

  denter(g, i, aconto, usercraft, control) {
    if (this.fase === 4) {
      let j = 0;
      do {
        aconto[j].out = false;
        aconto[j].wire = true;
        aconto[j].x = 0;
        aconto[j].y = 180;
        aconto[j].z = 0;
        aconto[j].xy = 90;
      } while (++j < 5);
      this.m.x = -100;
      this.m.y = 0;
      this.m.ground = 950 - this.m.y;
      this.m.z = -50;
      this.m.xz = -90;
      this.m.zy = 0;
      aconto[0].zy = 0;
      g.setColor(colorOf(255, 255, 0));
      j = 0;
      do {
        g.drawLine(j * 2, 0, j * 2, 360);
      } while (++j < 250);
      if (this.oldfase === 7) {
        this.fase = 7;
        this.oldfase = 0;
        this.cnt = 0;
      } else {
        this.fase = 5;
      }
    }
    if (this.fase === -8) {
      if (this.cnty < 351) {
        g.drawImage(this.mars, 0, 0);
        g.drawImage(this.text, 10, 380 - this.cnty);
        if (this.cnty !== 350) {
          if (!this.m.interpolating) ++this.cnty;
        } else {
          this.drawcs(g, 345, 'Press Enter to continue', 225, 225, 225, true);
          if (!this.m.interpolating) this.cnty = 351;
        }
      }
      if (control.space && !this.m.interpolating) {
        this.fase = -5;
        if (this.sgame === 1) {
          this.select = 1;
        } else {
          this.select = 2;
        }
        control.space = false;
      }
    }
    if (this.fase === -7) {
      g.drawImage(this.inst1, 0, 0);
      this.drawcs(g, 354, 'Press Enter to continue >', 170, 170, 170, false);
      if (control.space && !this.m.interpolating) {
        this.fase = -6;
        control.space = false;
      }
    }
    if (this.fase === -6) {
      g.drawImage(this.inst2, 0, 0);
      this.drawcs(g, 354, 'Press Enter to continue >', 170, 170, 170, false);
      if (control.space && !this.m.interpolating) {
        this.fase = -55;
        control.space = false;
      }
    }
    if (this.fase === -55) {
      g.drawImage(this.inst3, 0, 0);
      this.drawcs(g, 354, 'Press Enter to continue >', 170, 170, 170, false);
      if (control.space && !this.m.interpolating) {
        this.fase = this.oldfase;
        control.space = false;
      }
    }
    if (this.fase === -5) {
      g.drawImage(this.main, 0, 0);
      if (this.cnt < 7) {
        g.drawImage(this.as[this.select], 25, 283);
        g.drawImage(this.as[this.select], 423, 283);
        if (!this.m.interpolating) ++this.cnt;
      } else {
        if (!this.m.interpolating) this.cnt = 0;
      }
      g.setColor(colorOf(225, 230, 255));
      let k = 50 + trunc(random() * 150.0);
      g.drawLine(trunc(random() * 400.0), k, trunc(random() * 200.0), k);
      k = 50 + trunc(random() * 150.0);
      g.drawLine(500 - trunc(random() * 400.0), k, 500 - trunc(random() * 200.0), k);
      if (!this.m.interpolating) {
        if (this.cnts < -900) {
          this.cnts = 0;
          this.cntf = trunc(random() * 150.0);
        } else {
          this.cnts -= 7;
        }
      }
      if (control.space && !this.m.interpolating) {
        this.cnts = 10;
      }
      g.drawImage(this.rad, 500 + this.cnts, 50 + this.cntf);
      this.drawcs(g, 274, 'Start New Game', 0, 0, 0, false);
      if (this.sgame !== 0) {
        this.drawcs(g, 289, 'Resume Saved Game', 0, 0, 0, false);
      } else {
        if (control.space && this.select === 1 && !this.m.interpolating) {
          this.wcnt = 20;
        }
        if (this.wcnt !== 0) {
          this.drawcs(g, 289, 'No Saved Game!', 100, 0, 0, false);
          if (!this.m.interpolating) --this.wcnt;
        } else {
          this.drawcs(g, 289, 'Resume Saved Game', 200, 200, 200, false);
        }
      }
      this.drawcs(g, 304, 'Game Controls', 0, 0, 0, false);
      this.drawcs(g, 319, 'Credits', 0, 0, 0, false);
      this.drawcs(g, 334, 'Exit Game', 0, 0, 0, false);
      if (!this.flik) {
        g.setColor(colorOf(225, 230, 255));
        if (!this.m.interpolating) this.flik = true;
        g.drawLine(250 - this.ws[this.select], 271 + 15 * this.select, 250 + this.ws[this.select], 271 + 15 * this.select);
        g.drawRect(250 - this.ws[this.select], 264 + 15 * this.select, this.ws[this.select] * 2, 11);
        g.setColor(colorOf(0, 0, 0));
        g.drawLine(251 - this.ws[this.select], 271 + 15 * this.select, 255 - this.ws[this.select], 271 + 15 * this.select);
        g.drawLine(245 + this.ws[this.select], 271 + 15 * this.select, 249 + this.ws[this.select], 271 + 15 * this.select);
      } else {
        g.setColor(colorOf(168, 183, 255));
        g.drawRect(250 - this.ws[this.select], 264 + 15 * this.select, this.ws[this.select] * 2, 11);
        if (!this.m.interpolating) this.flik = false;
      }
      if (!this.m.interpolating) {
        if (control.down) {
          ++this.select;
          control.down = false;
        }
        if (control.up) {
          --this.select;
          control.up = false;
        }
        if (this.select === 5) {
          this.select = 0;
        }
        if (this.select === -1) {
          this.select = 4;
        }
        if (control.space) {
          if (this.select === 2) {
            this.fase = -7;
            this.oldfase = -5;
            control.space = false;
          }
          if (this.select === 3) {
            this.fase = 4;
            control.space = false;
          }
        }
      }
      this.drawcs(g, 354, '( use keyboard arrows to select and press Enter )', 170, 170, 170, false);
      if (this.frst && !this.m.interpolating) {
        this.frst = false;
      }
    }
    if (this.fase === -4) {
      if (control.space && !this.m.interpolating) {
        this.fase = -3;
        control.space = false;
      } else {
        let l = 0;
        let j2 = 0;
        for (let k2 = i; k2 < i + 13; ++k2) {
          l += aconto[k2].nhits;
          j2 += aconto[k2].maxhits;
        }
        if (l > j2) {
          l = j2;
        }
        const l2 = trunc(fr(fr(l / j2) * 100.0));
        this.drawcs(g, 30, 'The Mars Station..', 255, 255, 255, true);
        if (l2 < 90 || this.flik) {
          this.drawcs(g, 60, 'Damage status:  ' + l2 + '%', 0, 0, 0, false);
          if (!this.m.interpolating) this.flik = false;
        } else {
          this.drawcs(g, 60, 'Damage status:  ' + l2 + '%', 255, 0, 0, false);
          if (!this.m.interpolating) this.flik = true;
        }
        if (!this.frst) {
          this.drawcs(g, 340, 'Press Enter to continue', 255, 255, 255, false);
        } else {
          this.drawcs(g, 300, 'Mission ' + this.level + ' completed, do you wish to save game here?', 255, 255, 255, false);
          if (this.select === 0) {
            g.setColor(colorOf(255, 255, 255));
            g.fillRect(220, 319, 29, 14);
            g.setColor(colorOf(192, 192, 192));
            g.drawRect(220, 319, 29, 14);
          }
          if (this.select !== 0) {
            g.setColor(colorOf(255, 255, 255));
            g.fillRect(256, 319, 22, 14);
            g.setColor(colorOf(192, 192, 192));
            g.drawRect(256, 319, 22, 14);
          }
          if (!this.m.interpolating && (control.up || control.down || control.left || control.right)) {
            if (this.select === 0) {
              this.select = 1;
            } else {
              this.select = 0;
            }
            control.up = false;
            control.down = false;
            control.left = false;
            control.right = false;
          }
          this.drawcs(g, 330, 'Yes     No', 0, 0, 0, false);
        }
      }
    }
    if (this.fase === -3) {
      g.setColor(colorOf(225, 230, 255));
      g.drawRect(1, 1, 497, 357);
      this.drawcs(g, 180, 'Loading Mission ' + (this.level + 1) + ' ...', 225, 230, 255, true);
    }
    if (this.fase === -2) {
      this.rcnt = 0;
      let i2 = 0;
      do {
        aconto[i2].reset();
        aconto[i2].out = false;
        aconto[i2].x = Math.imul(i2 - this.selected, 500);
        aconto[i2].y = 180;
        aconto[i2].z = 0;
      } while (++i2 < 5);
      this.m.x = -this.m.cx;
      this.m.y = 0;
      this.m.ground = 250 - this.m.y;
      this.m.z = -620;
      this.m.xz = 0;
      this.m.zy = 0;
      aconto[0].zy = 15;
      aconto[0].xy = -15;
      aconto[2].xy = -30;
      aconto[3].zy = -15;
      aconto[1].zy = 30;
      for (let j3 = 0; j3 < this.nb; ++j3) {
        this.obx[j3] = aconto[this.ob[j3]].x;
        this.oby[j3] = aconto[this.ob[j3]].y;
        this.obz[j3] = aconto[this.ob[j3]].z;
        aconto[this.ob[j3]].x = -525;
        if (this.tnk[j3]) {
          aconto[this.ob[j3]].y = 95 + 305 * j3;
          aconto[this.ob[j3]].zy = 0;
        } else {
          aconto[this.ob[j3]].y = 55 + 305 * j3;
          aconto[this.ob[j3]].zy = 20;
        }
        aconto[this.ob[j3]].z = 1000;
        aconto[this.ob[j3]].xy = 0;
        aconto[this.ob[j3]].xz = trunc(random() * 270.0);
        aconto[this.ob[j3]].out = false;
      }
      this.cmback(this.nb);
      this.fase = -1;
    }
    if (this.fase === 0) {
      if (!this.dest[this.selected]) {
        if (this.wcnt < 5) {
          aconto[this.selected].wire = true;
        } else {
          aconto[this.selected].wire = false;
        }
        if (!this.m.interpolating) {
          if (this.wcnt > 9) {
            this.wcnt = 0;
          } else {
            ++this.wcnt;
          }
        }
      }
      if (this.rcnt === 0) {
        if (!this.m.interpolating) {
          if (control.left) {
            this.left = true;
            this.rcnt = 1;
          }
          if (control.right) {
            this.left = false;
            this.rcnt = 1;
          }
        }
      } else {
        if (!this.m.interpolating) {
          let k3 = 0;
          do {
            if (aconto[k3].x === 2000) {
              aconto[k3].x = -500;
            }
            if (aconto[k3].x === -2000) {
              aconto[k3].x = 500;
            }
            if (this.left) {
              const contO = aconto[k3];
              contO.x -= 100;
            } else {
              const contO2 = aconto[k3];
              contO2.x += 100;
            }
          } while (++k3 < 5);
          aconto[this.selected].wire = false;
          ++this.rcnt;
          if (this.rcnt === 6) {
            this.wcnt = 7;
            this.rcnt = 0;
            if (this.left) {
              if (this.selected !== 4) {
                ++this.selected;
              } else {
                this.selected = 0;
              }
            } else if (this.selected !== 0) {
              --this.selected;
            } else {
              this.selected = 4;
            }
            aconto[this.selected].hit = true;
            aconto[this.selected].nhits = 0;
          }
        }
      }
      if (control.space) {
        aconto[this.selected].wire = false;
      }
      g.drawImage(this.sback, 0, 0);
      let l3 = 0;
      do {
        aconto[l3].d(g);
        if (!this.m.interpolating) {
          const contO3 = aconto[l3];
          contO3.xz += 2;
        }
      } while (++l3 < 5);
      if (this.dest[this.selected] && this.rcnt === 0) {
        g.drawImage(this.destr, 117, 103);
      }
      this.drawcs(g, 16, 'Select your Ship', 255, 255, 255, false);
      this.drawcs(g, 354, '( use keyboard arrows to select )', 150, 150, 160, false);
      this.drawcs(g, 265, usercraft.name[this.selected], 190, 200, 255, false);
      if (control.space && this.dest[this.selected]) {
        this.drawcs(g, 80, 'Cannot Select Ship!', 255, 230, 230, true);
      }
      const ai = intArray(3);
      const ai2 = intArray(3);
      g.setColor(colorOf(100, 100, 100));
      if (this.rcnt === 1 && this.left) {
        g.setColor(colorOf(225, 225, 225));
      }
      ai[0] = 50;
      ai2[0] = 255;
      ai[1] = 75;
      ai2[1] = 250;
      ai[2] = 75;
      ai2[2] = 260;
      g.fillPolygon(ai, ai2, 3);
      g.setColor(colorOf(100, 100, 100));
      if (this.rcnt === 1 && !this.left) {
        g.setColor(colorOf(225, 225, 225));
      }
      ai[0] = 450;
      ai2[0] = 255;
      ai[1] = 425;
      ai2[1] = 250;
      ai[2] = 425;
      ai2[2] = 260;
      g.fillPolygon(ai, ai2, 3);
      g.setColor(colorOf(225, 225, 255));
      g.drawString('Max Speed', 57, 300);
      g.setColor(colorOf(190, 200, 255));
      g.fillRect(125, 295, trunc(fr(100.0 * fr(usercraft.maxspeed[this.selected] / 120.0))), 4);
      g.setColor(colorOf(225, 225, 255));
      g.drawString(' Fire Power', 57, 315);
      g.setColor(colorOf(190, 200, 255));
      g.fillRect(125, 310, trunc(fr(100.0 * fr(fr(usercraft.lsr.damg[this.selected] + 2) / 6.0))), 4);
      g.setColor(colorOf(225, 225, 255));
      g.drawString('  Tolerance', 57, 330);
      g.setColor(colorOf(190, 200, 255));
      g.fillRect(125, 325, trunc(fr(100.0 * fr(aconto[this.selected].maxhits / 300.0))), 4);
      g.setColor(colorOf(225, 225, 255));
      g.drawString('       Turning', 285, 300);
      g.setColor(colorOf(190, 200, 255));
      g.fillRect(355, 295, trunc(fr(100.0 * fr(fr(usercraft.trnn[this.selected] + 3) / 5.0))), 4);
      g.setColor(colorOf(225, 225, 255));
      g.drawString('     Elevation', 285, 315);
      g.setColor(colorOf(190, 200, 255));
      g.fillRect(355, 310, trunc(fr(100.0 * fr(fr(usercraft.elev[this.selected] + 3) / 5.0))), 4);
      g.setColor(colorOf(225, 225, 255));
      g.drawString('Light Speed Jumps:  ' + usercraft.dnjm[this.selected], 285, 330);
    }
    if (this.fase === -1) {
      g.drawImage(this.mback, 0, 0);
      if (this.level === 15) {
        this.drawcs(g, 30, 'Final Mission !', 255, 255, 255, true);
      } else {
        this.drawcs(g, 30, 'Mission ' + (this.level + 1), 255, 255, 255, true);
      }
      this.drawcs(g, 60, 'Incoming Enemies:', 240, 240, 220, false);
      for (let i3 = 0; i3 < this.nb; ++i3) {
        g.drawImage(this.lay, 79, 90 + 80 * i3);
        aconto[this.ob[i3]].d(g);
        if (!this.m.interpolating) {
          const contO4 = aconto[this.ob[i3]];
          contO4.xz += 7 + i3;
        }
        this.drawcs(g, 125 + 80 * i3, this.nam[i3], 0, 0, 0, false);
      }
      if (this.nb === 0) {
        this.drawcs(g, 180, '- Error loading mission ' + (this.level + 1) + ' -', 255, 255, 255, false);
        this.drawcs(g, 200, 'Connection Error!', 255, 255, 255, false);
        this.drawcs(g, 280, 'Click screen or Press Enter to continue >', 180, 180, 150, true);
      } else if (this.goodsun) {
        if (this.flik) {
          this.drawcs(g, 110 + 80 * this.nb, 'Click Screen to Continue >', 180, 180, 150, true);
          if (!this.m.interpolating) this.flik = false;
        } else {
          this.drawcs(g, 110 + 80 * this.nb, 'Click Screen to Continue >', 255, 255, 240, true);
          if (!this.m.interpolating) this.flik = true;
        }
      } else {
        this.drawcs(g, 110 + 80 * this.nb, 'Click screen or Press Enter to continue >', 180, 180, 150, true);
      }
      if (!control.canclick && !this.m.interpolating) {
        control.canclick = true;
      }
      if (control.space && !this.m.interpolating) {
        control.canclick = false;
        if (this.nb !== 0) {
          for (let j4 = 0; j4 < this.nb; ++j4) {
            aconto[this.ob[j4]].x = this.obx[j4];
            aconto[this.ob[j4]].y = this.oby[j4];
            aconto[this.ob[j4]].z = this.obz[j4];
          }
          this.fase = 0;
        } else {
          this.fase = -5;
          if (this.sgame === 1) {
            this.select = 1;
          } else {
            this.select = 0;
          }
        }
        control.space = false;
      }
    }
    if (this.fase === 1) {
      g.drawImage(this.mback, 0, 0);
      if (this.frst && !this.m.interpolating) {
        this.frst = false;
      }
      if (control.space && !this.m.interpolating) {
        this.fase = -3;
        control.space = false;
        this.drawcs(g, 230, 'Loading Mission ' + (this.level + 1) + ' again...', 255, 255, 255, true);
      } else {
        if (!control.jade) {
          this.drawcs(g, 250, "Don't forget to press the  [J]  key to escape lasers...", 225, 225, 225, false);
        }
        this.drawcs(g, 300, 'Press Enter to continue', 225, 225, 225, false);
      }
    }
    if (this.fase === 2) {
      g.drawImage(this.mback, 0, 0);
      if (this.alldest()) {
        this.drawcs(g, 180, 'All your ships were destroyed!', 255, 255, 255, true);
      } else {
        this.drawcs(g, 180, 'The mars station was destroyed!', 255, 255, 255, true);
      }
      this.drawcs(g, 320, 'Press Enter to continue', 225, 225, 225, true);
      if (control.space && !this.m.interpolating) {
        this.fase = -5;
        if (this.alldest() && this.sgame === 1) {
          this.select = 1;
        } else {
          this.select = 0;
        }
        control.space = false;
      }
    }
    if (this.fase === 3) {
      g.drawImage(this.mback, 0, 0);
      this.drawcs(g, 163, 'Resume Game', 255, 255, 255, false);
      this.drawcs(g, 183, 'Game Controls', 255, 255, 255, false);
      this.drawcs(g, 203, 'Quit Game', 255, 255, 255, false);
      if (this.flik) {
        g.setColor(colorOf(255, 0, 0));
        if (!this.m.interpolating) this.flik = false;
      } else {
        g.setColor(colorOf(0, 128, 255));
        if (!this.m.interpolating) this.flik = true;
      }
      g.drawRect(190, 153 + this.select * 20, 120, 11);
      if (!this.m.interpolating) {
        if (control.down) {
          ++this.select;
          control.down = false;
        }
        if (control.up) {
          --this.select;
          control.up = false;
        }
        if (this.select === 3) {
          this.select = 0;
        }
        if (this.select === -1) {
          this.select = 2;
        }
        if (control.space) {
          if (this.select === 1) {
            this.fase = -7;
            this.oldfase = 3;
            control.space = false;
          }
          if (this.select === 2) {
            this.fase = -5;
            if (this.sgame === 1) {
              this.select = 1;
            } else {
              this.select = 0;
            }
            control.space = false;
          }
        }
      }
      this.drawcs(g, 354, '( use keyboard arrows to select )', 210, 210, 210, false);
    }
    if (this.fase === 5 || this.fase === 6 || this.fase === 7) {
      g.setColor(colorOf(255, 255, 255));
      g.fillRect(80, 60, 340, 190);
      aconto[trunc(random() * 5.0)].d(g);
      if (!this.m.interpolating) {
        let k4 = 0;
        do {
          const contO5 = aconto[k4];
          contO5.zy += 5;
          const contO6 = aconto[k4];
          --contO6.xy;
        } while (++k4 < 5);
        if (aconto[0].zy === 360) {
          aconto[0].zy = 0;
          g.setColor(colorOf(255, 255, 0));
          let l4 = 0;
          do {
            g.drawLine(l4 * 2, 0, l4 * 2, 360);
          } while (++l4 < 250);
        }
      }
      g.drawImage(this.rad, 93, 32);
      if (this.fase === 5) {
        this.drawcs(g, 74, 'Wild Polygons 3D engine by:', 0, 0, 0, false);
        this.drawcs(g, 86, 'Omar Waly', 100, 100, 100, false);
        this.drawcs(g, 104, '3D models by:', 0, 0, 0, false);
        this.drawcs(g, 116, 'Omar Waly', 100, 100, 100, false);
        this.drawcs(g, 134, 'Game programming by:', 0, 0, 0, false);
        this.drawcs(g, 146, 'Omar Waly', 100, 100, 100, false);
        this.drawcs(g, 164, 'Graphics by:', 0, 0, 0, false);
        this.drawcs(g, 176, 'Omar Waly', 100, 100, 100, false);
        this.drawcs(g, 190, 'This version of the game was updated and is maintained by:', 0, 0, 0, false);
        this.drawcs(g, 202, 'Jaroslav Paska (Phyrexian)', 100, 100, 100, false);
        this.drawcs(g, 220, 'Web port:', 100, 100, 100, false);
        this.drawcs(g, 232, 'Evidlo', 0, 0, 0, false);
      }
      if (this.fase === 6) {
        this.drawcs(g, 80, 'Music was obtained from FlashKit.com', 0, 0, 0, false);
        this.drawcs(g, 92, 'and by the following artists:', 0, 0, 0, false);
        this.drawcs(g, 118, '.::Dj Hemp::.', 100, 100, 100, false);
        this.drawcs(g, 130, 'Gen A Dee', 100, 100, 100, false);
        this.drawcs(g, 142, 'Alex Volkmar', 100, 100, 100, false);
        this.drawcs(g, 154, 'Empty', 100, 100, 100, false);
        this.drawcs(g, 166, '[BoD]Raven', 100, 100, 100, false);
        this.drawcs(g, 178, 'Jeff Heysen', 100, 100, 100, false);
        this.drawcs(g, 190, 'Degz', 100, 100, 100, false);
        this.drawcs(g, 202, 'Justin Perkins', 100, 100, 100, false);
        this.drawcs(g, 214, 'and Vika', 100, 100, 100, false);
      }
      if (this.fase === 7) {
        if (this.flik) {
          this.drawcs(g, 140, 'G a m e   C o m p l e t e !', 255, 0, 0, false);
          if (!this.m.interpolating) this.flik = false;
        } else {
          this.drawcs(g, 140, 'G a m e   C o m p l e t e !', 0, 128, 255, true);
          if (!this.m.interpolating) this.flik = true;
        }
        this.drawcs(g, 180, '>  Press Enter to continue  >', 150, 150, 150, false);
        if (!this.m.interpolating) {
          ++this.cnt;
          if (this.cnt > 140) {
            control.space = true;
          }
        }
      } else {
        this.drawcs(g, 246, 'Press Enter to continue >', 150, 150, 150, false);
      }
      this.drawcs(g, 354, 'Copyright © RadicalPlay.com', 255, 255, 255, true);
      if (control.space && this.fase !== 7 && !this.m.interpolating) {
        if (this.fase === 5) {
          this.fase = 6;
        } else {
          let i4 = 0;
          do {
            aconto[i4].out = true;
            aconto[i4].wire = false;
          } while (++i4 < 5);
          this.fase = -5;
        }
        control.space = false;
      }
    }
  }

  drawefimg(image) {
    this.saveit(image, this.pix);
    let i = 0;
    do {
      const color_r = colorRed(this.pix[i]);
      const color_g = colorGreen(this.pix[i]);
      const color_b = colorBlue(this.pix[i]);
      const color2_r = colorRed(this.bpix[i]);
      const color2_g = colorGreen(this.bpix[i]);
      const color2_b = colorBlue(this.bpix[i]);
      let j = idiv(color_r + color2_r, 2);
      if (j > 225) {
        j = 225;
      }
      if (j < 0) {
        j = 0;
      }
      let k = idiv(color_g + color2_g, 2);
      if (k > 225) {
        k = 225;
      }
      if (k < 0) {
        k = 0;
      }
      let l = idiv(color_b + color2_b, 2);
      if (l > 225) {
        l = 225;
      }
      if (l < 0) {
        l = 0;
      }
      this.pix[i] = colorOf(j, k, l);
    } while (++i < 180000);
    this.mback = imageFromPixels(500, 360, this.pix);
  }

  alldest() {
    let i = 0;
    let j = 0;
    do {
      if (this.dest[j]) {
        ++i;
      }
    } while (++j < 5);
    return i === 5;
  }

  drawpimg(image) {
    this.saveit(image, this.pix);
    let i = 0;
    do {
      let j = 0;
      do {
        const color_r = colorRed(this.pix[i + j * 500]);
        const color_g = colorGreen(this.pix[i + j * 500]);
        const color_b = colorBlue(this.pix[i + j * 500]);
        const color2_r = colorRed(this.ppix[i + j * 500]);
        const color2_g = colorGreen(this.ppix[i + j * 500]);
        const color2_b = colorBlue(this.ppix[i + j * 500]);
        let k = 0;
        let l = 0;
        let i2 = 0;
        if (i > 150 && i < 350 && j > 130 && j < 230) {
          k = idiv(color_r + color2_r, 4);
          if (k > 225) {
            k = 225;
          }
          if (k < 0) {
            k = 0;
          }
          l = idiv(color_g + color2_g, 4);
          if (l > 225) {
            l = 225;
          }
          if (l < 0) {
            l = 0;
          }
          i2 = idiv(color_b + color2_b, 4);
          if (i2 > 225) {
            i2 = 225;
          }
          if (i2 < 0) {
            i2 = 0;
          }
        } else {
          k = idiv(color_r + color2_r, 2);
          if (k > 225) {
            k = 225;
          }
          if (k < 0) {
            k = 0;
          }
          l = idiv(color_g + color2_g, 2);
          if (l > 225) {
            l = 225;
          }
          if (l < 0) {
            l = 0;
          }
          i2 = idiv(color_b + color2_b, 2);
          if (i2 > 225) {
            i2 = 225;
          }
          if (i2 < 0) {
            i2 = 0;
          }
        }
        this.pix[i + j * 500] = colorOf(k, l, i2);
      } while (++j < 360);
    } while (++i < 500);
    this.mback = imageFromPixels(500, 360, this.pix);
  }

  ys(i, j) {
    if (j < 10) {
      j = 10;
    }
    return i32(idiv(Math.imul(j - this.m.focus_point, this.m.cy - i), j) + i);
  }

  reset() {
    let i = 0;
    do {
      this.dest[i] = false;
    } while (++i < 5);
    this.level = 0;
  }

  creset() {
    this.cnt = 0;
    this.flik = false;
    this.cnts = 10;
    this.cntf = 0;
    this.left = false;
    this.wcnt = 0;
    this.rcnt = 0;
    this.cnty = 0;
  }

  saveit(image, ai) {
    grabPixels(image, ai, 500, 360);
  }

  xs(i, j) {
    if (j < 10) {
      j = 10;
    }
    return i32(idiv(Math.imul(j - this.m.focus_point, this.m.cx - i), j) + i);
  }

  getcpy(conto, conto1) {
    const dx = idiv(conto.x - conto1.x, 100);
    const dy = idiv(conto.y - conto1.y, 100);
    const dz = idiv(conto.z - conto1.z, 100);
    return i32(i32(Math.imul(dx, dx) + Math.imul(dy, dy)) + Math.imul(dz, dz));
  }

  drawop(g, image) {
    this.saveit(image, this.pix);
    let i = 0;
    do {
      const color_r = colorRed(this.pix[i]);
      const color_g = colorGreen(this.pix[i]);
      const color_b = colorBlue(this.pix[i]);
      let j = Math.abs(255 - color_r);
      if (j > 255) {
        j = 255;
      }
      if (j < 0) {
        j = 0;
      }
      let k = Math.abs(255 - color_g);
      if (k > 255) {
        k = 255;
      }
      if (k < 0) {
        k = 0;
      }
      let l = Math.abs(255 - color_b);
      if (l > 255) {
        l = 255;
      }
      if (l < 0) {
        l = 0;
      }
      this.pix[i] = colorOf(j, k, l);
    } while (++i < 180000);
    g.drawImage(imageFromPixels(500, 360, this.pix), 0, 0);
  }

  cmback(i) {
    let j = 0;
    do {
      let k = 0;
      do {
        this.pix[j + k * 500] = this.mpix[j + k * 500];
        for (let l = 0; l < i; ++l) {
          if (j > 82 && j < 416 && k > 95 + l * 80 && k < 147 + l * 80) {
            const color2_r = colorRed(this.pix[j + k * 500]);
            const color2_g = colorGreen(this.pix[j + k * 500]);
            const color2_b = colorBlue(this.pix[j + k * 500]);
            let i2 = idiv(222 + color2_r, 2);
            if (i2 > 225) {
              i2 = 225;
            }
            if (i2 < 0) {
              i2 = 0;
            }
            let j2 = idiv(184 + color2_g, 2);
            if (j2 > 225) {
              j2 = 225;
            }
            if (j2 < 0) {
              j2 = 0;
            }
            let k2 = idiv(34 + color2_b, 2);
            if (k2 > 225) {
              k2 = 225;
            }
            if (k2 < 0) {
              k2 = 0;
            }
            this.pix[j + k * 500] = colorOf(i2, j2, k2);
          }
        }
      } while (++k < 360);
    } while (++j < 500);
    this.mback = imageFromPixels(500, 360, this.pix);
  }

  drawl(g, image) {
    this.saveit(image, this.pix);
    let i = 0;
    do {
      const color_r = colorRed(this.pix[i]);
      const color_g = colorGreen(this.pix[i]);
      const color_b = colorBlue(this.pix[i]);
      let j = Math.abs(idiv(color_r - 15, 2));
      if (j > 225) {
        j = 225;
      }
      if (j < 0) {
        j = 0;
      }
      let k = Math.abs(idiv(color_g - 10, 2));
      if (k > 225) {
        k = 225;
      }
      if (k < 0) {
        k = 0;
      }
      let l = Math.abs(idiv(color_b + 20, 2));
      if (l > 225) {
        l = 225;
      }
      if (l < 0) {
        l = 0;
      }
      this.pix[i] = colorOf(j, k, l);
    } while (++i < 180000);
    g.drawImage(imageFromPixels(500, 360, this.pix), 0, 0);
  }

  drawovimg(image) {
    this.saveit(image, this.pix);
    let i = 0;
    do {
      const color_r = colorRed(this.pix[i]);
      const color_g = colorGreen(this.pix[i]);
      const color_b = colorBlue(this.pix[i]);
      const color2_r = colorRed(this.opix[i]);
      const color2_g = colorGreen(this.opix[i]);
      const color2_b = colorBlue(this.opix[i]);
      let j = trunc((color_r / 1.7 + color2_r) / 2.0);
      if (j > 225) {
        j = 225;
      }
      if (j < 0) {
        j = 0;
      }
      let k = trunc((color_g / 1.7 + color2_g) / 2.0);
      if (k > 225) {
        k = 225;
      }
      if (k < 0) {
        k = 0;
      }
      let l = trunc((color_b / 1.7 + color2_b) / 2.0);
      if (l > 225) {
        l = 225;
      }
      if (l < 0) {
        l = 0;
      }
      this.pix[i] = colorOf(j, k, l);
    } while (++i < 180000);
    this.mback = imageFromPixels(500, 360, this.pix);
  }

  dtrakers(g, ai, ai1, i, aconto, usercraft, control) {
    this.cl = 1;
    let j = this.getcpy(aconto[ai1[0]], aconto[ai1[1]]);
    for (let l = 2; l < i; ++l) {
      if (j === 0 || aconto[ai1[this.cl]].exp) {
        this.cl = l;
        j = this.getcpy(aconto[ai1[0]], aconto[ai1[l]]);
      } else {
        const i2 = this.getcpy(aconto[ai1[0]], aconto[ai1[l]]);
        if ((i2 > 0 || j === 0) && i2 < j && !aconto[ai1[l]].exp) {
          j = i2;
          this.cl = l;
        }
      }
    }
    const ai2 = intArray(4);
    const ai3 = intArray(4);
    let flag = false;
    let flag2 = false;
    let j2 = 0;
    for (let k1 = 1; k1 < i; ++k1) {
      let c = 1000;
      if (ai[k1] === 1) {
        c = 4000;
      }
      const m = this.getcpy(aconto[ai1[0]], aconto[ai1[k1]]);
      if (m > c && !aconto[ai1[k1]].exp) {
        const l2 = this.m.cx + trunc(fr(fr((aconto[ai1[k1]].x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz)) - fr((aconto[ai1[k1]].z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz))));
        const k2 = this.m.cz + trunc(fr(fr((aconto[ai1[k1]].x - this.m.x - this.m.cx) * this.m.cs.getsin(this.m.xz)) + fr((aconto[ai1[k1]].z - this.m.z - this.m.cz) * this.m.cs.getcos(this.m.xz))));
        const j3 = this.m.cz + trunc(fr(fr((aconto[ai1[k1]].y - this.m.y - this.m.cy) * this.m.cs.getsin(this.m.zy)) + fr((k2 - this.m.cz) * this.m.cs.getcos(this.m.zy))));
        if (j3 > 100) {
          const i3 = this.m.cy + trunc(fr(fr((aconto[ai1[k1]].y - this.m.y - this.m.cy) * this.m.cs.getcos(this.m.zy)) - fr((k2 - this.m.cz) * this.m.cs.getsin(this.m.zy))));
          const k3 = this.xs(l2, j3);
          const i4 = this.ys(i3, j3);
          if (k3 > 0 && k3 < this.m.w && i4 > 0 && i4 < this.m.h) {
            if (!flag && m !== 0 && m < 10000) {
              flag = true;
            }
            if (ai[k1] === 0) {
              if (!aconto[ai1[k1]].fire) {
                g.setColor(colorOf(164, 209, 255));
              } else {
                g.setColor(colorOf(164, 229, 255));
              }
            } else if (!aconto[ai1[k1]].fire) {
              g.setColor(colorOf(255, 150, 100));
            } else {
              g.setColor(colorOf(255, 180, 100));
            }
            ai2[0] = k3 - 10;
            ai3[0] = i4 - 10;
            ai2[1] = k3 + 10;
            ai3[1] = i4 - 10;
            ai2[2] = k3 + 10;
            ai3[2] = i4 + 10;
            ai2[3] = k3 - 10;
            ai3[3] = i4 + 10;
            g.drawPolygon(ai2, ai3, 4);
          }
        }
      }
      if (aconto[ai1[k1]].exp) {
        if (this.cnte[k1 - 1] < 20 && !flag2) {
          if (this.cntf < 2) {
            if (aconto[ai1[k1]].nhits >= aconto[ai1[k1]].maxhits) {
              this.drawcs(g, 120, this.mname[k1 - 1] + ' distroyd!', 255, 255, 128, false);
            } else {
              this.drawcs(g, 120, this.mname[k1 - 1] + ' Crashed!', 255, 255, 128, false);
            }
          } else if (aconto[ai1[k1]].nhits >= aconto[ai1[k1]].maxhits) {
            this.drawcs(g, 120, this.mname[k1 - 1] + ' distroyd!', 186, 223, 57, false);
          } else {
            this.drawcs(g, 120, this.mname[k1 - 1] + ' Crashed!', 186, 223, 57, false);
          }
          if (!this.m.interpolating) {
            if (this.cntf < 2) {
              ++this.cntf;
            } else {
              this.cntf = 0;
            }
            const cnte = this.cnte;
            const n = k1 - 1;
            ++cnte[n];
          }
          flag2 = true;
        } else {
          ++j2;
        }
      }
    }
    if (!this.mcomp && j2 === i - 1 && !this.m.interpolating) {
      this.mcomp = true;
      this.select = 0;
    }
    if (this.mcomp && !aconto[ai1[0]].exp) {
      if (this.rcnt === 0) {
        if (!this.m.interpolating) this.rcnt = 1;
      } else {
        g.setColor(colorOf(50 + trunc(random() * 200.0), 50 + trunc(random() * 200.0), 50 + trunc(random() * 200.0)));
        g.fillRect(110, 67, 270, 13);
        if (!this.m.interpolating) this.rcnt = 0;
      }
      g.drawImage(this.complete, 105, 60);
      this.drawcs(g, 300, 'Press Enter to continue', 0, 0, 0, false);
    }
    if (!flag && !aconto[ai1[this.cl]].exp) {
      let flag3 = false;
      const j4 = this.m.cx + trunc(fr(fr((aconto[ai1[this.cl]].x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz)) - fr((aconto[ai1[this.cl]].z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz))));
      const i5 = this.m.cz + trunc(fr(fr((aconto[ai1[this.cl]].x - this.m.x - this.m.cx) * this.m.cs.getsin(this.m.xz)) + fr((aconto[ai1[this.cl]].z - this.m.z - this.m.cz) * this.m.cs.getcos(this.m.xz))));
      const l3 = this.m.cz + trunc(fr(fr((aconto[ai1[this.cl]].y - this.m.y - this.m.cy) * this.m.cs.getsin(this.m.zy)) + fr((i5 - this.m.cz) * this.m.cs.getcos(this.m.zy))));
      const k4 = this.m.cy + trunc(fr(fr((aconto[ai1[this.cl]].y - this.m.y - this.m.cy) * this.m.cs.getcos(this.m.zy)) - fr((i5 - this.m.cz) * this.m.cs.getsin(this.m.zy))));
      let j5 = this.ys(k4, l3);
      let l4 = this.xs(j4, l3);
      if (l4 < this.m.w && l4 > 0) {
        if (j5 > this.m.h || j5 < 0) {
          if (l4 > this.m.w - 10) {
            l4 = this.m.w - 50;
          }
          if (l4 < 5) {
            l4 = 50;
          }
          if (k4 > this.m.cy) {
            ai2[0] = l4;
            ai3[0] = this.m.h - 1;
            ai2[1] = l4 - 5;
            ai3[1] = this.m.h - 20;
            ai2[2] = l4 + 5;
            ai3[2] = this.m.h - 20;
            flag3 = true;
          } else {
            ai3[0] = 1;
            ai2[0] = l4;
            ai3[1] = 20;
            ai2[1] = l4 - 5;
            ai3[2] = 20;
            ai2[2] = l4 + 5;
            flag3 = true;
          }
        }
      } else {
        if (j5 > this.m.h - 10) {
          j5 = this.m.h - 50;
        }
        if (j5 < 5) {
          j5 = 50;
        }
        if (j4 > this.m.cx) {
          ai2[0] = this.m.w - 1;
          ai3[0] = j5;
          ai2[1] = this.m.w - 20;
          ai3[1] = j5 - 5;
          ai2[2] = this.m.w - 20;
          ai3[2] = j5 + 5;
          flag3 = true;
        } else {
          ai2[0] = 1;
          ai3[0] = j5;
          ai2[1] = 20;
          ai3[1] = j5 - 5;
          ai2[2] = 20;
          ai3[2] = j5 + 5;
          flag3 = true;
        }
      }
      if (flag3) {
        if (ai[this.cl] === 0) {
          g.setColor(colorOf(164, 209, 255));
        } else {
          g.setColor(colorOf(255, 180, 100));
        }
        g.fillPolygon(ai2, ai3, 3);
      }
    }
    if (aconto[ai1[0]].nhits > aconto[ai1[0]].maxhits - idiv(aconto[ai1[0]].maxhits, 3) && !aconto[ai1[0]].exp && !this.mcomp) {
      if (this.cnt > 90) {
        if (this.flik) {
          this.drawcs(g, 300, 'Recharge Ship !', 255, 255, 255, false);
          if (!this.m.interpolating) this.flik = false;
        } else {
          this.drawcs(g, 300, 'Recharge Ship !', 200, 200, 200, false);
          if (!this.m.interpolating) this.flik = true;
        }
      } else {
        this.drawcs(g, 300, 'Damage Critical', 255, 0, 0, false);
      }
      if (!this.m.interpolating) {
        ++this.cnt;
        if (this.cnt === 130) {
          this.cnt = 0;
        }
      }
    }
    if (control.jump >= 1 && usercraft.njumps === 0) {
      this.drawcs(g, 330, 'Light speed jumps expired - Recharge Ship !', 255, 255, 255, false);
      if (!this.m.interpolating) {
        ++control.jump;
        if (control.jump === 40) {
          control.jump = 0;
        }
      }
    }
    if (usercraft.ester !== 0 && !aconto[ai1[0]].exp && !this.mcomp) {
      this.drawcs(g, 300, 'Ship Recharged !', Math.imul(255, this.m.er), 255 - Math.imul(this.m.eg, 100), 64 + Math.imul(this.m.eb, 191), false);
    }
    if (control.radar && !this.mcomp) {
      g.drawImage(this.radar, 200, 60);
      let l5 = aconto[ai1[0]].zy;
      let k5 = -aconto[ai1[0]].xz;
      while (l5 > 360) {
        l5 -= 360;
      }
      while (l5 < 0) {
        l5 += 360;
      }
      if (l5 > 90 && l5 < 270) {
        k5 += 180;
      }
      for (let j6 = 1; j6 < i; ++j6) {
        if (!aconto[ai1[j6]].exp) {
          let i6 = this.m.cx + trunc(fr(fr((aconto[ai1[j6]].x - this.m.x - this.m.cx) * this.m.cs.getcos(k5)) - fr((aconto[ai1[j6]].z - this.m.z - this.m.cz) * this.m.cs.getsin(k5))));
          let l6 = this.m.cz + trunc(fr(fr((aconto[ai1[j6]].x - this.m.x - this.m.cx) * this.m.cs.getsin(k5)) + fr((aconto[ai1[j6]].z - this.m.z - this.m.cz) * this.m.cs.getcos(k5))));
          g.setColor(colorOf(0, 255, 128));
          i6 = idiv(i6, 400) + 249;
          l6 = idiv(-l6, 400) + 109;
          if (i6 < 204) {
            i6 = 204;
          }
          if (i6 > 296) {
            i6 = 296;
          }
          if (l6 < 64) {
            l6 = 64;
          }
          if (l6 > 156) {
            l6 = 156;
          }
          g.fillRect(i6, l6, 2, 2);
        }
      }
    }
    if (control.plus || control.mins || this.cnts < 10) {
      g.setColor(colorOf(0, 0, 0));
      g.drawString('' + usercraft.rspeed + ' zic/tes', 50, 55);
      g.drawImage(this.stube, 50, 60);
      const i7 = trunc(fr(260.0 - fr(usercraft.rspeed * fr(200.0 / usercraft.maxspeed[usercraft.ltyp]))));
      g.setColor(colorOf(255, i7 - 10, 0));
      g.fillRect(61, i7, 12, 260 - i7);
      if (!this.m.interpolating) {
        if (control.plus || control.mins) {
          this.cnts = 0;
        } else {
          ++this.cnts;
        }
      }
    }
    if (this.tcnt !== 0) {
      if (!this.m.interpolating) {
        if (usercraft.rspeed === 0) {
          ++this.tcnt;
        } else {
          this.tcnt = 0;
        }
      }
      if (!control.space) {
        if (this.tcnt > 90) {
          this.drawcs(g, 80, 'Press Enter for game controls and to pause game!', 255, 255, 255, false);
        }
      } else if (!this.m.interpolating) {
        this.tcnt = 0;
      }
    }
  }

  drawcs(g, i, s, j, k, l, flag) {
    if (flag) {
      g.setColor(colorOf(0, 0, 0));
      g.drawString(s, 250 - idiv(this.ftm.stringWidth(s), 2) + 1, i + 1);
    }
    g.setColor(colorOf(j, k, l));
    g.drawString(s, 250 - idiv(this.ftm.stringWidth(s), 2), i);
  }
}
