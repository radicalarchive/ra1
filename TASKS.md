# TASKS.md — Radical Aces port

What is done, what is next, what is blocked. Newest status wins; this file
supersedes the status (not the methodology) in `decompilation/PORT_SPEC.md`.

## Done

- **Decompilation.** All 14 game classes + the vendored `sun.audio` decompiled
  to `decompilation/java-src/`. 13 of 14 recompile clean; the one artifact is
  `F51$1.java`, the anonymous window-close handler.
- **Specs.** `decompilation/PORT_SPEC.md` (plan, measured facts, delegation),
  `web/TRANSPILE_SPEC.md` (the Java→JS contract), `AGENTS.md`, `WORK.md`.
- **Delegation pipeline.** `decompilation/agy_ra1`, three phases
  (`port` / `test` / `fix`), validated end to end on `SinCos`.
- **Seams, hand-written, not delegated:**
  - `web/java.js` — int/float32 semantics, seeded PRNG, packed-colour helpers.
  - `web/graphics.js` — the eleven-method `Graphics` surface on Canvas2D, plus
    `createImage` / `PixelGrabber` / `MemoryImageSource`.
  - `web/vfs.js` — preloading VFS, Latin-1 `readLine`, zip reader for
    `models.zrad`, `cookies/` on localStorage.
  - `web/audio.js` — `javax.sound.sampled.Clip` on WebAudio.
- **`SinCos`** — transpiled, probe-verified, 12 tests green.
- **`Control`, `cControl`** — transpiled by hand (pure field holders, nothing
  to probe).
- **`Plane`** — the calibration class. Delegated, then two systematic errors
  fixed by hand (`int[]` as plain `Array`; a missing `Math.imul` in `xs`/`ys`),
  both folded into the prompt template and the spec. 27 tests green, including
  the int32 overflow cases.
- **`ContO`** — delegated, then fixed by hand: its parser now throws where Java
  throws. Verified against **all 56 `.rad`/`.dar` model files in the
  distribution**, field by field and face by face.
- **`Medium`** — transpiled by hand (the `agy` quota ran out). Nine §2 **Case A**
  sites, the first in this port, verified against the bytecode and then
  mutation-checked. 25 tests green.

- **`Craft`** — delegated. All 14 §2 sites came back Case A at HIGH confidence
  and every one is Case B in the bytecode; corrected, and the probe was fixed to
  start `preform` from a fresh instance. 8 tests green, mutation-checked.
- **`Tank`** — delegated. The mirror-image error: its two `conto.xy ± speed/5.0f`
  sites are the port's only Case A sites outside `Medium`, reported as Case B.
  Corrected by hand; three replay tests were missing the probe's initial
  `conto.xz = 30`. 15 tests green, mutation-checked, including a case built
  specifically to discriminate the Case A rule.

- **`Lasers`** — the first class through the one-shot `class` job (subagent with
  a shell). Three §2 sites, all Case A, all downstream of `Math.random()` and so
  not coverable by a differential test; classified from the bytecode. 5 tests
  green. `Craft.js` and `Tank.js` now import it instead of carrying their own
  stub copies, whose `d`/`hsmoke`/`gsmoke` were no-ops.

- **`userCraft`** — the second one-shot `class` job, and the first clean one:
  14 §2 sites, all Case B, each with its javap offsets, mutation results
  reported per site and spot-checked. 16 tests green. Its inlined `Lasers` stub
  (written because `Lasers.js` did not exist yet when the job started) was
  replaced with the import by hand.

- **`xtGraphics`** — the GUI: menus, HUD, radar, pixel effects. One job, no §2
  sites in the whole class. 6 tests green; coverage is thin relative to its
  1,320 lines, and `denter` is the place to look first if the menus misbehave.

- **`F51`** — the transpiled half hand-ported (the two parsers, the constructor,
  the key tables, the AWT 1.0 key/mouse/focus state machine; 7 tests green
  against a headless probe, mutation-checked), and `run()` plus the seams
  delegated. The delegated pacer computed the frame delay and discarded it;
  fixed by hand, and measured at 25.8 game iterations/sec in the menus against
  Java's target.
- **`web/main.js`** — the boot: DOM keys through `input.js` into the AWT 1.0
  handlers, `blur` into `lostFocus`, canvas clicks into `mouseDown`.
- **The game runs.** It loads, plays the intro, renders the title scene with the
  real 3D models, and responds to keyboard and mouse in Chromium.

129 tests green in total; `graphics.js` also passes a headless-Chromium smoke
test (`web/tools/graphics-smoke.html`).

## Blocked

Nothing. The `agy` quota reset, and delegation now runs on
`gemini-3.7-flash-medium` with a shell (`--dangerously-skip-permissions`), so
`bash decompilation/run_class <Class>` does a whole class in one job.

- **`Medium` was transpiled by hand, not delegated** — the quota died and it is
  the dependency everything else needs. It is fully probe-verified and
  mutation-checked, but it is the one class that did not go through the
  subagent, which is worth knowing if its style differs from its neighbours.

## Options
Both are on the launcher (`index.html`), remembered in localStorage, and
settable as `?res=2&smooth=1`:
- **2× resolution** — `Graphics2D` scales the context, so the game's 500×360
  coordinates are untouched and only the rasterisation is finer. The fullscreen
  pixel effects stay 500×360 by construction and are upscaled.
- **Smooth motion** — interpolated frames between physics ticks. The tick rate,
  and so the game's speed, is unchanged: measured 25.5 ticks/sec with it off
  and 26.0 with it on, while drawn frames rise to the display's rate.

## Next, in dependency order

1. **Play it against the jar.** Everything so far is verified per-class or by a
   headless smoke run; nobody has yet flown a mission in the port and compared
   it with `sh start.sh                          # or: java -jar java/ra1.jar` side by side. Start a level, check the physics,
   the HUD, the radar, the lasers and the save/continue flow.
   `node web/tools/smoke.mjs [seconds] [out.png]` drives it headlessly
   (`SMOKE_KEYS`, `SMOKE_CLICK_WAIT`), but the real check needs a human.
2. **In-race pacing.** The menus measure 25.8 iterations/sec against Java's
   ~25; the in-race target is ~18/sec and is NOT yet measured, and it is the
   one that governs how the aircraft flies.
3. **Smooth motion in a race, judged by eye.** The guards are verified by
   forcing the interpolation rate and checking the per-tick state advance holds
   (`SMOKE_FORCE_INTERP=4`), and the menus look right, but nobody has watched an
   aircraft fly with it on. Watch for: an object that stutters while the rest
   glides (a missing blend field), an effect animating too fast (a missing
   guard), or a shimmer on flames and sparks (a draw-time random not replayed).
4. **Audio.** Preloaded and wired, but never heard: the smoke runs are muted
   and headless. Check the music cycles and that `playsounds`' counters are not
   retriggering clips every frame.

## Open questions / risks

- **Font metrics.** The menus position text with `drawString` at coordinates
  tuned to AWT's `SansSerif` bold 11. Canvas text will not match pixel for
  pixel; how far off it looks is unmeasured. Compare against the jar once the
  menus draw.
- **Polygon fill rule.** `graphics.js` fills even-odd, as AWT does. Whether the
  antialiasing difference matters on the flame/smoke shapes is unmeasured.
- **`xtGraphics` size.** 1,320 lines with the pixel effects in it. It may need
  splitting into chunks the way nfm's `CarMaker` did
  (`nfm/decompilation/CAREDITOR_PORT_SPEC.md` is the worked example of chunking
  one class across several jobs).
- **`F51.run()`'s adaptive pacer** self-tunes toward a wall-clock target and
  floors the sleep. Under `requestAnimationFrame` the floor is meaningless;
  decide deliberately what to keep, and write down why.
