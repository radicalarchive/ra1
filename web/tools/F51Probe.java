package tools;

import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Set;

/**
 * Reflection probe for the parts of F51 the port transpiles line by line:
 * getstring / getint and the loaders built on them, plus the key-binding
 * tables and the AWT 1.0 keyDown/keyUp state machine.
 *
 * The threading, audio and drawing seams are deliberately NOT probed — they
 * are replaced in the port, not transpiled, and F51's constructor does not
 * touch them, so the class can be built headless.
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe F51Probe.java
 * Run:
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.F51Probe
 */
public class F51Probe {

    static Object newF51() throws Exception {
        Class<?> cls = Class.forName("F51");
        Constructor<?> ctor = cls.getDeclaredConstructor();
        ctor.setAccessible(true);
        return ctor.newInstance();
    }

    static Object get(Object o, String name) throws Exception {
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

    static void setInt(Object o, String name, int v) throws Exception {
        Field f = o.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.setInt(o, v);
    }

    static String sorted(Set<?> s) {
        int[] a = new int[s.size()];
        int i = 0;
        for (Object o : s) a[i++] = (Integer) o;
        java.util.Arrays.sort(a);
        return java.util.Arrays.toString(a);
    }

    public static void main(String[] args) throws Exception {
        Object f51 = newF51();

        Method mGetstring = f51.getClass().getDeclaredMethod("getstring", String.class, String.class, int.class);
        mGetstring.setAccessible(true);
        Method mGetint = f51.getClass().getDeclaredMethod("getint", String.class, String.class, int.class);
        mGetint.setAccessible(true);

        // ------------------------------------------------------------------
        // 1. getstring — the parser every loader goes through.
        // Real lines from levels/*.txt and siters/*.txt.
        // ------------------------------------------------------------------
        System.out.println("getstring.name0 = " + mGetstring.invoke(f51, "name", "name(Sky Raider)", 0));
        System.out.println("getstring.prompt0 = " + mGetstring.invoke(f51, "prompt", "prompt(tank,3,Destroy the|tanks)", 0));
        System.out.println("getstring.prompt1 = " + mGetstring.invoke(f51, "prompt", "prompt(tank,3,Destroy the|tanks)", 1));
        System.out.println("getstring.prompt2 = " + mGetstring.invoke(f51, "prompt", "prompt(tank,3,Destroy the|tanks)", 2));
        System.out.println("getstring.l0 = " + mGetstring.invoke(f51, "l", "l(bild1,-300,0,1200)", 0));
        // Index past the end of the line: returns "" rather than throwing.
        System.out.println("getstring.past_end = [" + mGetstring.invoke(f51, "name", "name(Sky Raider)", 4) + "]");

        // ------------------------------------------------------------------
        // 2. getint — same walk, then Integer.valueOf.
        // ------------------------------------------------------------------
        System.out.println("getint.craft0 = " + mGetint.invoke(f51, "craft", "craft(7)", 0));
        System.out.println("getint.l1 = " + mGetint.invoke(f51, "l", "l(bild1,-300,0,1200)", 1));
        System.out.println("getint.l2 = " + mGetint.invoke(f51, "l", "l(bild1,-300,0,1200)", 2));
        System.out.println("getint.l3 = " + mGetint.invoke(f51, "l", "l(bild1,-300,0,1200)", 3));
        System.out.println("getint.stat5 = " + mGetint.invoke(f51, "stat", "stat(60,3,50,30,500,0)", 5));
        System.out.println("getint.negative = " + mGetint.invoke(f51, "xy", "xy(-180)", 0));

        // Integer.valueOf("") throws NumberFormatException. Every loader runs
        // inside a catch, so this is load-bearing: it abandons the line.
        try {
            mGetint.invoke(f51, "craft", "craft()", 0);
            System.out.println("getint.empty_throws = false");
        } catch (Exception e) {
            Throwable c = e.getCause() == null ? e : e.getCause();
            System.out.println("getint.empty_throws = " + c.getClass().getName());
        }
        try {
            mGetint.invoke(f51, "name", "name(Sky Raider)", 0);
            System.out.println("getint.nonnumeric_throws = false");
        } catch (Exception e) {
            Throwable c = e.getCause() == null ? e : e.getCause();
            System.out.println("getint.nonnumeric_throws = " + c.getClass().getName());
        }

        // ------------------------------------------------------------------
        // 3. Constructor defaults.
        // ------------------------------------------------------------------
        System.out.println("init.mon = " + getBool(f51, "mon"));
        System.out.println("init.moner = " + get(f51, "moner"));
        System.out.println("init.sndfrm = " + get(f51, "sndfrm"));
        System.out.println("init.nounif = " + getBool(f51, "nounif"));
        System.out.println("init.tab = " + getBool(f51, "tab"));
        System.out.println("init.view = " + getInt(f51, "view"));
        System.out.println("init.maxco = " + getInt(f51, "maxco"));
        System.out.println("init.maxmo = " + getInt(f51, "maxmo"));
        System.out.println("init.crntt = " + getInt(f51, "crntt"));
        System.out.println("init.dnload = " + getInt(f51, "dnload"));
        System.out.println("init.obj_len = " + ((Object[]) get(f51, "obj")).length);
        System.out.println("init.las_len = " + Array.getLength(get(f51, "las")));
        System.out.println("init.mtrak_len = " + Array.getLength(get(f51, "mtrak")));
        System.out.println("init.loadet_len = " + Array.getLength(get(f51, "loadet")));

        // ------------------------------------------------------------------
        // 4. initDefaultKeySettings — the binding tables.
        // ------------------------------------------------------------------
        Method mDefaults = f51.getClass().getDeclaredMethod("initDefaultKeySettings");
        mDefaults.setAccessible(true);
        mDefaults.invoke(f51);
        String[] tables = {
            "viewOneKeys", "viewTwoKeys", "viewThreeKeys", "viewFourKeys", "viewFiveKeys",
            "nomusicKeys", "switchmusicKeys", "nosoundKeys", "radarKeys", "tabKeys",
            "plusKeys", "minsKeys", "jumpKeys", "enterKeys", "fireKeys",
            "leftKeys", "rightKeys", "downKeys", "upKeys",
        };
        for (String t : tables) {
            System.out.println("defaults." + t + " = " + sorted((Set<?>) get(f51, t)));
        }

        // ------------------------------------------------------------------
        // 5. keyDown / keyUp — the AWT 1.0 state machine, on the defaults.
        // ------------------------------------------------------------------
        Method mKeyDown = f51.getClass().getDeclaredMethod("keyDown", java.awt.Event.class, int.class);
        mKeyDown.setAccessible(true);
        Method mKeyUp = f51.getClass().getDeclaredMethod("keyUp", java.awt.Event.class, int.class);
        mKeyUp.setAccessible(true);
        Object u = get(f51, "u");

        mKeyDown.invoke(f51, (java.awt.Event) null, 1004);   // Event.UP
        System.out.println("keys.up_down_u_up = " + getBool(u, "up"));
        mKeyDown.invoke(f51, (java.awt.Event) null, 1006);   // Event.LEFT
        System.out.println("keys.left_down_u_left = " + getBool(u, "left"));
        mKeyUp.invoke(f51, (java.awt.Event) null, 1004);
        System.out.println("keys.up_released_u_up = " + getBool(u, "up"));
        System.out.println("keys.up_released_u_left = " + getBool(u, "left"));

        // Views latch on press and only clear when the LAST bound key is up.
        mKeyDown.invoke(f51, (java.awt.Event) null, 51);     // '3'
        System.out.println("keys.view3 = " + getInt(f51, "view"));
        mKeyUp.invoke(f51, (java.awt.Event) null, 51);
        System.out.println("keys.view_after_release = " + getInt(f51, "view"));

        // enter latches enterd; the release branch tests enterKeys, not
        // enterPressedKeys, unlike every neighbour (keyUp offset 426).
        mKeyDown.invoke(f51, (java.awt.Event) null, 10);     // '\n'
        System.out.println("keys.enterd_after_down = " + getBool(f51, "enterd"));
        System.out.println("keys.space_after_down = " + getBool(u, "space"));
        // The game consumes u.space; a HELD enter must not set it again. That
        // is the only observable difference the `&& !this.enterd` guard makes,
        // so without this the guard could be dropped and every test stay green.
        Field spaceF = u.getClass().getDeclaredField("space");
        spaceF.setAccessible(true);
        spaceF.setBoolean(u, false);
        mKeyDown.invoke(f51, (java.awt.Event) null, 10);     // held: no re-latch
        System.out.println("keys.enterd_after_repeat = " + getBool(f51, "enterd"));
        System.out.println("keys.space_after_repeat = " + getBool(u, "space"));
        mKeyUp.invoke(f51, (java.awt.Event) null, 10);
        System.out.println("keys.enterd_after_up = " + getBool(f51, "enterd"));

        // Two keys bound to the same action: mins is '-' (45) and BACKSPACE (8).
        mKeyDown.invoke(f51, (java.awt.Event) null, 45);
        mKeyDown.invoke(f51, (java.awt.Event) null, 8);
        mKeyUp.invoke(f51, (java.awt.Event) null, 45);
        System.out.println("keys.mins_one_still_held = " + getBool(u, "mins"));
        mKeyUp.invoke(f51, (java.awt.Event) null, 8);
        System.out.println("keys.mins_both_released = " + getBool(u, "mins"));

        // jump only latches from 0, and sets jade once.
        mKeyDown.invoke(f51, (java.awt.Event) null, 106);    // 'j'
        System.out.println("keys.jump = " + getInt(u, "jump"));
        System.out.println("keys.jade = " + getBool(u, "jade"));

        // nosound / nomusic toggle rather than latch.
        mKeyDown.invoke(f51, (java.awt.Event) null, 115);    // 's'
        System.out.println("keys.nosound_1 = " + getBool(f51, "nosound"));
        mKeyDown.invoke(f51, (java.awt.Event) null, 115);
        System.out.println("keys.nosound_2 = " + getBool(f51, "nosound"));

        // ------------------------------------------------------------------
        // 6. lostFocus — the blur path.
        // ------------------------------------------------------------------
        Method mLostFocus = f51.getClass().getDeclaredMethod("lostFocus", java.awt.Event.class, Object.class);
        mLostFocus.setAccessible(true);
        setInt(f51, "maxmo", 3);
        mKeyDown.invoke(f51, (java.awt.Event) null, 1005);   // hold DOWN
        System.out.println("focus.down_held = " + getBool(u, "down"));
        System.out.println("focus.ret = " + mLostFocus.invoke(f51, (java.awt.Event) null, (Object) null));
        System.out.println("focus.mon = " + getBool(f51, "mon"));
        System.out.println("focus.view = " + getInt(f51, "view"));
        System.out.println("focus.u_down = " + getBool(u, "down"));
        System.out.println("focus.tab = " + getBool(f51, "tab"));

        // maxmo == -1 keeps the controls untouched; only `mon` is set.
        Object f2 = newF51();
        Object u2 = get(f2, "u");
        mDefaults.invoke(f2);
        mKeyDown.invoke(f2, (java.awt.Event) null, 1005);
        mLostFocus.invoke(f2, (java.awt.Event) null, (Object) null);
        System.out.println("focus.fresh_u_down = " + getBool(u2, "down"));
        System.out.println("focus.fresh_mon = " + getBool(f2, "mon"));

        // ------------------------------------------------------------------
        // 7. mouseDown.
        // ------------------------------------------------------------------
        Method mMouseDown = f51.getClass().getDeclaredMethod("mouseDown", java.awt.Event.class, int.class, int.class);
        mMouseDown.setAccessible(true);
        Object f3 = newF51();
        System.out.println("mouse.moner_before = " + get(f3, "moner"));
        mMouseDown.invoke(f3, (java.awt.Event) null, 10, 10);
        // maxmo is -1 on a fresh F51, so mon and moner do NOT change.
        System.out.println("mouse.fresh_mon = " + getBool(f3, "mon"));
        System.out.println("mouse.fresh_moner = " + get(f3, "moner"));
        setInt(f3, "maxmo", 3);
        mMouseDown.invoke(f3, (java.awt.Event) null, 10, 10);
        System.out.println("mouse.mon = " + getBool(f3, "mon"));
        System.out.println("mouse.moner = " + get(f3, "moner"));

        System.out.println("PROBE OK");
    }
}
