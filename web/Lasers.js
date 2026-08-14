// Transpiled from java-src/Lasers.java, line by line.
//
// Local names kept as procyon emitted them (ai, ai1, ai2, ai3, ai4, l2, i3, ...).
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
//
// PAINTER'S ALGORITHM: drawing calls are in the same order as Java.
// There is no depth buffer. Never reorder or batch fillPolygon calls.
//
// --- Compound-assignment audit (TRANSPILE_SPEC §2) ---
// Searched for `+= (int)(` and `-= (int)(` in Lasers.java.
//
// Found 3 sites in dt():
// Site 1 — Java line 91:
//   ai[n4] += (int)(i - this.m.x + (Math.random() * 50.0 - 25.0));
//   Bytecode:
//     70: aload_2
//     71: iload 16
//     73: dup2
//     74: iaload
//     75: i2d
//     76: iload 5
//     78: aload_0
//     79: getfield #1 (m)
//     82: getfield #9 (x)
//     85: isub
//     86: i2d
//     87: invokestatic Math.random
//     90: ldc2_w 50.0d
//     93: dmul
//     94: ldc2_w 25.0d
//     97: dsub
//     98: dadd
//     99: dadd
//    100: d2i
//    101: iastore
//   Analysis: Accumulator ai[l2] is widened to double (i2d at offset 75) before
//   addition (dadd at 99), then truncated ONCE at the end (d2i at 100).
//   Classification: CASE A.
//   Correct JS: ai[n4] = trunc(ai[n4] + (i - this.m.x + (random() * 50.0 - 25.0)));
//
// Site 2 — Java line 93:
//   ai1[n5] += (int)(j - this.m.y + (Math.random() * 50.0 - 25.0));
//   Bytecode:
//    102: aload_3 ; 103: iload 16 ; 105: dup2 ; 106: iaload ; 107: i2d
//    ... 130: dadd ; 131: dadd ; 132: d2i ; 133: iastore
//   Analysis: Accumulator ai1[l2] widened to double (i2d at 107), one d2i truncation at 132.
//   Classification: CASE A.
//   Correct JS: ai1[n5] = trunc(ai1[n5] + (j - this.m.y + (random() * 50.0 - 25.0)));
//
// Site 3 — Java line 95:
//   ai2[n6] += (int)(k - this.m.z + (Math.random() * 50.0 - 25.0));
//   Bytecode:
//    134: aload 4 ; 136: iload 16 ; 138: dup2 ; 139: iaload ; 140: i2d
//    ... 163: dadd ; 164: dadd ; 165: d2i ; 166: iastore
//   Analysis: Accumulator ai2[l2] widened to double (i2d at 140), one d2i truncation at 165.
//   Classification: CASE A.
//   Correct JS: ai2[n6] = trunc(ai2[n6] + (k - this.m.z + (random() * 50.0 - 25.0)));
//

import { idiv, i32, trunc, fr, intArray, random, colorOf } from './java.js';

export class Lasers {
  ys(i, j) {
    if (j < 10) {
      j = 10;
    }
    return i32(idiv(Math.imul(j - this.m.focus_point, this.m.cy - i), j) + i);
  }

  constructor(medium) {
    this.speed = intArray(12);
    this.rads = intArray(12);
    this.srate = intArray(12);
    this.damg = intArray(12);
    this.m = medium;
    this.speed[0] = 200;
    this.rads[0] = 200;
    this.srate[0] = 8;
    this.damg[0] = 3;
    this.speed[1] = 150;
    this.rads[1] = 200;
    this.srate[1] = 8;
    this.damg[1] = 2;
    this.speed[2] = 120;
    this.rads[2] = 300;
    this.srate[2] = 10;
    this.damg[2] = 2;
    this.speed[3] = 120;
    this.rads[3] = 300;
    this.srate[3] = 10;
    this.damg[3] = 3;
    this.speed[4] = 100;
    this.rads[4] = 200;
    this.srate[4] = 8;
    this.damg[4] = 2;
    this.speed[5] = 100;
    this.rads[5] = 150;
    this.srate[5] = 6;
    this.damg[5] = 1;
    this.speed[6] = 140;
    this.rads[6] = 160;
    this.srate[6] = 8;
    this.damg[6] = 1;
    this.speed[7] = 100;
    this.rads[7] = 160;
    this.srate[7] = 6;
    this.damg[7] = 2;
    this.speed[8] = 150;
    this.rads[8] = 160;
    this.srate[8] = 10;
    this.damg[8] = 2;
    this.speed[9] = 120;
    this.rads[9] = 200;
    this.srate[9] = 10;
    this.damg[9] = 2;
    this.speed[10] = 150;
    this.rads[10] = 200;
    this.srate[10] = 10;
    this.damg[10] = 3;
    this.speed[11] = 150;
    this.rads[11] = 300;
    this.srate[11] = 10;
    this.damg[11] = 7;
  }

  dt(g, ai, ai1, ai2, i, j, k, l, i1, j1, k1, l1, i2, j2, k2) {
    for (let l2 = 0; l2 < k1; ++l2) {
      if (l1 === 0) {
        const n = l2;
        ai[n] = i32(ai[n] + (i - this.m.x));
        const n2 = l2;
        ai1[n2] = i32(ai1[n2] + (j - this.m.y));
        const n3 = l2;
        ai2[n3] = i32(ai2[n3] + (k - this.m.z));
      } else {
        const n4 = l2;
        ai[n4] = trunc(ai[n4] + (i - this.m.x + (random() * 50.0 - 25.0)));
        const n5 = l2;
        ai1[n5] = trunc(ai1[n5] + (j - this.m.y + (random() * 50.0 - 25.0)));
        const n6 = l2;
        ai2[n6] = trunc(ai2[n6] + (k - this.m.z + (random() * 50.0 - 25.0)));
      }
    }
    this.rot(ai, ai1, i - this.m.x, j - this.m.y, j1, k1);
    this.rot(ai1, ai2, j - this.m.y, k - this.m.z, i1, k1);
    this.rot(ai, ai2, i - this.m.x, k - this.m.z, l, k1);
    this.rot(ai, ai2, this.m.cx, this.m.cz, this.m.xz, k1);
    this.rot(ai1, ai2, this.m.cy, this.m.cz, this.m.zy, k1);
    const ai3 = intArray(k1);
    const ai4 = intArray(k1);
    let flag = false;
    for (let i3 = 0; i3 < k1; ++i3) {
      ai3[i3] = this.xs(ai[i3], ai2[i3]);
      ai4[i3] = this.ys(ai1[i3], ai2[i3]);
      if (ai4[i3] > 0 && ai4[i3] < this.m.h && ai3[i3] > 0 && ai3[i3] < this.m.w && ai2[i3] > 10) {
        flag = true;
      }
    }
    if (flag) {
      if (l1 !== 0) {
        if (l1 === 1) {
          i2 = 255;
          j2 = 235;
          k2 = 120;
        } else {
          i2 = 255;
          j2 = 220;
          k2 = 111;
        }
      }
      g.setColor(colorOf(i2, j2, k2));
      g.fillPolygon(ai3, ai4, k1);
    }
  }

  d(g, i, j, k, l, i1, j1, k1, l1) {
    const byte0 = 4;
    const ai = intArray(byte0);
    const ai2 = intArray(byte0);
    const ai3 = intArray(byte0);
    if (i === 0) {
      let byte2 = 4;
      ai2[0] = (ai[0] = 3);
      ai3[0] = 0;
      ai[1] = -3;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = -3;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 3;
      ai3[ai2[3] = 3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, 0, byte2, l1, 200, 255, 240);
      byte2 = 4;
      ai2[ai[0] = 0] = -3;
      ai[1] = (ai3[0] = 0);
      ai2[1] = 3;
      ai[2] = (ai3[1] = 0);
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 0;
      ai2[3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, 0, byte2, l1, 200, 255, 240);
      byte2 = 4;
      ai2[0] = (ai[0] = -3);
      ai3[0] = -100;
      ai[1] = -3;
      ai2[1] = 3;
      ai3[1] = -100;
      ai2[2] = (ai[2] = 3);
      ai3[2] = -100;
      ai2[ai[3] = 3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, 0, byte2, l1, 200, 255, 240);
    }
    if (i === 1) {
      let byte3 = 4;
      ai[0] = 20;
      ai3[ai2[0] = 0] = -10;
      ai[1] = -20;
      ai2[1] = 0;
      ai3[1] = -10;
      ai[2] = -30;
      ai2[2] = 0;
      ai[3] = (ai3[2] = 30);
      ai2[3] = 0;
      ai3[3] = 30;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte3, l1, 149, 255, 205);
      byte3 = 3;
      ai[0] = 0;
      ai3[ai2[0] = 0] = 30;
      ai[1] = 0;
      ai2[1] = -3;
      ai3[1] = -10;
      ai2[2] = (ai[2] = 0);
      ai3[2] = -10;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte3, l1, 149, 255, 205);
      byte3 = 4;
      ai[0] = -20;
      ai3[ai2[0] = 0] = -10;
      ai[1] = -20;
      ai2[1] = -3;
      ai3[1] = -10;
      ai[2] = 20;
      ai2[2] = -3;
      ai3[2] = -10;
      ai[3] = 20;
      ai2[3] = 0;
      ai3[3] = -10;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte3, l1, 0, 232, 215);
    }
    if (i === 2) {
      const byte4 = 4;
      ai[0] = -87 + trunc(random() * 10.0);
      ai2[0] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[0] = 30 + trunc(random() * 50.0 - 25.0);
      ai[1] = -93 - trunc(random() * 10.0);
      ai2[1] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[1] = 30 + trunc(random() * 50.0 - 25.0);
      ai[2] = -93 - trunc(random() * 10.0);
      ai2[2] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[2] = -100 + trunc(random() * 50.0 - 25.0);
      ai[3] = -87 + trunc(random() * 10.0);
      ai2[3] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[3] = -100 + trunc(random() * 50.0 - 25.0);
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte4, l1, 193, 224, 255);
      let byte4_2 = 4;
      ai[0] = -90;
      ai2[0] = -2;
      ai3[0] = 30;
      ai[1] = -90;
      ai2[1] = 2;
      ai3[1] = 30;
      ai[2] = -90;
      ai3[ai2[2] = 2] = -100;
      ai[3] = -90;
      ai2[3] = -2;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte4_2, l1, 255, 240, 240);
      byte4_2 = 3;
      ai[0] = -90;
      ai2[0] = -2;
      ai3[0] = -100;
      ai[1] = -93;
      ai2[1] = 2;
      ai3[1] = -100;
      ai[2] = -87;
      ai3[ai2[2] = 2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte4_2, l1, 255, 240, 240);
      byte4_2 = 4;
      ai[0] = 87 - trunc(random() * 10.0);
      ai2[0] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[0] = 30 + trunc(random() * 50.0 - 25.0);
      ai[1] = 93 + trunc(random() * 10.0);
      ai2[1] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[1] = 30 + trunc(random() * 50.0 - 25.0);
      ai[2] = 93 + trunc(random() * 10.0);
      ai2[2] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[2] = -100 + trunc(random() * 50.0 - 25.0);
      ai[3] = 87 - trunc(random() * 10.0);
      ai2[3] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[3] = -100 + trunc(random() * 50.0 - 25.0);
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte4_2, l1, 193, 224, 255);
      byte4_2 = 4;
      ai[0] = 90;
      ai2[0] = -2;
      ai3[0] = 30;
      ai[1] = 90;
      ai2[1] = 2;
      ai3[1] = 30;
      ai[2] = 90;
      ai3[ai2[2] = 2] = -100;
      ai[3] = 90;
      ai2[3] = -2;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte4_2, l1, 255, 240, 240);
      byte4_2 = 3;
      ai[0] = 90;
      ai2[0] = -2;
      ai3[0] = -100;
      ai[1] = 93;
      ai2[1] = 2;
      ai3[1] = -100;
      ai[2] = 87;
      ai3[ai2[2] = 2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte4_2, l1, 255, 240, 240);
    }
    if (i === 3) {
      let i2 = trunc(random() * 100.0);
      let byte5 = 4;
      ai[0] = 80;
      ai3[ai2[0] = 0] = -75;
      ai[1] = 40;
      ai2[1] = 0;
      ai3[1] = -50;
      ai[2] = 10 - i2;
      ai3[2] = (ai2[2] = 0);
      ai[3] = 80 + i2;
      ai2[3] = 0;
      ai3[3] = -30;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte5, l1, 255, 200, 255);
      byte5 = 3;
      ai[0] = 60;
      ai3[ai2[0] = 0] = 0;
      ai[1] = 60;
      ai2[1] = -3;
      ai3[1] = -60;
      ai[2] = 60;
      ai2[2] = 0;
      ai3[2] = -60;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte5, l1, 255, 221, 255);
      byte5 = 4;
      ai[0] = 40;
      ai3[ai2[0] = 0] = -50;
      ai[1] = 40;
      ai2[1] = -3;
      ai3[1] = -50;
      ai[2] = 80;
      ai2[2] = -3;
      ai3[2] = -75;
      ai[3] = 80;
      ai2[3] = 0;
      ai3[3] = -75;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte5, l1, 255, 221, 255);
      i2 = trunc(random() * 100.0);
      byte5 = 4;
      ai[0] = -80;
      ai3[ai2[0] = 0] = -75;
      ai[1] = -40;
      ai2[1] = 0;
      ai3[1] = -50;
      ai[2] = -10 + i2;
      ai3[2] = (ai2[2] = 0);
      ai[3] = -80 - i2;
      ai2[3] = 0;
      ai3[3] = -30;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte5, l1, 255, 200, 255);
      byte5 = 3;
      ai[0] = -60;
      ai3[ai2[0] = 0] = 0;
      ai[1] = -60;
      ai2[1] = -3;
      ai[2] = (ai3[1] = -60);
      ai2[2] = 0;
      ai3[2] = -60;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte5, l1, 255, 221, 255);
      byte5 = 4;
      ai[0] = -40;
      ai3[ai2[0] = 0] = -50;
      ai[1] = -40;
      ai2[1] = -3;
      ai3[1] = -50;
      ai[2] = -80;
      ai2[2] = -3;
      ai3[2] = -75;
      ai[3] = -80;
      ai2[3] = 0;
      ai3[3] = -75;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte5, l1, 255, 221, 255);
    }
    if (i === 4) {
      let byte6 = 4;
      ai2[0] = (ai[0] = 3);
      ai3[0] = 0;
      ai[1] = -3;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = -3;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 3;
      ai3[ai2[3] = 3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, 0, byte6, l1, 255, 255, 177);
      byte6 = 4;
      ai2[ai[0] = 0] = -3;
      ai[1] = (ai3[0] = 0);
      ai2[1] = 3;
      ai[2] = (ai3[1] = 0);
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 0;
      ai2[3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, 0, byte6, l1, 255, 255, 177);
      byte6 = 4;
      ai2[0] = (ai[0] = -3);
      ai3[0] = -100;
      ai[1] = -3;
      ai2[1] = 3;
      ai3[1] = -100;
      ai2[2] = (ai[2] = 3);
      ai3[2] = -100;
      ai2[ai[3] = 3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, 0, byte6, l1, 255, 255, 177);
    }
    if (i === 5) {
      let byte7 = 4;
      ai[0] = 11;
      ai2[0] = 3;
      ai3[0] = 0;
      ai[1] = 5;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = 5;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 11;
      ai3[ai2[3] = 3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte7, l1, 255, 240, 177);
      byte7 = 4;
      ai[0] = 8;
      ai2[0] = -3;
      ai3[0] = 0;
      ai[1] = 8;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = 8;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 8;
      ai2[3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte7, l1, 255, 240, 177);
      byte7 = 3;
      ai[0] = 8;
      ai2[0] = -3;
      ai3[0] = -100;
      ai[1] = 5;
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = 11;
      ai2[2] = 3;
      ai3[2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte7, l1, 255, 240, 177);
      byte7 = 4;
      ai[0] = -11;
      ai2[0] = 3;
      ai3[0] = 0;
      ai[1] = -5;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = -5;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = -11;
      ai3[ai2[3] = 3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte7, l1, 255, 240, 177);
      byte7 = 4;
      ai[0] = -8;
      ai2[0] = -3;
      ai3[0] = 0;
      ai[1] = -8;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = -8;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = -8;
      ai2[3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte7, l1, 255, 240, 177);
      byte7 = 3;
      ai[0] = -8;
      ai2[0] = -3;
      ai3[0] = -100;
      ai[1] = -5;
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = -11;
      ai2[2] = 3;
      ai3[2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte7, l1, 255, 240, 177);
    }
    if (i === 6) {
      let byte8 = 4;
      ai[0] = 103;
      ai2[0] = 3;
      ai3[0] = -100;
      ai[1] = 97;
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = 97;
      ai2[2] = 3;
      ai3[2] = -200;
      ai[3] = 103;
      ai3[ai2[3] = 3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte8, l1, 177, 255, 177);
      byte8 = 4;
      ai[0] = 100;
      ai2[0] = -3;
      ai3[0] = -100;
      ai[1] = 100;
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = 100;
      ai2[2] = 3;
      ai3[2] = -200;
      ai[3] = 100;
      ai2[3] = -3;
      ai3[3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte8, l1, 177, 255, 177);
      byte8 = 3;
      ai[0] = 100;
      ai2[0] = -3;
      ai3[0] = -200;
      ai[1] = 97;
      ai2[1] = 3;
      ai3[1] = -200;
      ai[2] = 103;
      ai2[2] = 3;
      ai3[2] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte8, l1, 177, 255, 177);
      byte8 = 4;
      ai[0] = -103;
      ai2[0] = 3;
      ai3[0] = -100;
      ai[1] = -97;
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = -97;
      ai2[2] = 3;
      ai3[2] = -200;
      ai[3] = -103;
      ai3[ai2[3] = 3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte8, l1, 177, 255, 177);
      byte8 = 4;
      ai[0] = -100;
      ai2[0] = -3;
      ai[1] = (ai3[0] = -100);
      ai2[1] = 3;
      ai[2] = (ai3[1] = -100);
      ai2[2] = 3;
      ai3[2] = -200;
      ai[3] = -100;
      ai2[3] = -3;
      ai3[3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte8, l1, 177, 255, 177);
      byte8 = 3;
      ai[0] = -100;
      ai2[0] = -3;
      ai3[0] = -200;
      ai[1] = -97;
      ai2[1] = 3;
      ai3[1] = -200;
      ai[2] = -103;
      ai2[2] = 3;
      ai3[2] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte8, l1, 177, 255, 177);
    }
    if (i === 7) {
      let byte9 = 4;
      ai[0] = 10;
      ai3[ai2[0] = 0] = -50;
      ai[1] = -10;
      ai2[1] = 0;
      ai3[1] = -50;
      ai[2] = -10;
      ai2[2] = 0;
      ai3[2] = -100;
      ai[3] = 10;
      ai2[3] = 0;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte9, l1, 255, 255, 255);
      byte9 = 3;
      ai2[ai[0] = 0] = -10;
      ai3[0] = -50;
      ai2[1] = (ai[1] = 0);
      ai3[1] = -50;
      ai2[2] = (ai[2] = 0);
      ai3[2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte9, l1, 175, 240, 255);
      byte9 = 3;
      ai2[ai[0] = 0] = -10;
      ai3[0] = -50;
      ai[1] = -10;
      ai2[1] = 0;
      ai3[1] = -50;
      ai[2] = 10;
      ai2[2] = 0;
      ai3[2] = -50;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte9, l1, 175, 240, 255);
    }
    if (i === 8) {
      let byte10 = 4;
      ai[0] = 10;
      ai3[ai2[0] = 0] = 0;
      ai[1] = -10;
      ai3[1] = (ai2[1] = 0);
      ai[2] = -10;
      ai2[2] = 0;
      ai3[2] = -100;
      ai[3] = 10;
      ai2[3] = 0;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte10, l1, 255, 255, 255);
      byte10 = 3;
      ai2[ai[0] = 0] = -10;
      ai[1] = (ai3[0] = 0);
      ai3[1] = (ai2[1] = 0);
      ai2[2] = (ai[2] = 0);
      ai3[2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte10, l1, 200, 200, 200);
      byte10 = 3;
      ai2[ai[0] = 0] = -10;
      ai3[0] = 0;
      ai[1] = -10;
      ai3[1] = (ai2[1] = 0);
      ai[2] = 10;
      ai3[2] = (ai2[2] = 0);
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte10, l1, 200, 200, 200);
    }
    if (i === 9) {
      let byte11 = 4;
      ai[0] = 69;
      ai2[0] = 3;
      ai3[0] = 0;
      ai[1] = 63;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = 63;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 69;
      ai3[ai2[3] = 3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte11, l1, 200, 240, 255);
      byte11 = 4;
      ai[0] = 66;
      ai2[0] = -3;
      ai3[0] = 0;
      ai[1] = 66;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = 66;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = 66;
      ai2[3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte11, l1, 200, 240, 255);
      byte11 = 3;
      ai[0] = 66;
      ai2[0] = -3;
      ai3[0] = -100;
      ai[1] = 63 - trunc(random() * 30.0);
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = 69 + trunc(random() * 30.0);
      ai2[2] = 3;
      ai3[2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte11, l1, 255, 240, 177);
      byte11 = 4;
      ai[0] = -69;
      ai2[0] = 3;
      ai3[0] = 0;
      ai[1] = -63;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = -63;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = -69;
      ai3[ai2[3] = 3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte11, l1, 200, 240, 255);
      byte11 = 4;
      ai[0] = -66;
      ai2[0] = -3;
      ai3[0] = 0;
      ai[1] = -66;
      ai2[1] = 3;
      ai3[1] = 0;
      ai[2] = -66;
      ai2[2] = 3;
      ai3[2] = -100;
      ai[3] = -66;
      ai2[3] = -3;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte11, l1, 200, 240, 255);
      byte11 = 3;
      ai[0] = -66;
      ai2[0] = -3;
      ai3[0] = -100;
      ai[1] = -63 + trunc(random() * 30.0);
      ai2[1] = 3;
      ai3[1] = -100;
      ai[2] = -69 - trunc(random() * 30.0);
      ai2[2] = 3;
      ai3[2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte11, l1, 255, 240, 177);
    }
    if (i === 10) {
      const byte12 = 4;
      ai[0] = -8;
      ai3[ai2[0] = 0] = 56;
      ai[1] = -58;
      ai2[1] = 20;
      ai3[1] = 24;
      ai[2] = -55;
      ai2[2] = 20;
      ai3[2] = 0;
      ai[3] = -8;
      ai2[3] = 0;
      ai3[3] = 14;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte12, l1, 200, 200, 255);
      const byte12_2 = 4;
      ai[0] = -8;
      ai3[ai2[0] = 0] = 14;
      ai[1] = -49;
      ai2[1] = -20;
      ai3[1] = -25;
      ai[2] = -45;
      ai2[2] = -20;
      ai3[2] = -45;
      ai[3] = -8;
      ai2[3] = 0;
      ai3[3] = -33;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte12_2, l1, 230, 230, 255);
      const byte12_3 = 4;
      ai[0] = 8;
      ai3[ai2[0] = 0] = 56;
      ai[1] = 58;
      ai2[1] = 20;
      ai3[1] = 24;
      ai[2] = 55;
      ai2[2] = 20;
      ai3[2] = 0;
      ai[3] = 8;
      ai2[3] = 0;
      ai3[3] = 14;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte12_3, l1, 200, 200, 255);
      const byte12_4 = 4;
      ai[0] = 8;
      ai3[ai2[0] = 0] = 14;
      ai[1] = 49;
      ai2[1] = -20;
      ai3[1] = -25;
      ai[2] = 45;
      ai2[2] = -20;
      ai3[2] = -45;
      ai[3] = 8;
      ai2[3] = 0;
      ai3[3] = -33;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte12_4, l1, 230, 230, 255);
    }
    if (i === 11) {
      let byte13 = 4;
      ai[0] = -87 + trunc(random() * 10.0);
      ai2[0] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[0] = 30 + trunc(random() * 50.0 - 25.0);
      ai[1] = -93 - trunc(random() * 10.0);
      ai2[1] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[1] = 30 + trunc(random() * 50.0 - 25.0);
      ai[2] = -93 - trunc(random() * 10.0);
      ai2[2] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[2] = -100 + trunc(random() * 50.0 - 25.0);
      ai[3] = -87 + trunc(random() * 10.0);
      ai2[3] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[3] = -100 + trunc(random() * 50.0 - 25.0);
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 190, 190, 190);
      byte13 = 4;
      ai[0] = -90;
      ai2[0] = -2;
      ai3[0] = 30;
      ai[1] = -90;
      ai2[1] = 2;
      ai3[1] = 30;
      ai[2] = -90;
      ai3[ai2[2] = 2] = -100;
      ai[3] = -90;
      ai2[3] = -2;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 200, 230, 255);
      byte13 = 3;
      ai[0] = -90;
      ai2[0] = -2;
      ai3[0] = -100;
      ai[1] = -93;
      ai2[1] = 2;
      ai3[1] = -100;
      ai[2] = -87;
      ai3[ai2[2] = 2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 200, 230, 255);
      byte13 = 4;
      ai[0] = 87 - trunc(random() * 10.0);
      ai2[0] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[0] = 30 + trunc(random() * 50.0 - 25.0);
      ai[1] = 93 + trunc(random() * 10.0);
      ai2[1] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[1] = 30 + trunc(random() * 50.0 - 25.0);
      ai[2] = 93 + trunc(random() * 10.0);
      ai2[2] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[2] = -100 + trunc(random() * 50.0 - 25.0);
      ai[3] = 87 - trunc(random() * 10.0);
      ai2[3] = 2 + trunc(random() * 20.0 - 10.0);
      ai3[3] = -100 + trunc(random() * 50.0 - 25.0);
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 190, 190, 190);
      byte13 = 4;
      ai[0] = 90;
      ai2[0] = -2;
      ai3[0] = 30;
      ai[1] = 90;
      ai2[1] = 2;
      ai3[1] = 30;
      ai[2] = 90;
      ai3[ai2[2] = 2] = -100;
      ai[3] = 90;
      ai2[3] = -2;
      ai3[3] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 200, 230, 255);
      byte13 = 3;
      ai[0] = 90;
      ai2[0] = -2;
      ai3[0] = -100;
      ai[1] = 93;
      ai2[1] = 2;
      ai3[1] = -100;
      ai[2] = 87;
      ai3[ai2[2] = 2] = -100;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 200, 230, 255);
      byte13 = 4;
      ai[0] = 143;
      ai2[0] = 20;
      ai3[0] = -100;
      ai[1] = 137;
      ai2[1] = 20;
      ai3[1] = -100;
      ai[2] = 137;
      ai2[2] = 20;
      ai3[2] = -200;
      ai[3] = 143;
      ai2[3] = 20;
      ai3[3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 180, 180, 180);
      byte13 = 4;
      ai[0] = 140;
      ai2[0] = 17;
      ai3[0] = -100;
      ai[1] = 140;
      ai2[1] = 20;
      ai3[1] = -100;
      ai[2] = 140;
      ai2[2] = 20;
      ai3[2] = -200;
      ai[3] = 140;
      ai2[3] = 17;
      ai3[3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 180, 180, 180);
      byte13 = 3;
      ai[0] = 140;
      ai2[0] = 17;
      ai3[0] = -200;
      ai[1] = 137;
      ai2[1] = 20;
      ai3[1] = -200;
      ai[2] = 143;
      ai2[2] = 20;
      ai3[2] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 180, 180, 180);
      byte13 = 4;
      ai[0] = -143;
      ai2[0] = 20;
      ai3[0] = -100;
      ai[1] = -137;
      ai2[1] = 20;
      ai3[1] = -100;
      ai[2] = -137;
      ai2[2] = 20;
      ai3[2] = -200;
      ai[3] = -143;
      ai2[3] = 20;
      ai3[3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 180, 180, 180);
      byte13 = 4;
      ai[0] = -140;
      ai2[0] = 17;
      ai3[0] = -100;
      ai[1] = -140;
      ai2[1] = 20;
      ai3[1] = -100;
      ai[2] = -140;
      ai2[2] = 20;
      ai3[2] = -200;
      ai[3] = -140;
      ai2[3] = 17;
      ai3[3] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 180, 180, 180);
      byte13 = 3;
      ai[0] = -140;
      ai2[0] = 17;
      ai3[0] = -200;
      ai[1] = -137;
      ai2[1] = 20;
      ai3[1] = -200;
      ai[2] = -143;
      ai2[2] = 20;
      ai3[2] = -200;
      this.dt(g, ai, ai2, ai3, j, k, l, i1, j1, k1, byte13, l1, 180, 180, 180);
    }
  }

  rot(ai, ai1, i, j, k, l) {
    if (k !== 0) {
      for (let i2 = 0; i2 < l; ++i2) {
        const j2 = ai[i2];
        const k2 = ai1[i2];
        ai[i2] = i32(i + trunc(fr(fr((j2 - i) * this.m.cs.getcos(k)) - fr((k2 - j) * this.m.cs.getsin(k)))));
        ai1[i2] = i32(j + trunc(fr(fr((j2 - i) * this.m.cs.getsin(k)) + fr((k2 - j) * this.m.cs.getcos(k)))));
      }
    }
  }

  gsmoke(g, i, j, k, l, i1, j1) {
    const ai = intArray(8);
    const ai2 = intArray(8);
    const ai3 = intArray(8);
    ai[0] = -5 + trunc(random() * 5.0) - Math.imul(j1, 2);
    ai2[0] = -12 + trunc(random() * 12.0) - Math.imul(j1, 6);
    ai3[0] = -50;
    ai[1] = 5 - trunc(random() * 5.0) + Math.imul(j1, 2);
    ai2[1] = -12 + trunc(random() * 12.0) - Math.imul(j1, 6);
    ai3[1] = -50;
    ai[2] = 12 - trunc(random() * 12.0) + Math.imul(j1, 6);
    ai2[2] = -5 + trunc(random() * 5.0) - Math.imul(j1, 2);
    ai3[2] = -50;
    ai[3] = 12 - trunc(random() * 12.0) + Math.imul(j1, 6);
    ai2[3] = 5 - trunc(random() * 5.0) + Math.imul(j1, 2);
    ai3[3] = -50;
    ai[4] = 5 - trunc(random() * 5.0) + Math.imul(j1, 2);
    ai2[4] = 12 - trunc(random() * 12.0) + Math.imul(j1, 6);
    ai3[4] = -50;
    ai[5] = -5 + trunc(random() * 5.0) - Math.imul(j1, 2);
    ai2[5] = 12 - trunc(random() * 12.0) + Math.imul(j1, 6);
    ai3[5] = -50;
    ai[6] = -12 + trunc(random() * 12.0) - Math.imul(j1, 6);
    ai2[6] = 5 - trunc(random() * 5.0) + Math.imul(j1, 2);
    ai3[6] = -50;
    ai[7] = -12 + trunc(random() * 12.0) - Math.imul(j1, 6);
    ai2[7] = -5 + trunc(random() * 5.0) - Math.imul(j1, 2);
    ai3[7] = -50;
    if (j1 > 3) {
      j1 = 3;
    }
    this.dt(g, ai, ai2, ai3, i, j, k, l, i1, 0, 8, 0, 249 - Math.imul(j1, 25), 251 - Math.imul(j1, 25), 240 - Math.imul(j1, 25));
  }

  xs(i, j) {
    if (j < 10) {
      j = 10;
    }
    return i32(idiv(Math.imul(j - this.m.focus_point, this.m.cx - i), j) + i);
  }

  hsmoke(g, i, j, k, l, i1, j1) {
    const ai = intArray(8);
    const ai2 = intArray(8);
    const ai3 = intArray(8);
    ai[0] = -5 + trunc(random() * 5.0) - j1;
    ai2[0] = -12 + trunc(random() * 12.0) - Math.imul(j1, 2);
    ai3[0] = -50;
    ai[1] = 5 - trunc(random() * 5.0) + j1;
    ai2[1] = -12 + trunc(random() * 12.0) - Math.imul(j1, 2);
    ai3[1] = -50;
    ai[2] = 12 - trunc(random() * 12.0) + Math.imul(j1, 2);
    ai2[2] = -5 + trunc(random() * 5.0) - j1;
    ai3[2] = -50;
    ai[3] = 12 - trunc(random() * 12.0) + Math.imul(j1, 2);
    ai2[3] = 5 - trunc(random() * 5.0) + j1;
    ai3[3] = -50;
    ai[4] = 5 - trunc(random() * 5.0) + j1;
    ai2[4] = 12 - trunc(random() * 12.0) + Math.imul(j1, 2);
    ai3[4] = -50;
    ai[5] = -5 + trunc(random() * 5.0) - j1;
    ai2[5] = 12 - trunc(random() * 12.0) + Math.imul(j1, 2);
    ai3[5] = -50;
    ai[6] = -12 + trunc(random() * 12.0) - Math.imul(j1, 2);
    ai2[6] = 5 - trunc(random() * 5.0) + j1;
    ai3[6] = -50;
    ai[7] = -12 + trunc(random() * 12.0) - Math.imul(j1, 2);
    ai2[7] = -5 + trunc(random() * 5.0) - j1;
    ai3[7] = -50;
    if (j1 > 3) {
      j1 = 3;
    }
    this.dt(g, ai, ai2, ai3, i, j, k, l, i1, 0, 8, 0, 89 + Math.imul(j1, 20), 91 + Math.imul(j1, 20), 80 + Math.imul(j1, 20));
  }
}
