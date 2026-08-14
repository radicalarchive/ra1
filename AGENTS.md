# AGENTS.md — Radical Aces (ra1)

## Project
A 2001 Java game being ported to run natively in the browser as JavaScript.
The original source was never released; `decompilation/java-src/` is
procyon-decompiled bytecode and is the reference for the port, not a build
input. `ra1.jar` still runs and is the oracle you compare against.

**The port under `port/` is the active work.**

This is the second port of this engine. The first — *Need for Madness*, at
`/home/evan/resources/nfm` — is finished, playable, and shares `ContO`,
`Plane`, `Medium`, `xtGraphics` and `SinCos` with this game. Read it before
solving a problem it already solved.

## Read these first
- `decompilation/PORT_SPEC.md` — the plan, the measured facts, and the
  subagent delegation methodology. Binding.
- `port/TRANSPILE_SPEC.md` — the contract for turning decompiled Java into JS
  (int wrapping, float32 rounding, compound-assignment classification).
- `WORK.md` — the running log. See below.
- `TASKS.md` — what is done, what is next, what is blocked.
- `/home/evan/resources/nfm/WORK.md` — the sibling port's gotchas. Most of them
  still apply.

## Keep the WORK log
`WORK.md` is a log of `## YYYY-MM-DD HH:MM` sections, local time, newest at the
bottom — a new section per work session. Roughly **one line per major milestone
or gotcha**: the things a future agent would otherwise waste an hour
rediscovering. Append as you go, not at the end of the session. When a
measurement overturns an entry, ~~strike it through~~; don't delete it.

## Layout
- `port/` — the JS port. `java.js`, `graphics.js`, `vfs.js`, `audio.js` are the
  hand-written seams; every other `.js` is a transpiled class with a
  probe-verified `.test.js` beside it.
- `port/tools/` — Java reflection probes that drive the real classes from the
  jar. These are the oracle.
- `decompilation/java-src/` — decompiled originals. Read-only reference.
- `decompilation/agy_ra1` — runs one delegated transpilation job.
- `decompilation/logs/` — job logs, probe output, failure logs.
- `graphics/ levels/ objects/ siters/ sounds/ music/ web/ winner/` — game
  assets from the original distribution, byte-identical and **not to be
  modified**; the port reads them as-is.
- `ra1.jar`, `ra1.exe` — the original build. Read-only.
- `cookies/` — save data, gitignored. The port keeps saves in localStorage.

## The original GUI is part of the port
Unlike the nfm port, which replaced the game's menu with an HTML launcher, this
port **keeps the game's own menus**. They are not AWT widgets: `xtGraphics`
draws them into the same 500×360 offscreen image as the race, with the same
eleven `Graphics` calls. Keeping them is less work than replacing them, and it
is what the user asked for. Do not introduce an HTML launcher.

## Running the port
```sh
python3 -m http.server 8123          # from the repo root
# then open http://localhost:8123/port/main.html   (click to start — WebAudio
#                                                   needs a user gesture)
```
The game reads its assets by relative path from the repo root, exactly as the
desktop build does; `F51.init` resolves them against `import.meta.url`, so a
harness page at any depth loads the same files.

To check it headlessly:
```sh
node port/tools/smoke.mjs 12 /tmp/shot.png    # console, page errors, canvas
                                              # coverage, game-loop rate, and
                                              # screenshots before/after a click
SMOKE_KEYS=10,10 node port/tools/smoke.mjs    # send AWT key codes too
```
**Do not smoke-test with `chromium --headless --screenshot`.** That mode uses
virtual time, which does not advance across `createImageBitmap` or
`decodeAudioData`, so the boot looks deadlocked until the budget expires.
`smoke.mjs` drives the DevTools protocol on a real clock.

## Verifying a change
```sh
cd port && node --test               # unit + differential tests
```
Every transpiled class has a `.test.js` whose expected values were printed by
its Java probe. If one fails, the port is wrong — not the test (§2c).

To re-run a probe:
```sh
mkdir -p /tmp/ra1jar && cd /tmp/ra1jar && unzip -oq /home/evan/resources/ra1/ra1.jar
javac -cp /tmp/ra1jar -d /tmp/ra1port/probe port/tools/<Class>Probe.java
java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.<Class>Probe
```

## The reference implementation
```sh
java -jar ra1.jar                    # needs a display; reads assets from cwd
```
JDK 17 runs it: the jar vendors its own copy of `sun.audio`, which Java 9
removed, so no patching was needed. That is a real difference from nfm, whose
jar needed seven bytecode patches before it would start.

## Delegating work
`bash decompilation/run_class <Class>` takes one class the whole way: it runs
the `port` job, compiles and runs the probe, runs the `test` job, runs
`node --test`, and gives one `fix` attempt on failure. It stops at anything
needing judgement and prints the manual checklist (bytecode classification,
mutation testing, array typing). **That checklist is not optional** — the
script proves the tests are green, not that the port is right.

`bash decompilation/agy_ra1 <port|test|fix> <Class>` runs a single phase, for
when you want to intervene between them.

**Delegation runs on Gemini (`gemini-3.7-flash-medium`), never on a `claude-*`
model.** That is the user's instruction, and the `claude-*` quota is shared and
is what stalled this port mid-`ContO`.

**The subagent has a shell** — `agy_ra1` runs it with
`--dangerously-skip-permissions`, the user's explicit decision. So one `class`
job does the whole loop itself: `javap` for the §2 classifications, the
transpilation, the probe, the test, iterating to green, and the mutation test.
`PORT_SPEC.md` §"Using a subagent" still says what may and may not be
delegated. Two jobs at a time, no more.

**Verify it anyway.** `run_class` recompiles and re-runs the probe from source
and runs the whole suite regardless of what the job reported, and its closing
checklist is yours to work through. In particular, **check every §2
classification against `javap` yourself**: a confident report is not evidence —
the `Craft` job called 13 of 14 sites Case A at HIGH confidence when the
bytecode says Case B for every one, and the `Tank` job got the same shape
backwards in the other direction.

`chmod` is unavailable in this session, so invoke the script with `bash`.

## The one invariant that must not break
There is **no depth buffer**. Occlusion is submission order and nothing else:
`F51.run()` depth-sorts the `ContO`s, `Plane.d()` sorts faces within an object.
Do not batch, reorder, or hoist a draw call. Any of those still looks plausible
in a screenshot, which is what makes it dangerous. See the banner at the top of
`port/graphics.js`.
