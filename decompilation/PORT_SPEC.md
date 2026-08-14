# PORT_SPEC.md — Radical Aces → JavaScript in the browser

The plan for porting the 2001 Java game *Radical Aces* (Omar Waly; this is
Phyrexian's maintained `ra1-dist` build) to run natively in a browser.

This is the **second** port of this engine. The first was *Need for Madness*
at `/home/evan/resources/nfm`, and it is finished and playable. Everything here
that is not specific to Radical Aces was inherited from it, including the
mistakes it made — read `/home/evan/resources/nfm/WORK.md` before you decide
that a rule in `web/TRANSPILE_SPEC.md` is over-cautious.

---

## Source of truth

`java-src/` holds procyon-decompiled Java for every class in `ra1.jar`,
committed to the repo. **This is the input to the entire port** — start there,
not from the jar.

Regenerate with:
```sh
java -jar procyon.jar -o decompilation/java-src <Class>.class   # per class
```
Feeding procyon the jar directory in one go fails ("Failed to load class"); it
was run once per class file.

**13 of the 14 game classes recompile clean** with `javac -source 8 -target 8`.
The one artifact is `F51$1.java` ("modifier static not allowed here"), procyon's
rendering of an anonymous `WindowAdapter`. It is 12 lines and it is the
close-the-window handler, so it costs nothing. That everything else round-trips
is the evidence that procyon's output is trustworthy for this codebase.

`sun/audio/` in the jar is a **vendored copy of the JDK's own `sun.audio`**,
bundled because Java 9 removed it. It is not game code. It is decompiled for
reference and is dropped by the port.

---

## Goal

Run the game — all of it, including the menus — natively in a browser at
500×360, with sound.

**The original GUI is kept.** This is the one deliberate divergence from the
nfm port, which replaced the game's menu with an HTML launcher. Radical Aces'
menus are not AWT widgets: `xtGraphics.denter()` draws them into the same
offscreen image as the game, with the same `Graphics` calls, so keeping them is
*less* work than replacing them and it preserves the thing that makes the game
feel like itself. `F51`'s only real AWT widgets are the `Frame` it lives in and
the window-close handler.

---

## Measured facts

Jar: 14 game classes, 8,086 lines decompiled, plus 14 vendored `sun.audio`
classes. No JNI, no native code, no Java3D/LWJGL, no networking beyond a
`Desktop.browse()` link out to a web page.

| Class | Lines | What it is |
| --- | --- | --- |
| `F51` | 1,779 | applet/Panel, main loop, all file IO, sound, key bindings, saves |
| `xtGraphics` | 1,320 | **menus, HUD, radar, and the fullscreen pixel effects** |
| `Lasers` | 982 | projectiles, explosions, smoke |
| `Craft` | 867 | enemy aircraft AI + physics |
| `userCraft` | 612 | the player's aircraft |
| `Tank` | 527 | ground enemies |
| `Plane` | 526 | one polygon face: project, light, fog, rasterize |
| `Medium` | 337 | camera, sky, ground, view modes |
| `ContO` | 335 | a 3D object: model loading, transform, draw |
| `SinCos` | 42 | the float32 sin/cos table the whole game rotates through |
| `Control` | 34 | input state (11 booleans) |
| `cControl` | 20 | AI input state |
| `F51$1` | 12 | window-close handler |

**The entire drawing surface is ELEVEN methods**, counted over `java-src/`:
`setColor` (61), `drawImage` (23), `fillRect` (14), `drawString` (12),
`fillPolygon` (11), `drawRect` (7), `drawLine` (7), `drawPolygon` (2),
`setFont` (1), `getFontMetrics` (1), `dispose` (1).
Plus `PixelGrabber`, `MemoryImageSource` and `createImage` for the menu
effects. That is the whole renderer contract. For comparison, nfm's was 42
methods.

Assets, all read at runtime and **not to be modified**:
`graphics/` (28 files, 308K), `objects/` (54 `.rad` models, 248K),
`levels/*.txt` (16 stages), `siters/{aces,base,smap,clmap0..4}.txt`
(object placement), `sounds/{default,newsun}/` (3.6M), `music/*.wav` (12M),
`graphics/models.zrad` (a zip of the base models, read with `ZipInputStream`).

Saves are one file per key under `cookies/` (`radxv`, `raddest0..4`, …), each
holding a single integer. `.gitignore` already excludes `cookies/`.

Input is the **Java 1.0 event model** — `keyDown(Event, int)` / `keyUp` with
AWT key codes, remappable through `KeySettings.txt` (documented in
`README.TXT`). `F51` holds a `Set<Integer>` per action.

---

## Architecture

### 1. Transpile the core line by line

Java 6, no generics beyond `Set<Integer>`, no lambdas — mechanically
translatable. **Do not restructure.** The value of this approach is that the 3D
math and physics carry over verbatim and stay diff-testable against the running
Java. The contract is `web/TRANSPILE_SPEC.md`; read it in full.

### 2. Reimplement `Graphics`, do not rewrite the renderer

There is no renderer layer to extract. `Plane.d()` interleaves projection,
per-face lighting, fog and rasterization in one pass, ending in
`setColor(...)` immediately followed by `fillPolygon(...)`. So the boundary is
the **call site**, not the class: transpile `Plane`/`ContO`/`Medium` unchanged
and reimplement the eleven methods underneath them.

> ### ⚠ The one non-obvious constraint: painter's algorithm
>
> This renderer has **no depth buffer**. Occlusion comes entirely from
> submission order: `F51.run()` depth-sorts the `ContO`s by `dist` before
> drawing, and `Plane.d()` sorts faces within an object. Never batch, reorder,
> or hoist a draw call. This is the failure that passes every test and still
> draws planes through mountains.

### 3. Canvas2D, not WebGL — and this is not laziness

nfm went to WebGL because it was fill-bound at 800×450 with a much heavier
scene. Radical Aces is different in two ways that both point back to Canvas2D:

- it draws a **500×360** frame, a quarter of the pixels;
- its menus **round-trip the entire framebuffer through JS every frame**.
  `xtGraphics.drawefimg/drawpimg/drawop/drawl/drawovimg/cmback` each do
  `new Color(pix[i])` over 180,000 pixels, blend against a stored JPEG, and
  build a new image from the result. Under Canvas2D that is a `getImageData`;
  under WebGL it is a `readPixels` stall on every menu frame.

So `web/graphics.js` is Canvas2D. If the *race* turns out to be fill-bound,
the answer is a WebGL backend behind the same eleven methods, with colour as a
vertex attribute and one ordered buffer per frame — nfm's `web/graphics.js` is
the worked example. Measure before switching, and read nfm's AGENTS.md
§"Measuring performance" first: every wrong conclusion in that project came
from a measurement artifact.

### 4. Audio is easy here

`javax.sound.sampled.Clip` — load, `start()`, `stop()`, `loop()`. Twenty-odd
WAV clips plus seven music tracks. No `SourceDataLine`, no pitch-shifted PCM
stream, and above all **no MOD tracker**: nfm needed a software synthesizer
transpiled sample-by-sample, and this game needs `AudioBufferSourceNode`.
Browsers require a user gesture before audio starts.

### 5. Virtual filesystem

~40 file accesses, all relative paths from the game directory. Reads go to
`fetch`; `graphics/models.zrad` goes through `DecompressionStream('deflate-raw')`
(it is a plain zip); `cookies/` writes go to `localStorage`.

### 6. Main loop

`F51.run()` is a `while(true)` with an adaptive pacer: `f` self-tunes ±0.5ms
(in menus) or ±3.5ms (in race) per 10 frames toward a target, floored at 5.0,
and the sleep is floored at `i` (5, or 15 on the old-Sun path that this build
can no longer take). Convert to `requestAnimationFrame`.

**The one sanctioned §0 exception, and it is only in `F51`.** JS has no
`Thread.sleep`, so `run()` is split in exactly two places:

- everything before the `while` becomes `async boot()` — it is also where the
  `await`s for asset loading go, and nothing inside it is a loop iteration;
- the body of the `while` becomes `tick()`, called from `requestAnimationFrame`.

Every local the loop carries across iterations (`f`, `f2`, `flag`, `flag2`,
`k2`, `i3`, `l3`, the `ContO[]`/`Craft[]`/`Tank[]` arrays, `medium`,
`xtgraphics`, `usercraft`) becomes a field on the instance. Nothing else may be
restructured, and the statement order inside `tick()` must match the Java line
for line. Keep the pacer arithmetic verbatim even though rAF ignores the
computed sleep: `f` is read by nothing else today, but it is the game's own
measure of how far behind it is, and deleting it would quietly change what a
later frame-rate decision is based on. Write down what the port does with the
computed delay, in the code, at the point where the `Thread.sleep` was.

---

## Correctness: the differential harness

Physics bugs are transpilation bugs, and transpilation bugs have an oracle: the
running Java. For every class, a Java reflection probe drives the **real class
from the jar**, prints its state, and those literals become the expected values
in a `node:test` file. This is not optional and it is not approximate — see
`web/TRANSPILE_SPEC.md` §6.

### Numeric hazards — the actual risk in Java→JS

Not typos. Silent semantic divergence: `int` division truncates, `int` wraps at
32 bits, and Java `float` is 32-bit while JS has only doubles. `SinCos.getsin`
and `getcos` return `float`, and essentially every coordinate in this game
passes through them, so float32 rounding must happen at **each** binary
operation or the port drifts gradually rather than failing loudly.

The full rules, with worked examples of the two bugs that survived "looking
right" in the sibling port, are in `web/TRANSPILE_SPEC.md` §1, §2, §2b.

---

## Using a subagent (`agy -p`)

Delegate **mechanical, specified, verifiable** work — per-class transpilation
against an exact signature, probe scaffolding, boilerplate — one bounded task
per invocation, with the target and expected semantics stated, then verify
every result yourself.

Do **not** delegate the main loop, the audio timing, the painter's-algorithm
ordering, or anything about how the seams fit together: those fail silently,
and a subagent will return confident, plausible, wrong code that surfaces later
as "the handling feels off".

`decompilation/agy_ra1` runs one job. It has three phases — `port`, `test`,
`fix` — because **the subagent has no shell here**: headless `agy` auto-denies
every command-running tool, and both ways to lift that are blanket grants over
the whole machine. So the subagent writes the JS and the probe; the caller
compiles and runs the probe, hands the output back, and the subagent writes the
test from those literals. The script's header documents the loop.

That split is a feature. PORT_SPEC has always required the caller to verify
every delegated result; this makes the oracle physically the caller's, and it
makes "the probe agreed" a claim the caller has actually seen.

### Calibrate before batching — mandatory

Never fan out across many classes on an unvalidated prompt template. A
systematic flaw (a dropped `fr()`, a misclassified compound assignment)
replicated across ten files costs far more to find and unpick than it saved.

1. Pick one representative class with real numeric content. `Plane.java` is
   ideal: int/float mixing, per-face lighting, and a `fillPolygon` call site.
2. Delegate it alone.
3. Verify against the Java: read the diff **and** run the probe. Do not accept
   "it looks right".
4. Catalogue every systematic error and fold each one into the prompt template
   as an explicit rule.
5. Repeat on a second class. Only batch once a class comes back clean with no
   template changes.

Re-verify at intervals during the batch too — quality is not stationary across
a long run. Restate the painter's-algorithm constraint in **every** prompt that
touches rendering.

---

## Order of work

Dependencies run bottom-up, so the order is:

| # | Work | Gate |
| --- | --- | --- |
| 0 | Decompile, scaffold, infra seams (`java.js`, `graphics.js`, `vfs.js`, `audio.js`) | done |
| 1 | `SinCos`, `Control`, `cControl` — trivial, validates the pipeline | probe-green |
| 2 | `Plane` — the calibration class | probe-green, template updated |
| 3 | `ContO`, `Medium` — geometry and camera | probe-green |
| 4 | `Craft`, `Tank`, `userCraft`, `Lasers` — physics and effects | probe-green |
| 5 | `xtGraphics` — menus, HUD, radar, pixel effects | pixel-compared against the jar |
| 6 | `F51` — main loop, IO, audio, input. **Not delegated.** | the game runs |

`F51` is the seam class: threading model, audio timing, the `Event`-based input
model and the VFS all land in it, and every one of those is on the do-not-
delegate list.
