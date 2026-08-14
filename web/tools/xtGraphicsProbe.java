package tools;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.util.Arrays;

/**
 * Reflection probe for xtGraphics.java against the real ra1.jar classes.
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe /home/evan/resources/ra1/web/tools/xtGraphicsProbe.java
 * Run:
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.xtGraphicsProbe
 */
public class xtGraphicsProbe {

    static Object newMedium() throws Exception {
        Class<?> cls = Class.forName("Medium");
        Constructor<?> ctor = cls.getDeclaredConstructor();
        ctor.setAccessible(true);
        return ctor.newInstance();
    }

    static Object newContO(byte[] data, Object m, int x, int y, int z) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Class<?> contoCls = Class.forName("ContO");
        Constructor<?> ctor = contoCls.getDeclaredConstructor(
            byte[].class, medCls, int.class, int.class, int.class);
        ctor.setAccessible(true);
        Object c = ctor.newInstance(data, m, x, y, z);
        setInt(c, "maxhits", 100);
        setInt(c, "nhits", 0);
        return c;
    }

    static Object newControl() throws Exception {
        Class<?> cls = Class.forName("Control");
        Constructor<?> ctor = cls.getDeclaredConstructor();
        ctor.setAccessible(true);
        return ctor.newInstance();
    }

    static Object newUserCraft(Object m) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Class<?> craftCls = Class.forName("userCraft");
        Constructor<?> ctor = craftCls.getDeclaredConstructor(medCls);
        ctor.setAccessible(true);
        return ctor.newInstance(m);
    }

    static Object newXtGraphics(Object m, Graphics g) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Class<?> xtCls = Class.forName("xtGraphics");
        Constructor<?> ctor = xtCls.getDeclaredConstructor(medCls, Graphics.class);
        ctor.setAccessible(true);
        return ctor.newInstance(m, g);
    }

    static Object getField(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.get(o);
    }

    static int getInt(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getInt(o);
    }

    static boolean getBool(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getBoolean(o);
    }

    static int[] getIntArr(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return (int[]) f.get(o);
    }

    static boolean[] getBoolArr(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return (boolean[]) f.get(o);
    }

    static void setInt(Object o, String name, int val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setInt(o, val);
    }

    static void setBool(Object o, String name, boolean val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setBoolean(o, val);
    }

    static void setObj(Object o, String name, Object val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.set(o, val);
    }

    public static void main(String[] args) throws Exception {
        byte[] radData = Files.readAllBytes(new File("/home/evan/resources/ra1/objects/air1.rad").toPath());
        BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g = img.createGraphics();

        // 1. Constructor and field initialisation
        {
            Object m = newMedium();
            Object xt = newXtGraphics(m, g);
            System.out.println("ws = " + Arrays.toString(getIntArr(xt, "ws")));
            System.out.println("goodsun = " + getBool(xt, "goodsun"));
            System.out.println("cl = " + getInt(xt, "cl"));
            System.out.println("as_len = " + Array.getLength(getField(xt, "as")));
            System.out.println("pix_len = " + getIntArr(xt, "pix").length);
            System.out.println("bpix_len = " + getIntArr(xt, "bpix").length);
            System.out.println("mpix_len = " + getIntArr(xt, "mpix").length);
            System.out.println("opix_len = " + getIntArr(xt, "opix").length);
            System.out.println("ppix_len = " + getIntArr(xt, "ppix").length);
            System.out.println("cnt = " + getInt(xt, "cnt"));
            System.out.println("flik = " + getBool(xt, "flik"));
            System.out.println("cnts = " + getInt(xt, "cnts"));
            System.out.println("mname_len = " + Array.getLength(getField(xt, "mname")));
            System.out.println("cnte_len = " + getIntArr(xt, "cnte").length);
            System.out.println("cntf = " + getInt(xt, "cntf"));
            System.out.println("left = " + getBool(xt, "left"));
            System.out.println("wcnt = " + getInt(xt, "wcnt"));
            System.out.println("rcnt = " + getInt(xt, "rcnt"));
            System.out.println("cnty = " + getInt(xt, "cnty"));
            System.out.println("fase = " + getInt(xt, "fase"));
            System.out.println("selected = " + getInt(xt, "selected"));
            System.out.println("select = " + getInt(xt, "select"));
            System.out.println("frst = " + getBool(xt, "frst"));
            System.out.println("oldfase = " + getInt(xt, "oldfase"));
            System.out.println("nb = " + getInt(xt, "nb"));
            System.out.println("ob_len = " + getIntArr(xt, "ob").length);
            System.out.println("nam_len = " + Array.getLength(getField(xt, "nam")));
            System.out.println("tnk_len = " + getBoolArr(xt, "tnk").length);
            System.out.println("obx_len = " + getIntArr(xt, "obx").length);
            System.out.println("oby_len = " + getIntArr(xt, "oby").length);
            System.out.println("obz_len = " + getIntArr(xt, "obz").length);
            System.out.println("sgame = " + getInt(xt, "sgame"));
            System.out.println("level = " + getInt(xt, "level"));
            System.out.println("dest_len = " + getBoolArr(xt, "dest").length);
            System.out.println("mcomp = " + getBool(xt, "mcomp"));
            System.out.println("tcnt = " + getInt(xt, "tcnt"));
        }

        // 2. Math helpers: xs, ys, getcpy
        {
            Object m = newMedium();
            Object xt = newXtGraphics(m, g);
            Method xsMethod = xt.getClass().getDeclaredMethod("xs", int.class, int.class);
            Method ysMethod = xt.getClass().getDeclaredMethod("ys", int.class, int.class);
            Method getcpyMethod = xt.getClass().getDeclaredMethod("getcpy", Class.forName("ContO"), Class.forName("ContO"));
            xsMethod.setAccessible(true);
            ysMethod.setAccessible(true);
            getcpyMethod.setAccessible(true);

            // xs
            System.out.println("xs_norm = " + xsMethod.invoke(xt, 100, 200));
            System.out.println("xs_neg_i = " + xsMethod.invoke(xt, -500, 800));
            System.out.println("xs_neg_j = " + xsMethod.invoke(xt, 300, -100));
            System.out.println("xs_clamp_small = " + xsMethod.invoke(xt, 200, 5));
            System.out.println("xs_clamp_zero = " + xsMethod.invoke(xt, 0, 0));
            System.out.println("xs_overflow_pos = " + xsMethod.invoke(xt, 50000, 20000));
            System.out.println("xs_overflow_neg = " + xsMethod.invoke(xt, -60000, 40000));

            // ys
            System.out.println("ys_norm = " + ysMethod.invoke(xt, 100, 200));
            System.out.println("ys_neg_i = " + ysMethod.invoke(xt, -500, 800));
            System.out.println("ys_neg_j = " + ysMethod.invoke(xt, 300, -100));
            System.out.println("ys_clamp_small = " + ysMethod.invoke(xt, 200, 5));
            System.out.println("ys_clamp_zero = " + ysMethod.invoke(xt, 0, 0));
            System.out.println("ys_overflow_pos = " + ysMethod.invoke(xt, 50000, 20000));
            System.out.println("ys_overflow_neg = " + ysMethod.invoke(xt, -60000, 40000));

            // getcpy
            Object c1 = newContO(radData, m, 0, 0, 0);
            Object c2 = newContO(radData, m, 0, 0, 0);
            System.out.println("getcpy_zero = " + getcpyMethod.invoke(xt, c1, c2));

            setInt(c1, "x", 1000); setInt(c1, "y", 2000); setInt(c1, "z", 3000);
            setInt(c2, "x", 500);  setInt(c2, "y", 1000); setInt(c2, "z", 1500);
            System.out.println("getcpy_pos = " + getcpyMethod.invoke(xt, c1, c2));

            setInt(c1, "x", -5000); setInt(c1, "y", -3000); setInt(c1, "z", -2000);
            setInt(c2, "x", 2000);  setInt(c2, "y", 1000);  setInt(c2, "z", 4000);
            System.out.println("getcpy_neg = " + getcpyMethod.invoke(xt, c1, c2));

            setInt(c1, "x", 50000);  setInt(c1, "y", 60000);  setInt(c1, "z", 70000);
            setInt(c2, "x", -50000); setInt(c2, "y", -60000); setInt(c2, "z", -70000);
            System.out.println("getcpy_overflow = " + getcpyMethod.invoke(xt, c1, c2));

            setInt(c1, "x", 5000000);  setInt(c1, "y", 5000000);  setInt(c1, "z", 5000000);
            setInt(c2, "x", 0); setInt(c2, "y", 0); setInt(c2, "z", 0);
            System.out.println("getcpy_wrap32 = " + getcpyMethod.invoke(xt, c1, c2));
        }

        // 3. Reset and state checks: reset, creset, alldest
        {
            Object m = newMedium();
            Object xt = newXtGraphics(m, g);
            Method resetMethod = xt.getClass().getDeclaredMethod("reset");
            Method cresetMethod = xt.getClass().getDeclaredMethod("creset");
            Method alldestMethod = xt.getClass().getDeclaredMethod("alldest");
            resetMethod.setAccessible(true);
            cresetMethod.setAccessible(true);
            alldestMethod.setAccessible(true);

            boolean[] dest = getBoolArr(xt, "dest");
            dest[0] = true; dest[1] = true; dest[2] = true; dest[3] = true; dest[4] = true;
            System.out.println("alldest_all_true = " + alldestMethod.invoke(xt));
            dest[2] = false;
            System.out.println("alldest_one_false = " + alldestMethod.invoke(xt));

            setInt(xt, "level", 7);
            resetMethod.invoke(xt);
            System.out.println("reset_level = " + getInt(xt, "level"));
            System.out.println("reset_dest0 = " + getBoolArr(xt, "dest")[0]);
            System.out.println("reset_dest4 = " + getBoolArr(xt, "dest")[4]);

            setInt(xt, "cnt", 42);
            setBool(xt, "flik", true);
            setInt(xt, "cnts", 99);
            setInt(xt, "cntf", 12);
            setBool(xt, "left", true);
            setInt(xt, "wcnt", 5);
            setInt(xt, "rcnt", 3);
            setInt(xt, "cnty", 100);
            cresetMethod.invoke(xt);
            System.out.println("creset_cnt = " + getInt(xt, "cnt"));
            System.out.println("creset_flik = " + getBool(xt, "flik"));
            System.out.println("creset_cnts = " + getInt(xt, "cnts"));
            System.out.println("creset_cntf = " + getInt(xt, "cntf"));
            System.out.println("creset_left = " + getBool(xt, "left"));
            System.out.println("creset_wcnt = " + getInt(xt, "wcnt"));
            System.out.println("creset_rcnt = " + getInt(xt, "rcnt"));
            System.out.println("creset_cnty = " + getInt(xt, "cnty"));
        }

        // 4. Pixel blending operations
        {
            Object m = newMedium();
            Object xt = newXtGraphics(m, g);
            Method drawefimgMethod = xt.getClass().getDeclaredMethod("drawefimg", java.awt.Image.class);
            Method drawpimgMethod = xt.getClass().getDeclaredMethod("drawpimg", java.awt.Image.class);
            Method drawopMethod = xt.getClass().getDeclaredMethod("drawop", Graphics.class, java.awt.Image.class);
            Method drawlMethod = xt.getClass().getDeclaredMethod("drawl", Graphics.class, java.awt.Image.class);
            Method drawovimgMethod = xt.getClass().getDeclaredMethod("drawovimg", java.awt.Image.class);
            Method cmbackMethod = xt.getClass().getDeclaredMethod("cmback", int.class);
            drawefimgMethod.setAccessible(true);
            drawpimgMethod.setAccessible(true);
            drawopMethod.setAccessible(true);
            drawlMethod.setAccessible(true);
            drawovimgMethod.setAccessible(true);
            cmbackMethod.setAccessible(true);

            BufferedImage testImg = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
            Graphics tg = testImg.createGraphics();
            tg.setColor(new java.awt.Color(120, 80, 200));
            tg.fillRect(0, 0, 500, 360);

            int[] bpix = getIntArr(xt, "bpix");
            Arrays.fill(bpix, (255 << 24) | (100 << 16) | (140 << 8) | 60);

            drawefimgMethod.invoke(xt, testImg);
            int[] pix = getIntArr(xt, "pix");
            System.out.println("drawefimg_pix_0 = " + (pix[0] & 0xFFFFFF));
            System.out.println("drawefimg_pix_mid = " + (pix[90000] & 0xFFFFFF));

            int[] ppix = getIntArr(xt, "ppix");
            Arrays.fill(ppix, (255 << 24) | (200 << 16) | (100 << 8) | 50);
            drawpimgMethod.invoke(xt, testImg);
            System.out.println("drawpimg_pix_center = " + (pix[200 + 150 * 500] & 0xFFFFFF));
            System.out.println("drawpimg_pix_outside = " + (pix[10 + 10 * 500] & 0xFFFFFF));

            drawopMethod.invoke(xt, g, testImg);
            System.out.println("drawop_pix_0 = " + (pix[0] & 0xFFFFFF));

            drawlMethod.invoke(xt, g, testImg);
            System.out.println("drawl_pix_0 = " + (pix[0] & 0xFFFFFF));

            int[] opix = getIntArr(xt, "opix");
            Arrays.fill(opix, (255 << 24) | (80 << 16) | (160 << 8) | 40);
            drawovimgMethod.invoke(xt, testImg);
            System.out.println("drawovimg_pix_0 = " + (pix[0] & 0xFFFFFF));

            int[] mpix = getIntArr(xt, "mpix");
            Arrays.fill(mpix, (255 << 24) | (50 << 16) | (60 << 8) | 70);
            cmbackMethod.invoke(xt, 2);
            System.out.println("cmback_pix_outside = " + (pix[10 + 10 * 500] & 0xFFFFFF));
            System.out.println("cmback_pix_inside_box0 = " + (pix[100 + 100 * 500] & 0xFFFFFF));
            System.out.println("cmback_pix_inside_box1 = " + (pix[100 + 180 * 500] & 0xFFFFFF));
        }

        // 5. dtrakers scenarios
        {
            Object m = newMedium();
            Object xt = newXtGraphics(m, g);
            Object usercraft = newUserCraft(m);
            Object control = newControl();
            Method dtrakersMethod = xt.getClass().getDeclaredMethod(
                "dtrakers", Graphics.class, int[].class, int[].class, int.class,
                Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
            dtrakersMethod.setAccessible(true);

            Class<?> contoArrCls = Class.forName("[LContO;");
            Object aconto = Array.newInstance(Class.forName("ContO"), 5);
            for (int k = 0; k < 5; k++) {
                Object c = newContO(radData, m, k * 200, 0, 500 + k * 300);
                Array.set(aconto, k, c);
            }

            int[] ai = new int[] { 0, 1, 0, 1, 0 };
            int[] ai1 = new int[] { 0, 1, 2, 3, 4 };

            // dtrakers target acquisition
            dtrakersMethod.invoke(xt, g, ai, ai1, 5, aconto, usercraft, control);
            System.out.println("dtrakers_cl = " + getInt(xt, "cl"));
            System.out.println("dtrakers_mcomp = " + getBool(xt, "mcomp"));

            // All enemies destroyed scenario
            for (int k = 1; k < 5; k++) {
                Object c = Array.get(aconto, k);
                setBool(c, "exp", true);
                setInt(c, "nhits", 200);
                setInt(c, "maxhits", 100);
            }
            dtrakersMethod.invoke(xt, g, ai, ai1, 5, aconto, usercraft, control);
            System.out.println("dtrakers_all_exp_mcomp = " + getBool(xt, "mcomp"));
            System.out.println("dtrakers_cntf = " + getInt(xt, "cntf"));

            // Radar and speedometer triggers
            setBool(control, "radar", true);
            setBool(control, "plus", true);
            setInt(usercraft, "rspeed", 50);
            dtrakersMethod.invoke(xt, g, ai, ai1, 5, aconto, usercraft, control);
            System.out.println("dtrakers_cnts_after_plus = " + getInt(xt, "cnts"));
        }

        // 6. denter scenarios
        {
            // Scenario 6A: fase = 4 -> transition to fase 5 or 7
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                setInt(xt, "fase", 4);
                setInt(xt, "oldfase", 0);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase4_fase = " + getInt(xt, "fase"));
                System.out.println("denter_fase4_mx = " + getInt(m, "x"));
                System.out.println("denter_fase4_my = " + getInt(m, "y"));
                System.out.println("denter_fase4_ground = " + getInt(m, "ground"));

                setInt(xt, "fase", 4);
                setInt(xt, "oldfase", 7);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase4_oldfase7_fase = " + getInt(xt, "fase"));
                System.out.println("denter_fase4_oldfase7_oldfase = " + getInt(xt, "oldfase"));
            }

            // Scenario 6B: fase = -8 (intro crawl)
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                setInt(xt, "fase", -8);
                setInt(xt, "cnty", 10);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase_neg8_cnty = " + getInt(xt, "cnty"));

                setInt(xt, "cnty", 350);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase_neg8_cnty_end = " + getInt(xt, "cnty"));

                setBool(control, "space", true);
                setInt(xt, "sgame", 1);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase_neg8_space_fase = " + getInt(xt, "fase"));
                System.out.println("denter_fase_neg8_space_select = " + getInt(xt, "select"));
                System.out.println("denter_fase_neg8_space_control = " + getBool(control, "space"));
            }

            // Scenario 6C: fase = -7, -6, -55 (instructions progression)
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                setInt(xt, "fase", -7);
                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_inst1_fase = " + getInt(xt, "fase"));

                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_inst2_fase = " + getInt(xt, "fase"));

                setInt(xt, "oldfase", -5);
                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_inst3_fase = " + getInt(xt, "fase"));
            }

            // Scenario 6D: fase = -5 (main menu navigation)
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                setInt(xt, "fase", -5);
                setInt(xt, "select", 0);
                setBool(control, "down", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_main_down_select = " + getInt(xt, "select"));

                setBool(control, "up", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_main_up_select = " + getInt(xt, "select"));

                // wrap around
                setBool(control, "up", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_main_wrap_select = " + getInt(xt, "select"));

                // Select controls (item 2)
                setInt(xt, "select", 2);
                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_main_select2_fase = " + getInt(xt, "fase"));
                System.out.println("denter_main_select2_oldfase = " + getInt(xt, "oldfase"));
            }

            // Scenario 6E: fase = -4 (mission complete / save prompt)
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 20);
                for (int k = 0; k < 20; k++) {
                    Object c = newContO(radData, m, 0, 0, 0);
                    setInt(c, "nhits", 50);
                    setInt(c, "maxhits", 100);
                    Array.set(aconto, k, c);
                }

                setInt(xt, "fase", -4);
                setBool(xt, "frst", true);
                setInt(xt, "select", 0);
                setBool(control, "right", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase_neg4_select = " + getInt(xt, "select"));

                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase_neg4_space_fase = " + getInt(xt, "fase"));
            }

            // Scenario 6F: fase = -2 -> setup vehicles, fase = -1
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                setInt(xt, "fase", -2);
                setInt(xt, "selected", 2);
                setInt(xt, "nb", 0);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_fase_neg2_fase = " + getInt(xt, "fase"));
                System.out.println("denter_fase_neg2_c0_x = " + getInt(Array.get(aconto, 0), "x"));
                System.out.println("denter_fase_neg2_c2_x = " + getInt(Array.get(aconto, 2), "x"));
                System.out.println("denter_fase_neg2_c4_x = " + getInt(Array.get(aconto, 4), "x"));
            }

            // Scenario 6G: fase = 0 (ship selection)
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                setInt(xt, "fase", 0);
                setInt(xt, "selected", 0);
                setInt(xt, "rcnt", 0);
                setBool(control, "left", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_ship_select_left = " + getBool(xt, "left"));
                System.out.println("denter_ship_select_rcnt = " + getInt(xt, "rcnt"));

                // Advance rcnt to 6
                setInt(xt, "rcnt", 5);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_ship_select_selected = " + getInt(xt, "selected"));
                System.out.println("denter_ship_select_rcnt_reset = " + getInt(xt, "rcnt"));
            }

            // Scenario 6H: fase = 2 (game over) & fase = 3 (pause)
            {
                Object m = newMedium();
                Object xt = newXtGraphics(m, g);
                Object usercraft = newUserCraft(m);
                Object control = newControl();
                Method denterMethod = xt.getClass().getDeclaredMethod(
                    "denter", Graphics.class, int.class, Class.forName("[LContO;"), Class.forName("userCraft"), Class.forName("Control"));
                denterMethod.setAccessible(true);

                Object aconto = Array.newInstance(Class.forName("ContO"), 5);
                for (int k = 0; k < 5; k++) {
                    Array.set(aconto, k, newContO(radData, m, 0, 0, 0));
                }

                // fase = 2
                setInt(xt, "fase", 2);
                boolean[] dest = getBoolArr(xt, "dest");
                Arrays.fill(dest, true);
                setInt(xt, "sgame", 1);
                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_gameover_fase = " + getInt(xt, "fase"));
                System.out.println("denter_gameover_select = " + getInt(xt, "select"));

                // fase = 3 (pause menu)
                setInt(xt, "fase", 3);
                setInt(xt, "select", 1);
                setBool(control, "space", true);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_pause_select1_fase = " + getInt(xt, "fase"));
                System.out.println("denter_pause_select1_oldfase = " + getInt(xt, "oldfase"));

                setInt(xt, "fase", 3);
                setInt(xt, "select", 2);
                setBool(control, "space", true);
                setInt(xt, "sgame", 0);
                denterMethod.invoke(xt, g, 0, aconto, usercraft, control);
                System.out.println("denter_pause_select2_fase = " + getInt(xt, "fase"));
                System.out.println("denter_pause_select2_select = " + getInt(xt, "select"));
            }
        }

        System.out.println("PROBE OK");
    }
}
