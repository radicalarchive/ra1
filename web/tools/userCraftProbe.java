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
 * Reflection probe for userCraft.java against the real ra1.jar classes.
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe /home/evan/resources/ra1/web/tools/userCraftProbe.java
 * Run:
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.userCraftProbe
 */
public class userCraftProbe {

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
        // Set maxhits = 100 so conto.nhits (0) > maxhits - maxhits/6 is false (avoids Math.random damage jitter)
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

    static String[] getStringArr(Object o, String name) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return (String[]) f.get(o);
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

    static void printUserCraftState(String prefix, Object uc) throws Exception {
        System.out.println(prefix + ".rspeed = " + getInt(uc, "rspeed"));
        System.out.println(prefix + ".speed = " + getFloat(uc, "speed"));
        System.out.println(prefix + ".rlift = " + getInt(uc, "rlift"));
        System.out.println(prefix + ".lift = " + getDouble(uc, "lift"));
        System.out.println(prefix + ".pexp = " + getBool(uc, "pexp"));
        System.out.println(prefix + ".ltyp = " + getInt(uc, "ltyp"));
        System.out.println(prefix + ".njumps = " + getInt(uc, "njumps"));
        System.out.println(prefix + ".ester = " + getInt(uc, "ester"));
        System.out.println(prefix + ".nl = " + getInt(uc, "nl"));
        System.out.println(prefix + ".skip = " + getBool(uc, "skip"));
        System.out.println(prefix + ".bulkc = " + getInt(uc, "bulkc"));
        System.out.println(prefix + ".ns = " + getInt(uc, "ns"));
        System.out.println(prefix + ".smoke = " + getBool(uc, "smoke"));
        System.out.println(prefix + ".nd = " + getInt(uc, "nd"));
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
        System.out.println(prefix + ".wire = " + getBool(conto, "wire"));
    }

    public static void main(String[] args) throws Exception {
        Object m = newMedium();
        byte[] radData = Files.readAllBytes(new File("/home/evan/resources/ra1/objects/rk1.rad").toPath());

        // -------------------------------------------------------------------
        // 1. CONSTRUCTOR AND DEFAULT FIELDS
        // -------------------------------------------------------------------
        Object ucInit = newUserCraft(m);
        System.out.println("init.rspeed = " + getInt(ucInit, "rspeed"));
        System.out.println("init.speed = " + getFloat(ucInit, "speed"));
        System.out.println("init.rlift = " + getInt(ucInit, "rlift"));
        System.out.println("init.lift = " + getDouble(ucInit, "lift"));
        System.out.println("init.pexp = " + getBool(ucInit, "pexp"));
        System.out.println("init.ltyp = " + getInt(ucInit, "ltyp"));
        System.out.println("init.njumps = " + getInt(ucInit, "njumps"));
        System.out.println("init.ester = " + getInt(ucInit, "ester"));
        System.out.println("init.nl = " + getInt(ucInit, "nl"));
        System.out.println("init.skip = " + getBool(ucInit, "skip"));
        System.out.println("init.bulkc = " + getInt(ucInit, "bulkc"));
        System.out.println("init.ns = " + getInt(ucInit, "ns"));
        System.out.println("init.smoke = " + getBool(ucInit, "smoke"));
        System.out.println("init.nd = " + getInt(ucInit, "nd"));
        System.out.println("init.maxspeed = " + Arrays.toString(getIntArr(ucInit, "maxspeed")));
        System.out.println("init.elev = " + Arrays.toString(getIntArr(ucInit, "elev")));
        System.out.println("init.trnn = " + Arrays.toString(getIntArr(ucInit, "trnn")));
        System.out.println("init.dnjm = " + Arrays.toString(getIntArr(ucInit, "dnjm")));
        System.out.println("init.name = " + Arrays.toString(getStringArr(ucInit, "name")));
        System.out.println("init.sms = " + Arrays.toString(getIntArr(ucInit, "sms")));
        System.out.println("init.dms = " + Arrays.toString(getIntArr(ucInit, "dms")));
        System.out.println("init.lstage = " + Arrays.toString(getIntArr(ucInit, "lstage")));

        // -------------------------------------------------------------------
        // 2. RESET
        // -------------------------------------------------------------------
        Object ucReset = newUserCraft(m);
        setInt(ucReset, "rspeed", 50);
        setFloat(ucReset, "speed", 45.5f);
        setInt(ucReset, "rlift", 12);
        setDouble(ucReset, "lift", 10.5);
        setBool(ucReset, "pexp", true);
        getIntArr(ucReset, "lstage")[0] = 5;
        getIntArr(ucReset, "lstage")[1] = 10;

        Method mReset = ucReset.getClass().getDeclaredMethod("reset", int.class);
        mReset.setAccessible(true);
        mReset.invoke(ucReset, 2);

        System.out.println("reset2.rspeed = " + getInt(ucReset, "rspeed"));
        System.out.println("reset2.speed = " + getFloat(ucReset, "speed"));
        System.out.println("reset2.rlift = " + getInt(ucReset, "rlift"));
        System.out.println("reset2.lift = " + getDouble(ucReset, "lift"));
        System.out.println("reset2.pexp = " + getBool(ucReset, "pexp"));
        System.out.println("reset2.ltyp = " + getInt(ucReset, "ltyp"));
        System.out.println("reset2.njumps = " + getInt(ucReset, "njumps"));
        System.out.println("reset2.lstage0 = " + getIntArr(ucReset, "lstage")[0]);
        System.out.println("reset2.lstage1 = " + getIntArr(ucReset, "lstage")[1]);

        // -------------------------------------------------------------------
        // 3. GETPY (Large, negative and wrapping inputs)
        // -------------------------------------------------------------------
        Object ucGetpy = newUserCraft(m);
        Method mGetpy = ucGetpy.getClass().getDeclaredMethod("getpy", int.class, int.class, int.class, int.class);
        mGetpy.setAccessible(true);

        int[] lx = getIntArr(ucGetpy, "lx");
        int[] ly = getIntArr(ucGetpy, "ly");
        int[] lz = getIntArr(ucGetpy, "lz");
        lx[0] = -30000; ly[0] = 40000; lz[0] = -50000;
        lx[1] = 25000;  ly[1] = -15000; lz[1] = 35000;

        System.out.println("getpy.res1 = " + mGetpy.invoke(ucGetpy, 10000, -20000, 30000, 0));
        System.out.println("getpy.res2 = " + mGetpy.invoke(ucGetpy, -40000, 50000, -60000, 1));
        System.out.println("getpy.res3 = " + mGetpy.invoke(ucGetpy, 70000, 80000, 90000, 0));

        // -------------------------------------------------------------------
        // 4. PREFORM - AIR FLIGHT (conto.y < 207), up, down, left, right controls
        // Discriminating §2 inputs (accumulator positive, step small fraction)
        // -------------------------------------------------------------------
        Object ucAir = newUserCraft(m);
        Object cAir = newContO(radData, m, 0, 100, 0);
        Object ctlAir = newControl();
        setBool(ctlAir, "up", true);
        setBool(ctlAir, "left", true);
        setFloat(ucAir, "speed", 50.0f);
        setInt(ucAir, "rspeed", 50);
        setInt(cAir, "zy", 180);
        setInt(cAir, "xy", 89);
        setInt(cAir, "xz", 180);

        Method mPreform = ucAir.getClass().getDeclaredMethod(
            "preform", Class.forName("Control"), Class.forName("ContO"),
            Class.forName("[LContO;"), int[].class, int.class);
        mPreform.setAccessible(true);

        Object acontoArray = Array.newInstance(Class.forName("ContO"), 2);
        Array.set(acontoArray, 0, cAir);
        int[] ai = new int[] { 0, 0 };

        mPreform.invoke(ucAir, ctlAir, cAir, acontoArray, ai, 1);
        printContOState("air1.conto", cAir);
        printUserCraftState("air1.craft", ucAir);

        // Preform with down and right
        Object ucAir2 = newUserCraft(m);
        Object cAir2 = newContO(radData, m, 500, 50, -500);
        Object ctlAir2 = newControl();
        setBool(ctlAir2, "down", true);
        setBool(ctlAir2, "right", true);
        setBool(ctlAir2, "plus", true);
        setFloat(ucAir2, "speed", 20.0f);
        setInt(ucAir2, "rspeed", 20);
        setInt(cAir2, "zy", 45);
        setInt(cAir2, "xy", -45);
        setInt(cAir2, "xz", 90);

        mPreform.invoke(ucAir2, ctlAir2, cAir2, acontoArray, ai, 1);
        printContOState("air2.conto", cAir2);
        printUserCraftState("air2.craft", ucAir2);

        // Preform with down = true, xy = 95 (discriminator for Sites 3 & 4)
        Object ucAir3 = newUserCraft(m);
        Object cAir3 = newContO(radData, m, 0, 100, 0);
        Object ctlAir3 = newControl();
        setBool(ctlAir3, "down", true);
        setFloat(ucAir3, "speed", 50.0f);
        setInt(ucAir3, "rspeed", 50);
        setInt(cAir3, "zy", 45);
        setInt(cAir3, "xy", 95);
        setInt(cAir3, "xz", 180);

        mPreform.invoke(ucAir3, ctlAir3, cAir3, acontoArray, ai, 1);
        printContOState("air3.conto", cAir3);
        printUserCraftState("air3.craft", ucAir3);

        // -------------------------------------------------------------------
        // 5. PREFORM - GROUND FLIGHT (conto.y >= 207), explosion and alignment
        // -------------------------------------------------------------------
        Object ucGnd = newUserCraft(m);
        Object cGnd = newContO(radData, m, 100, 210, 100);
        Object ctlGnd = newControl();
        setInt(cGnd, "zy", 120);
        setInt(cGnd, "xy", 45);
        setFloat(ucGnd, "speed", 60.0f);
        setInt(ucGnd, "rspeed", 60);

        mPreform.invoke(ucGnd, ctlGnd, cGnd, acontoArray, ai, 1);
        printContOState("gnd1.conto", cGnd);
        printUserCraftState("gnd1.craft", ucGnd);

        // Ground upright flight with down key and speed > 10
        Object ucGnd2 = newUserCraft(m);
        Object cGnd2 = newContO(radData, m, 200, 208, 200);
        Object ctlGnd2 = newControl();
        setBool(ctlGnd2, "down", true);
        setBool(ctlGnd2, "mins", true);
        setInt(cGnd2, "zy", 10);
        setInt(cGnd2, "xy", 0);
        setFloat(ucGnd2, "speed", 25.0f);
        setInt(ucGnd2, "rspeed", 25);

        mPreform.invoke(ucGnd2, ctlGnd2, cGnd2, acontoArray, ai, 1);
        printContOState("gnd2.conto", cGnd2);
        printUserCraftState("gnd2.craft", ucGnd2);

        // Ground upright flight with down key, xy = 95, speed > 10 (discriminator for Site 5)
        Object ucGnd3 = newUserCraft(m);
        Object cGnd3 = newContO(radData, m, 200, 208, 200);
        Object ctlGnd3 = newControl();
        setBool(ctlGnd3, "down", true);
        setInt(cGnd3, "zy", 10);
        setInt(cGnd3, "xy", 95);
        setFloat(ucGnd3, "speed", 25.0f);
        setInt(ucGnd3, "rspeed", 25);

        mPreform.invoke(ucGnd3, ctlGnd3, cGnd3, acontoArray, ai, 1);
        printContOState("gnd3.conto", cGnd3);
        printUserCraftState("gnd3.craft", ucGnd3);

        // -------------------------------------------------------------------
        // 6. PREFORM - LIFT CLAMPING AND BOUNDARIES
        // -------------------------------------------------------------------
        Object ucBnd = newUserCraft(m);
        Object cBnd = newContO(radData, m, -45000, 150, 45000);
        Object ctlBnd = newControl();
        setDouble(ucBnd, "lift", 100.0);
        setFloat(ucBnd, "speed", 40.0f);
        setInt(cBnd, "zy", 0);
        setInt(cBnd, "xy", 0);

        mPreform.invoke(ucBnd, ctlBnd, cBnd, acontoArray, ai, 1);
        printContOState("bnd1.conto", cBnd);
        printUserCraftState("bnd1.craft", ucBnd);

        Object ucBnd2 = newUserCraft(m);
        Object cBnd2 = newContO(radData, m, 45000, 150, -45000);
        Object ctlBnd2 = newControl();
        setDouble(ucBnd2, "lift", -100.0);
        setFloat(ucBnd2, "speed", 10.0f);
        setInt(cBnd2, "zy", 0);
        setInt(cBnd2, "xy", 180);

        mPreform.invoke(ucBnd2, ctlBnd2, cBnd2, acontoArray, ai, 1);
        printContOState("bnd2.conto", cBnd2);
        printUserCraftState("bnd2.craft", ucBnd2);

        // -------------------------------------------------------------------
        // 7. PREFORM - JUMP AND SPEED HANDLING
        // -------------------------------------------------------------------
        Object ucJump = newUserCraft(m);
        Object cJump = newContO(radData, m, 0, 100, 0);
        Object ctlJump = newControl();
        setInt(ucJump, "njumps", 3);
        setInt(ctlJump, "jump", 1);

        mPreform.invoke(ucJump, ctlJump, cJump, acontoArray, ai, 1);
        System.out.println("jump1.speed = " + getFloat(ucJump, "speed"));
        System.out.println("jump1.jump = " + getInt(ctlJump, "jump"));
        System.out.println("jump1.jumping = " + getInt(getField(cJump, "m"), "jumping"));

        // Second step of jump when m.jumping reaches 0
        setInt(getField(cJump, "m"), "jumping", 0);
        mPreform.invoke(ucJump, ctlJump, cJump, acontoArray, ai, 1);
        System.out.println("jump2.speed = " + getFloat(ucJump, "speed"));
        System.out.println("jump2.jump = " + getInt(ctlJump, "jump"));
        System.out.println("jump2.njumps = " + getInt(ucJump, "njumps"));

        // -------------------------------------------------------------------
        // 8. PREFORM - WEAPONS AND LASER TRACKING
        // -------------------------------------------------------------------
        Object ucWep = newUserCraft(m);
        Object cWep = newContO(radData, m, 1000, 100, 2000);
        setInt(cWep, "xz", 45);
        setInt(cWep, "zy", 15);
        setInt(cWep, "xy", 0);
        Object ctlWep = newControl();
        setBool(ctlWep, "fire", true);
        setBool(ucWep, "skip", true);
        setInt(ucWep, "bulkc", 2);
        setFloat(ucWep, "speed", 50.0f);

        // Target enemy craft
        Object cEnemy = newContO(radData, m, 1500, 50, 2500);
        Object acontoEnemies = Array.newInstance(Class.forName("ContO"), 3);
        Array.set(acontoEnemies, 0, cWep);
        Array.set(acontoEnemies, 1, cEnemy);
        int[] aiEnemies = new int[] { 0, 1 };

        mPreform.invoke(ucWep, ctlWep, cWep, acontoEnemies, aiEnemies, 2);
        System.out.println("wep.nl = " + getInt(ucWep, "nl"));
        System.out.println("wep.lx0 = " + getIntArr(ucWep, "lx")[0]);
        System.out.println("wep.ly0 = " + getIntArr(ucWep, "ly")[0]);
        System.out.println("wep.lz0 = " + getIntArr(ucWep, "lz")[0]);
        System.out.println("wep.lspeed0 = " + getIntArr(ucWep, "lspeed")[0]);
        System.out.println("wep.lstage0 = " + getIntArr(ucWep, "lstage")[0]);

        // Drive laser tracking with lstage > 10
        getIntArr(ucWep, "lstage")[0] = 12;
        mPreform.invoke(ucWep, ctlWep, cWep, acontoEnemies, aiEnemies, 2);
        System.out.println("wep.track.lxz0 = " + getIntArr(ucWep, "lxz")[0]);
        System.out.println("wep.track.lzy0 = " + getIntArr(ucWep, "lzy")[0]);
        System.out.println("wep.track.lx0 = " + getIntArr(ucWep, "lx")[0]);
        System.out.println("wep.track.ly0 = " + getIntArr(ucWep, "ly")[0]);
        System.out.println("wep.track.lz0 = " + getIntArr(ucWep, "lz")[0]);
        System.out.println("wep.track.lstage0 = " + getIntArr(ucWep, "lstage")[0]);

        // -------------------------------------------------------------------
        // 9. PREFORM - ESTER EGG
        // -------------------------------------------------------------------
        Object ucEst = newUserCraft(m);
        Object cEst = newContO(radData, m, 3000, 0, -2000);
        Object ctlEst = newControl();
        setInt(ucEst, "ester", 0);
        setInt(cEst, "nhits", 50);

        mPreform.invoke(ucEst, ctlEst, cEst, acontoArray, ai, 1);
        System.out.println("ester1.ester = " + getInt(ucEst, "ester"));
        System.out.println("ester1.nhits = " + getInt(cEst, "nhits"));
        System.out.println("ester1.njumps = " + getInt(ucEst, "njumps"));
        System.out.println("ester1.wire = " + getBool(cEst, "wire"));

        // Advance ester to 3
        setInt(ucEst, "ester", 2);
        mPreform.invoke(ucEst, ctlEst, cEst, acontoArray, ai, 1);
        System.out.println("ester3.ester = " + getInt(ucEst, "ester"));
        System.out.println("ester3.wire = " + getBool(cEst, "wire"));

        // Test ester color switching for ltyp 0..4
        for (int t = 0; t < 5; t++) {
            Object ucT = newUserCraft(m);
            setInt(ucT, "ltyp", t);
            setInt(ucT, "ester", 5);
            Object cT = newContO(radData, m, 0, 100, 0);
            setInt(getField(cT, "m"), "er", 0);
            setInt(getField(cT, "m"), "eg", 0);
            setInt(getField(cT, "m"), "eb", 0);
            Object ctlT = newControl();
            mPreform.invoke(ucT, ctlT, cT, acontoArray, ai, 1);
            System.out.println("ester.ltyp" + t + ".er = " + getInt(getField(cT, "m"), "er"));
            System.out.println("ester.ltyp" + t + ".eg = " + getInt(getField(cT, "m"), "eg"));
            System.out.println("ester.ltyp" + t + ".eb = " + getInt(getField(cT, "m"), "eb"));
        }

        // -------------------------------------------------------------------
        // 10. LASERCOLID (Deterministic checks)
        // -------------------------------------------------------------------
        Object ucCol = newUserCraft(m);
        Object cTarget = newContO(radData, m, 1000, 500, 1000);
        setInt(cTarget, "maxR", 5000);
        setInt(cTarget, "rcol", 1);
        setInt(cTarget, "maxhits", -1); // avoids random damage roll

        getIntArr(ucCol, "lstage")[0] = 5;
        getIntArr(ucCol, "lhit")[0] = 0;
        getIntArr(ucCol, "lx")[0] = 1000;
        getIntArr(ucCol, "ly")[0] = 500;
        getIntArr(ucCol, "lz")[0] = 1000;

        Method mLasercolid = ucCol.getClass().getDeclaredMethod("lasercolid", Class.forName("ContO"));
        mLasercolid.setAccessible(true);

        mLasercolid.invoke(ucCol, cTarget);
        System.out.println("col.lhit0 = " + getIntArr(ucCol, "lhit")[0]);

        // Non-zero offset radial hit
        Object ucCol2 = newUserCraft(m);
        getIntArr(ucCol2, "lstage")[0] = 5;
        getIntArr(ucCol2, "lhit")[0] = 0;
        getIntArr(ucCol2, "lx")[0] = 990;
        getIntArr(ucCol2, "ly")[0] = 500;
        getIntArr(ucCol2, "lz")[0] = 1000;
        mLasercolid.invoke(ucCol2, cTarget);
        System.out.println("col2.lhit0 = " + getIntArr(ucCol2, "lhit")[0]);

        // -------------------------------------------------------------------
        // 11. DL (Graphics drawing and lhit stage advancing)
        // -------------------------------------------------------------------
        Object ucDl = newUserCraft(m);
        getIntArr(ucDl, "lstage")[0] = 10;
        getIntArr(ucDl, "lhit")[0] = 1;
        getIntArr(ucDl, "lstage")[1] = 15;
        getIntArr(ucDl, "lhit")[1] = 0;

        Method mDl = ucDl.getClass().getDeclaredMethod("dl", Graphics.class);
        mDl.setAccessible(true);
        BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g = img.createGraphics();

        mDl.invoke(ucDl, g);
        System.out.println("dl1.lhit0 = " + getIntArr(ucDl, "lhit")[0]);
        System.out.println("dl1.lstage0 = " + getIntArr(ucDl, "lstage")[0]);
        System.out.println("dl1.lhit1 = " + getIntArr(ucDl, "lhit")[1]);
        System.out.println("dl1.lstage1 = " + getIntArr(ucDl, "lstage")[1]);

        mDl.invoke(ucDl, g);
        System.out.println("dl2.lhit0 = " + getIntArr(ucDl, "lhit")[0]);
        System.out.println("dl2.lstage0 = " + getIntArr(ucDl, "lstage")[0]);

        mDl.invoke(ucDl, g);
        System.out.println("dl3.lhit0 = " + getIntArr(ucDl, "lhit")[0]);
        System.out.println("dl3.lstage0 = " + getIntArr(ucDl, "lstage")[0]);

        // -------------------------------------------------------------------
        // 12. NONDETERMINISTIC SECTION (dosmokes, damage rolls)
        // -------------------------------------------------------------------
        System.out.println("NONDETERMINISTIC.START");
        Object ucSmoke = newUserCraft(m);
        Object cSmoke = newContO(radData, m, 0, 210, 0);
        setBool(ucSmoke, "smoke", true);
        Method mDosmokes = ucSmoke.getClass().getDeclaredMethod("dosmokes", Graphics.class, Class.forName("ContO"));
        mDosmokes.setAccessible(true);
        mDosmokes.invoke(ucSmoke, g, cSmoke);
        System.out.println("smoke.ns = " + getInt(ucSmoke, "ns"));
        System.out.println("NONDETERMINISTIC.END");

        System.out.println("PROBE OK");
    }
}
