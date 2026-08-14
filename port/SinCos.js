// Transpiled from java-src/SinCos.java, line by line.
//
// Local names kept as procyon emitted them.  No restructuring.
//
// Numeric notes:
//   tcos / tsin are Float32Array — every store rounds to float32 automatically,
//   matching Java's explicit (float) cast in the constructor.
//
//   The angle expression `i * 0.017453292519943295` is int * double → double in
//   Java (and in JS).  No fr() is needed on the intermediate; Math.cos/sin
//   receive a double and the (float) cast is the Float32Array store.
//
//   getsin() and getcos() return the Float32Array element as a JS number, which
//   is already float32-rounded (Float32Array read returns a double that is the
//   nearest float32 value).  Callers must wrap every binary operation involving
//   the returned value in fr() — see TRANSPILE_SPEC §1.
//
//   §2 compound-assignment audit: the file contains i -= 360 and i += 360.
//   Both are pure int arithmetic (no float anywhere).  Neither matches the
//   `+= (int)(` or `-= (int)(` pattern; no §2 sites exist in this file.

import { floatArray } from './java.js';

export class SinCos {
  constructor() {
    this.tcos = floatArray(360);
    this.tsin = floatArray(360);
    let i = 0;
    do {
      this.tcos[i] = Math.cos(i * 0.017453292519943295);
    } while (++i < 360);
    i = 0;
    do {
      this.tsin[i] = Math.sin(i * 0.017453292519943295);
    } while (++i < 360);
  }

  getsin(i) {
    while (i >= 360) {
      i -= 360;
    }
    while (i < 0) {
      i += 360;
    }
    return this.tsin[i];
  }

  getcos(i) {
    while (i >= 360) {
      i -= 360;
    }
    while (i < 0) {
      i += 360;
    }
    return this.tcos[i];
  }
}
