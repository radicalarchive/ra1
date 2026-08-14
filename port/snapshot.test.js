// Tests for the smooth-motion snapshot helpers.
//
// These are not differential tests — there is no Java to compare against, the
// feature does not exist in the original. They pin the rules that went wrong
// in practice.

import test from 'node:test';
import assert from 'node:assert/strict';
import { captureScalars, restoreScalars } from './snapshot.js';

test('scalars round-trip', () => {
  const src = { a: 1, b: true, c: 'x' };
  const snap = captureScalars(src, {});
  src.a = 2; src.b = false; src.c = 'y';
  restoreScalars(src, snap);
  assert.deepStrictEqual(src, { a: 1, b: true, c: 'x' });
});

test('array CONTENTS round-trip, and the array object is not swapped', () => {
  const arr = new Int32Array([1, 2, 3]);
  const plain = [true, false];
  const src = { arr, plain };
  const snap = captureScalars(src, {});
  arr[1] = 99;
  plain[0] = false;
  restoreScalars(src, snap);
  assert.deepStrictEqual(Array.from(src.arr), [1, 2, 3]);
  assert.deepStrictEqual(src.plain, [true, false]);
  // The game holds direct references to these arrays, so restoring must refill
  // them rather than hand back a different object.
  assert.strictEqual(src.arr, arr);
  assert.strictEqual(src.plain, plain);
});

test('a field holding null is NOT captured', () => {
  // The bug this rule exists for: xtGraphics.mback starts null and is built
  // later by cmback(). Capturing the null pinned it, every restore put it
  // back, and drawImage(null) drew nothing — so the briefing screen stopped
  // repainting its background and the rotating enemy preview smeared across
  // it, Windows-solitaire style.
  const src = { mback: null, n: 1 };
  const snap = captureScalars(src, {});
  assert.ok(!('mback' in snap), 'a null field must not enter the snapshot');

  src.mback = { width: 500 };          // cmback builds the image
  captureScalars(src, snap);           // a later tick re-captures
  restoreScalars(src, snap);
  assert.deepStrictEqual(src.mback, { width: 500 }, 'the image must survive a restore');
});

test('object fields are left alone', () => {
  const img = { width: 500 };
  const src = { img, n: 1 };
  const snap = captureScalars(src, {});
  assert.ok(!('img' in snap));
  src.img = { width: 999 };
  restoreScalars(src, snap);
  assert.deepStrictEqual(src.img, { width: 999 });
});

test('a key that stops qualifying is dropped from the snapshot', () => {
  const src = { x: 5 };
  const snap = captureScalars(src, {});
  assert.strictEqual(snap.x, 5);
  src.x = { now: 'an object' };
  captureScalars(src, snap);
  assert.ok(!('x' in snap), 'a stale scalar must not outlive the field it came from');
  restoreScalars(src, snap);
  assert.deepStrictEqual(src.x, { now: 'an object' });
});

test('skip list is honoured', () => {
  const src = { pix: new Int32Array(4), keep: 1 };
  const snap = captureScalars(src, {}, new Set(['pix']));
  assert.ok(!('pix' in snap));
  assert.strictEqual(snap.keep, 1);
});
