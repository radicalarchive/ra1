package tools;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.Files;

/**
 * Drives the REAL Medium from ra1.jar, for port/Medium.test.js.
 *
 * What matters here is the NINE compound assignments of the shape
 * `this.z += (int)((...) / 1.5)`. The bytecode says Case A (the left-hand side
 * is widened to double before the add, one truncation at the end), and Case A
 * and Case B differ only when the fraction and the accumulator disagree in
 * sign — so the camera is driven through many steps, from a NEGATIVE starting
 * position, and the state is printed each step. A Case B port matches for a
 * step or two and then drifts, which is exactly the failure §2 is about.
 *
 * A real ContO is used as the camera target, built from a real model file, so
 * the collaborator is the game's own object rather than a stub.
 *
 * Run:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe port/tools/MediumProbe.java
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.MediumProbe
 */
public class MediumProbe {

    static Object medium() throws Exception {
        Constructor<?> c = Class.forName("Medium").getDeclaredConstructor();
        c.setAccessible(true);
        return c.newInstance();
    }

    static Object contO(Object m, int x, int y, int z) throws Exception {
        byte[] data = Files.readAllBytes(new java.io.File("/home/evan/resources/ra1/objects/rk1.rad").toPath());
        Constructor<?> c = Class.forName("ContO").getDeclaredConstructor(
                byte[].class, Class.forName("Medium"), int.class, int.class, int.class);
        c.setAccessible(true);
        return c.newInstance(data, m, x, y, z);
    }

    static int gi(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getInt(o);
    }

    static void si(Object o, String name, int v) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setInt(o, v);
    }

    static boolean gb(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getBoolean(o);
    }

    static String state(Object m) throws Exception {
        return "x=" + gi(m, "x") + " y=" + gi(m, "y") + " z=" + gi(m, "z")
             + " xz=" + gi(m, "xz") + " zy=" + gi(m, "zy")
             + " tart=" + gi(m, "tart") + " yart=" + gi(m, "yart");
    }

    static void drive(String label, String method, int contoZy, int contoXz) throws Exception {
        drive(label, method, contoZy, contoXz, 4000, -1200, 5000);
    }

    /**
     * The target position decides the SIGN of the camera's step, and that is
     * what separates §2 Case A from Case B: `trunc(z + q)` and `z + trunc(q)`
     * agree for every positive q and disagree whenever q is negative and
     * fractional. A target the camera has to move BACKWARDS to reach is
     * therefore not an extra case, it is the only case that tests the rule.
     * (Verified by mutation: with only the forward target, swapping Case A for
     * Case B changed nothing and the test still passed.)
     */
    static void drive(String label, String method, int contoZy, int contoXz,
                      int tx, int ty, int tz) throws Exception {
        drive(label, method, contoZy, contoXz, tx, ty, tz, 3000, -1000, -2000);
    }

    /**
     * As above, but the CAMERA's starting position is set too.
     *
     * Case A and Case B differ only when the accumulator and the step's
     * fractional part have opposite signs — `trunc(5 - 0.4)` is 4 while
     * `5 + trunc(-0.4)` is 5, but with the accumulator negative both give the
     * same answer. So the discriminating case is a POSITIVE camera coordinate
     * moving in the NEGATIVE direction, which needs both ends pinned. Found by
     * mutation testing: the constructor's default camera never produced it, and
     * a wrong port passed 17 tests.
     */
    static void drive(String label, String method, int contoZy, int contoXz,
                      int tx, int ty, int tz, int camx, int camy, int camz) throws Exception {
        Object m = medium();
        si(m, "x", camx);
        si(m, "y", camy);
        si(m, "z", camz);
        Object o = contO(m, tx, ty, tz);
        si(o, "zy", contoZy);
        si(o, "xz", contoXz);
        Method mth = m.getClass().getDeclaredMethod(method, Class.forName("ContO"));
        mth.setAccessible(true);
        for (int step = 1; step <= 8; step++) {
            mth.invoke(m, o);
            System.out.println(label + ".step" + step + " = " + state(m));
        }
    }

    public static void main(String[] argv) throws Exception {
        Object m0 = medium();
        System.out.println("ctor = " + state(m0)
                + " focus_point=" + gi(m0, "focus_point") + " ground=" + gi(m0, "ground")
                + " cx=" + gi(m0, "cx") + " cy=" + gi(m0, "cy") + " cz=" + gi(m0, "cz")
                + " w=" + gi(m0, "w") + " h=" + gi(m0, "h") + " adv=" + gi(m0, "adv"));

        // ys(), including the overflow d() actually reaches (j = 70000).
        Method ys = m0.getClass().getDeclaredMethod("ys", int.class, int.class);
        ys.setAccessible(true);
        int[][] cases = { {250, 70000}, {0, 0}, {-500, 800}, {200, 5}, {-2000000, 49000}, {1000000, 70000} };
        for (int[] c : cases) {
            System.out.println("ys(" + c[0] + ", " + c[1] + ") = " + ys.invoke(m0, c[0], c[1]));
        }

        // The four view modes that carry the Case A sites. Two target
        // orientations each, because infront/behinde branch on conto.zy.
        drive("infront_a", "infront", 30, 45);
        drive("infront_b", "infront", 200, -70);
        drive("behinde_a", "behinde", 30, 45);
        drive("behinde_b", "behinde", 200, -70);
        drive("left", "left", 30, 45);
        drive("right", "right", 30, 45);
        drive("watch", "watch", 30, 45);

        // Same modes, but with the target BEHIND and BELOW the camera, so every
        // step is negative — see the comment on drive() above.
        drive("infront_neg", "infront", 30, 45, -6000, 2500, -9000);
        drive("behinde_neg", "behinde", 30, 45, -6000, 2500, -9000);
        drive("left_neg", "left", 30, 45, -6000, 2500, -9000);
        drive("right_neg", "right", 30, 45, -6000, 2500, -9000);
        drive("watch_neg", "watch", 30, 45, -6000, 2500, -9000);

        // Camera at positive coordinates, target far behind and below it: the
        // accumulator is positive while every step is negative, which is the
        // only shape that separates §2 Case A from Case B.
        drive("infront_ab", "infront", 30, 45, -9000, 4000, -12000, 7000, 3000, 9000);
        drive("behinde_ab", "behinde", 30, 45, -9000, 4000, -12000, 7000, 3000, 9000);
        drive("left_ab", "left", 30, 45, -9000, 4000, -12000, 7000, 3000, 9000);
        drive("right_ab", "right", 30, 45, -9000, 4000, -12000, 7000, 3000, 9000);

        // The camera CONVERGING DOWNWARD onto a positive target: the
        // accumulator stays positive while every step is a small negative
        // fraction, which is the shape that makes trunc(z + q) and
        // z + trunc(q) differ (z=5000, numerator=-1 gives 4999 vs 5000).
        drive("infront_cv", "infront", 0, 0, 3000, 900, 4000, 6000, 2600, 9000);
        drive("behinde_cv", "behinde", 0, 0, 3000, 900, 4000, 6000, 2600, 9000);
        drive("left_cv", "left", 0, 0, 3000, 900, 4000, 6000, 2600, 9000);
        drive("right_cv", "right", 0, 0, 3000, 900, 4000, 6000, 2600, 9000);

        // around() takes an extra int; 6000 selects its other branch.
        for (int arg : new int[] { 3000, 6000 }) {
            Object m = medium();
            Object o = contO(m, 4000, -1200, 5000);
            Method ar = m.getClass().getDeclaredMethod("around", Class.forName("ContO"), int.class);
            ar.setAccessible(true);
            for (int step = 1; step <= 8; step++) {
                ar.invoke(m, o, arg);
                System.out.println("around" + arg + ".step" + step + " = " + state(m)
                        + " adv=" + gi(m, "adv") + " vxz=" + gi(m, "vxz") + " vert=" + gb(m, "vert"));
            }
        }

        // d() clamps zy/y, recomputes ground, and decrements jumping. Drive it
        // with a real Graphics2D so the fills run; we read the fields, not the
        // pixels.
        BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        int[][] dcases = { {0, 0, 0}, {120, -800, 0}, {-120, 500, 3}, {45, -1000, 1} };
        for (int[] c : dcases) {
            Object m = medium();
            si(m, "zy", c[0]);
            si(m, "y", c[1]);
            si(m, "jumping", c[2]);
            Method d = m.getClass().getDeclaredMethod("d", java.awt.Graphics.class);
            d.setAccessible(true);
            d.invoke(m, g);
            System.out.println("d(zy=" + c[0] + ",y=" + c[1] + ",jumping=" + c[2] + ") = "
                    + "zy=" + gi(m, "zy") + " y=" + gi(m, "y") + " ground=" + gi(m, "ground")
                    + " jumping=" + gi(m, "jumping"));
        }

        System.out.println("PROBE OK");
    }
}
