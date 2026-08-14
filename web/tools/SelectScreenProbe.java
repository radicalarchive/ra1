package tools;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * The ship-select screen, driven on the REAL Java classes.
 *
 * xtGraphics' fase -2 sets the camera and lays the five selectable craft out;
 * fase 0 draws them. This probe reproduces that setup exactly and prints where
 * the real code puts the model on screen — the bounding box of everything it
 * rasterises — so the port's numbers can be compared against it.
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe SelectScreenProbe.java
 * Run (from the repo root, it reads graphics/models.zrad):
 *   java -Djava.awt.headless=true -cp /tmp/ra1port/probe:/tmp/ra1jar tools.SelectScreenProbe
 */
public class SelectScreenProbe {

    static Field f(Object o, String n) throws Exception {
        Field f = o.getClass().getDeclaredField(n);
        f.setAccessible(true);
        return f;
    }
    static void setInt(Object o, String n, int v) throws Exception { f(o, n).setInt(o, v); }
    static int getInt(Object o, String n) throws Exception { return f(o, n).getInt(o); }
    static void setBool(Object o, String n, boolean v) throws Exception { f(o, n).setBoolean(o, v); }

    /** Records the bounding box of everything drawn, as PixelGrabber cannot see vectors. */
    static class Recorder extends Graphics {
        int minx = 99999, miny = 99999, maxx = -99999, maxy = -99999, polys = 0;
        void note(int x, int y) {
            if (x < minx) minx = x;
            if (y < miny) miny = y;
            if (x > maxx) maxx = x;
            if (y > maxy) maxy = y;
        }
        public void fillPolygon(int[] xs, int[] ys, int n) {
            polys++;
            for (int i = 0; i < n; i++) note(xs[i], ys[i]);
        }
        public void drawPolygon(int[] xs, int[] ys, int n) {
            polys++;
            for (int i = 0; i < n; i++) note(xs[i], ys[i]);
        }
        public void drawLine(int x1, int y1, int x2, int y2) { polys++; note(x1, y1); note(x2, y2); }

        // Everything else is inert.
        public Graphics create() { return this; }
        public void translate(int x, int y) {}
        public java.awt.Color getColor() { return java.awt.Color.WHITE; }
        public void setColor(java.awt.Color c) {}
        public void setPaintMode() {}
        public void setXORMode(java.awt.Color c) {}
        public java.awt.Font getFont() { return null; }
        public void setFont(java.awt.Font f) {}
        public java.awt.FontMetrics getFontMetrics(java.awt.Font f) { return null; }
        public java.awt.Rectangle getClipBounds() { return null; }
        public void clipRect(int x, int y, int w, int h) {}
        public void setClip(int x, int y, int w, int h) {}
        public java.awt.Shape getClip() { return null; }
        public void setClip(java.awt.Shape s) {}
        public void copyArea(int x, int y, int w, int h, int dx, int dy) {}
        public void drawRect(int x, int y, int w, int h) {}
        public void fillRect(int x, int y, int w, int h) {}
        public void clearRect(int x, int y, int w, int h) {}
        public void drawRoundRect(int x, int y, int w, int h, int aw, int ah) {}
        public void fillRoundRect(int x, int y, int w, int h, int aw, int ah) {}
        public void drawOval(int x, int y, int w, int h) {}
        public void fillOval(int x, int y, int w, int h) {}
        public void drawArc(int x, int y, int w, int h, int sa, int aa) {}
        public void fillArc(int x, int y, int w, int h, int sa, int aa) {}
        public void drawPolyline(int[] x, int[] y, int n) {}
        public void drawString(String s, int x, int y) {}
        public void drawString(java.text.AttributedCharacterIterator it, int x, int y) {}
        public boolean drawImage(java.awt.Image i, int x, int y, java.awt.image.ImageObserver o) { return true; }
        public boolean drawImage(java.awt.Image i, int x, int y, int w, int h, java.awt.image.ImageObserver o) { return true; }
        public boolean drawImage(java.awt.Image i, int x, int y, java.awt.Color c, java.awt.image.ImageObserver o) { return true; }
        public boolean drawImage(java.awt.Image i, int x, int y, int w, int h, java.awt.Color c, java.awt.image.ImageObserver o) { return true; }
        public boolean drawImage(java.awt.Image i, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, java.awt.image.ImageObserver o) { return true; }
        public boolean drawImage(java.awt.Image i, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, java.awt.Color c, java.awt.image.ImageObserver o) { return true; }
        public void dispose() {}
    }

    public static void main(String[] args) throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Constructor<?> mc = medCls.getDeclaredConstructor();
        mc.setAccessible(true);
        Object m = mc.newInstance();

        // The five selectable craft are NOT the first models in the zip: they
        // are the first objects PLACED by siters/aces.txt (spit, hamer, drag,
        // bebs, sykos), so this has to go through the same two loaders the
        // game does — loadbase reads the zip into the base array, loadobjects
        // copies placed instances out of it.
        Class<?> contoCls = Class.forName("ContO");
        Constructor<?> byBytes = contoCls.getDeclaredConstructor(byte[].class, medCls, int.class, int.class, int.class);
        byBytes.setAccessible(true);
        Constructor<?> byCopy = contoCls.getDeclaredConstructor(medCls, contoCls, int.class, int.class, int.class);
        byCopy.setAccessible(true);

        Object[] base = new Object[53];
        String[] baseName = new String[53];
        ZipInputStream zin = new ZipInputStream(new java.io.FileInputStream(new File("graphics/models.zrad")));
        ZipEntry e = zin.getNextEntry();
        int bi = 0;
        while (e != null) {
            int len = (int) e.getSize();
            byte[] b = new byte[len];
            int off = 0;
            while (len > 0) { int r = zin.read(b, off, len); off += r; len -= r; }
            base[bi] = byBytes.newInstance(b, m, 0, 0, 0);
            baseName[bi] = e.getName();
            bi++;
            e = zin.getNextEntry();
        }
        zin.close();

        // F51.loadobjects("aces"), for the five `l(...)` lines that matter.
        Object[] aconto = new Object[5];
        String[] names = new String[5];
        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.FileReader("siters/aces.txt"));
        String line;
        int placed = 0;
        while ((line = br.readLine()) != null && placed < 5) {
            String t = line.trim();
            if (!t.startsWith("l")) continue;
            String want = t.substring(2, t.indexOf(','));
            for (int l = 0; l < 53; l++) {
                if (baseName[l] != null && baseName[l].equals(want + ".rad")) {
                    // The placement coordinates are overwritten by fase -2 below.
                    aconto[placed] = byCopy.newInstance(m, base[l], 0, 0, 0);
                    names[placed] = baseName[l];
                    placed++;
                    break;
                }
            }
        }
        br.close();

        // --- xtGraphics fase -2, transcribed ---
        int selected = 4;
        Method reset = aconto[0].getClass().getDeclaredMethod("reset");
        reset.setAccessible(true);
        for (int i2 = 0; i2 < 5; i2++) {
            reset.invoke(aconto[i2]);
            setBool(aconto[i2], "out", false);
            setInt(aconto[i2], "x", (i2 - selected) * 500);
            setInt(aconto[i2], "y", 180);
            setInt(aconto[i2], "z", 0);
        }
        setInt(m, "x", -getInt(m, "cx"));
        setInt(m, "y", 0);
        setInt(m, "ground", 250 - getInt(m, "y"));
        setInt(m, "z", -620);
        setInt(m, "xz", 0);
        setInt(m, "zy", 0);
        setInt(aconto[0], "zy", 15);
        setInt(aconto[0], "xy", -15);
        setInt(aconto[2], "xy", -30);
        setInt(aconto[3], "zy", -15);
        setInt(aconto[1], "zy", 30);

        System.out.println("camera.x = " + getInt(m, "x"));
        System.out.println("camera.y = " + getInt(m, "y"));
        System.out.println("camera.z = " + getInt(m, "z"));
        System.out.println("camera.cx = " + getInt(m, "cx"));
        System.out.println("camera.cy = " + getInt(m, "cy"));
        System.out.println("camera.focus_point = " + getInt(m, "focus_point"));
        System.out.println("camera.ground = " + getInt(m, "ground"));

        // fase 0 draws the selected craft. Medium.d first (the backdrop), then
        // each ContO in turn — submission order is the depth (spec §4).
        Method md = m.getClass().getDeclaredMethod("d", Graphics.class);
        md.setAccessible(true);
        Method cd = aconto[0].getClass().getDeclaredMethod("d", Graphics.class);
        cd.setAccessible(true);

        for (int k = 0; k < 5; k++) {
            Recorder rec = new Recorder();
            cd.invoke(aconto[k], rec);
            System.out.println("craft" + k + ".name = " + names[k]);
            System.out.println("craft" + k + ".world = " + getInt(aconto[k], "x") + "," + getInt(aconto[k], "y") + "," + getInt(aconto[k], "z"));
            System.out.println("craft" + k + ".polys = " + rec.polys);
            if (rec.polys > 0) {
                System.out.println("craft" + k + ".bbox = " + rec.minx + "," + rec.miny + " .. " + rec.maxx + "," + rec.maxy);
                System.out.println("craft" + k + ".size = " + (rec.maxx - rec.minx) + "x" + (rec.maxy - rec.miny));
                System.out.println("craft" + k + ".centre = " + ((rec.minx + rec.maxx) / 2) + "," + ((rec.miny + rec.maxy) / 2));
            }
            System.out.println("craft" + k + ".maxR = " + getInt(aconto[k], "maxR"));
            System.out.println("craft" + k + ".dist = " + getInt(aconto[k], "dist"));
        }

        System.out.println("PROBE OK");
    }
}
