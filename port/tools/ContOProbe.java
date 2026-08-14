package tools;

import java.io.File;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.util.Arrays;

/**
 * Drives the REAL ContO from ra1.jar and prints its state, for port/ContO.test.js.
 *
 * Two things are probed, and the first is the interesting one:
 *
 * 1. THE MODEL PARSER, against every .rad in objects/ and graphics/. ContO's
 *    byte[] constructor is how the whole game's geometry is loaded, its parse
 *    loop is wrapped in `catch (Exception ex) {}`, and getvalue() throws in
 *    ordinary cases (charAt past the end after a ',' or ')'; Integer.valueOf on
 *    anything non-numeric). So a JS parser that throws in DIFFERENT places
 *    loads a DIFFERENT model and nothing else in the port will look wrong until
 *    a plane is missing a face. Every field the parser sets is printed, per
 *    file, plus per-plane vertex counts, colours and coordinate checksums.
 *
 * 2. The arithmetic helpers getpy / xs / ys, with inputs big enough to overflow
 *    int32 — those are the ones TRANSPILE_SPEC §2b is about.
 *
 * Run:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe port/tools/ContOProbe.java
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.ContOProbe
 */
public class ContOProbe {

    static Object medium() throws Exception {
        Constructor<?> c = Class.forName("Medium").getDeclaredConstructor();
        c.setAccessible(true);
        return c.newInstance();
    }

    static Object contO(byte[] data, Object m, int x, int y, int z) throws Exception {
        Constructor<?> c = Class.forName("ContO").getDeclaredConstructor(
                byte[].class, Class.forName("Medium"), int.class, int.class, int.class);
        c.setAccessible(true);
        return c.newInstance(data, m, x, y, z);
    }

    static Object f(Object o, String name) throws Exception {
        Field fl = o.getClass().getDeclaredField(name);
        fl.setAccessible(true);
        return fl.get(o);
    }

    static void setInt(Object o, String name, int v) throws Exception {
        Field fl = o.getClass().getDeclaredField(name);
        fl.setAccessible(true);
        fl.setInt(o, v);
    }

    static int call(Object o, String name, int... args) throws Exception {
        Class<?>[] sig = new Class<?>[args.length];
        Arrays.fill(sig, int.class);
        Method mth = o.getClass().getDeclaredMethod(name, sig);
        mth.setAccessible(true);
        Object[] boxed = new Object[args.length];
        for (int i = 0; i < args.length; i++) boxed[i] = args[i];
        return (Integer) mth.invoke(o, boxed);
    }

    public static void main(String[] argv) throws Exception {
        Object m = medium();

        // ---- 1. the parser, over every model file in the distribution ------
        File repo = new File("/home/evan/resources/ra1");
        File[] dirs = { new File(repo, "objects"), new File(repo, "graphics") };
        java.util.List<File> models = new java.util.ArrayList<File>();
        for (File d : dirs) {
            File[] fs = d.listFiles();
            if (fs == null) continue;
            for (File file : fs) {
                if (file.getName().endsWith(".rad") || file.getName().endsWith(".dar")) models.add(file);
            }
        }
        java.util.Collections.sort(models);

        System.out.println("model_count = " + models.size());
        for (File file : models) {
            byte[] data = Files.readAllBytes(file.toPath());
            Object o = contO(data, m, 100, 200, 300);
            String tag = file.getParentFile().getName() + "/" + file.getName();

            int npl = (Integer) f(o, "npl");
            System.out.println(tag + ".npl = " + npl);
            System.out.println(tag + ".maxR = " + f(o, "maxR"));
            System.out.println(tag + ".disp = " + f(o, "disp"));
            System.out.println(tag + ".shadow = " + f(o, "shadow"));
            System.out.println(tag + ".loom = " + f(o, "loom"));
            System.out.println(tag + ".out = " + f(o, "out"));
            System.out.println(tag + ".maxhits = " + f(o, "maxhits"));
            System.out.println(tag + ".colides = " + f(o, "colides"));
            System.out.println(tag + ".rcol = " + f(o, "rcol"));
            System.out.println(tag + ".pcol = " + f(o, "pcol"));
            System.out.println(tag + ".grounded = " + f(o, "grounded"));

            // Per-plane shape. Summing the coordinates catches a wrong `div`
            // scale factor or a dropped vertex without printing 3,000 numbers.
            Object[] planes = (Object[]) f(o, "p");
            StringBuilder ns = new StringBuilder();
            StringBuilder cs = new StringBuilder();
            StringBuilder sums = new StringBuilder();
            for (int i = 0; i < npl; i++) {
                Object pl = planes[i];
                int n = (Integer) f(pl, "n");
                int[] ox = (int[]) f(pl, "ox");
                int[] oy = (int[]) f(pl, "oy");
                int[] oz = (int[]) f(pl, "oz");
                int[] c = (int[]) f(pl, "c");
                int sx = 0, sy = 0, sz = 0;
                for (int k = 0; k < n; k++) { sx += ox[k]; sy += oy[k]; sz += oz[k]; }
                if (i > 0) { ns.append(", "); cs.append(", "); sums.append(", "); }
                ns.append(n);
                cs.append(c[0]).append("/").append(c[1]).append("/").append(c[2]);
                sums.append(sx).append(":").append(sy).append(":").append(sz);
            }
            System.out.println(tag + ".plane_n = [" + ns + "]");
            System.out.println(tag + ".plane_c = [" + cs + "]");
            System.out.println(tag + ".plane_xyzsum = [" + sums + "]");
        }

        // ---- 2. getvalue directly, including the cases that THROW ----------
        byte[] empty = new byte[0];
        Object g = contO(empty, m, 0, 0, 0);
        Method gv = g.getClass().getDeclaredMethod("getvalue", String.class, String.class, int.class);
        gv.setAccessible(true);
        String[][] cases = {
            { "c", "c(180,120,60)", "0" },
            { "c", "c(180,120,60)", "1" },
            { "c", "c(180,120,60)", "2" },
            { "c", "c(180,120,60)", "3" },      // one past the end
            { "colid", "colid(3)", "0" },
            { "colid", "colid(3)", "1" },       // the line has only one value
            { "p", "p(-500,20,-33)", "0" },
            { "p", "p(-500,20,-33)", "2" },
            { "hits", "hits(x)", "0" },         // not a number
        };
        for (String[] cse : cases) {
            String label = "getvalue(\"" + cse[0] + "\", \"" + cse[1] + "\", " + cse[2] + ")";
            try {
                Object r = gv.invoke(g, cse[0], cse[1], Integer.parseInt(cse[2]));
                System.out.println(label + " = " + r);
            } catch (java.lang.reflect.InvocationTargetException e) {
                System.out.println(label + " = THROWS " + e.getCause().getClass().getName());
            }
        }

        // ---- 3. arithmetic, with int32 overflow --------------------------
        Object a = contO(empty, m, 100, 200, 300);
        System.out.println("getpy(400, 500, 600) = " + call(a, "getpy", 400, 500, 600));
        System.out.println("getpy(-40000, 50000, -60000) = " + call(a, "getpy", -40000, 50000, -60000));
        System.out.println("getpy(2000000, 2000000, 2000000) = " + call(a, "getpy", 2000000, 2000000, 2000000));
        System.out.println("xs(0, 0) = " + call(a, "xs", 0, 0));
        System.out.println("xs(-500, 800) = " + call(a, "xs", -500, 800));
        System.out.println("xs(-2000000, 49000) = " + call(a, "xs", -2000000, 49000));
        System.out.println("ys(0, 0) = " + call(a, "ys", 0, 0));
        System.out.println("ys(-500, 800) = " + call(a, "ys", -500, 800));
        System.out.println("ys(-2000000, 49000) = " + call(a, "ys", -2000000, 49000));

        // reset() and loadrots(false) both clear the rotation state.
        setInt(a, "xz", 90);
        setInt(a, "xy", 45);
        setInt(a, "zy", 30);
        setInt(a, "nhits", 7);
        Method reset = a.getClass().getDeclaredMethod("reset");
        reset.setAccessible(true);
        reset.invoke(a);
        System.out.println("after reset: xz=" + f(a, "xz") + " xy=" + f(a, "xy")
                + " zy=" + f(a, "zy") + " nhits=" + f(a, "nhits") + " exp=" + f(a, "exp"));

        System.out.println("PROBE OK");
    }
}
