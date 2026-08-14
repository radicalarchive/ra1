package tools;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.Shape;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.AttributedCharacterIterator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Reflection probe for Lasers.java
 *
 * Compile:
 *   javac -cp /tmp/ra1jar -d /tmp/ra1port/probe \
 *         /home/evan/resources/ra1/port/tools/LasersProbe.java
 *
 * Run:
 *   java -Djava.awt.headless=true \
 *        -cp /tmp/ra1port/probe:/tmp/ra1jar tools.LasersProbe
 */
public class LasersProbe {

    static class RecordingGraphics extends Graphics {
        private final Graphics delegate;
        public final List<String> records = new ArrayList<>();
        private Color curColor;

        public RecordingGraphics(Graphics delegate) {
            this.delegate = delegate;
        }

        @Override
        public void setColor(Color c) {
            this.curColor = c;
            delegate.setColor(c);
        }

        @Override
        public void fillPolygon(int[] xPoints, int[] yPoints, int nPoints) {
            int[] xs = Arrays.copyOf(xPoints, nPoints);
            int[] ys = Arrays.copyOf(yPoints, nPoints);
            records.add(String.format("color=[%d,%d,%d], xs=%s, ys=%s",
                    curColor.getRed(), curColor.getGreen(), curColor.getBlue(),
                    Arrays.toString(xs), Arrays.toString(ys)));
            delegate.fillPolygon(xPoints, yPoints, nPoints);
        }

        @Override public Graphics create() { return new RecordingGraphics(delegate.create()); }
        @Override public void translate(int x, int y) { delegate.translate(x, y); }
        @Override public Color getColor() { return delegate.getColor(); }
        @Override public void setPaintMode() { delegate.setPaintMode(); }
        @Override public void setXORMode(Color c1) { delegate.setXORMode(c1); }
        @Override public Font getFont() { return delegate.getFont(); }
        @Override public void setFont(Font font) { delegate.setFont(font); }
        @Override public FontMetrics getFontMetrics(Font f) { return delegate.getFontMetrics(f); }
        @Override public Rectangle getClipBounds() { return delegate.getClipBounds(); }
        @Override public void clipRect(int x, int y, int width, int height) { delegate.clipRect(x, y, width, height); }
        @Override public void setClip(int x, int y, int width, int height) { delegate.setClip(x, y, width, height); }
        @Override public Shape getClip() { return delegate.getClip(); }
        @Override public void setClip(Shape clip) { delegate.setClip(clip); }
        @Override public void copyArea(int x, int y, int width, int height, int dx, int dy) { delegate.copyArea(x, y, width, height, dx, dy); }
        @Override public void drawLine(int x1, int y1, int x2, int y2) { delegate.drawLine(x1, y1, x2, y2); }
        @Override public void fillRect(int x, int y, int width, int height) { delegate.fillRect(x, y, width, height); }
        @Override public void clearRect(int x, int y, int width, int height) { delegate.clearRect(x, y, width, height); }
        @Override public void drawRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight) { delegate.drawRoundRect(x, y, width, height, arcWidth, arcHeight); }
        @Override public void fillRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight) { delegate.fillRoundRect(x, y, width, height, arcWidth, arcHeight); }
        @Override public void drawOval(int x, int y, int width, int height) { delegate.drawOval(x, y, width, height); }
        @Override public void fillOval(int x, int y, int width, int height) { delegate.fillOval(x, y, width, height); }
        @Override public void drawArc(int x, int y, int width, int height, int startAngle, int arcAngle) { delegate.drawArc(x, y, width, height, startAngle, arcAngle); }
        @Override public void fillArc(int x, int y, int width, int height, int startAngle, int arcAngle) { delegate.fillArc(x, y, width, height, startAngle, arcAngle); }
        @Override public void drawPolyline(int[] xPoints, int[] yPoints, int nPoints) { delegate.drawPolyline(xPoints, yPoints, nPoints); }
        @Override public void drawPolygon(int[] xPoints, int[] yPoints, int nPoints) { delegate.drawPolygon(xPoints, yPoints, nPoints); }
        @Override public void drawString(String str, int x, int y) { delegate.drawString(str, x, y); }
        @Override public void drawString(AttributedCharacterIterator iterator, int x, int y) { delegate.drawString(iterator, x, y); }
        @Override public boolean drawImage(Image img, int x, int y, ImageObserver observer) { return delegate.drawImage(img, x, y, observer); }
        @Override public boolean drawImage(Image img, int x, int y, int width, int height, ImageObserver observer) { return delegate.drawImage(img, x, y, width, height, observer); }
        @Override public boolean drawImage(Image img, int x, int y, Color bgcolor, ImageObserver observer) { return delegate.drawImage(img, x, y, bgcolor, observer); }
        @Override public boolean drawImage(Image img, int x, int y, int width, int height, Color bgcolor, ImageObserver observer) { return delegate.drawImage(img, x, y, width, height, bgcolor, observer); }
        @Override public boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, ImageObserver observer) { return delegate.drawImage(img, dx1, dy1, dx2, dy2, sx1, sy1, sx2, sy2, observer); }
        @Override public boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, Color bgcolor, ImageObserver observer) { return delegate.drawImage(img, dx1, dy1, dx2, dy2, sx1, sy1, sx2, sy2, bgcolor, observer); }
        @Override public void dispose() { delegate.dispose(); }
    }

    static Object newMedium() throws Exception {
        Class<?> medCls = Class.forName("Medium");
        Object m = medCls.getDeclaredConstructor().newInstance();
        setInt(m, "focus_point", 400);
        setInt(m, "ground", 250);
        setInt(m, "cx", 250);
        setInt(m, "cy", 150);
        setInt(m, "cz", 50);
        setInt(m, "xz", 45);
        setInt(m, "zy", 30);
        setInt(m, "x", 1200);
        setInt(m, "y", -800);
        setInt(m, "z", 3500);
        setInt(m, "w", 500);
        setInt(m, "h", 360);
        return m;
    }

    static Object newLasers(Object medium) throws Exception {
        Class<?> lasersCls = Class.forName("Lasers");
        Class<?> medCls = Class.forName("Medium");
        Constructor<?> ctor = lasersCls.getDeclaredConstructor(medCls);
        ctor.setAccessible(true);
        return ctor.newInstance(medium);
    }

    static void setInt(Object target, String fieldName, int value) throws Exception {
        Field f = target.getClass().getDeclaredField(fieldName);
        f.setAccessible(true);
        f.setInt(target, value);
    }

    static int getInt(Object target, String fieldName) throws Exception {
        Field f = target.getClass().getDeclaredField(fieldName);
        f.setAccessible(true);
        return f.getInt(target);
    }

    static int[] getIntArray(Object target, String fieldName) throws Exception {
        Field f = target.getClass().getDeclaredField(fieldName);
        f.setAccessible(true);
        return (int[]) f.get(target);
    }

    public static void main(String[] args) throws Exception {
        // ===================================================================
        // 1. Constructor fields
        // ===================================================================
        {
            Object m = newMedium();
            Object l = newLasers(m);
            System.out.println("ctor.speed = " + Arrays.toString(getIntArray(l, "speed")));
            System.out.println("ctor.rads = " + Arrays.toString(getIntArray(l, "rads")));
            System.out.println("ctor.srate = " + Arrays.toString(getIntArray(l, "srate")));
            System.out.println("ctor.damg = " + Arrays.toString(getIntArray(l, "damg")));
        }

        // ===================================================================
        // 2. xs() and ys() screen projection helpers
        // ===================================================================
        {
            Object m = newMedium();
            Object l = newLasers(m);
            Method xsMethod = l.getClass().getDeclaredMethod("xs", int.class, int.class);
            Method ysMethod = l.getClass().getDeclaredMethod("ys", int.class, int.class);
            xsMethod.setAccessible(true);
            ysMethod.setAccessible(true);

            // Normal values
            System.out.println("xs.normal1 = " + xsMethod.invoke(l, 100, 500));
            System.out.println("xs.normal2 = " + xsMethod.invoke(l, -200, 300));
            System.out.println("ys.normal1 = " + ysMethod.invoke(l, 80, 500));
            System.out.println("ys.normal2 = " + ysMethod.invoke(l, -150, 300));

            // j < 10 clamped branch
            System.out.println("xs.clamped_j = " + xsMethod.invoke(l, 100, 5));
            System.out.println("xs.neg_j = " + xsMethod.invoke(l, 100, -50));
            System.out.println("ys.clamped_j = " + ysMethod.invoke(l, 80, 5));
            System.out.println("ys.neg_j = " + ysMethod.invoke(l, 80, -50));

            // Large values that test 32-bit int overflow wrapping
            System.out.println("xs.overflow1 = " + xsMethod.invoke(l, 50000, 45000));
            System.out.println("xs.overflow2 = " + xsMethod.invoke(l, -60000, 55000));
            System.out.println("ys.overflow1 = " + ysMethod.invoke(l, 40000, 45000));
            System.out.println("ys.overflow2 = " + ysMethod.invoke(l, -70000, 55000));
        }

        // ===================================================================
        // 3. rot() 2D rotation helper
        // ===================================================================
        {
            Object m = newMedium();
            Object l = newLasers(m);
            Method rotMethod = l.getClass().getDeclaredMethod("rot", int[].class, int[].class, int.class, int.class, int.class, int.class);
            rotMethod.setAccessible(true);

            // Test k == 0 (no-op)
            int[] ai_k0 = new int[] { 10, -20, 30, -40 };
            int[] ai1_k0 = new int[] { 50, -60, 70, -80 };
            rotMethod.invoke(l, ai_k0, ai1_k0, 0, 0, 0, 4);
            System.out.println("rot.k0_ai = " + Arrays.toString(ai_k0));
            System.out.println("rot.k0_ai1 = " + Arrays.toString(ai1_k0));

            // Test k == 45 with center (0, 0)
            int[] ai_45 = new int[] { 100, -200, 300, -400 };
            int[] ai1_45 = new int[] { 150, -250, 350, -450 };
            rotMethod.invoke(l, ai_45, ai1_45, 0, 0, 45, 4);
            System.out.println("rot.k45_ai = " + Arrays.toString(ai_45));
            System.out.println("rot.k45_ai1 = " + Arrays.toString(ai1_45));

            // Test k == 120 with non-zero center (250, 150)
            int[] ai_center = new int[] { 500, -100, 250, 0 };
            int[] ai1_center = new int[] { 300, 400, 150, -200 };
            rotMethod.invoke(l, ai_center, ai1_center, 250, 150, 120, 4);
            System.out.println("rot.center_ai = " + Arrays.toString(ai_center));
            System.out.println("rot.center_ai1 = " + Arrays.toString(ai1_center));

            // Test large negative coordinates and k == 270
            int[] ai_large = new int[] { -15000, 25000, -32000, 18000 };
            int[] ai1_large = new int[] { 12000, -28000, 31000, -19000 };
            rotMethod.invoke(l, ai_large, ai1_large, -1000, 2000, 270, 4);
            System.out.println("rot.large_ai = " + Arrays.toString(ai_large));
            System.out.println("rot.large_ai1 = " + Arrays.toString(ai1_large));
        }

        // ===================================================================
        // 4. dt() 3D transform and polygon render (deterministic: l1 == 0)
        // ===================================================================
        {
            Object m = newMedium();
            Object l = newLasers(m);
            Method dtMethod = l.getClass().getDeclaredMethod("dt", Graphics.class, int[].class, int[].class, int[].class,
                    int.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class);
            dtMethod.setAccessible(true);

            BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
            RecordingGraphics g = new RecordingGraphics(img.createGraphics());

            // Case 1: Simple laser quad transformed through Medium (visible in frustum)
            int[] ai1 = new int[] { -20, 20, 20, -20 };
            int[] ai2 = new int[] { -10, -10, 10, 10 };
            int[] ai3 = new int[] { 0, 0, 100, 100 };
            dtMethod.invoke(l, g, ai1, ai2, ai3, 1000, -500, 4000, 15, 30, 45, 4, 0, 200, 255, 240);
            System.out.println("dt.case1_ai = " + Arrays.toString(ai1));
            System.out.println("dt.case1_ai1 = " + Arrays.toString(ai2));
            System.out.println("dt.case1_ai2 = " + Arrays.toString(ai3));
            System.out.println("dt.case1_draws = " + g.records.size());

            // Case 2: Negative coordinates and different angles
            int[] ai1_b = new int[] { -100, 100, 100, -100 };
            int[] ai2_b = new int[] { -50, -50, 50, 50 };
            int[] ai3_b = new int[] { -200, -200, -100, -100 };
            dtMethod.invoke(l, g, ai1_b, ai2_b, ai3_b, -500, 300, 2000, 90, 180, 270, 4, 0, 100, 150, 200);
            System.out.println("dt.case2_ai = " + Arrays.toString(ai1_b));
            System.out.println("dt.case2_ai1 = " + Arrays.toString(ai2_b));
            System.out.println("dt.case2_ai2 = " + Arrays.toString(ai3_b));

            // Case 3: Triangle (k1 = 3)
            int[] ai1_c = new int[] { 0, 30, -30 };
            int[] ai2_c = new int[] { -40, 20, 20 };
            int[] ai3_c = new int[] { 50, 50, 50 };
            dtMethod.invoke(l, g, ai1_c, ai2_c, ai3_c, 800, -200, 3000, 0, 0, 0, 3, 0, 255, 255, 255);
            System.out.println("dt.case3_ai = " + Arrays.toString(ai1_c));
            System.out.println("dt.case3_ai1 = " + Arrays.toString(ai2_c));
            System.out.println("dt.case3_ai2 = " + Arrays.toString(ai3_c));

            // Case 4: Laser rendered directly in front of camera (frustum pass)
            Object m4 = newMedium();
            setInt(m4, "x", 0);
            setInt(m4, "y", 0);
            setInt(m4, "z", 0);
            setInt(m4, "xz", 0);
            setInt(m4, "zy", 0);
            Object l4 = newLasers(m4);
            RecordingGraphics g4 = new RecordingGraphics(img.createGraphics());
            int[] ai1_d = new int[] { 240, 260, 260, 240 };
            int[] ai2_d = new int[] { 140, 140, 160, 160 };
            int[] ai3_d = new int[] { 200, 200, 200, 200 };
            dtMethod.invoke(l4, g4, ai1_d, ai2_d, ai3_d, 0, 0, 0, 0, 0, 0, 4, 0, 200, 255, 240);
            System.out.println("dt.case4_draws = " + g4.records.size());
            if (g4.records.size() > 0) {
                System.out.println("dt.case4_draw0 = " + g4.records.get(0));
            }
        }

        // ===================================================================
        // 5. d() deterministic laser drawing calls (l1 == 0, types without random)
        // ===================================================================
        {
            BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
            RecordingGraphics g = new RecordingGraphics(img.createGraphics());

            Method dMethod = Class.forName("Lasers").getDeclaredMethod("d",
                    Graphics.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class);
            dMethod.setAccessible(true);

            // Centered camera facing laser at (0,0,500)
            Object m = newMedium();
            setInt(m, "x", 0);
            setInt(m, "y", 0);
            setInt(m, "z", 0);
            setInt(m, "xz", 0);
            setInt(m, "zy", 0);
            Object l = newLasers(m);

            // Type 0 (deterministic, draws 3 polygons)
            dMethod.invoke(l, g, 0, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type0_draws = " + g.records.size());

            // Type 1 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 1, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type1_draws = " + g.records.size());

            // Type 4 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 4, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type4_draws = " + g.records.size());

            // Type 5 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 5, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type5_draws = " + g.records.size());

            // Type 6 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 6, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type6_draws = " + g.records.size());

            // Type 7 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 7, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type7_draws = " + g.records.size());

            // Type 8 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 8, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type8_draws = " + g.records.size());

            // Type 10 (deterministic)
            g.records.clear();
            dMethod.invoke(l, g, 10, 0, 0, 500, 0, 0, 0, 0);
            System.out.println("d.type10_draws = " + g.records.size());

            System.out.println("d.deterministic_types_executed = true");
        }

        // ===================================================================
        // 6. NONDETERMINISTIC paths (contain Math.random()) — NOT asserted in tests
        // ===================================================================
        {
            BufferedImage img = new BufferedImage(500, 360, BufferedImage.TYPE_INT_RGB);
            Graphics g = img.createGraphics();

            Object m = newMedium();
            Object l = newLasers(m);

            Method gsmokeMethod = l.getClass().getDeclaredMethod("gsmoke", Graphics.class, int.class, int.class, int.class, int.class, int.class, int.class);
            Method hsmokeMethod = l.getClass().getDeclaredMethod("hsmoke", Graphics.class, int.class, int.class, int.class, int.class, int.class, int.class);
            Method dMethod = l.getClass().getDeclaredMethod("d", Graphics.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class, int.class);
            gsmokeMethod.setAccessible(true);
            hsmokeMethod.setAccessible(true);
            dMethod.setAccessible(true);

            gsmokeMethod.invoke(l, g, 1000, -500, 3000, 10, 20, 1);
            hsmokeMethod.invoke(l, g, 1000, -500, 3000, 10, 20, 1);
            dMethod.invoke(l, g, 2, 1000, -500, 3000, 10, 20, 30, 0);
            dMethod.invoke(l, g, 3, 1000, -500, 3000, 10, 20, 30, 0);
            dMethod.invoke(l, g, 9, 1000, -500, 3000, 10, 20, 30, 0);
            dMethod.invoke(l, g, 11, 1000, -500, 3000, 10, 20, 30, 0);

            System.out.println("NONDETERMINISTIC.smoke_and_jitter_executed = true");
        }

        System.out.println("PROBE OK");
    }
}
