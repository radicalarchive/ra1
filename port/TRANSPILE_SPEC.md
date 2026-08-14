# TRANSPILE_SPEC.md — rules for transpiling `decompilation/java-src/*.java` to `port/*.js`

Read this in full before writing a line.

Most of these rules are inherited from the sibling port of *Need for Madness*
(`/home/evan/resources/nfm`), which is the **same engine family** — `ContO`,
`Plane`, `Medium`, `xtGraphics` and `SinCos` are recognisably the same code,
written by the same author. Every rule below was derived there by running the
real Java and diffing, not by reasoning about it. Sections §2, §2b and §3 are
bugs that were caught that way *after* the code "looked right". Assume they
apply here too until a probe says otherwise.

---

## 0. The prime directive

**Transpile line by line. Do not restructure, rename, simplify, or "fix".**

Keep procyon's local names (`i`, `j`, `l2`, `aconto`, `abyte0`) even though they
are ugly. The entire value of this approach is that the JS file diffs against
the Java file side by side. A reviewer must be able to put them in two panes
and scan.

Do not:
- rename locals to meaningful names
- collapse repeated blocks into helpers (one exception, §9)
- reorder statements, even when order looks irrelevant
- fix apparent bugs (§3)
- add features, logging, or error handling

---

## 1. Numeric semantics — the core rules

Import from `./java.js`:
`idiv, i32, trunc, fr, jround, intArray, floatArray, objArray, random,
colorOf, colorRed, colorGreen, colorBlue`

| Java | JS | Why |
| --- | --- | --- |
| `int / int` | `idiv(a, b)` | Java truncates toward zero; JS `/` yields a float |
| `(int) someFloat` | `trunc(x)` | truncates toward zero, saturates at int32 bounds (does NOT wrap) |
| `int * int` that can exceed 2^31 | `Math.imul(a, b)` | exact int32 wrapping multiply |
| `int + int` / `int - int` that can exceed 2^31 | `i32(a + b)` | **`Math.imul` alone is not enough — see §2b** |
| any `float`-typed intermediate | `fr(x)` | Java `float` is 32-bit; JS has only doubles |
| `int[]` field | `intArray(n)` | Int32Array: wrapping + truncation on every store, free |
| `float[]` field | `floatArray(n)` | Float32Array: float32 rounding on every store, free |
| `Object[]` / nested | `objArray(n)` | null-filled |
| `Math.round(f)` | `jround(x)` | `floor(x + 0.5)` |
| `Math.random()` | `random()` | seeded; deterministic runs |
| `new Color(r,g,b)` | `colorOf(r,g,b)` | packed int; **throws** out of range, as Java does |
| `new Color(packedPixel)` | the packed int itself | no wrapper object |
| `.getRed()/.getGreen()/.getBlue()` | `colorRed(c)` / `colorGreen(c)` / `colorBlue(c)` | |

### Where `fr()` actually matters

`SinCos.getsin(i)` and `SinCos.getcos(i)` return **`float`** — they index a
`float[360]` table. So *any* expression mixing them is float32 arithmetic in
Java, rounded at **every** binary operation. Radical Aces routes essentially
all of its 3D math through `this.m.cs.getsin(...)` / `getcos(...)`, so this is
the single most common source of silent drift in this port.

```java
final int k = this.m.cx + (int)((this.x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz)
                              - (this.z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz));
```
becomes
```js
const k = this.m.cx + trunc(fr(fr((this.x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz))
                             - fr((this.z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz))));
//                             ^^ the subtraction is ALSO rounded
```

Round each binary op, innermost first. Getting this wrong does not fail a smoke
test — it drifts slowly over frames, which is far worse.

Note the mixed cases: `Math.sqrt`, `Math.atan` and any `double` literal make the
expression **double**, not float, so no `fr()` — read the declared types.

---

## 2. ⚠ Compound assignment — procyon decompiles this WRONG

**This is the rule that will bite you. It bit the nfm port's reference class.**

Procyon emits:

```java
this.clds[i] += (int)(this.clds[i] * (this.snap[i] / 100.0f));
```

The actual bytecode is `i2f, i2f, i2f, fdiv, fmul, fadd, f2i, iastore` — the
**left-hand side is converted to float, added, and truncated ONCE at the end.**
Java's compound-assignment rule inserts an implicit narrowing cast, so the real
source was `x += <float expr>` and procyon rendered the implicit cast as an
explicit one *in the wrong place*.

So this:
```js
this.clds[i] += trunc(fr(this.clds[i] * fr(this.snap[i] / 100.0)));   // WRONG
```
must be:
```js
this.clds[i] = trunc(fr(this.clds[i] + fr(this.clds[i] * fr(this.snap[i] / 100.0))));
```

Worked example: base 219, snap −5.
- wrong: `219 + trunc(-10.95)` = `219 - 10` = **209**
- right: `trunc(219 - 10.95)` = `trunc(208.05)` = **208**  ← what Java prints

### ⚠ The rule — and it is NOT unconditional. CHECK THE BYTECODE, PER SITE.

`lvalue += (int)(expr)` from procyon is **ambiguous**. It compiles from two
different sources, and only one of them is an artifact. You cannot tell which
from the decompiled text — you must disassemble.

**Case A — implicit narrowing (procyon artifact). Must be rewritten.**
Source was `x += <float expr>`; javac inserted the narrowing cast.
Bytecode signature: the LHS is loaded and **converted to float/double before
the add**, with a single truncation at the very end.

```
getfield x ; i2f ; <expr> ; fadd ; f2i ; putfield x
         ^^^^^^^                   ^^^ one truncation, after the add
```
```js
x = trunc(fr(x + expr));     // correct for Case A
```

**Case B — explicit cast in the original source. Already correct, leave it.**
Bytecode signature: the expression is truncated **on its own**, then an
integer add.

```
getfield x ; <expr> ; d2i ; iadd ; putfield x
                      ^^^^^^^^^^ truncate first, THEN integer add
```
```js
x += trunc(expr);            // correct for Case B — do NOT "fix" this
```

**The discriminator is whether `i2f`/`i2d` appears on the LHS load.**
Case A converts the left side; Case B does not.

**Grep your file for `+= (int)(` and `-= (int)(`, disassemble each hit, and
classify it A or B.** Report the classification per site. Guessing is not
acceptable in either direction. Radical Aces is full of these: `Craft.java`,
`userCraft.java` and `Tank.java` each carry dozens in their `preform` methods.

If the operand is genuinely integer-valued (no float or double anywhere in it),
a plain `+=` is correct and no disassembly is needed.

---

### 2e. Mutate the site before you believe the test

A passing differential test proves nothing until you have seen it fail. After
classifying a §2 site, **flip it to the other case, re-run, confirm the test
goes red, and revert.**

This is not ceremony. `Medium.js` was tested by driving all seven camera modes
for eight steps each against real Java values — 17 assertions, all green — and
it stayed green with every one of its nine Case A sites flipped to Case B. The
two rules differ only when the accumulator is positive and the step is a small
negative fraction (`trunc(5000 - 0.67)` = 4999 vs `5000 + trunc(-0.67)` = 5000),
and the game's default camera never reaches that state within eight steps. Four
more probe cases — the camera converging *downward* onto a *positive* target —
made the mutation fail three tests.

So: work out, in words, what input shape separates the two answers, and make
sure the probe covers it. If you cannot find such an input, say so in your
report; "the classification does not matter on any reachable input" is a fine
answer, but it is a claim that needs stating, not an assumption.

## 2b. ⚠ EVERY int operation wraps, not just the multiplies

`Math.imul` fixes the multiply and then people stop. The **addition wraps too**.

```java
return (n - n2) * (n - n2) + (n3 - n4) * (n3 - n4);   // imul, imul, iadd
```

```js
return Math.imul(n - n2, n - n2) + Math.imul(n3 - n4, n3 - n4);        // WRONG
return i32(Math.imul(n - n2, n - n2) + Math.imul(n3 - n4, n3 - n4));   // right
```

This is not theoretical. It is exactly the shape of `getpy` / `getcpy`, which
every class in this game has its own copy of, and Radical Aces world
coordinates run to tens of thousands — squared and summed, three terms, that
overflows routinely. The original game overflows too, and the wrapped value
feeds distance comparisons, so the wrap **changes gameplay**. Reproduce it.

Use `Math.imul` ONLY when both operands are declared `int` in the Java. On a
float operand it silently zeroes the value — in the nfm port that single
mistake meant no car ever collided with anything.

---

## 2c. ⚠ NEVER weaken a test to make it pass

This happened on the first delegated class in the nfm port and must not happen
here.

That agent wrote an overflow test from real probe values, saw it fail, and
**deleted the failing inputs, substituted inputs that passed, and moved the
Java values into a comment** — with a rationalisation that the failing range
"never occurs in the game". The range did occur, and the code was wrong.

When your test disagrees with the probe:

1. The probe is right. Your code is wrong. Start from that assumption.
2. Disassemble the method (`javap -p -c`) and find the exact opcode sequence.
3. Fix the **code**.

You may **never**:
- change the test's inputs to avoid a failure
- loosen `strictEqual` to a tolerance
- move an expected value into a comment
- delete a case
- argue that the failing range is unrealistic

If after disassembling you genuinely cannot reconcile it, **leave the test
failing**, mark it `test.todo`, and say so loudly in your report. A red test is
information. A green test that was edited until it went green is a lie, and it
is worse than no test at all.

The Java bytecode is the only oracle. If an already-ported file here disagrees
with it, that file is wrong: implement it correctly and say so in your report —
do not copy the bug.

---

## 2d. ⚠ Some Java state is NOT reproducible — recognise it before chasing it

`Math.random()` is unseeded on the Java side. Anything downstream of it is
non-deterministic *in the Java*, so a probe cannot produce a stable expected
value for it. `Plane`, `Lasers`, `Craft`, `Tank` and `userCraft` all roll for
smoke, flame and debris.

So before concluding "my port has a drift bug", **run the Java probe three
times.** If the field moves between Java runs, the port is not the problem.

Handle it by asserting the deterministic fields and documenting — prominently,
in the test — which fields are excluded and why. That is NOT a §2c violation:
§2c forbids weakening an assertion that *could* hold. This is declining to
assert something that provably cannot.

---

## 3. ⚠ Preserve the game's bugs verbatim

`(int)` casts of float literals appear in the original and are **not** typos to
fix. They evaluate to the truncated integer:

```java
r6 *= (int)1.6;      // (int)1.6 == 1  -> multiply by ONE, a no-op
r3 *= (int)0.991;    // (int)0.991 == 0 -> ZEROES the value
```

Transpile these as `Math.imul(r6, 1)` and `Math.imul(r3, 0)` with a comment
saying it is the game's behaviour and not a slip. Do **not** write `1.6`.
Somebody will "fix" it otherwise, and the output will stop matching.

Likewise do not fix off-by-ones, unreachable branches, or dead stores. Radical
Aces has several: `F51.run()` opens with a `String s2 = ""` that is then tested
with `s2.startsWith("sun.")`, which is always false. Port it as written.

---

## 4. Graphics calls

The shim is `port/graphics.js`, a **Canvas2D** backend (nfm used WebGL; the
reasoning for the difference is in the banner at the top of the file — do not
"upgrade" it without reading that).

| Java | JS |
| --- | --- |
| `g.setColor(new Color(r, g, b))` | `g.setColor(colorOf(r, g, b))` |
| `g.setColor(new Color(this.pix[i]))` | `g.setColor(this.pix[i])` |
| `g.fillPolygon(xs, ys, n)` | same signature |
| `g.drawPolygon / fillRect / drawRect / drawLine / drawString` | same |
| `g.drawImage(img, x, y, null)` | `g.drawImage(img, x, y)` |
| `g.setFont(new Font("SansSerif", 1, 11))` | `g.setFont('SansSerif', 1, 11)` |
| `g.getFontMetrics()` | same; `.getHeight()`, `.stringWidth(s)` |
| `panel.createImage(w, h)` | `createImage(w, h)` from `graphics.js` |
| `createImage(new MemoryImageSource(w,h,pix,0,w))` | `imageFromPixels(w, h, pix)` |
| `new PixelGrabber(img,0,0,w,h,pix,0,w).grabPixels()` | `grabPixels(img, pix, w, h)` |

### ⚠ PAINTER'S ALGORITHM — never violate this

There is **no depth buffer**. Occlusion comes entirely from the order in which
`fillPolygon` / `drawPolygon` are called. `F51.run()` depth-sorts the ContOs
before drawing them, and `Plane.d()` sorts faces within one object.

Therefore:
- never reorder drawing calls
- never hoist a draw out of a branch
- never batch or group draws by colour, type, or anything else
- never merge two loops that each draw

This is the failure that passes every test and still draws planes through
mountains.

---

## 5. Class shape

```js
import { idiv, i32, trunc, fr, intArray, floatArray, objArray } from './java.js';

export class Foo {
  constructor(...) {
    // field initialisers in the SAME ORDER procyon lists them
  }
  someMethod(a, b) { ... }
}
```

- `final` → drop
- `this.` stays
- Java `boolean[]` → `new Array(n).fill(false)`
- nested `int[a][b]` → array of `Int32Array`
- Java `long` arithmetic: plain numbers; values here stay far inside 2^53
- `String.charAt(i)` → `s[i]` — but see §5a
- `s.startsWith` / `.trim` / `.indexOf` / `.substring` are the same in JS
- `Integer.valueOf(s)` / `Integer.parseInt(s)` → `parseInt(s, 10)`
- `Float.valueOf(s)` → `parseFloat(s)`
- `Math.abs/sqrt/atan/round/cos/sin` → the JS equivalents (`round` → `jround`)
- the game's `do { ... } while (++i < n)` loops stay `do/while`

### 5b. `int[]` means `Int32Array`, locals included

Every Java `int[]` becomes `intArray(n)` and every `float[]` becomes
`floatArray(n)` — **fields and locals alike**, including the scratch arrays a
method allocates for one call:

```java
final int[] ai = new int[this.n];      // Plane.d(), three of them per call
```
```js
const ai = intArray(this.n);           // NOT new Array(this.n).fill(0)
```

`new Array(n).fill(0)` looks equivalent and is not: it loses the
wrap-and-truncate Java does on every store, which is precisely the divergence
§2b is about. The calibration class made this mistake on all 24 of its arrays
and reasoned that "the values are already in int32 range before the store".
That reasoning is not available to you — the whole point of §2b is that they
sometimes are not.

### 5c. ⚠ Array indexing throws in Java. Use `at()` where a loop can overrun.

The JVM bounds-checks every array read. JS returns `undefined`, which poisons
the arithmetic with `NaN` and keeps going. Where that difference is reachable,
use `at(arr, i)` from `java.js`, which throws.

This is not hypothetical, and it is not only about crashes. Measured:

```java
this.ox = new int[this.n];         // Plane's constructor, n from the model file
...
do { ... this.ox[l] ... } while (++l < 3);    // runs 0..2 whatever n is
```

`graphics/bebs.rad` contains two faces with only **two** vertices. Java throws
`ArrayIndexOutOfBoundsException` on the seventh face; `ContO`'s parse loop
catches it and abandons the rest of the file, so the real game builds a model
with **6** faces. The port without `at()` built all **8**, the two extra ones
made of `NaN` coordinates — and every test still passed, because nothing
asserted the face count until a probe compared all 56 model files.

So: whenever a loop bound and an array length come from different places, the
read is `at()`. When they provably come from the same place, plain indexing is
fine and clearer.

### 5a. Java throws where JS shrugs

`String.charAt()` past the end **throws** StringIndexOutOfBoundsException;
`s[i]` returns `undefined` and silently concatenates `"undefined"`.
`Integer.parseInt("x")` throws NumberFormatException; `parseInt` returns `NaN`.

The `.rad`/`.txt` parsers (`ContO.getvalue`, `F51.getstring`, `F51.getint`) walk
strings character by character and the game **relies** on the throw in at least
one place. Match Java's behaviour, including the throw. Do **not** add a bounds
check the Java does not have — that is a §0/§3 violation even when it looks
obviously safer.

---

## 6. Verification — MANDATORY, and it is not optional or approximate

You must diff your output against the **real Java class**, not against your
reading of it.

```sh
# unpack (usually already done at $JAR_DIR, else:)
mkdir -p /tmp/ra1jar && cd /tmp/ra1jar && unzip -oq /home/evan/resources/ra1/ra1.jar

# write a probe that drives the real class through reflection
# (fields are package-private, so setAccessible(true) is required)
javac -cp /tmp/ra1jar -d /tmp/probe YourProbe.java
java -cp /tmp/probe:/tmp/ra1jar tools.YourProbe
```

A probe looks like this:

```java
Object m = Class.forName("Medium").getDeclaredConstructor().newInstance();
Field f = m.getClass().getDeclaredField("clds"); f.setAccessible(true);
Method x = m.getClass().getDeclaredMethod("setsky", int.class, int.class, int.class);
x.setAccessible(true);
x.invoke(m, 207, 232, 255);
System.out.println(java.util.Arrays.toString((int[]) f.get(m)));
```

Then drive your JS the same way and compare **exact integers**, not "close".

Write the comparison up as a `node:test` file, `port/<Class>.test.js`, with the
Java-produced values as literals and a comment saying they came from the probe.
Save the probe SOURCE under `port/tools/`; probes declare `package tools;`.

**Pick inputs that exercise negatives, and magnitudes large enough to overflow
int32**, because that is where truncation-vs-floor, §2 and §2b show up. Small
all-positive inputs will happily agree while the code is wrong.

Anything taking a `Graphics` argument can be driven with a real
`BufferedImage.createGraphics()` under `-Djava.awt.headless=true` — you are
verifying the numbers it computes and the fields it mutates, not the pixels.

### Coverage: probe the method that does the work

The first delegated class in the nfm port probed only the small leaf helpers and
skipped the class's main method, because it needed stub objects to call. That is
the method most worth verifying, and "it was awkward to set up" is not a reason
to skip it.

Build the stubs. Plain object literals with the fields the method touches are
enough on the JS side; construct the equivalent with reflection on the Java
side. If a method genuinely cannot be driven, say so **explicitly and
prominently** in your report and name it. Do not let it pass silently behind a
green suite of leaf-helper tests.

---

## 7. What to hand back

- `port/<Class>.js`
- `port/<Class>.test.js`, passing
- the probe source under `port/tools/`
- a note listing: every `+= (int)(` site and its A/B classification; every field
  you touched with its declared Java type; every preserved bug; everything you
  could NOT verify

State plainly if you could not verify something. A gap you flag is cheap; a gap
you paper over costs days. Do not report "gaps: none".

---

## 8. Do not touch

- `port/java.js`, `port/graphics.js`, `port/vfs.js`, `port/audio.js` — shared
  infrastructure. If you think one needs a change, say so in your report
  instead of editing it.
- any existing `.js` or `.test.js` you were not asked to create
- `AGENTS.md`, `WORK.md`, `TASKS.md`
- `graphics/`, `levels/`, `objects/`, `siters/`, `sounds/`, `music/`, `ra1.jar`
  — game assets and the reference jar, read-only

---

## 9. The one allowed exception to §0

If the Java contains two blocks that are **provably character-identical apart
from a couple of index constants**, you may fold them into one private method,
**provided** the call sites preserve the original order and you comment what was
folded and why.

If you are not certain the two blocks are identical, do not fold them. The
default answer is no.
