// Snapshot/restore for smooth motion.
//
// An interpolated frame re-runs the game's whole draw path against blended
// positions, so anything that path mutates has to be put back afterwards or
// the simulation drifts. Objects and the camera are snapshotted field by field
// in F51.run(); this is the general half, for xtGraphics, whose phase machine
// mutates dozens of scalars from inside its draw method.
//
// It lives in its own file with tests because getting it subtly wrong is
// invisible: the game keeps running and one screen quietly misbehaves. The
// null rule below cost exactly that — a pinned null on an image field made the
// briefing screen stop repainting its background, so the rotating preview
// smeared across it.

/**
 * Copy the restorable state of `src` into `into`.
 *
 * Restorable means numbers, booleans, strings, and the CONTENTS of arrays and
 * typed arrays. Deliberately excluded:
 *
 *   - object fields, including a field that currently holds null. Images are
 *     built lazily (xtGraphics.mback is null until cmback assembles it), so
 *     capturing the null would pin it: every restore would put it back, and a
 *     drawImage(null) draws nothing at all.
 *   - anything named in `skip` — the caller's list of things too big to copy
 *     per frame, or that must not be rolled back.
 *
 * A key that stops qualifying is dropped, so a stale value can never outlive
 * the field it came from.
 */
export function captureScalars(src, into, skip = new Set()) {
  for (const k of Object.keys(src)) {
    if (skip.has(k)) continue;
    const v = src[k];
    const t = typeof v;
    if (t === 'number' || t === 'boolean' || t === 'string') {
      into[k] = v;
    } else if (ArrayBuffer.isView(v)) {
      if (!into[k] || into[k].length !== v.length) into[k] = v.slice();
      else into[k].set(v);
    } else if (Array.isArray(v)) {
      if (!Array.isArray(into[k]) || into[k].length !== v.length) into[k] = v.slice();
      else for (let i = 0; i < v.length; i++) into[k][i] = v[i];
    } else if (k in into) {
      delete into[k];
    }
  }
  return into;
}

/** Put a captureScalars() snapshot back. Arrays are refilled, not replaced. */
export function restoreScalars(dst, snap) {
  for (const k of Object.keys(snap)) {
    const v = snap[k];
    if (ArrayBuffer.isView(v)) {
      dst[k].set(v);
    } else if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) dst[k][i] = v[i];
    } else {
      dst[k] = v;
    }
  }
}
