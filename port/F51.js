// F51.js — the seam class. Hand-transpiled, NOT delegated (PORT_SPEC).
//
// F51 is a java.awt.Panel implementing Runnable: it owns the offscreen image,
// the game thread, the AWT 1.0 key handlers, the audio clips, the file loaders
// and the save cookies. Everything except the loaders and the key model is a
// place where Java's runtime does not exist in a browser, so this file is
// split deliberately:
//
//   TRANSPILED LINE BY LINE (the parsers and loaders, verified by probe):
//     getstring getint loadbase loadobjects loadmovers loadrots setmover
//     savegame loadsaved getslevel set0 initKeySettings initDefaultKeySettings
//     keyDown keyUp mouseDown lostFocus
//
//   REPLACED, with the reason written at each site:
//     init start run stop destroy paint update lstat playsounds getSound
//     getImage downloadall savecookie readcookie cookieDir open main
//
// The replaced ones are the do-not-delegate list from PORT_SPEC: threading,
// audio timing, the input model and file IO. Each keeps the original's
// observable behaviour and says what it does differently and why.
//
// Java 1.0 event codes: keyDown/keyUp take the int AWT produced, and
// KeySettings.txt is written in those numbers, so input.js maps DOM keys back
// to them rather than inventing a new scheme. See its header.

import { trunc, parseIntJava, colorOf, intArray, random } from './java.js';
import * as vfs from './vfs.js';
import * as assets from './assets.js';
import { Graphics2D, JImage, createImage, loadImage } from './graphics.js';
import { Clip, getSound as audioGetSound } from './audio.js';
import { Control } from './Control.js';
import { ContO } from './ContO.js';
import { Medium } from './Medium.js';
import { xtGraphics } from './xtGraphics.js';
import { Craft } from './Craft.js';
import { Tank } from './Tank.js';
import { userCraft } from './userCraft.js';

// Every asset path in the game is relative to the repo root; the port lives in
// port/. Resolve against this module, not against whatever page loaded it.
const REPO = new URL('../', import.meta.url).href;

export class F51 {
  constructor() {
    this.viewOneKeys = new Set();
    this.viewTwoKeys = new Set();
    this.viewThreeKeys = new Set();
    this.viewFourKeys = new Set();
    this.viewFiveKeys = new Set();
    this.nomusicKeys = new Set();
    this.switchmusicKeys = new Set();
    this.nosoundKeys = new Set();
    this.radarKeys = new Set();
    this.tabKeys = new Set();
    this.plusKeys = new Set();
    this.minsKeys = new Set();
    this.jumpKeys = new Set();
    this.enterKeys = new Set();
    this.fireKeys = new Set();
    this.leftKeys = new Set();
    this.rightKeys = new Set();
    this.downKeys = new Set();
    this.upKeys = new Set();
    this.viewOnePressedKeys = new Set();
    this.viewTwoPressedKeys = new Set();
    this.viewThreePressedKeys = new Set();
    this.viewFourPressedKeys = new Set();
    this.viewFivePressedKeys = new Set();
    this.radarPressedKeys = new Set();
    this.plusPressedKeys = new Set();
    this.minsPressedKeys = new Set();
    this.enterPressedKeys = new Set();
    this.tabPressedKeys = new Set();
    this.firePressedKeys = new Set();
    this.leftPressedKeys = new Set();
    this.rightPressedKeys = new Set();
    this.downPressedKeys = new Set();
    this.upPressedKeys = new Set();
    this.mon = true;
    this.moner = "Click here to Start";
    this.obj = new Array(53).fill(null);
    this.sndfrm = "default";
    this.nounif = false;
    this.u = new Control();
    this.tab = false;
    this.view = 0;
    this.maxco = 0;
    this.maxmo = -1;
    this.las = new Array(5).fill(null);
    this.mtrak = new Array(7).fill(null);
    this.loadet = new Array(7).fill(false);
    this.plow = false;
    this.pmed = false;
    this.pexph = false;
    this.pint = false;
    this.pmis = false;
    this.pman = false;
    this.psel = false;
    this.nomusic = false;
    this.nosound = false;
    this.enterd = false;
    this.sosun = false;
    this.pgrnd = 0;
    this.pdownl = 0;
    this.pupl = 0;
    this.lascnt = 0;
    this.crntt = -1;
    this.plcnt = 0;
    this.frags = 0;
    this.dnload = 0;

    this.rd = null;        // the offscreen Graphics (graphics.js)
    this.offImage = null;
    this.gamer = null;     // the rAF handle, where Java had a Thread
  }

  // --- the two parsers every loader goes through ---------------------------
  // Both walk from s.length() + 1, i.e. past "name(" — and both step j an
  // extra time on a ',' or ')', which is why a trailing ')' can walk off the
  // end. charAt/parseIntJava reproduce the Java throw (§5a); do not add a
  // bounds check the original does not have.

  getstring(s, s1, i) {
    let k = 0;
    let s2 = "";
    for (let j = s.length + 1; j < s1.length; ++j) {
      const s3 = "" + s1.charAt(j);
      if (s3 === "," || s3 === ")") {
        ++k;
        ++j;
      }
      if (k === i) {
        s2 += s1.charAt(j);
      }
    }
    return s2;
  }

  getint(s, s1, i) {
    let k = 0;
    let s2 = "";
    for (let j = s.length + 1; j < s1.length; ++j) {
      const s3 = "" + s1.charAt(j);
      if (s3 === "," || s3 === ")") {
        ++k;
        ++j;
      }
      if (k === i) {
        s2 += s1.charAt(j);
      }
    }
    // Integer.valueOf, which THROWS on garbage — the loaders rely on the
    // enclosing catch to abandon a malformed line (§5a).
    return parseIntJava(s2);
  }

  // --- loaders --------------------------------------------------------------

  loadrots(aconto, flag) {
    for (let i = 0; i < this.maxco; ++i) {
      aconto[i].loadrots(flag);
    }
  }

  // Java streams graphics/models.zrad with ZipInputStream inside the game
  // thread. vfs.js has already inflated it at boot (the entries come back in
  // stored order, which is the order this loop depends on).
  loadbase(aconto, medium) {
    try {
      const entries = vfs.zipEntries('graphics/models.zrad');
      let i = 0;
      for (const entry of entries) {
        aconto[i] = new ContO(entry.bytes, medium, 0, 0, 0);
        this.obj[i] = entry.name;
        ++i;
      }
    }
    catch (exception) {
      console.log("Error Reading Models: " + exception);
    }
  }

  loadobjects(aconto, aconto1, medium, s) {
    try {
      // Java swallows the FileNotFoundException here, and three of the five
      // clmap files are missing from the distribution — so on three runs in
      // five the cloud layer is simply absent. Reproduce it (§3).
      const lines = vfs.readLines("siters/" + s + ".txt");
      let flag = false;
      for (const s2 of lines) {
        const s3 = "" + s2.trim();
        if (s3.startsWith("l")) {
          const s4 = this.getstring("l", s3, 0);
          let i;
          let j;
          let k;
          if (!flag) {
            i = this.getint("l", s3, 1) * 10;
            j = this.getint("l", s3, 2) * 10;
            k = this.getint("l", s3, 3) * 10;
          }
          else {
            i = this.getint("l", s3, 1);
            j = this.getint("l", s3, 2);
            k = this.getint("l", s3, 3);
          }
          let l = 0;
          do {
            if (this.obj[l] === s4 + ".rad") {
              aconto[this.maxco] = new ContO(medium, aconto1[l], i, j, k);
              ++this.maxco;
            }
          } while (++l < 53);
        }
        if (s3.startsWith("xy")) {
          aconto[this.maxco - 1].xy = this.getint("xy", s3, 0);
        }
        if (s3.startsWith("xz")) {
          aconto[this.maxco - 1].xz = this.getint("xz", s3, 0);
        }
        if (s3.startsWith("zy")) {
          aconto[this.maxco - 1].zy = this.getint("zy", s3, 0);
        }
        if (s3.startsWith("xmult")) {
          flag = !flag;
        }
      }
    }
    catch (ex) {}
  }

  loadmovers(ai, ai1, aconto, acraft, atank, usercraft, xtgraphics) {
    for (let i = 1; i < this.maxmo; ++i) {
      aconto[ai[i]].out = true;
    }
    this.maxmo = 1;
    xtgraphics.nb = 0;
    xtgraphics.mcomp = false;
    try {
      const lines = vfs.readLines("levels/" + xtgraphics.level + ".txt");
      for (const s of lines) {
        const s2 = "" + s.trim();
        if (s2.startsWith("craft")) {
          ai[this.maxmo] = this.getint("craft", s2, 0);
          ai1[this.maxmo] = 0;
        }
        if (s2.startsWith("tank")) {
          ai[this.maxmo] = this.getint("tank", s2, 0);
          ai1[this.maxmo] = 1;
        }
        if (s2.startsWith("name")) {
          xtgraphics.mname[this.maxmo - 1] = this.getstring("name", s2, 0);
          xtgraphics.cnte[this.maxmo - 1] = 0;
        }
        if (s2.startsWith("l")) {
          aconto[ai[this.maxmo]].x = this.getint("l", s2, 0) * 10;
          aconto[ai[this.maxmo]].y = this.getint("l", s2, 1) * 10;
          aconto[ai[this.maxmo]].z = this.getint("l", s2, 2) * 10;
          aconto[ai[this.maxmo]].out = false;
          aconto[ai[this.maxmo]].reset();
        }
        if (s2.startsWith("prompt")) {
          if (this.getstring("prompt", s2, 0) === "tank") {
            xtgraphics.tnk[xtgraphics.nb] = true;
          }
          else {
            xtgraphics.tnk[xtgraphics.nb] = false;
          }
          xtgraphics.ob[xtgraphics.nb] = this.getint("prompt", s2, 1);
          xtgraphics.nam[xtgraphics.nb] = this.getstring("prompt", s2, 2).replaceAll('|', ',');
          ++xtgraphics.nb;
        }
        if (s2.startsWith("stat")) {
          if (ai1[this.maxmo] === 0) {
            acraft[this.maxmo].reset(this.getint("stat", s2, 0), this.getint("stat", s2, 1), this.getint("stat", s2, 2), this.getint("stat", s2, 3), this.getint("stat", s2, 4), this.getint("stat", s2, 5));
          }
          else {
            atank[this.maxmo].reset(this.getint("stat", s2, 0), this.getint("stat", s2, 1));
          }
          ++this.maxmo;
        }
      }
    }
    catch (ex) {}
  }

  setmover(ai, aconto, usercraft, xtgraphics) {
    let i = 0;
    do {
      aconto[i].out = true;
      aconto[i].wire = false;
    } while (++i < 5);
    ai[0] = xtgraphics.selected;
    aconto[ai[0]].x = 3000;
    aconto[ai[0]].y = 250;
    aconto[ai[0]].z = -500;
    aconto[ai[0]].out = false;
    usercraft.reset(ai[0]);
    aconto[ai[0]].reset();
    aconto[ai[0]].xz = 360;
    this.u.jump = 0;
    xtgraphics.creset();
  }

  // --- saves ----------------------------------------------------------------
  // Java writes one file per key under cookies/. vfs.js keeps them in
  // localStorage under the same names; readcookie returns 0 for a missing or
  // unparseable key exactly as the Java's catch does.

  savecookie(s, s1) {
    try {
      vfs.savecookie(s, s1);
    }
    catch (ex) {}
  }

  readcookie(s) {
    let i = 0;
    try {
      i = vfs.readcookie(s);
    }
    catch (ex) {}
    return i;
  }

  cookieDir() {
    // Java mkdir()s cookies/. localStorage needs no directory.
    return true;
  }

  set0() {
    try {
      this.savecookie("radxv", "0");
    }
    catch (ex) {}
  }

  savegame(aconto, xtgraphics, i) {
    try {
      this.savecookie("radxv", String(xtgraphics.level));
      for (let j = i; j < i + 13; ++j) {
        this.savecookie("radnhits" + String(j), String(aconto[j].nhits));
      }
      let k = 0;
      do {
        this.savecookie("raddest" + String(k), String(xtgraphics.dest[k] ? 1 : 0));
      } while (++k < 5);
      xtgraphics.sgame = 1;
    }
    catch (ex) {}
  }

  getslevel(xtgraphics) {
    try {
      const i = this.readcookie("radxv");
      if (i === 0) {
        xtgraphics.sgame = 0;
      }
      else {
        xtgraphics.sgame = 1;
        xtgraphics.select = 1;
      }
    }
    catch (ex) {}
  }

  loadsaved(aconto, xtgraphics, i) {
    try {
      xtgraphics.level = this.readcookie("radxv");
      for (let j = i; j < i + 13; ++j) {
        aconto[j].nhits = this.readcookie("radnhits" + String(j));
        if (aconto[j].nhits >= aconto[j].maxhits) {
          aconto[j].exp = true;
          aconto[j].out = true;
        }
        else {
          aconto[j].out = false;
        }
      }
      let k = 0;
      do {
        const i2 = this.readcookie("raddest" + String(k));
        if (i2 === 0) {
          xtgraphics.dest[k] = false;
        }
        else {
          xtgraphics.dest[k] = true;
        }
      } while (++k < 5);
    }
    catch (ex) {}
  }

  // --- key bindings ---------------------------------------------------------

  initKeySettings() {
    try {
      if (!vfs.has("KeySettings.txt")) {
        return false;   // Java's FileReader throws IOException -> false
      }
      const lines = vfs.readLines("KeySettings.txt");
      for (const string of lines) {
        if (string.startsWith("viewOne(")) {
          this.viewOneKeys.add(this.getint("viewOne", string, 0));
        }
        if (string.startsWith("viewTwo(")) {
          this.viewTwoKeys.add(this.getint("viewTwo", string, 0));
        }
        if (string.startsWith("viewThree(")) {
          this.viewThreeKeys.add(this.getint("viewThree", string, 0));
        }
        if (string.startsWith("viewFour(")) {
          this.viewFourKeys.add(this.getint("viewFour", string, 0));
        }
        if (string.startsWith("viewFive(")) {
          this.viewFiveKeys.add(this.getint("viewFive", string, 0));
        }
        if (string.startsWith("nomusic(")) {
          this.nomusicKeys.add(this.getint("nomusic", string, 0));
        }
        if (string.startsWith("switchmusic(")) {
          this.switchmusicKeys.add(this.getint("switchmusic", string, 0));
        }
        if (string.startsWith("nosound(")) {
          this.nosoundKeys.add(this.getint("nosound", string, 0));
        }
        if (string.startsWith("radar(")) {
          this.radarKeys.add(this.getint("radar", string, 0));
        }
        if (string.startsWith("tab(")) {
          this.tabKeys.add(this.getint("tab", string, 0));
        }
        if (string.startsWith("plus(")) {
          this.plusKeys.add(this.getint("plus", string, 0));
        }
        if (string.startsWith("mins(")) {
          this.minsKeys.add(this.getint("mins", string, 0));
        }
        if (string.startsWith("jump(")) {
          this.jumpKeys.add(this.getint("jump", string, 0));
        }
        if (string.startsWith("enter(")) {
          this.enterKeys.add(this.getint("enter", string, 0));
        }
        if (string.startsWith("fire(")) {
          this.fireKeys.add(this.getint("fire", string, 0));
        }
        if (string.startsWith("left(")) {
          this.leftKeys.add(this.getint("left", string, 0));
        }
        if (string.startsWith("right(")) {
          this.rightKeys.add(this.getint("right", string, 0));
        }
        if (string.startsWith("down(")) {
          this.downKeys.add(this.getint("down", string, 0));
        }
        if (string.startsWith("up(")) {
          this.upKeys.add(this.getint("up", string, 0));
        }
      }
    }
    catch (ex) {
      return false;
    }
    return true;
  }

  initDefaultKeySettings() {
    this.viewOneKeys.add(49);
    this.viewTwoKeys.add(50);
    this.viewThreeKeys.add(51);
    this.viewFourKeys.add(52);
    this.viewFiveKeys.add(53);
    this.nomusicKeys.add(109);
    this.nomusicKeys.add(77);
    this.switchmusicKeys.add(116);
    this.switchmusicKeys.add(84);
    this.nosoundKeys.add(115);
    this.nosoundKeys.add(83);
    this.radarKeys.add(114);
    this.radarKeys.add(82);
    this.tabKeys.add(9);
    this.plusKeys.add(43);
    this.plusKeys.add(61);
    this.minsKeys.add(45);
    this.minsKeys.add(8);
    this.jumpKeys.add(106);
    this.jumpKeys.add(74);
    this.enterKeys.add(10);
    this.enterKeys.add(27);
    this.fireKeys.add(32);
    this.leftKeys.add(1006);
    this.rightKeys.add(1007);
    this.downKeys.add(1005);
    this.upKeys.add(1004);
  }

  keyDown(event, i) {
    if (this.viewOneKeys.has(i)) {
      this.viewOnePressedKeys.add(i);
      this.view = 1;
    }
    if (this.viewTwoKeys.has(i)) {
      this.viewTwoPressedKeys.add(i);
      this.view = 2;
    }
    if (this.viewThreeKeys.has(i)) {
      this.viewThreePressedKeys.add(i);
      this.view = 3;
    }
    if (this.viewFourKeys.has(i)) {
      this.viewFourPressedKeys.add(i);
      this.view = 4;
    }
    if (this.viewFiveKeys.has(i)) {
      this.viewFivePressedKeys.add(i);
      this.view = 5;
    }
    if (this.nomusicKeys.has(i)) {
      if (this.nomusic) {
        this.nomusic = false;
      }
      else {
        this.nomusic = true;
        if (this.plcnt >= 100 && this.crntt !== -1) {
          this.mtrak[this.crntt].stop();
          --this.crntt;
          this.plcnt = 95;
        }
      }
    }
    if (this.switchmusicKeys.has(i)) {
      if (this.plcnt >= 100) {
        this.mtrak[this.crntt].stop();
      }
      this.plcnt = 95;
    }
    if (this.nosoundKeys.has(i)) {
      if (this.nosound) {
        this.nosound = false;
      }
      else {
        this.nosound = true;
      }
    }
    if (this.radarKeys.has(i)) {
      this.radarPressedKeys.add(i);
      this.u.radar = true;
    }
    if (this.tabKeys.has(i)) {
      this.tabPressedKeys.add(i);
      this.tab = true;
    }
    if (this.plusKeys.has(i)) {
      this.plusPressedKeys.add(i);
      this.u.plus = true;
    }
    if (this.minsKeys.has(i)) {
      this.minsPressedKeys.add(i);
      this.u.mins = true;
    }
    if (this.jumpKeys.has(i) && this.u.jump === 0) {
      this.u.jump = 1;
      if (!this.u.jade) {
        this.u.jade = true;
      }
    }
    if (this.enterKeys.has(i) && !this.enterd) {
      this.enterPressedKeys.add(i);
      this.u.space = true;
      this.enterd = true;
    }
    if (this.fireKeys.has(i)) {
      this.firePressedKeys.add(i);
      this.u.fire = true;
    }
    if (this.leftKeys.has(i)) {
      this.leftPressedKeys.add(i);
      this.u.left = true;
    }
    if (this.rightKeys.has(i)) {
      this.rightPressedKeys.add(i);
      this.u.right = true;
    }
    if (this.downKeys.has(i)) {
      this.downPressedKeys.add(i);
      this.u.down = true;
    }
    if (this.upKeys.has(i)) {
      this.upPressedKeys.add(i);
      this.u.up = true;
    }
    return false;
  }

  keyUp(event, i) {
    if (this.viewOnePressedKeys.has(i)) {
      this.viewOnePressedKeys.delete(i);
      if (this.viewOnePressedKeys.size === 0 && this.view === 1) {
        this.view = 0;
      }
    }
    if (this.viewTwoPressedKeys.has(i)) {
      this.viewTwoPressedKeys.delete(i);
      if (this.viewTwoPressedKeys.size === 0 && this.view === 2) {
        this.view = 0;
      }
    }
    if (this.viewThreePressedKeys.has(i)) {
      this.viewThreePressedKeys.delete(i);
      if (this.viewThreePressedKeys.size === 0 && this.view === 3) {
        this.view = 0;
      }
    }
    if (this.viewFourPressedKeys.has(i)) {
      this.viewFourPressedKeys.delete(i);
      if (this.viewFourPressedKeys.size === 0 && this.view === 4) {
        this.view = 0;
      }
    }
    if (this.viewFivePressedKeys.has(i)) {
      this.viewFivePressedKeys.delete(i);
      if (this.viewFivePressedKeys.size === 0 && this.view === 5) {
        this.view = 0;
      }
    }
    if (this.radarPressedKeys.has(i)) {
      this.radarPressedKeys.delete(i);
      if (this.radarPressedKeys.size === 0) {
        this.u.radar = false;
      }
    }
    if (this.plusPressedKeys.has(i)) {
      this.plusPressedKeys.delete(i);
      if (this.plusPressedKeys.size === 0) {
        this.u.plus = false;
      }
    }
    if (this.minsPressedKeys.has(i)) {
      this.minsPressedKeys.delete(i);
      if (this.minsPressedKeys.size === 0) {
        this.u.mins = false;
      }
    }
    // NOTE the asymmetry: this one tests enterKeys, where all fifteen of its
    // neighbours test their *PressedKeys set. Verified in the bytecode
    // (keyUp offset 426: getfield enterKeys ; contains), so it is the author's
    // slip and not procyon's. Keep it (§3).
    if (this.enterKeys.has(i)) {
      this.enterPressedKeys.delete(i);
      if (this.enterPressedKeys.size === 0) {
        this.enterd = false;
      }
    }
    if (this.tabPressedKeys.has(i)) {
      this.tabPressedKeys.delete(i);
      if (this.tabPressedKeys.size === 0) {
        this.tab = false;
      }
    }
    if (this.firePressedKeys.has(i)) {
      this.firePressedKeys.delete(i);
      if (this.firePressedKeys.size === 0) {
        this.u.fire = false;
      }
    }
    if (this.leftPressedKeys.has(i)) {
      this.leftPressedKeys.delete(i);
      if (this.leftPressedKeys.size === 0) {
        this.u.left = false;
      }
    }
    if (this.rightPressedKeys.has(i)) {
      this.rightPressedKeys.delete(i);
      if (this.rightPressedKeys.size === 0) {
        this.u.right = false;
      }
    }
    if (this.downPressedKeys.has(i)) {
      this.downPressedKeys.delete(i);
      if (this.downPressedKeys.size === 0) {
        this.u.down = false;
      }
    }
    if (this.upPressedKeys.has(i)) {
      this.upPressedKeys.delete(i);
      if (this.upPressedKeys.size === 0) {
        this.u.up = false;
      }
    }
    return false;
  }

  mouseDown(event, i, j) {
    if (this.maxmo !== -1) {
      this.mon = false;
      if (this.moner === "Click here to Start") {
        this.moner = "Click here to Continue";
      }
    }
    if (this.u.canclick) {
      this.u.space = true;
    }
    return true;
  }

  lostFocus(event, obj1) {
    // Transpiled as-is. The browser equivalent of losing window focus is the
    // 'blur' event; main.js wires it here so a key held across an alt-tab does
    // not stick down.
    if (!this.nounif) {
      this.mon = true;
    }
    if (this.maxmo !== -1) {
      this.view = 0;
      this.u.radar = false;
      this.u.plus = false;
      this.u.mins = false;
      this.enterd = false;
      this.tab = false;
      this.u.fire = false;
      this.u.left = false;
      this.u.right = false;
      this.u.down = false;
      this.u.up = false;
    }
    return false;
  }

  // --- the loading screen ---------------------------------------------------
  // Java repaints between loads, on the game thread, and the whole boot is
  // synchronous. Here the assets are already in the VFS, so lstat only draws;
  // main.js yields a frame between calls so the bar is actually seen.

  lstat(s, i) {
    this.dnload += i;
    this.rd.setColor(colorOf(223, 223, 223));
    this.rd.fillRect(0, 0, 500, 360);
    this.rd.setColor(colorOf(174, 185, 198));
    this.rd.drawRect(150, 200, 200, 5);
    this.rd.fillRect(150, 200, 24 + trunc(this.dnload / 594.0 * 176.0), 5);
    this.rd.setColor(colorOf(151, 166, 183));
    this.rd.drawString(s, 290, 220);
    this.rd.drawString("Remaining: " + (594 - this.dnload) + " KB", 202, 250);
    this.rd.setColor(colorOf(0, 0, 0));
    this.rd.drawString("Loading " + trunc((24 + trunc(this.dnload / 594.0 * 176.0)) / 200.0 * 100.0) + "%", 103, 194);
    this.repaint();
  }

  paint(g) {
    // Java blits the offscreen image into the Panel. graphics.js draws
    // straight into the visible canvas, so this is where the frame is
    // presented; main.js calls it once per rAF tick.
    g.drawImage(this.offImage, 0, 0, this);
  }

  update(g) {
    this.paint(g);
  }

  repaint() {
    // AWT's asynchronous repaint(). Under rAF the frame is presented by the
    // pacer, so this is a no-op rather than a queued event.
  }

  // --- seams and life cycle -------------------------------------------------

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{scale?: number}} [opts] — `scale` 2 renders the same 500x360 game
   *        coordinates onto a 1000x720 backing store. See Graphics2D.
   */
  async init(canvas, opts = {}) {
    const scale = opts.scale || 1;
    this.scale = scale;

    // 2. GRAPHICS: create the offscreen surface / Graphics2D over the canvas
    if (canvas) {
      // The game's coordinates are fixed at 500x360; only the backing store
      // grows. main.html sizes the element in CSS, so this changes sharpness,
      // not layout.
      if (canvas.width !== 500 * scale || canvas.height !== 360 * scale) {
        canvas.width = 500 * scale;
        canvas.height = 360 * scale;
      }
      this.offImage = new JImage(canvas);
      this.rd = this.offImage.getGraphics(scale);
    } else {
      this.offImage = createImage(500 * scale, 360 * scale);
      this.rd = this.offImage.getGraphics(scale);
    }
    this.rd.setFont("SansSerif", 1, 11);
    this.cookieDir();

    // 4. FILES: preload VFS assets and base models zip before loaders run.
    //
    // The game's paths are relative to the REPO ROOT ("siters/base.txt"), and
    // the port lives one directory down in port/. Resolving that against
    // import.meta.url rather than against the page means a harness page at any
    // depth — port/main.html, port/tools/boot-smoke.html — resolves the same
    // assets; a bare '../' silently 404s from anywhere but port/.
    vfs.setFpath(REPO);
    await vfs.preload(assets.VFS_FILES);
    await vfs.preloadZip(assets.MODELS_ZIP);

    // 2. Preload images so getImage(s) can stay synchronous, the way
    // ImageIO.read was inside run().
    //
    // A missing image is NOT swallowed. The Java prints the stack trace and
    // carries on with a null Image, which then draws nothing; vfs.js takes the
    // opposite line for the same reason — a failed boot is far easier to debug
    // than a game running with half its graphics silently absent.
    this._images = new Map();
    for (const path of assets.IMAGES) {
      this._images.set(path, await loadImage(REPO + path));
    }

    // 3. Preload audio so getSound(s) can stay synchronous too.
    //
    // Only the "default" sound set: sndfrm is chosen by run()'s
    // `"".startsWith("sun.")` test, which is always false, so "newsun" is dead
    // code — and that directory ships .au files, so asking for its .wav names
    // would be sixteen guaranteed 404s.
    //
    // Sound, unlike graphics, is not required to play: a browser that refuses
    // to decode a clip should leave the game running and silent, so these are
    // collected and reported rather than thrown.
    this._sounds = new Map();
    const soundPaths = [...assets.MUSIC, ...assets.sounds('default')];
    const failed = [];
    for (const path of soundPaths) {
      try {
        this._sounds.set(path, await audioGetSound(REPO + path));
      } catch (e) {
        failed.push(path);
      }
    }
    if (failed.length > 0) {
      console.warn(`audio unavailable, the game runs silent: ${failed.join(', ')}`);
    }

    if (!this.initKeySettings()) {
      this.initDefaultKeySettings();
    }
  }

  getImage(s) {
    return this._images?.get(s) ?? null;
  }

  getSound(s) {
    const cached = this._sounds?.get(s);
    if (cached) {
      return new Clip(cached.buffer);
    }
    return new Clip(null);
  }

  start() {
    if (this.gamer === null) {
      this.gamer = true;
      this.run();
    }
  }

  stop() {
    if (this.into) this.into.stop();
    if (this.miso) this.miso.stop();
    if (this.selo) this.selo.stop();
    if (this.mano) this.mano.stop();
    if (this.upl) this.upl.stop();
    if (this.downl) this.downl.stop();
    if (this.low) this.low.stop();
    if (this.med) this.med.stop();
    if (this.ljump) this.ljump.stop();
    if (this.grnd) this.grnd.stop();
    if (this.exp) this.exp.stop();
    if (this.exph) this.exph.stop();
    if (this.hit) this.hit.stop();
    if (this.hitl) this.hitl.stop();
    if (this.charged) this.charged.stop();
    let i = 0;
    do {
      if (this.las[i]) {
        this.las[i].stop();
      }
    } while (++i < 5);
    i = 0;
    do {
      if (this.loadet[i] && this.mtrak[i]) {
        this.mtrak[i].stop();
      }
    } while (++i < 7);
    this.gamer = null;
    if (this.rd) {
      this.rd.dispose();
    }
  }

  destroy() {
    this.stop();
    this.gamer = null;
  }

  open(url) {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  downloadall(xtgraphics) {
    xtgraphics.radar = this.getImage("graphics/radar.gif");
    this.lstat("Loading Images...", 1);
    xtgraphics.stube = this.getImage("graphics/stube.gif");
    this.lstat("Loading Images...", 2);
    xtgraphics.sback = this.getImage("graphics/select.jpg");
    this.lstat("Loading Images...", 18);
    xtgraphics.destr = this.getImage("graphics/destroyed.gif");
    this.lstat("Loading Images...", 2);
    xtgraphics.saveit(this.getImage("graphics/failed.jpg"), xtgraphics.bpix);
    this.lstat("Loading Images...", 31);
    xtgraphics.saveit(this.getImage("graphics/mission.jpg"), xtgraphics.mpix);
    this.lstat("Loading Images...", 22);
    xtgraphics.saveit(this.getImage("graphics/over.jpg"), xtgraphics.opix);
    this.lstat("Loading Images...", 21);
    xtgraphics.saveit(this.getImage("graphics/paused.jpg"), xtgraphics.ppix);
    this.lstat("Loading Images...", 10);
    xtgraphics.lay = this.getImage("graphics/layout.gif");
    this.lstat("Loading Images...", 1);
    xtgraphics.complete = this.getImage("graphics/comp.gif");
    this.lstat("Loading Images...", 2);
    xtgraphics.main = this.getImage("graphics/main.gif");
    this.lstat("Loading Images...", 32);
    xtgraphics.rad = this.getImage("graphics/radicalplay.gif");
    this.lstat("Loading Images...", 2);
    let i = 0;
    do {
      xtgraphics.as[i] = this.getImage("graphics/a" + i + ".gif");
      this.lstat("Loading Images...", 1);
    } while (++i < 5);
    xtgraphics.inst1 = this.getImage("graphics/inst1.gif");
    this.lstat("Loading Images...", 10);
    xtgraphics.inst2 = this.getImage("graphics/inst2.gif");
    this.lstat("Loading Images...", 11);
    xtgraphics.inst3 = this.getImage("graphics/inst3.gif");
    this.lstat("Loading Images...", 4);
    xtgraphics.text = this.getImage("graphics/text.gif");
    this.lstat("Loading Images...", 6);
    xtgraphics.mars = this.getImage("graphics/mars.jpg");
    this.lstat("Loading Images...", 15);
    this.into = this.getSound("music/intro.wav");
    this.lstat("Loading Music...", 24);
    this.miso = this.getSound("music/mission.wav");
    this.lstat("Loading Music...", 29);
    this.selo = this.getSound("music/select.wav");
    this.lstat("Loading Music...", 52);
    this.mano = this.getSound("music/main.wav");
    this.lstat("Loading Music...", 50);
    this.upl = this.getSound("sounds/" + this.sndfrm + "/up.wav");
    this.lstat("Loading Sound Effects...", 11);
    this.hitl = this.getSound("sounds/" + this.sndfrm + "/hitl.wav");
    this.lstat("Loading Sound Effects...", 7);
    this.downl = this.getSound("sounds/" + this.sndfrm + "/down.wav");
    this.lstat("Loading Sound Effects...", 10);
    this.low = this.getSound("sounds/" + this.sndfrm + "/low.wav");
    this.lstat("Loading Sound Effects...", 11);
    this.med = this.getSound("sounds/" + this.sndfrm + "/med.wav");
    this.lstat("Loading Sound Effects...", 6);
    this.ljump = this.getSound("sounds/" + this.sndfrm + "/jump.wav");
    this.lstat("Loading Sound Effects...", 25);
    this.grnd = this.getSound("sounds/" + this.sndfrm + "/grnd.wav");
    this.lstat("Loading Sound Effects...", 5);
    this.exp = this.getSound("sounds/" + this.sndfrm + "/exp.wav");
    this.lstat("Loading Sound Effects...", 10);
    this.exph = this.getSound("sounds/" + this.sndfrm + "/exph.wav");
    this.lstat("Loading Sound Effects...", 12);
    this.hit = this.getSound("sounds/" + this.sndfrm + "/hit.wav");
    this.lstat("Loading Sound Effects...", 25);
    i = 0;
    do {
      this.las[i] = this.getSound("sounds/" + this.sndfrm + "/l" + i + ".wav");
      this.lstat("Loading Sound Effects...", 9);
    } while (++i < 5);
    this.charged = this.getSound("sounds/" + this.sndfrm + "/charged.wav");
    this.lstat("Loading Sound Effects...", 12);
  }

  playsounds(usercraft, conto, flag, xtgraphics) {
    if (!flag) {
      if (!this.nosound) {
        if (!conto.exp && usercraft.speed > 10.0 && !this.pmed) {
          if (!this.plow) {
            this.low.loop(-1);
            this.plow = true;
          }
        }
        else if (this.plow) {
          this.low.stop();
          this.plow = false;
        }
        if (usercraft.speed > 65.0) {
          if (!this.pmed) {
            this.med.loop(-1);
            this.pmed = true;
          }
        }
        else if (this.pmed) {
          this.med.stop();
          this.pmed = false;
        }
        if (usercraft.speed > 65.0 && this.u.up) {
          if (this.pupl === 0) {
            this.pupl = 70;
            this.upl.setFramePosition(0);
            this.upl.start();
          }
        }
        else if (this.pupl !== 0) {
          --this.pupl;
        }
        if (usercraft.speed > 65.0 && this.u.down) {
          if (this.pdownl === 0) {
            this.pdownl = 70;
            this.downl.setFramePosition(0);
            this.downl.start();
          }
        }
        else if (this.pdownl !== 0) {
          --this.pdownl;
        }
        if (usercraft.speed === 400.0) {
          this.ljump.setFramePosition(0);
          this.ljump.start();
        }
        if (usercraft.ester === 1) {
          this.charged.setFramePosition(0);
          this.charged.start();
        }
        if (conto.hit && this.frags === 0) {
          this.hit.setFramePosition(0);
          this.hit.start();
          if (this.sosun) {
            this.frags = 3;
          }
        }
        if (this.sosun && this.frags !== 0) {
          --this.frags;
        }
        if (this.u.fire && !conto.exp) {
          if (this.lascnt === 0) {
            this.las[usercraft.ltyp].setFramePosition(0);
            this.las[usercraft.ltyp].start();
            this.lascnt = 14;
          }
          else {
            --this.lascnt;
          }
        }
        else if (this.lascnt !== 0) {
          this.lascnt = 0;
        }
        if (this.pgrnd === 0) {
          if (!conto.exp && conto.y > 200 && (usercraft.sms[0] === 1 || usercraft.sms[1] === 1 || usercraft.sms[2] === 1 || usercraft.sms[3] === 1)) {
            this.grnd.setFramePosition(0);
            this.grnd.start();
            this.pgrnd = 2;
          }
        }
        else {
          --this.pgrnd;
        }
        if (conto.exp) {
          if (!this.pexph) {
            this.exph.setFramePosition(0);
            this.exph.start();
            this.pexph = true;
          }
        }
        else if (this.pexph) {
          this.pexph = false;
        }
      }
      else {
        if (this.pmed) {
          this.med.stop();
          this.pmed = false;
        }
        if (this.plow) {
          this.low.stop();
          this.plow = false;
        }
      }
      if (this.psel) {
        this.selo.stop();
        this.psel = false;
      }
      if (this.plcnt === 100) {
        ++this.crntt;
        if (this.crntt === 7) {
          this.crntt = 0;
        }
        if (this.loadet[this.crntt]) {
          this.mtrak[this.crntt].loop(-1);
        }
        else {
          this.crntt = -1;
          let i = 6;
          do {
            if (this.loadet[i]) {
              this.crntt = i;
            }
          } while (--i >= 0);
          if (this.crntt !== -1) {
            this.mtrak[this.crntt].loop(-1);
          }
        }
      }
      if (this.plcnt !== 2000) {
        if (!this.nomusic) {
          ++this.plcnt;
        }
      }
      else {
        this.plcnt = 80;
        this.mtrak[this.crntt].stop();
      }
    }
    else {
      if (this.pmed) {
        this.med.stop();
        this.pmed = false;
      }
      if (this.plow) {
        this.low.stop();
        this.plow = false;
      }
      if (this.plcnt !== 0 && this.crntt !== -1 && xtgraphics.fase !== -4 && xtgraphics.fase !== 1 && xtgraphics.fase !== 2) {
        if (this.plcnt >= 100) {
          this.mtrak[this.crntt].stop();
        }
        if (xtgraphics.fase === 3 && this.plcnt >= 100) {
          --this.crntt;
        }
        this.plcnt = 0;
      }
      if (xtgraphics.fase === -8 && xtgraphics.cnty < 351 && !this.nomusic) {
        if (!this.pint) {
          this.into.loop(-1);
          this.pint = true;
        }
      }
      else {
        if (this.pint) {
          this.into.stop();
          this.pint = false;
        }
        if (xtgraphics.cnty === 352) {
          this.hit.setFramePosition(0);
          this.hit.start();
          xtgraphics.cnty = 353;
        }
      }
      if ((xtgraphics.fase === -5 || xtgraphics.fase === 7) && !this.nomusic) {
        if (!this.pman) {
          this.mano.loop(-1);
          this.pman = true;
        }
      }
      else if (this.pman) {
        this.mano.stop();
        this.pman = false;
      }
      if (xtgraphics.fase === -1 && !this.nomusic) {
        if (!this.pmis) {
          this.miso.loop(-1);
          this.pmis = true;
        }
      }
      else if (this.pmis) {
        this.miso.stop();
        this.pmis = false;
      }
      if ((xtgraphics.fase === 0 || xtgraphics.fase === 5 || xtgraphics.fase === 6) && !this.nomusic) {
        if (!this.psel) {
          this.selo.loop(-1);
          this.psel = true;
        }
      }
      else if (this.psel) {
        this.selo.stop();
        this.psel = false;
      }
      if (xtgraphics.fase === 7) {
        if (this.pupl === 0) {
          this.pupl = 30;
          this.upl.setFramePosition(0);
          this.upl.start();
        }
        else {
          --this.pupl;
        }
      }
    }
  }

  async run() {
    // Thread priority (this.gamer.setPriority(10)) has no browser JS equivalent.
    const medium = new Medium();
    const xtgraphics = new xtGraphics(medium, this.rd);
    let i = 5;
    const s = "1.8";
    const s2 = "";
    if (s2.startsWith("sun.")) {
      if (s.startsWith("1.3")) {
        xtgraphics.goodsun = true;
      }
      else if (s.startsWith("1.4")) {
        this.sosun = true;
      }
      else {
        this.sosun = true;
        this.sndfrm = "newsun";
      }
      i = 15;
    }
    this.lstat("Preparing for loading...", 0);
    const aconto = new Array(53).fill(null);
    const aconto2 = new Array(3000).fill(null);
    const usercraft = new userCraft(medium);
    const atank = new Array(20).fill(null);
    let j = 0;
    do {
      atank[j] = new Tank(medium);
    } while (++j < 20);
    const acraft = new Array(20).fill(null);
    let k = 0;
    do {
      acraft[k] = new Craft(medium);
    } while (++k < 20);
    this.loadbase(aconto, medium);
    this.lstat("Loading 3D Models...", 17);
    k = 0;
    this.loadobjects(aconto2, aconto, medium, "aces");
    this.lstat("Loading 3D Models...", 1);
    k = this.maxco;
    this.loadobjects(aconto2, aconto, medium, "base");
    this.lstat("Loading 3D Models...", 2);
    this.loadobjects(aconto2, aconto, medium, "smap");
    this.lstat("Loading 3D Models...", 44);
    this.loadobjects(aconto2, aconto, medium, "clmap" + trunc(random() * 5.0) + "");
    this.lstat("Loading 3D Models...", 1);
    this.loadrots(aconto2, true);
    let l = 0;
    const ai = intArray(600);
    for (let i2 = 0; i2 < this.maxco; ++i2) {
      if (aconto2[i2].colides) {
        ai[l] = i2;
        ++l;
      }
    }
    const ai2 = intArray(20);
    const ai3 = intArray(20);
    let j2 = 0;
    do {
      this.loadet[j2] = false;
    } while (++j2 < 7);
    this.downloadall(xtgraphics);
    const date = new Date();
    const l2 = 0;
    let l3 = Date.now();
    let f = 30.0;
    let f2 = 35.0;
    let flag = false;
    let k2 = 0;
    let i3 = 0;
    let flag2 = true;
    this.maxmo = 0;
    const raf = typeof requestAnimationFrame !== 'undefined'
      ? requestAnimationFrame
      : (cb) => setTimeout(cb, 16);

    while (this.gamer) {
      let date2 = new Date();
      const l4 = Date.now();
      if (!this.mon) {
        if (!flag2) {
          medium.d(this.rd);
          let j3 = 0;
          const ai4 = intArray(100);
          for (let j4 = 0; j4 < this.maxco; ++j4) {
            if (aconto2[j4].dist !== 0) {
              ai4[j3] = j4;
              ++j3;
            }
            else {
              aconto2[j4].d(this.rd);
            }
          }
          const ai5 = intArray(j3);
          for (let i4 = 0; i4 < j3; ++i4) {
            ai5[i4] = 0;
            for (let k3 = 0; k3 < j3; ++k3) {
              if (aconto2[ai4[i4]].dist !== aconto2[ai4[k3]].dist) {
                if (aconto2[ai4[i4]].dist < aconto2[ai4[k3]].dist) {
                  const array = ai5;
                  const n = i4;
                  ++array[n];
                }
              }
              else if (k3 > i4) {
                const array2 = ai5;
                const n2 = i4;
                ++array2[n2];
              }
            }
          }
          for (let j5 = 0; j5 < j3; ++j5) {
            for (let l5 = 0; l5 < j3; ++l5) {
              if (ai5[l5] === j5) {
                if (aconto2[ai4[l5]].fire) {
                  if (ai4[l5] === ai2[0]) {
                    usercraft.dl(this.rd);
                  }
                  else {
                    for (let k4 = 1; k4 < this.maxmo; ++k4) {
                      if (ai4[l5] === ai2[k4]) {
                        if (ai3[k4] === 0) {
                          acraft[k4].dl(this.rd);
                        }
                        if (ai3[k4] === 1) {
                          atank[k4].dl(this.rd);
                        }
                      }
                    }
                  }
                }
                aconto2[ai4[l5]].d(this.rd);
              }
            }
          }
          if (xtgraphics.level < 6) {
            for (let k5 = 0; k5 < l; ++k5) {
              for (let i5 = 0; i5 < this.maxmo; ++i5) {
                if (ai2[i5] !== ai[k5]) {
                  aconto2[ai[k5]].tryexp(aconto2[ai2[i5]]);
                  if (aconto2[ai2[i5]].fire) {
                    if (i5 === 0) {
                      usercraft.lasercolid(aconto2[ai[k5]]);
                    }
                    else {
                      if (ai3[i5] === 0) {
                        acraft[i5].lasercolid(aconto2[ai[k5]]);
                      }
                      if (ai3[i5] === 1) {
                        atank[i5].lasercolid(aconto2[ai[k5]]);
                      }
                    }
                  }
                }
              }
            }
          }
          else {
            for (let i6 = l - 1; i6 >= 0; --i6) {
              for (let j6 = 0; j6 < this.maxmo; ++j6) {
                if (ai2[j6] !== ai[i6]) {
                  if (xtgraphics.level !== 15 || j6 !== 1) {
                    aconto2[ai[i6]].tryexp(aconto2[ai2[j6]]);
                  }
                  if (aconto2[ai2[j6]].fire) {
                    if (j6 === 0) {
                      usercraft.lasercolid(aconto2[ai[i6]]);
                    }
                    else {
                      if (ai3[j6] === 0) {
                        acraft[j6].lasercolid(aconto2[ai[i6]]);
                      }
                      if (ai3[j6] === 1) {
                        atank[j6].lasercolid(aconto2[ai[i6]]);
                      }
                    }
                  }
                }
              }
            }
          }
          for (let j7 = 1; j7 < this.maxmo; ++j7) {
            if (ai3[j7] === 0) {
              acraft[j7].dosmokes(this.rd, aconto2[ai2[j7]]);
              acraft[j7].preform(aconto2[ai2[j7]], aconto2, ai, l, ai2[0], k);
              if (aconto2[ai2[j7]].exp) {
                if (!this.nosound) {
                  this.exp.setFramePosition(0);
                  this.exp.start();
                }
                ai3[j7] = -1;
              }
              if (aconto2[ai2[j7]].hit && !this.nosound && this.frags === 0) {
                this.hitl.setFramePosition(0);
                this.hitl.start();
                if (this.sosun) {
                  this.frags = 3;
                }
              }
            }
            if (ai3[j7] === 1) {
              atank[j7].dosmokes(this.rd, aconto2[ai2[j7]]);
              atank[j7].preform(aconto2[ai2[j7]], aconto2, ai2[0], k);
              if (aconto2[ai2[j7]].exp) {
                if (!this.nosound) {
                  this.exp.setFramePosition(0);
                  this.exp.start();
                }
                ai3[j7] = -1;
              }
              if (aconto2[ai2[j7]].hit && !this.nosound && this.frags === 0) {
                this.hitl.setFramePosition(0);
                this.hitl.start();
                if (this.sosun) {
                  this.frags = 3;
                }
              }
            }
          }
          usercraft.dosmokes(this.rd, aconto2[ai2[0]]);
          usercraft.preform(this.u, aconto2[ai2[0]], aconto2, ai2, this.maxmo);
          let k6 = 0;
          if (this.tab) {
            k6 = xtgraphics.cl;
          }
          else if (this.view !== 4 && this.view !== 5) {
            xtgraphics.dtrakers(this.rd, ai3, ai2, this.maxmo, aconto2, usercraft, this.u);
          }
          if (this.view === 0) {
            medium.behinde(aconto2[ai2[k6]]);
          }
          if (this.view === 1) {
            medium.right(aconto2[ai2[k6]]);
          }
          if (this.view === 2) {
            medium.infront(aconto2[ai2[k6]]);
          }
          if (this.view === 3) {
            medium.left(aconto2[ai2[k6]]);
          }
          if (this.view === 4) {
            medium.around(aconto2[ai2[k6]], 800);
          }
          if (this.view === 5) {
            medium.watch(aconto2[ai2[k6]]);
          }
          else if (medium.td) {
            medium.td = false;
          }
          if (aconto2[ai2[0]].exp) {
            let k7 = 0;
            for (let l6 = 0; l6 < aconto2[ai2[0]].npl; ++l6) {
              if (aconto2[ai2[0]].p[l6].exp === 7) {
                ++k7;
              }
            }
            if (k7 === aconto2[ai2[0]].npl) {
              flag2 = true;
              xtgraphics.dest[ai2[0]] = true;
              if (xtgraphics.alldest()) {
                xtgraphics.fase = 2;
                xtgraphics.drawovimg(this.offImage);
              }
              else {
                xtgraphics.fase = 1;
                xtgraphics.drawefimg(this.offImage);
              }
            }
            if (this.u.space) {
              this.u.space = false;
            }
          }
          else {
            if (xtgraphics.mcomp) {
              if (this.u.space) {
                if (xtgraphics.level !== 15) {
                  xtgraphics.fase = -4;
                  const xtGraphics = xtgraphics;
                  ++xtGraphics.level;
                }
                else {
                  xtgraphics.fase = 4;
                  xtgraphics.oldfase = 7;
                }
                flag2 = true;
                this.u.space = false;
              }
            }
            else if (this.u.space) {
              flag2 = true;
              xtgraphics.drawpimg(this.offImage);
              xtgraphics.fase = 3;
              this.u.space = false;
              xtgraphics.select = 0;
            }
            let l7 = 0;
            for (let i7 = k; i7 < k + 13; ++i7) {
              if (aconto2[i7].exp) {
                ++l7;
              }
            }
            if (l7 === 13) {
              flag2 = true;
              xtgraphics.drawovimg(this.offImage);
              xtgraphics.fase = 2;
            }
          }
        }
        else {
          if (xtgraphics.fase === -4) {
            medium.d(this.rd);
            let k8 = 0;
            const ai6 = intArray(100);
            for (let k9 = 0; k9 < this.maxco; ++k9) {
              if (aconto2[k9].dist !== 0) {
                ai6[k8] = k9;
                ++k8;
              }
              else {
                aconto2[k9].d(this.rd);
              }
            }
            const ai7 = intArray(k8);
            for (let i8 = 0; i8 < k8; ++i8) {
              ai7[i8] = 0;
              for (let i9 = 0; i9 < k8; ++i9) {
                if (aconto2[ai6[i8]].dist !== aconto2[ai6[i9]].dist) {
                  if (aconto2[ai6[i8]].dist < aconto2[ai6[i9]].dist) {
                    const array3 = ai7;
                    const n3 = i8;
                    ++array3[n3];
                  }
                }
                else if (i9 > i8) {
                  const array4 = ai7;
                  const n4 = i8;
                  ++array4[n4];
                }
              }
            }
            for (let j8 = 0; j8 < k8; ++j8) {
              for (let j9 = 0; j9 < k8; ++j9) {
                if (ai7[j9] === j8) {
                  aconto2[ai6[j9]].d(this.rd);
                }
              }
            }
            medium.around(aconto2[k + 4], 6000);
            if (this.u.space) {
              xtgraphics.drawl(this.rd, this.offImage);
            }
          }
          xtgraphics.denter(this.rd, k, aconto2, usercraft, this.u);
          if (xtgraphics.fase === -5 && this.u.space) {
            if (xtgraphics.select === 0) {
              this.loadrots(aconto2, false);
              for (let i10 = k; i10 < k + 13; ++i10) {
                aconto2[i10].out = false;
              }
              xtgraphics.reset();
              xtgraphics.fase = -4;
            }
            if (xtgraphics.select === 1 && xtgraphics.sgame === 1) {
              this.loadrots(aconto2, false);
              xtgraphics.reset();
              this.loadsaved(aconto2, xtgraphics, k);
              xtgraphics.fase = -4;
            }
            if (xtgraphics.select === 4) {
              this.moner = "Exiting game...";
              this.mon = true;
            }
            this.u.space = false;
          }
          if (xtgraphics.fase === 4) {}
          if (xtgraphics.fase === -33) {
            if (xtgraphics.frst && xtgraphics.select === 0) {
              this.savegame(aconto2, xtgraphics, k);
            }
            else if (!xtgraphics.frst) {
              xtgraphics.frst = true;
            }
            while (i3 !== 7) {
              if (xtgraphics.goodsun) {
                this.nounif = true;
              }
              this.mtrak[i3] = this.getSound("music/" + i3 + ".wav");
              this.loadet[i3] = true;
              ++i3;
            }
            if (xtgraphics.goodsun) {
              xtgraphics.goodsun = false;
            }
            this.loadmovers(ai2, ai3, aconto2, acraft, atank, usercraft, xtgraphics);
            this.nounif = false;
            xtgraphics.fase = -2;
          }
          if (xtgraphics.fase === -3) {
            xtgraphics.fase = -33;
          }
          if (xtgraphics.fase === 0 && this.u.space) {
            if (!xtgraphics.dest[xtgraphics.selected]) {
              this.setmover(ai2, aconto2, usercraft, xtgraphics);
              flag2 = false;
              this.view = 0;
            }
            this.u.space = false;
          }
          if (xtgraphics.fase === 2 && xtgraphics.sgame === 1 && !xtgraphics.alldest()) {
            this.set0();
            xtgraphics.sgame = 0;
          }
          if (xtgraphics.fase === 3 && this.u.space) {
            if (xtgraphics.select === 0) {
              flag2 = false;
            }
            this.u.space = false;
          }
          if (xtgraphics.fase === -8) {
            if (xtgraphics.sgame === -1) {
              this.getslevel(xtgraphics);
            }
            if (xtgraphics.cnty === 351) {
              xtgraphics.drawop(this.rd, this.offImage);
              xtgraphics.cnty = 352;
            }
          }
          if (xtgraphics.fase === 7 && this.u.space) {
            this.moner = "One moment...";
            this.mon = true;
            this.u.space = false;
          }
        }
      }
      else {
        if (this.u.space) {
          this.u.space = false;
        }
        this.rd.setColor(colorOf(223, 223, 223));
        this.rd.fillRect(0, 0, 500, 360);
        xtgraphics.drawcs(this.rd, 170, this.moner, 0, 0, 0, false);
        if (this.moner === "Exiting game...") {
          this.repaint();
          this.stop();
          return;
        }
        if (this.moner === "One moment...") {
          this.repaint();
          try {
            this.open("winner/index.html");
          }
          catch (ex) {}
          this.stop();
          return;
        }
      }
      this.repaint();
      if (!this.mon) {
        this.playsounds(usercraft, aconto2[ai2[0]], flag2, xtgraphics);
      }
      date2 = new Date();
      const l8 = Date.now();
      if (!flag2) {
        if (!flag) {
          f = f2;
          flag = true;
          k2 = 0;
        }
        if (k2 === 10) {
          if (l8 - l3 < 560) {
            f += 0.5;
          }
          else {
            f -= 0.5;
            if (f < 5.0) {
              f = 5.0;
            }
          }
          l3 = l8;
          k2 = 0;
        }
        else {
          ++k2;
        }
      }
      else {
        if (flag) {
          f2 = f;
          flag = false;
          k2 = 0;
        }
        if (k2 === 10) {
          if (l8 - l3 < 400) {
            f += 3.5;
          }
          else {
            f -= 3.5;
            if (f < 5.0) {
              f = 5.0;
            }
          }
          l3 = l8;
          k2 = 0;
        }
        else {
          ++k2;
        }
      }
      // THE PACER. Java: `long l9 = Math.round(f) - (l8 - l4); if (l9 < i) l9 = i;
      // Thread.sleep(l9);` — f is the target milliseconds per frame, and the
      // block above tunes it so ten frames take ~560ms in a race (~56ms/frame,
      // ~18fps) or ~400ms in the menus. That target is the game's SPEED: every
      // physics step is per-frame, not per-second, so a frame that arrives
      // early makes the aircraft fly faster.
      //
      // So the sleep has to actually happen. requestAnimationFrame alone fires
      // at the display's refresh rate — 16.7ms on a 60Hz screen, which would
      // run a race about three and a half times too fast — so yield frames
      // until l9 milliseconds have really elapsed.
      //
      // The one thing that cannot survive the move: Java's floor of `i`
      // (5ms, or 15 on the old Sun JVMs) is finer than a display frame, so a
      // sleep below one refresh interval still costs a whole frame. That makes
      // the port no faster than the refresh rate, never slower.
      let l9 = Math.round(f) - (l8 - l4);
      if (l9 < i) {
        l9 = i;
      }
      if (!this.gamer) break;
      const l10 = Date.now();
      do {
        await new Promise((r) => raf(r));
      } while (this.gamer && Date.now() - l10 < l9);
    }
  }
}
