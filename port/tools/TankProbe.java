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
 * Reflection probe for Tank.java against the real ra1.jar classes.
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe TankProbe.java
 * Run:
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.TankProbe
 */
public class TankProbe {

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

    static Object newTank(Object m) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Class<?> tankCls = Class.forName("Tank");
        Constructor<?> ctor = tankCls.getDeclaredConstructor(medCls);
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

    static void setBool(Object o, String name, boolean val) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setBoolean(o, val);
    }

    static void setControl(Object tank, boolean left, boolean right, boolean up, boolean down, boolean fire) throws Exception {
        Object u = getField(tank, "u");
        setBool(u, "left", left);
        setBool(u, "right", right);
        setBool(u, "up", up);
        setBool(u, "down", down);
        setBool(u, "fire", fire);
    }

    static void printTankState(String prefix, Object t) throws Exception {
        System.out.println(prefix + ".rspeed = " + getInt(t, "rspeed"));
        System.out.println(prefix + ".speed = " + getFloat(t, "speed"));
        System.out.println(prefix + ".ltyp = " + getInt(t, "ltyp"));
        System.out.println(prefix + ".pexp = " + getBool(t, "pexp"));
        System.out.println(prefix + ".left = " + getBool(t, "left"));
        System.out.println(prefix + ".right = " + getBool(t, "right"));
        System.out.println(prefix + ".nl = " + getInt(t, "nl"));
        System.out.println(prefix + ".skip = " + getBool(t, "skip"));
        System.out.println(prefix + ".bulkc = " + getInt(t, "bulkc"));
        System.out.println(prefix + ".ns = " + getInt(t, "ns"));
        System.out.println(prefix + ".smoke = " + getBool(t, "smoke"));
        System.out.println(prefix + ".tcnt = " + getInt(t, "tcnt"));
        System.out.println(prefix + ".gxz = " + getInt(t, "gxz"));
        System.out.println(prefix + ".attack = " + getInt(t, "attack"));
        System.out.println(prefix + ".responce = " + getBool(t, "responce"));
        System.out.println(prefix + ".trgxz = " + getInt(t, "trgxz"));
        System.out.println(prefix + ".trgt = " + getInt(t, "trgt"));
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
        Object tank = newTank(m);
        System.out.println("init.rspeed = " + getInt(tank, "rspeed"));
        System.out.println("init.ltyp = " + getInt(tank, "ltyp"));
        System.out.println("init.speed = " + getFloat(tank, "speed"));
        System.out.println("init.pexp = " + getBool(tank, "pexp"));
        System.out.println("init.left = " + getBool(tank, "left"));
        System.out.println("init.right = " + getBool(tank, "right"));
        System.out.println("init.nl = " + getInt(tank, "nl"));
        System.out.println("init.skip = " + getBool(tank, "skip"));
        System.out.println("init.bulkc = " + getInt(tank, "bulkc"));
        System.out.println("init.ns = " + getInt(tank, "ns"));
        System.out.println("init.smoke = " + getBool(tank, "smoke"));
        System.out.println("init.tcnt = " + getInt(tank, "tcnt"));
        System.out.println("init.gxz = " + getInt(tank, "gxz"));
        System.out.println("init.attack = " + getInt(tank, "attack"));
        System.out.println("init.responce = " + getBool(tank, "responce"));
        System.out.println("init.trgxz = " + getInt(tank, "trgxz"));
        System.out.println("init.trgt = " + getInt(tank, "trgt"));
        System.out.println("init.sms = " + Arrays.toString(getIntArr(tank, "sms")));
        System.out.println("init.lstage = " + Arrays.toString(getIntArr(tank, "lstage")));

        // -------------------------------------------------------------------
        // 2. HELPER METHODS (getpy, getcpy)
        // -------------------------------------------------------------------
        Method mGetpy = tank.getClass().getDeclaredMethod("getpy", int.class, int.class, int.class, int.class);
        mGetpy.setAccessible(true);

        int[] lx = getIntArr(tank, "lx");
        int[] ly = getIntArr(tank, "ly");
        int[] lz = getIntArr(tank, "lz");
        lx[0] = -35000; ly[0] = 25000; lz[0] = -48000;
        lx[1] = 15000;  ly[1] = -12000; lz[1] = 32000;

        int py1 = (Integer) mGetpy.invoke(tank, 48000, -38000, 28000, 0);
        int py2 = (Integer) mGetpy.invoke(tank, -28000, 18000, -8000, 1);
        System.out.println("getpy.test1 = " + py1);
        System.out.println("getpy.test2 = " + py2);

        Method mGetcpy = tank.getClass().getDeclaredMethod("getcpy", Class.forName("ContO"), Class.forName("ContO"));
        mGetcpy.setAccessible(true);
        Object c1 = newContO(radData, m, 42000, -32000, 22000);
        Object c2 = newContO(radData, m, -38000, 28000, -48000);
        int cpy = (Integer) mGetcpy.invoke(tank, c1, c2);
        System.out.println("getcpy.test1 = " + cpy);

        // -------------------------------------------------------------------
        // 3. RESET
        // -------------------------------------------------------------------
        Method mReset = tank.getClass().getDeclaredMethod("reset", int.class, int.class);
        mReset.setAccessible(true);
        mReset.invoke(tank, 90, 2);
        printTankState("reset1", tank);
        mReset.invoke(tank, 45, 1);
        printTankState("reset2", tank);

        // -------------------------------------------------------------------
        // 4. LASER COLLISION
        // -------------------------------------------------------------------
        Method mLasercolid = tank.getClass().getDeclaredMethod("lasercolid", Class.forName("ContO"));
        mLasercolid.setAccessible(true);
        Object targetConto = newContO(radData, m, 400, 80, 800);
        setInt(targetConto, "maxR", 300);
        setInt(targetConto, "rcol", 1);
        setInt(targetConto, "maxhits", 80);
        setInt(targetConto, "nhits", 0);
        setBool(targetConto, "exp", false);
        setBool(targetConto, "out", false);

        int[] lstage = getIntArr(tank, "lstage");
        int[] lhit = getIntArr(tank, "lhit");
        lx[0] = 405; ly[0] = 82; lz[0] = 805;
        lstage[0] = 5; lhit[0] = 0;
        lx[1] = 8000; ly[1] = 8000; lz[1] = 8000;
        lstage[1] = 5; lhit[1] = 0;

        mLasercolid.invoke(tank, targetConto);
        System.out.println("lasercolid.lhit0 = " + lhit[0]);
        System.out.println("lasercolid.lhit1 = " + lhit[1]);
        System.out.println("lasercolid.conto_hit = " + getBool(targetConto, "hit"));
        System.out.println("lasercolid.conto_nhits = " + getInt(targetConto, "nhits"));

        // -------------------------------------------------------------------
        // 5. GRAPHICS METHODS: dl and dosmokes
        // -------------------------------------------------------------------
        BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
        Graphics g = img.createGraphics();

        Method mDl = tank.getClass().getDeclaredMethod("dl", Graphics.class);
        mDl.setAccessible(true);
        lstage[0] = 1; lhit[0] = 0;
        lstage[1] = 1; lhit[1] = 1;
        lstage[2] = 1; lhit[2] = 2;
        mDl.invoke(tank, g);
        System.out.println("dl.lhit0 = " + lhit[0]);
        System.out.println("dl.lhit1 = " + lhit[1]);
        System.out.println("dl.lhit2 = " + lhit[2]);
        System.out.println("dl.lstage2 = " + lstage[2]);

        Method mDosmokes = tank.getClass().getDeclaredMethod("dosmokes", Graphics.class, Class.forName("ContO"));
        mDosmokes.setAccessible(true);
        Object smokeConto = newContO(radData, m, 150, 210, 350);
        setBool(tank, "smoke", true); // triggers smoke

        mDosmokes.invoke(tank, g, smokeConto);
        System.out.println("dosmokes.ns = " + getInt(tank, "ns"));
        System.out.println("dosmokes.smoke_flag = " + getBool(tank, "smoke"));
        System.out.println("dosmokes.sms0 = " + getIntArr(tank, "sms")[0]);

        // -------------------------------------------------------------------
        // 6. PREFORM METHOD — MULTI-STEP SIMULATION (DETERMINISTIC PATHS)
        // -------------------------------------------------------------------
        Class<?> contoArrCls = Array.newInstance(Class.forName("ContO"), 0).getClass();
        Method mPreform = tank.getClass().getDeclaredMethod("preform",
            Class.forName("ContO"), contoArrCls, int.class, int.class);
        mPreform.setAccessible(true);

        // Sections 1-5 leave state on `tank` (dosmokes bumps ns/nd, lasercolid
        // touches the laser arrays). A test drives preform from a fresh object,
        // so the probe must too, or the printed values are unreachable.
        tank = newTank(m);

        Object playerConto = newContO(radData, m, 0, 200, 0);
        setInt(playerConto, "maxhits", 100);
        setInt(playerConto, "nhits", 0);
        setBool(playerConto, "exp", false);
        setInt(playerConto, "xz", 30);
        setInt(playerConto, "xy", 0);
        setInt(playerConto, "zy", 0);

        Object[] targets = (Object[]) Array.newInstance(Class.forName("ContO"), 20);
        for (int e = 0; e < 20; e++) {
            targets[e] = newContO(radData, m, e * 1200 - 9000, 200, e * 1200 - 9000);
            setInt(targets[e], "maxR", 150);
        }

        // Scenario A: Left steering and Case A speed/5 compound assignment
        mReset.invoke(tank, 40, 1);
        setInt(tank, "turnat", 1000); // keep tcnt <= turnat to avoid random branch
        setInt(tank, "tcnt", 0);
        setFloat(tank, "speed", 25.0f);
        setControl(tank, true, false, false, false, false);
        for (int step = 0; step < 5; step++) {
            mPreform.invoke(tank, playerConto, targets, 0, 0);
            printContOState("preform.turnleft.step" + step + ".conto", playerConto);
            printTankState("preform.turnleft.step" + step + ".tank", tank);
        }

        // Scenario B: Right steering
        setControl(tank, false, true, false, false, false);
        for (int step = 0; step < 5; step++) {
            mPreform.invoke(tank, playerConto, targets, 0, 0);
            printContOState("preform.turnright.step" + step + ".conto", playerConto);
            printTankState("preform.turnright.step" + step + ".tank", tank);
        }

        // Scenario C: Boundary clamping
        setInt(playerConto, "x", 43000);
        setInt(playerConto, "z", -42000);
        setControl(tank, false, false, false, false, false);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.bound.x = " + getInt(playerConto, "x"));
        System.out.println("preform.bound.z = " + getInt(playerConto, "z"));

        // Scenario D: Pitch/Roll normalisation (zy > 270 and xy adjustment)
        setInt(playerConto, "zy", 300);
        setInt(playerConto, "xy", 120);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.zy_norm.zy = " + getInt(playerConto, "zy"));
        System.out.println("preform.zy_norm.xy = " + getInt(playerConto, "xy"));
        System.out.println("preform.zy_norm.smoke = " + getBool(tank, "smoke"));

        // Scenario E: Gravity behavior (y <= 235, y > 235, y > 240)
        setInt(playerConto, "y", 220);
        setBool(tank, "pexp", false);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.grav.y1 = " + getInt(playerConto, "y"));
        setInt(playerConto, "y", 237);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.grav.y2 = " + getInt(playerConto, "y"));
        setInt(playerConto, "y", 245);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.grav.y3 = " + getInt(playerConto, "y"));

        // Scenario F: Laser firing (u.fire = true)
        setBool(playerConto, "exp", false);
        setBool(tank, "pexp", false);
        setBool(tank, "skip", true);
        setInt(tank, "bulkc", 0);
        setControl(tank, false, false, false, false, true);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.fire.nl = " + getInt(tank, "nl"));
        System.out.println("preform.fire.lstage0 = " + getIntArr(tank, "lstage")[0]);
        System.out.println("preform.fire.lspeed0 = " + getIntArr(tank, "lspeed")[0]);
        System.out.println("preform.fire.lx0 = " + getIntArr(tank, "lx")[0]);
        System.out.println("preform.fire.ly0 = " + getIntArr(tank, "ly")[0]);
        System.out.println("preform.fire.lz0 = " + getIntArr(tank, "lz")[0]);
        System.out.println("preform.fire.lzy0 = " + getIntArr(tank, "lzy")[0]);

        // Scenario G: Laser homing update
        int[] nlstage = getIntArr(tank, "lstage");
        int[] nnf = getIntArr(tank, "nf");
        nlstage[0] = 12; // > 10 triggers homing towards aconto
        nnf[0] = 2;      // < 15
        setControl(tank, false, false, false, false, false);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.homing.lxz0 = " + getIntArr(tank, "lxz")[0]);
        System.out.println("preform.homing.lzy0 = " + getIntArr(tank, "lzy")[0]);
        System.out.println("preform.homing.nf0 = " + getIntArr(tank, "nf")[0]);
        System.out.println("preform.homing.lx0 = " + getIntArr(tank, "lx")[0]);
        System.out.println("preform.homing.ly0 = " + getIntArr(tank, "ly")[0]);
        System.out.println("preform.homing.lz0 = " + getIntArr(tank, "lz")[0]);

        // Scenario H: Response / steering tracking
        setBool(tank, "responce", true);
        setInt(playerConto, "xz", 10);
        setInt(tank, "gxz", 300);
        mPreform.invoke(tank, playerConto, targets, 0, 0);
        System.out.println("preform.resp.u_right = " + getBool(getField(tank, "u"), "right"));
        System.out.println("preform.resp.trgxz = " + getInt(tank, "trgxz"));

        // Scenario I: the §2 discriminator for the Case A site at Tank.java 102,
        // `conto.xy -= (int)(this.speed / 5.0f)`.
        // The site only fires with xy == 0 or xy == 180, and xy is normalised
        // toward one of those every step: the `k > 90` branch (|zy| in 90..270)
        // is the one that leaves xy == 180 intact, so zy = 180 here.
        // Case A gives trunc(180 - speed/5), Case B gives 180 - trunc(speed/5);
        // with speed/5 = 8.6 that is 171 vs 172.
        // The sibling `+=` site at line 92 has NO discriminating input: it fires
        // only at xy == 0 or 180, where a positive step truncates identically
        // under both rules. Nothing to probe there.
        Object tank2 = newTank(m);
        Object conto2 = newContO(radData, m, 0, 200, 0);
        setInt(conto2, "maxhits", 100);
        setInt(conto2, "nhits", 0);
        setBool(conto2, "exp", false);
        setInt(conto2, "xz", 0);
        setInt(conto2, "zy", 180);
        setInt(conto2, "xy", 180);
        mReset.invoke(tank2, 40, 1);
        setInt(tank2, "turnat", 1000);
        setInt(tank2, "tcnt", 0);
        setFloat(tank2, "speed", 43.0f);
        setBool(tank2, "right", false);
        setControl(tank2, false, true, false, false, false);
        mPreform.invoke(tank2, conto2, targets, 0, 0);
        System.out.println("caseA.right.xy = " + getInt(conto2, "xy"));
        System.out.println("caseA.right.speed = " + getFloat(tank2, "speed"));

        // -------------------------------------------------------------------
        // 7. NONDETERMINISTIC VALUES (DO NOT ASSERT IN TESTS)
        // -------------------------------------------------------------------
        System.out.println("--- NONDETERMINISTIC ---");
        System.out.println("nondet.init_turnat = " + getInt(tank, "turnat"));
        System.out.println("nondet.smoke_sx0 = " + getIntArr(tank, "sx")[0]);

        System.out.println("PROBE OK");
    }
}
