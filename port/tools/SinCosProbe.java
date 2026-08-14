package tools;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * Probe for SinCos.java
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe SinCosProbe.java
 *
 * Run:
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.SinCosProbe
 *
 * Output format: one 'label = value' per line (arrays: 'label = [a, b, c]').
 * Final line is 'PROBE OK'.
 *
 * Inputs chosen deliberately:
 *   - Negative angles: exercise the i += 360 branch in getsin/getcos.
 *   - Large positive angles > 360 (and > 720): exercise the i -= 360 branch
 *     for single and multiple subtractions.
 *   - In-range angles: baseline.
 *   - Angle 0, 90, 180, 270: boundary values where exact float32 matters.
 *
 * SinCos contains no Math.random() calls and no non-deterministic paths.
 * There are no NONDETERMINISTIC outputs below.
 *
 * What this probe does NOT cover:
 *   - The exact float32 bit-pattern of every table entry (we spot-check
 *     representative entries from the full tsin/tcos arrays).
 *   - Angles equal to exactly ±Integer.MAX_VALUE: the while loops would spin
 *     essentially forever; we use -1081 and 1441 as overflow-class proxies.
 */
public class SinCosProbe {

    public static void main(String[] args) throws Exception {
        // Construct SinCos via reflection (it has a public no-arg constructor,
        // but we use reflection throughout to match the probe style required
        // for package-private classes in other probes).
        Class<?> cls = Class.forName("SinCos");
        Object sc = cls.getDeclaredConstructor().newInstance();

        // --- Spot-check the full tsin and tcos arrays ---
        // Print first 5 entries and last 5 entries to verify table construction.
        Field ftsin = cls.getDeclaredField("tsin");
        ftsin.setAccessible(true);
        float[] tsin = (float[]) ftsin.get(sc);

        Field ftcos = cls.getDeclaredField("tcos");
        ftcos.setAccessible(true);
        float[] tcos = (float[]) ftcos.get(sc);

        System.out.println("tsin.length = " + tsin.length);
        System.out.println("tcos.length = " + tcos.length);

        // First 5
        System.out.println("tsin[0] = " + tsin[0]);
        System.out.println("tsin[1] = " + tsin[1]);
        System.out.println("tsin[2] = " + tsin[2]);
        System.out.println("tsin[3] = " + tsin[3]);
        System.out.println("tsin[4] = " + tsin[4]);

        // Key boundary angles in-table
        System.out.println("tsin[90] = " + tsin[90]);
        System.out.println("tsin[180] = " + tsin[180]);
        System.out.println("tsin[270] = " + tsin[270]);
        System.out.println("tsin[359] = " + tsin[359]);

        System.out.println("tcos[0] = " + tcos[0]);
        System.out.println("tcos[1] = " + tcos[1]);
        System.out.println("tcos[2] = " + tcos[2]);
        System.out.println("tcos[3] = " + tcos[3]);
        System.out.println("tcos[4] = " + tcos[4]);

        System.out.println("tcos[90] = " + tcos[90]);
        System.out.println("tcos[180] = " + tcos[180]);
        System.out.println("tcos[270] = " + tcos[270]);
        System.out.println("tcos[359] = " + tcos[359]);

        // A few mid-table entries to catch systematic offset errors
        System.out.println("tsin[45] = " + tsin[45]);
        System.out.println("tcos[45] = " + tcos[45]);
        System.out.println("tsin[135] = " + tsin[135]);
        System.out.println("tcos[135] = " + tcos[135]);

        // --- getsin and getcos via reflection ---
        Method mgetsin = cls.getDeclaredMethod("getsin", int.class);
        mgetsin.setAccessible(true);
        Method mgetcos = cls.getDeclaredMethod("getcos", int.class);
        mgetcos.setAccessible(true);

        // In-range inputs
        System.out.println("getsin(0) = " + mgetsin.invoke(sc, 0));
        System.out.println("getsin(90) = " + mgetsin.invoke(sc, 90));
        System.out.println("getsin(180) = " + mgetsin.invoke(sc, 180));
        System.out.println("getsin(270) = " + mgetsin.invoke(sc, 270));
        System.out.println("getsin(359) = " + mgetsin.invoke(sc, 359));
        System.out.println("getcos(0) = " + mgetcos.invoke(sc, 0));
        System.out.println("getcos(90) = " + mgetcos.invoke(sc, 90));
        System.out.println("getcos(180) = " + mgetcos.invoke(sc, 180));
        System.out.println("getcos(270) = " + mgetcos.invoke(sc, 270));
        System.out.println("getcos(359) = " + mgetcos.invoke(sc, 359));

        // Angles >= 360: exercise the -= 360 while-loop branch (single wrap)
        System.out.println("getsin(360) = " + mgetsin.invoke(sc, 360));
        System.out.println("getsin(450) = " + mgetsin.invoke(sc, 450));   // 450-360=90
        System.out.println("getcos(360) = " + mgetcos.invoke(sc, 360));
        System.out.println("getcos(450) = " + mgetcos.invoke(sc, 450));

        // Angles >= 720: exercise -= 360 loop multiple times
        System.out.println("getsin(720) = " + mgetsin.invoke(sc, 720));   // 720-360-360=0
        System.out.println("getsin(1441) = " + mgetsin.invoke(sc, 1441)); // 1441 mod 360 = 1
        System.out.println("getcos(720) = " + mgetcos.invoke(sc, 720));
        System.out.println("getcos(1441) = " + mgetcos.invoke(sc, 1441));

        // Negative angles: exercise the += 360 while-loop branch (single wrap)
        System.out.println("getsin(-1) = " + mgetsin.invoke(sc, -1));     // -1+360=359
        System.out.println("getsin(-90) = " + mgetsin.invoke(sc, -90));   // -90+360=270
        System.out.println("getsin(-359) = " + mgetsin.invoke(sc, -359)); // -359+360=1
        System.out.println("getcos(-1) = " + mgetcos.invoke(sc, -1));
        System.out.println("getcos(-90) = " + mgetcos.invoke(sc, -90));
        System.out.println("getcos(-359) = " + mgetcos.invoke(sc, -359));

        // Deeply negative: exercise += 360 loop multiple times
        System.out.println("getsin(-360) = " + mgetsin.invoke(sc, -360));   // -360+360=0
        System.out.println("getsin(-720) = " + mgetsin.invoke(sc, -720));   // -720+360+360=0
        System.out.println("getsin(-1081) = " + mgetsin.invoke(sc, -1081)); // -1081+360*3=359 (mod 360 = 359)
        System.out.println("getcos(-360) = " + mgetcos.invoke(sc, -360));
        System.out.println("getcos(-720) = " + mgetcos.invoke(sc, -720));
        System.out.println("getcos(-1081) = " + mgetcos.invoke(sc, -1081));

        System.out.println("PROBE OK");
    }
}
