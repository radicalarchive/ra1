package tools;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * Reflection probe for Plane.java
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe \
 *         /home/evan/resources/ra1/port/tools/PlaneProbe.java
 *
 * Run:
 *   java -Djava.awt.headless=true \
 *        -cp /tmp/ra1port/probe:/tmp/ra1jar tools.PlaneProbe
 *
 * Output format: one 'label = value' per line; arrays as '[a, b, c]'.
 * Final line is 'PROBE OK'.
 *
 * Inputs chosen to exercise:
 *   - Large coordinates with negative values that overflow int32 when squared
 *     (ox[], oy[], oz[] in the thousands to tens of thousands).
 *   - spy() called with values > sqrt(Integer.MAX_VALUE) to exercise i32 wrap.
 *   - Non-zero camera angles (xz=45, zy=30) so rot() actually runs.
 *   - exp=0 everywhere to avoid Math.random() paths (see NONDETERMINISTIC section).
 *
 * NONDETERMINISTIC: any Plane method that sets this.exp > 0 triggers Math.random()
 *   calls. The following paths are intentionally NOT exercised here:
 *     d() when exp == 2 (sdx, sdz, sdy, sx[], sy[], sz[] initialisation)
 *     d() when exp != 0 (the whole explosion animation block)
 *     s() when exp == 1 (adx, adz, ady, ofcx, ofcy, ofcz, nx, ny, nz, azy, axy)
 *     s() when exp != 0 (explosion translation + rotation block)
 *   All random values printed below are clearly labelled NONDETERMINISTIC and
 *   must not be asserted in tests.
 *
 * What this probe does NOT cover:
 *   - The explosion animation paths in d() (exp 2..7): they contain Math.random()
 *     and are therefore non-deterministic on the Java side (TRANSPILE_SPEC §2d).
 *   - The explosion setup path in s() (exp==1): same reason.
 *   - loadprojf() is called and its result (this.projf) is printed; the value
 *     depends only on ox[] and oz[], which are deterministic given the inputs.
 *   - The case where d() draws via flag=true (400.0f * f path) is exercised by
 *     a second call in the SECOND_PLANE section below.
 */
public class PlaneProbe {

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    static Object newMedium() throws Exception {
        Class<?> medCls = Class.forName("Medium");
        // Medium() sets all fields including cs = new SinCos()
        Object m = medCls.getDeclaredConstructor().newInstance();
        // Set non-default values to exercise the camera angles
        setInt(m, "xz", 45);
        setInt(m, "zy", 30);
        return m;
    }

    static Object newPlane(Object medium, int[] ox, int[] oz, int[] oy, int n, int[] c) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Class<?> planeCls = Class.forName("Plane");
        // Plane(Medium medium, int[] ai, int[] ai1, int[] ai2, int i, int[] ai3)
        // ai = ox, ai1 = oz, ai2 = oy, i = n, ai3 = c
        Constructor<?> ctor = planeCls.getDeclaredConstructor(
            medCls, int[].class, int[].class, int[].class, int.class, int[].class);
        ctor.setAccessible(true);
        return ctor.newInstance(medium, ox, oz, oy, n, c);
    }

    static void setInt(Object obj, String fname, int val) throws Exception {
        Field f = obj.getClass().getDeclaredField(fname);
        f.setAccessible(true);
        f.setInt(obj, val);
    }

    static int getInt(Object obj, String fname) throws Exception {
        Field f = obj.getClass().getDeclaredField(fname);
        f.setAccessible(true);
        return f.getInt(obj);
    }

    static float getFloat(Object obj, String fname) throws Exception {
        Field f = obj.getClass().getDeclaredField(fname);
        f.setAccessible(true);
        return f.getFloat(obj);
    }

    static double getDouble(Object obj, String fname) throws Exception {
        Field f = obj.getClass().getDeclaredField(fname);
        f.setAccessible(true);
        return f.getDouble(obj);
    }

    static int[] getIntArray(Object obj, String fname) throws Exception {
        Field f = obj.getClass().getDeclaredField(fname);
        f.setAccessible(true);
        return (int[]) f.get(obj);
    }

    static int invokeXs(Object plane, int i, int j) throws Exception {
        Method m = plane.getClass().getDeclaredMethod("xs", int.class, int.class);
        m.setAccessible(true);
        return (int) m.invoke(plane, i, j);
    }

    static int invokeYs(Object plane, int i, int j) throws Exception {
        Method m = plane.getClass().getDeclaredMethod("ys", int.class, int.class);
        m.setAccessible(true);
        return (int) m.invoke(plane, i, j);
    }

    static int invokeSpy(Object plane, int i, int j) throws Exception {
        Method m = plane.getClass().getDeclaredMethod("spy", int.class, int.class);
        m.setAccessible(true);
        return (int) m.invoke(plane, i, j);
    }

    static void invokeLoadprojf(Object plane) throws Exception {
        Method m = plane.getClass().getDeclaredMethod("loadprojf");
        m.setAccessible(true);
        m.invoke(plane);
    }

    static void invokeRot(Object plane, int[] ai, int[] ai1, int i, int j, int k, int l)
            throws Exception {
        Method m = plane.getClass().getDeclaredMethod(
            "rot", int[].class, int[].class, int.class, int.class, int.class, int.class);
        m.setAccessible(true);
        m.invoke(plane, ai, ai1, i, j, k, l);
    }

    static void invokeD(Object plane, Graphics g, int i, int j, int k, int l,
                        int i1, int j1, boolean flag, boolean flag1, boolean flag2)
            throws Exception {
        Method m = plane.getClass().getDeclaredMethod(
            "d", Graphics.class, int.class, int.class, int.class, int.class,
            int.class, int.class, boolean.class, boolean.class, boolean.class);
        m.setAccessible(true);
        m.invoke(plane, g, i, j, k, l, i1, j1, flag, flag1, flag2);
    }

    static void invokeS(Object plane, Graphics g, int i, int j, int k, int l,
                        int i1, int j1, boolean flag)
            throws Exception {
        Method m = plane.getClass().getDeclaredMethod(
            "s", Graphics.class, int.class, int.class, int.class, int.class,
            int.class, int.class, boolean.class);
        m.setAccessible(true);
        m.invoke(plane, g, i, j, k, l, i1, j1, flag);
    }

    // -----------------------------------------------------------------------
    // Main
    // -----------------------------------------------------------------------

    public static void main(String[] args) throws Exception {

        // ----- MEDIUM setup -----------------------------------------------
        Object m = newMedium();
        // Default Medium constructor gives:
        // cx=250, cy=150, cz=50, focus_point=400, ground=250, w=500, h=360
        // We additionally set xz=45, zy=30 in newMedium().

        // ----- PLANE setup (3-vertex triangle with large, signed coords) --
        // ai  = ox (x), ai1 = oz (z), ai2 = oy (y), i = n, ai3 = c (colour)
        // Vertex coords chosen large and negative so int32 overflow occurs in
        // the deltaf (and spy) squared-distance calculations.
        int[] ox = { -5000, 5000, 2000 };
        int[] oz = { -3000, 3000, 1500 };
        int[] oy = { 100, -200, 50 };
        int   n  = 3;
        int[] c  = { 180, 120, 60 };

        Object plane = newPlane(m, ox, oz, oy, n, c);

        // ----- Constructor post-conditions --------------------------------
        System.out.println("n = " + getInt(plane, "n"));
        System.out.println("ox = " + Arrays.toString(getIntArray(plane, "ox")));
        System.out.println("oy = " + Arrays.toString(getIntArray(plane, "oy")));
        System.out.println("oz = " + Arrays.toString(getIntArray(plane, "oz")));
        System.out.println("c = " + Arrays.toString(getIntArray(plane, "c")));
        System.out.println("deltaf_after_ctor = " + getFloat(plane, "deltaf"));
        System.out.println("projf_after_ctor = " + getFloat(plane, "projf"));
        System.out.println("sr = " + getInt(plane, "sr"));
        System.out.println("sg = " + getInt(plane, "sg"));
        System.out.println("exp_after_ctor = " + getInt(plane, "exp"));

        // ----- loadprojf() ------------------------------------------------
        // Uses ox[] and oz[] only; deterministic.
        invokeLoadprojf(plane);
        System.out.println("projf_after_loadprojf = " + getFloat(plane, "projf"));

        // ----- xs() -------------------------------------------------------
        // xs(i, j): perspective x.  j < 10 clamps j = 10.
        // Normal case: large i and j (no clamp)
        System.out.println("xs(3000, 2000) = " + invokeXs(plane, 3000, 2000));
        // Negative i
        System.out.println("xs(-500, 800) = " + invokeXs(plane, -500, 800));
        // j < 10 clamp
        System.out.println("xs(200, 5) = " + invokeXs(plane, 200, 5));
        // j negative: clamp to 10
        System.out.println("xs(200, -100) = " + invokeXs(plane, 200, -100));
        // Edge: j == 0 -> clamp to 10
        System.out.println("xs(0, 0) = " + invokeXs(plane, 0, 0));

        // ----- ys() -------------------------------------------------------
        System.out.println("ys(3000, 2000) = " + invokeYs(plane, 3000, 2000));
        System.out.println("ys(-500, 800) = " + invokeYs(plane, -500, 800));
        System.out.println("ys(200, 5) = " + invokeYs(plane, 200, 5));
        System.out.println("ys(200, -100) = " + invokeYs(plane, 200, -100));
        System.out.println("ys(0, 0) = " + invokeYs(plane, 0, 0));

        // ----- spy() ------------------------------------------------------
        // spy(i, j): distance from (i, j) to (cx, 0), using integer arithmetic.
        // cx = 250 (Medium default).
        // Small inputs (no overflow)
        System.out.println("spy(250, 0) = " + invokeSpy(plane, 250, 0));
        System.out.println("spy(0, 0) = " + invokeSpy(plane, 0, 0));
        System.out.println("spy(1000, 1000) = " + invokeSpy(plane, 1000, 1000));
        // Large inputs that overflow when squared:
        // (50000 - 250)^2 = 2475062500 > Integer.MAX_VALUE; j=60000
        // 60000^2 = 3600000000 > Integer.MAX_VALUE
        // The game wraps these, so the result is NOT the geometrically correct distance.
        System.out.println("spy(50000, 60000) = " + invokeSpy(plane, 50000, 60000));
        System.out.println("spy(-30000, -40000) = " + invokeSpy(plane, -30000, -40000));

        // ----- rot() ------------------------------------------------------
        // rot modifies ai and ai1 in-place; k=0 is a no-op so test k != 0.
        // Use k=45 (same as m.xz), inputs large enough to be interesting.
        int[] rotA  = { -5000, 5000, 2000 };
        int[] rotB  = { -3000, 3000, 1500 };
        invokeRot(plane, rotA, rotB, 0, 0, 45, 3);
        System.out.println("rot_ai_after = " + Arrays.toString(rotA));
        System.out.println("rot_ai1_after = " + Arrays.toString(rotB));

        // k=0 must be a no-op
        int[] rotC = { 100, 200, 300 };
        int[] rotD = { 400, 500, 600 };
        invokeRot(plane, rotC, rotD, 10, 20, 0, 3);
        System.out.println("rot_noop_ai = " + Arrays.toString(rotC));
        System.out.println("rot_noop_ai1 = " + Arrays.toString(rotD));

        // ----- d() with exp=0 (deterministic path) -------------------------
        // Set exp=0 explicitly (it is 0 from constructor, but be explicit).
        setInt(plane, "exp", 0);

        // Drive d() with:
        //   i=3000 (object x), j=-500 (object y — negative), k=2000 (object z)
        //   l=0 (no additional rotation), i1=45 (xy angle), j1=30 (zy angle)
        //   flag=false (normal colour, not white), flag1=false (fill polygon)
        //   flag2=false (not flag2 mode)
        // Use a real BufferedImage for the Graphics argument (headless-safe).
        BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g = img.createGraphics();

        invokeD(plane, g, 3000, -500, 2000, 0, 45, 30, false, false, false);

        System.out.println("av_after_d = " + getInt(plane, "av"));
        System.out.println("projf_after_d = " + getFloat(plane, "projf"));
        System.out.println("exp_after_d = " + getInt(plane, "exp"));

        g.dispose();

        // ----- d() with flag=true (exercises 400.0f * f branch) -----------
        // Build a fresh plane so we get a clean projf / deltaf.
        int[] ox2 = { -500, 500, 200 };
        int[] oz2 = { -300, 300, 150 };
        int[] oy2 = { 10, -20, 5 };
        int[] c2  = { 100, 150, 200 };
        Object plane2 = newPlane(m, ox2, oz2, oy2, 3, c2);
        setInt(plane2, "exp", 0);

        BufferedImage img2 = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g2 = img2.createGraphics();

        invokeD(plane2, g2, 500, -100, 400, 0, 45, 30, true, false, false);

        System.out.println("av_after_d_flag = " + getInt(plane2, "av"));
        System.out.println("projf_after_d_flag = " + getFloat(plane2, "projf"));

        g2.dispose();

        // ----- s() with exp=0 (shadow, deterministic path) ----------------
        // s() clamps oy values to ground and draws the shadow polygon.
        // Use a new plane so we don't corrupt d()'s plane state.
        int[] ox3 = { -200, 300, 100 };
        int[] oz3 = { -150, 200, 80 };
        int[] oy3 = { 400, 450, 420 };    // all > ground (250) -> i2 == n -> no draw
        int[] c3  = { 80, 100, 60 };
        Object plane3 = newPlane(m, ox3, oz3, oy3, 3, c3);
        setInt(plane3, "exp", 0);

        BufferedImage img3 = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g3 = img3.createGraphics();

        // l=0, i1=45, j1=30, flag=false
        invokeS(plane3, g3, 500, -100, 400, 0, 45, 30, false);
        System.out.println("exp_after_s_allaboveground = " + getInt(plane3, "exp"));

        // Now with oy values below ground: some will be clamped -> shadow drawn
        int[] ox4 = { -200, 300, 100 };
        int[] oz4 = { -150, 200, 80 };
        int[] oy4 = { -100, -50, -200 };  // all < ground -> all clamped, i2==0 -> draw
        int[] c4  = { 80, 100, 60 };
        Object plane4 = newPlane(m, ox4, oz4, oy4, 3, c4);
        setInt(plane4, "exp", 0);

        BufferedImage img4 = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g4 = img4.createGraphics();

        invokeS(plane4, g4, 500, -100, 400, 0, 45, 30, false);
        System.out.println("exp_after_s_belowground = " + getInt(plane4, "exp"));

        g3.dispose();
        g4.dispose();

        // ----- NONDETERMINISTIC section ------------------------------------
        // The following paths are NOT exercised because they call Math.random():
        //   d(): exp==2 block (sdx/sdz/sdy/sx/sy/sz init)
        //   d(): exp!=0 block (explosion frame update + flame drawing)
        //   s(): exp==1 block (adx/adz/ady/ofcx/ofcy/ofcz/nx/ny/nz/azy/axy init)
        //   s(): exp!=0 block (explosion translation and rotation)
        // Run the Java probe three times; if any of these values change between
        // runs, they are non-deterministic and must not be asserted in tests.
        // (We do not call those paths here, so nothing to print.)

        System.out.println("PROBE OK");
    }
}
