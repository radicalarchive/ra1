// F51.test.js — differential test for the transpiled half of F51.
//
// Every expected value is the LITERAL output of web/tools/F51Probe.java run
// against the real Java class (decompilation/logs/F51.probe.txt). If a value
// disagrees, the port is wrong, not the test (§2c).
//
// SCOPE: only the parts F51.js transpiles line by line — getstring, getint,
// the constructor defaults, the key-binding tables and the AWT 1.0
// keyDown/keyUp/lostFocus/mouseDown state machine. run(), the audio and the
// drawing seams are REPLACED rather than transpiled, and are not probed; the
// loaders that read files are covered by vfs.test.js and by the model tests in
// ContO.test.js, and will get their own coverage when run() lands.
//
// There are no §2 compound-assignment sites in the transpiled half.

import test from 'node:test';
import assert from 'node:assert/strict';
import { F51 } from './F51.js';

test('getstring parses the level-file forms (from probe)', () => {
  const f = new F51();
  // From probe: getstring.name0 = Sky Raider
  assert.strictEqual(f.getstring('name', 'name(Sky Raider)', 0), 'Sky Raider');
  // From probe: getstring.prompt0/1/2
  assert.strictEqual(f.getstring('prompt', 'prompt(tank,3,Destroy the|tanks)', 0), 'tank');
  assert.strictEqual(f.getstring('prompt', 'prompt(tank,3,Destroy the|tanks)', 1), '3');
  assert.strictEqual(f.getstring('prompt', 'prompt(tank,3,Destroy the|tanks)', 2), 'Destroy the|tanks');
  // From probe: getstring.l0 = bild1
  assert.strictEqual(f.getstring('l', 'l(bild1,-300,0,1200)', 0), 'bild1');
  // From probe: getstring.past_end = []  — an index past the end is "", not a throw
  assert.strictEqual(f.getstring('name', 'name(Sky Raider)', 4), '');
});

test('getint parses and throws exactly where Java does (from probe)', () => {
  const f = new F51();
  // From probe: getint.craft0 = 7
  assert.strictEqual(f.getint('craft', 'craft(7)', 0), 7);
  // From probe: getint.l1 = -300, l2 = 0, l3 = 1200
  assert.strictEqual(f.getint('l', 'l(bild1,-300,0,1200)', 1), -300);
  assert.strictEqual(f.getint('l', 'l(bild1,-300,0,1200)', 2), 0);
  assert.strictEqual(f.getint('l', 'l(bild1,-300,0,1200)', 3), 1200);
  // From probe: getint.stat5 = 0
  assert.strictEqual(f.getint('stat', 'stat(60,3,50,30,500,0)', 5), 0);
  // From probe: getint.negative = -180
  assert.strictEqual(f.getint('xy', 'xy(-180)', 0), -180);

  // From probe: getint.empty_throws = java.lang.NumberFormatException
  // From probe: getint.nonnumeric_throws = java.lang.NumberFormatException
  // This is load-bearing: every loader runs inside a catch, so the throw is
  // what abandons a malformed line. JS's parseInt would return NaN and carry
  // on parsing lines the original never reached (§5a).
  assert.throws(() => f.getint('craft', 'craft()', 0));
  assert.throws(() => f.getint('name', 'name(Sky Raider)', 0));
});

test('constructor defaults match Java (from probe)', () => {
  const f = new F51();
  assert.strictEqual(f.mon, true);                       // init.mon
  assert.strictEqual(f.moner, 'Click here to Start');     // init.moner
  assert.strictEqual(f.sndfrm, 'default');                // init.sndfrm
  assert.strictEqual(f.nounif, false);                    // init.nounif
  assert.strictEqual(f.tab, false);                       // init.tab
  assert.strictEqual(f.view, 0);                          // init.view
  assert.strictEqual(f.maxco, 0);                         // init.maxco
  assert.strictEqual(f.maxmo, -1);                        // init.maxmo
  assert.strictEqual(f.crntt, -1);                        // init.crntt
  assert.strictEqual(f.dnload, 0);                        // init.dnload
  assert.strictEqual(f.obj.length, 53);                   // init.obj_len
  assert.strictEqual(f.las.length, 5);                    // init.las_len
  assert.strictEqual(f.mtrak.length, 7);                  // init.mtrak_len
  assert.strictEqual(f.loadet.length, 7);                 // init.loadet_len
});

test('initDefaultKeySettings builds the same tables as Java (from probe)', () => {
  const f = new F51();
  f.initDefaultKeySettings();
  const sorted = (s) => Array.from(s).sort((a, b) => a - b);

  assert.deepStrictEqual(sorted(f.viewOneKeys), [49]);
  assert.deepStrictEqual(sorted(f.viewTwoKeys), [50]);
  assert.deepStrictEqual(sorted(f.viewThreeKeys), [51]);
  assert.deepStrictEqual(sorted(f.viewFourKeys), [52]);
  assert.deepStrictEqual(sorted(f.viewFiveKeys), [53]);
  assert.deepStrictEqual(sorted(f.nomusicKeys), [77, 109]);
  assert.deepStrictEqual(sorted(f.switchmusicKeys), [84, 116]);
  assert.deepStrictEqual(sorted(f.nosoundKeys), [83, 115]);
  assert.deepStrictEqual(sorted(f.radarKeys), [82, 114]);
  assert.deepStrictEqual(sorted(f.tabKeys), [9]);
  assert.deepStrictEqual(sorted(f.plusKeys), [43, 61]);
  assert.deepStrictEqual(sorted(f.minsKeys), [8, 45]);
  assert.deepStrictEqual(sorted(f.jumpKeys), [74, 106]);
  assert.deepStrictEqual(sorted(f.enterKeys), [10, 27]);
  assert.deepStrictEqual(sorted(f.fireKeys), [32]);
  assert.deepStrictEqual(sorted(f.leftKeys), [1006]);
  assert.deepStrictEqual(sorted(f.rightKeys), [1007]);
  assert.deepStrictEqual(sorted(f.downKeys), [1005]);
  assert.deepStrictEqual(sorted(f.upKeys), [1004]);
});

test('keyDown / keyUp reproduce the AWT 1.0 state machine (from probe)', () => {
  const f = new F51();
  f.initDefaultKeySettings();

  f.keyDown(null, 1004);                                  // Event.UP
  assert.strictEqual(f.u.up, true);                       // keys.up_down_u_up
  f.keyDown(null, 1006);                                  // Event.LEFT
  assert.strictEqual(f.u.left, true);                     // keys.left_down_u_left
  f.keyUp(null, 1004);
  assert.strictEqual(f.u.up, false);                      // keys.up_released_u_up
  assert.strictEqual(f.u.left, true);                     // keys.up_released_u_left

  f.keyDown(null, 51);                                    // '3'
  assert.strictEqual(f.view, 3);                          // keys.view3
  f.keyUp(null, 51);
  assert.strictEqual(f.view, 0);                          // keys.view_after_release

  f.keyDown(null, 10);                                    // ENTER
  assert.strictEqual(f.enterd, true);                     // keys.enterd_after_down
  assert.strictEqual(f.u.space, true);                    // keys.space_after_down
  // The game consumes u.space; a HELD enter must not set it again. This is the
  // only observable effect of the `&& !this.enterd` guard — without this case
  // the guard can be deleted and every other assertion stays green (§2e).
  f.u.space = false;
  f.keyDown(null, 10);                                    // held down
  assert.strictEqual(f.enterd, true);                     // keys.enterd_after_repeat
  assert.strictEqual(f.u.space, false);                   // keys.space_after_repeat
  f.keyUp(null, 10);
  assert.strictEqual(f.enterd, false);                    // keys.enterd_after_up

  // mins is bound to both '-' (45) and BACKSPACE (8): the action only clears
  // when the last of them is released.
  f.keyDown(null, 45);
  f.keyDown(null, 8);
  f.keyUp(null, 45);
  assert.strictEqual(f.u.mins, true);                     // keys.mins_one_still_held
  f.keyUp(null, 8);
  assert.strictEqual(f.u.mins, false);                    // keys.mins_both_released

  f.keyDown(null, 106);                                   // 'j'
  assert.strictEqual(f.u.jump, 1);                        // keys.jump
  assert.strictEqual(f.u.jade, true);                     // keys.jade

  // nosound toggles rather than latching.
  f.keyDown(null, 115);                                   // 's'
  assert.strictEqual(f.nosound, true);                    // keys.nosound_1
  f.keyDown(null, 115);
  assert.strictEqual(f.nosound, false);                   // keys.nosound_2
});

test('lostFocus clears the controls only once a level is loaded (from probe)', () => {
  const f = new F51();
  f.initDefaultKeySettings();
  f.maxmo = 3;
  f.keyDown(null, 1005);                                  // hold DOWN
  assert.strictEqual(f.u.down, true);                     // focus.down_held
  assert.strictEqual(f.lostFocus(null, null), false);     // focus.ret
  assert.strictEqual(f.mon, true);                        // focus.mon
  assert.strictEqual(f.view, 0);                          // focus.view
  assert.strictEqual(f.u.down, false);                    // focus.u_down
  assert.strictEqual(f.tab, false);                       // focus.tab

  // With maxmo == -1 (nothing loaded) only `mon` is touched: the held key
  // stays down. That is the original's behaviour, not an oversight in the port.
  const f2 = new F51();
  f2.initDefaultKeySettings();
  f2.keyDown(null, 1005);
  f2.lostFocus(null, null);
  assert.strictEqual(f2.u.down, true);                    // focus.fresh_u_down
  assert.strictEqual(f2.mon, true);                       // focus.fresh_mon
});

test('mouseDown starts the game only once a level is loaded (from probe)', () => {
  const f = new F51();
  assert.strictEqual(f.moner, 'Click here to Start');      // mouse.moner_before
  f.mouseDown(null, 10, 10);
  // maxmo is -1 on a fresh F51, so neither mon nor moner changes.
  assert.strictEqual(f.mon, true);                         // mouse.fresh_mon
  assert.strictEqual(f.moner, 'Click here to Start');      // mouse.fresh_moner
  f.maxmo = 3;
  f.mouseDown(null, 10, 10);
  assert.strictEqual(f.mon, false);                        // mouse.mon
  assert.strictEqual(f.moner, 'Click here to Continue');   // mouse.moner
});
