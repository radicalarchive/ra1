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
 * Reflection probe for Craft.java against the real ra1.jar classes.
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe /home/evan/resources/ra1/web/tools/CraftProbe.java
 * Run:
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.CraftProbe
 */
public class CraftProbe {

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
        return ctor.newInstance(data, m, x, y, z);
    }

    static Object newCraft(Object m) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Class<?> craftCls = Class.forName("Craft");
        Constructor<?> ctor = craftCls.getDeclaredConstructor(medCls);
        ctor.setAccessible(true);
        return ctor.newInstance(m);
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

    static float getFloat(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getFloat(o);
    }

    static double getDouble(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getDouble(o);
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

    static void setInt(Object o, String name, int val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setInt(o, val);
    }

    static void setFloat(Object o, String name, float val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setFloat(o, val);
    }

    static void setDouble(Object o, String name, double val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setDouble(o, val);
    }

    static void setBool(Object o, String name, boolean val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setBoolean(o, val);
    }

    static void setControl(Object craft, boolean left, boolean right, boolean up, boolean down, boolean fire) throws Exception {
        Object u = getField(craft, "u");
        setBool(u, "left", left);
        setBool(u, "right", right);
        setBool(u, "up", up);
        setBool(u, "down", down);
        setBool(u, "fire", fire);
    }

    static void printCraftState(String prefix, Object c) throws Exception {
        System.out.println(prefix + ".rspeed = " + getInt(c, "rspeed"));
        System.out.println(prefix + ".speed = " + getFloat(c, "speed"));
        System.out.println(prefix + ".rlift = " + getInt(c, "rlift"));
        System.out.println(prefix + ".lift = " + getDouble(c, "lift"));
        System.out.println(prefix + ".pexp = " + getBool(c, "pexp"));
        System.out.println(prefix + ".ltyp = " + getInt(c, "ltyp"));
        System.out.println(prefix + ".nl = " + getInt(c, "nl"));
        System.out.println(prefix + ".skip = " + getBool(c, "skip"));
        System.out.println(prefix + ".bulkc = " + getInt(c, "bulkc"));
        System.out.println(prefix + ".ns = " + getInt(c, "ns"));
        System.out.println(prefix + ".smoke = " + getBool(c, "smoke"));
        System.out.println(prefix + ".nd = " + getInt(c, "nd"));
        System.out.println(prefix + ".gxz = " + getInt(c, "gxz"));
        System.out.println(prefix + ".gzy = " + getInt(c, "gzy"));
        System.out.println(prefix + ".responce = " + getBool(c, "responce"));
        System.out.println(prefix + ".trgxz = " + getInt(c, "trgxz"));
        System.out.println(prefix + ".trgzy = " + getInt(c, "trgzy"));
        System.out.println(prefix + ".out = " + getInt(c, "out"));
        System.out.println(prefix + ".tcnt = " + getInt(c, "tcnt"));
        System.out.println(prefix + ".engage = " + getBool(c, "engage"));
        System.out.println(prefix + ".enx = " + getInt(c, "enx"));
        System.out.println(prefix + ".eny = " + getInt(c, "eny"));
        System.out.println(prefix + ".enz = " + getInt(c, "enz"));
        System.out.println(prefix + ".ens = " + getInt(c, "ens"));
        System.out.println(prefix + ".targeting = " + getBool(c, "targeting"));
        System.out.println(prefix + ".mode = " + getInt(c, "mode"));
        System.out.println(prefix + ".m3o = " + getInt(c, "m3o"));
        System.out.println(prefix + ".m3cnt = " + getInt(c, "m3cnt"));
        System.out.println(prefix + ".m1cnt = " + getInt(c, "m1cnt"));
        System.out.println(prefix + ".relax = " + getInt(c, "relax"));
        System.out.println(prefix + ".runn = " + getInt(c, "runn"));
        System.out.println(prefix + ".liftup = " + getInt(c, "liftup"));
        System.out.println(prefix + ".dracs = " + getBool(c, "dracs"));
    }

    static void printContOState(String prefix, Object conto) throws Exception {
        System.out.println(prefix + ".x = " + getInt(conto, "x"));
        System.out.println(prefix + ".y = " + getInt(conto, "y"));
        System.out.println(prefix + ".z = " + getInt(conto, "z"));
        System.out.println(prefix + ".xz = " + getInt(conto, "xz"));
        System.out.println(prefix + ".xy = " + getInt(conto, "xy"));
        System.out.println(prefix + ".zy = " + getInt(conto, "zy"));
        System.out.println(prefix + ".fire = " + getBool(conto, "fire"));
        System.out.println(prefix + ".hit = " + getBool(conto, "hit"));
        System.out.println(prefix + ".nhits = " + getInt(conto, "nhits"));
        System.out.println(prefix + ".exp = " + getBool(conto, "exp"));
    }

    public static void main(String[] args) throws Exception {
        Object m = newMedium();
        byte[] radData = Files.readAllBytes(new File("/home/evan/resources/ra1/objects/rk1.rad").toPath());

        // -------------------------------------------------------------------
        // 1. CONSTRUCTOR AND DEFAULT FIELDS
        // -------------------------------------------------------------------
        Object craft = newCraft(m);
        System.out.println("init.rspeed = " + getInt(craft, "rspeed"));
        System.out.println("init.speed = " + getFloat(craft, "speed"));
        System.out.println("init.rlift = " + getInt(craft, "rlift"));
        System.out.println("init.lift = " + getDouble(craft, "lift"));
        System.out.println("init.pexp = " + getBool(craft, "pexp"));
        System.out.println("init.ltyp = " + getInt(craft, "ltyp"));
        System.out.println("init.nl = " + getInt(craft, "nl"));
        System.out.println("init.skip = " + getBool(craft, "skip"));
        System.out.println("init.bulkc = " + getInt(craft, "bulkc"));
        System.out.println("init.ns = " + getInt(craft, "ns"));
        System.out.println("init.smoke = " + getBool(craft, "smoke"));
        System.out.println("init.nd = " + getInt(craft, "nd"));
        System.out.println("init.gxz = " + getInt(craft, "gxz"));
        System.out.println("init.gzy = " + getInt(craft, "gzy"));
        System.out.println("init.responce = " + getBool(craft, "responce"));
        System.out.println("init.trgxz = " + getInt(craft, "trgxz"));
        System.out.println("init.trgzy = " + getInt(craft, "trgzy"));
        System.out.println("init.out = " + getInt(craft, "out"));
        System.out.println("init.tcnt = " + getInt(craft, "tcnt"));
        System.out.println("init.engage = " + getBool(craft, "engage"));
        System.out.println("init.enx = " + getInt(craft, "enx"));
        System.out.println("init.eny = " + getInt(craft, "eny"));
        System.out.println("init.enz = " + getInt(craft, "enz"));
        System.out.println("init.ens = " + getInt(craft, "ens"));
        System.out.println("init.targeting = " + getBool(craft, "targeting"));
        System.out.println("init.mode = " + getInt(craft, "mode"));
        System.out.println("init.m3o = " + getInt(craft, "m3o"));
        System.out.println("init.m3cnt = " + getInt(craft, "m3cnt"));
        System.out.println("init.m1cnt = " + getInt(craft, "m1cnt"));
        System.out.println("init.relax = " + getInt(craft, "relax"));
        System.out.println("init.runn = " + getInt(craft, "runn"));
        System.out.println("init.liftup = " + getInt(craft, "liftup"));
        System.out.println("init.dracs = " + getBool(craft, "dracs"));
        System.out.println("init.sms = " + Arrays.toString(getIntArr(craft, "sms")));
        System.out.println("init.dms = " + Arrays.toString(getIntArr(craft, "dms")));
        System.out.println("init.lstage = " + Arrays.toString(getIntArr(craft, "lstage")));

        // -------------------------------------------------------------------
        // 2. HELPER METHODS (getpy, getcpy, getepy, nearst, myway)
        // -------------------------------------------------------------------
        Method mGetpy = craft.getClass().getDeclaredMethod("getpy", int.class, int.class, int.class, int.class);
        mGetpy.setAccessible(true);

        int[] lx = getIntArr(craft, "lx");
        int[] ly = getIntArr(craft, "ly");
        int[] lz = getIntArr(craft, "lz");
        lx[0] = -25000; ly[0] = 35000; lz[0] = -45000;
        lx[1] = 12000;  ly[1] = -18000; lz[1] = 22000;

        int py1 = (Integer) mGetpy.invoke(craft, 50000, -40000, 30000, 0);
        int py2 = (Integer) mGetpy.invoke(craft, -30000, 20000, -10000, 1);
        System.out.println("getpy.test1 = " + py1);
        System.out.println("getpy.test2 = " + py2);

        Method mGetcpy = craft.getClass().getDeclaredMethod("getcpy", Class.forName("ContO"), Class.forName("ContO"));
        mGetcpy.setAccessible(true);
        Object c1 = newContO(radData, m, 45000, -35000, 25000);
        Object c2 = newContO(radData, m, -40000, 30000, -50000);
        int cpy = (Integer) mGetcpy.invoke(craft, c1, c2);
        System.out.println("getcpy.test1 = " + cpy);

        Method mGetepy = craft.getClass().getDeclaredMethod("getepy", Class.forName("ContO"));
        mGetepy.setAccessible(true);
        setInt(craft, "enx", -15000);
        setInt(craft, "eny", 5000);
        setInt(craft, "enz", -25000);
        int epy = (Integer) mGetepy.invoke(craft, c1);
        System.out.println("getepy.test1 = " + epy);

        // nearst
        Class<?> contoArrCls = Array.newInstance(Class.forName("ContO"), 0).getClass();
        Method mNearst = craft.getClass().getDeclaredMethod("nearst", contoArrCls, int[].class, int.class, int.class, Class.forName("ContO"));
        mNearst.setAccessible(true);
        Object contoArray = Array.newInstance(Class.forName("ContO"), 5);
        Array.set(contoArray, 0, newContO(radData, m, 1000, 200, 3000));
        Array.set(contoArray, 1, newContO(radData, m, 5000, -1000, 8000));
        Array.set(contoArray, 2, newContO(radData, m, 200, 100, 500));
        Array.set(contoArray, 3, newContO(radData, m, -3000, -200, -4000));
        Array.set(contoArray, 4, newContO(radData, m, 1500, 300, 2500));
        int[] aiNear = new int[] { 0, 1, 2, 3, 4 };
        int nearestTarget = (Integer) mNearst.invoke(craft, contoArray, aiNear, 5, 2, c1);
        System.out.println("nearst.target = " + nearestTarget);

        // myway
        Method mMyway = craft.getClass().getDeclaredMethod("myway", contoArrCls, int[].class, int.class, int.class, int.class, int.class, int.class);
        mMyway.setAccessible(true);
        boolean way1 = (Boolean) mMyway.invoke(craft, contoArray, aiNear, 5, 0, 1000, 200, 3000);
        boolean way2 = (Boolean) mMyway.invoke(craft, contoArray, aiNear, 5, 0, 40000, -30000, 40000);
        System.out.println("myway.obstacle = " + way1);
        System.out.println("myway.clear = " + way2);

        // -------------------------------------------------------------------
        // 3. RESET
        // -------------------------------------------------------------------
        Method mReset = craft.getClass().getDeclaredMethod("reset", int.class, int.class, int.class, int.class, int.class, int.class);
        mReset.setAccessible(true);
        mReset.invoke(craft, 120, 2, 40, 25, 600, 1);
        printCraftState("reset1", craft);
        mReset.invoke(craft, 80, 1, 60, 35, 400, 0);
        printCraftState("reset2", craft);

        // -------------------------------------------------------------------
        // 4. LASER COLLISION
        // -------------------------------------------------------------------
        Method mLasercolid = craft.getClass().getDeclaredMethod("lasercolid", Class.forName("ContO"));
        mLasercolid.setAccessible(true);
        Object targetConto = newContO(radData, m, 500, 100, 1000);
        setInt(targetConto, "maxR", 400);
        setInt(targetConto, "rcol", 1);
        setInt(targetConto, "maxhits", 100);
        setInt(targetConto, "nhits", 0);
        setBool(targetConto, "exp", false);
        setBool(targetConto, "out", false);

        int[] lstage = getIntArr(craft, "lstage");
        int[] lhit = getIntArr(craft, "lhit");
        lx[0] = 510; ly[0] = 105; lz[0] = 1010;
        lstage[0] = 5; lhit[0] = 0;
        lx[1] = 5000; ly[1] = 5000; lz[1] = 5000;
        lstage[1] = 5; lhit[1] = 0;

        mLasercolid.invoke(craft, targetConto);
        System.out.println("lasercolid.lhit0 = " + lhit[0]);
        System.out.println("lasercolid.lhit1 = " + lhit[1]);
        System.out.println("lasercolid.conto_hit = " + getBool(targetConto, "hit"));
        System.out.println("lasercolid.conto_nhits = " + getInt(targetConto, "nhits"));

        // -------------------------------------------------------------------
        // 5. GRAPHICS METHODS: dl and dosmokes
        // -------------------------------------------------------------------
        BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g = img.createGraphics();

        Method mDl = craft.getClass().getDeclaredMethod("dl", Graphics.class);
        mDl.setAccessible(true);
        lstage[0] = 1; lhit[0] = 0;
        lstage[1] = 1; lhit[1] = 1;
        lstage[2] = 1; lhit[2] = 2;
        mDl.invoke(craft, g);
        System.out.println("dl.lhit0 = " + lhit[0]);
        System.out.println("dl.lhit1 = " + lhit[1]);
        System.out.println("dl.lhit2 = " + lhit[2]);
        System.out.println("dl.lstage2 = " + lstage[2]);

        Method mDosmokes = craft.getClass().getDeclaredMethod("dosmokes", Graphics.class, Class.forName("ContO"));
        mDosmokes.setAccessible(true);
        Object smokeConto = newContO(radData, m, 200, 220, 400);
        setInt(smokeConto, "maxhits", 60);
        setInt(smokeConto, "nhits", 50); // triggers damage smoke
        setBool(craft, "smoke", true);   // triggers ground smoke

        mDosmokes.invoke(craft, g, smokeConto);
        System.out.println("dosmokes.nd = " + getInt(craft, "nd"));
        System.out.println("dosmokes.ns = " + getInt(craft, "ns"));
        System.out.println("dosmokes.smoke_flag = " + getBool(craft, "smoke"));
        System.out.println("dosmokes.dms0 = " + getIntArr(craft, "dms")[0]);
        System.out.println("dosmokes.sms0 = " + getIntArr(craft, "sms")[0]);

        // -------------------------------------------------------------------
        // 6. PREFORM METHOD — MULTI-STEP SIMULATION (DETERMINISTIC PATHS)
        // -------------------------------------------------------------------
        Method mPreform = craft.getClass().getDeclaredMethod("preform",
            Class.forName("ContO"), contoArrCls, int[].class, int.class, int.class, int.class);
        mPreform.setAccessible(true);

        // Sections 1-5 leave state on `craft` (dosmokes bumps ns/nd, lasercolid
        // touches the laser arrays). A test drives preform from a fresh object,
        // so the probe must too, or the printed values are unreachable.
        craft = newCraft(m);

        Object playerConto = newContO(radData, m, 0, 100, 0);
        setInt(playerConto, "maxhits", 100);
        setInt(playerConto, "nhits", 0);
        setBool(playerConto, "exp", false);
        setInt(playerConto, "xz", 45);
        setInt(playerConto, "xy", 30);
        setInt(playerConto, "zy", -20);

        Object[] enemies = (Object[]) Array.newInstance(Class.forName("ContO"), 15);
        int[] aiEnemies = new int[15];
        for (int e = 0; e < 15; e++) {
            enemies[e] = newContO(radData, m, e * 1000 - 7000, 100, e * 1000 - 7000);
            setInt(enemies[e], "maxR", 100);
            aiEnemies[e] = e;
        }

        // Scenario A: Climbing in air (u.up = true), tests Case A compound assignments
        mReset.invoke(craft, 60, 3, 50, 30, 500, 0);
        setInt(craft, "turnat", 100); // keep tcnt <= turnat to avoid random branches
        setInt(craft, "tcnt", 0);
        setControl(craft, false, false, true, false, false);
        for (int step = 0; step < 5; step++) {
            mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
            printContOState("preform.climb.step" + step + ".conto", playerConto);
            printCraftState("preform.climb.step" + step + ".craft", craft);
        }

        // Scenario B: Diving with down key and high speed, tests Case A & Case B (lift)
        setControl(craft, false, false, false, true, false);
        setFloat(craft, "speed", 70.0f);
        setInt(craft, "rspeed", 70);
        setDouble(craft, "lift", 10.5);
        for (int step = 0; step < 5; step++) {
            mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
            printContOState("preform.dive.step" + step + ".conto", playerConto);
            printCraftState("preform.dive.step" + step + ".craft", craft);
        }

        // Scenario C: Banking left and right
        setControl(craft, true, false, false, false, false);
        for (int step = 0; step < 3; step++) {
            mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
            printContOState("preform.bankleft.step" + step + ".conto", playerConto);
        }
        setControl(craft, false, true, false, false, false);
        for (int step = 0; step < 3; step++) {
            mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
            printContOState("preform.bankright.step" + step + ".conto", playerConto);
        }

        // Scenario D: Boundary clamping (x > 40000, z < -40000)
        setInt(playerConto, "x", 42000);
        setInt(playerConto, "z", -43000);
        setControl(craft, false, false, false, false, false);
        mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
        System.out.println("preform.bound.x = " + getInt(playerConto, "x"));
        System.out.println("preform.bound.z = " + getInt(playerConto, "z"));
        System.out.println("preform.bound.xz = " + getInt(playerConto, "xz"));

        // Scenario E: Ground contact / crash (conto.y >= 207)
        setInt(playerConto, "y", 220);
        setInt(playerConto, "zy", 120);
        setInt(playerConto, "xy", 120);
        setFloat(craft, "speed", 50.0f);
        mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
        printContOState("preform.ground.conto", playerConto);
        printCraftState("preform.ground.craft", craft);

        // Scenario F: Laser firing (u.fire = true)
        setInt(playerConto, "y", 150);
        setBool(playerConto, "exp", false);
        setBool(craft, "pexp", false);
        setBool(craft, "skip", true);
        setInt(craft, "bulkc", 0);
        setControl(craft, false, false, false, false, true);
        mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
        System.out.println("preform.fire.nl = " + getInt(craft, "nl"));
        System.out.println("preform.fire.lstage0 = " + getIntArr(craft, "lstage")[0]);
        System.out.println("preform.fire.lspeed0 = " + getIntArr(craft, "lspeed")[0]);
        System.out.println("preform.fire.lx0 = " + getIntArr(craft, "lx")[0]);
        System.out.println("preform.fire.ly0 = " + getIntArr(craft, "ly")[0]);
        System.out.println("preform.fire.lz0 = " + getIntArr(craft, "lz")[0]);

        // Scenario G: Laser homing update
        int[] nlstage = getIntArr(craft, "lstage");
        int[] nnf = getIntArr(craft, "nf");
        nlstage[0] = 12; // > 10 triggers homing towards enemies[0]
        nnf[0] = 2;      // < 15
        setControl(craft, false, false, false, false, false);
        mPreform.invoke(craft, playerConto, enemies, aiEnemies, 15, 0, 0);
        System.out.println("preform.homing.lxz0 = " + getIntArr(craft, "lxz")[0]);
        System.out.println("preform.homing.lzy0 = " + getIntArr(craft, "lzy")[0]);
        System.out.println("preform.homing.nf0 = " + getIntArr(craft, "nf")[0]);
        System.out.println("preform.homing.lx0 = " + getIntArr(craft, "lx")[0]);
        System.out.println("preform.homing.ly0 = " + getIntArr(craft, "ly")[0]);
        System.out.println("preform.homing.lz0 = " + getIntArr(craft, "lz")[0]);

        // -------------------------------------------------------------------
        // 7. NONDETERMINISTIC VALUES (DO NOT ASSERT IN TESTS)
        // -------------------------------------------------------------------
        System.out.println("--- NONDETERMINISTIC ---");
        System.out.println("nondet.init_turnat = " + getInt(craft, "turnat"));
        System.out.println("nondet.smoke_dx0 = " + getIntArr(craft, "dx")[0]);
        System.out.println("nondet.smoke_sx0 = " + getIntArr(craft, "sx")[0]);

        System.out.println("PROBE OK");
    }
}
