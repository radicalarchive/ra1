import java.awt.Color;
import java.awt.Graphics;

// 
// Decompiled by Procyon v0.6.0
// 

public class Medium
{
    boolean isun;
    SinCos cs;
    int focus_point;
    int ground;
    int er;
    int eg;
    int eb;
    int jumping;
    int cx;
    int cy;
    int cz;
    int xz;
    int zy;
    int x;
    int y;
    int z;
    int w;
    int h;
    int tart;
    int yart;
    int zart;
    int ztgo;
    boolean td;
    int vxz;
    int adv;
    boolean vert;
    
    public int ys(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.focus_point) * (this.cy - i) / j + i;
    }
    
    public void infront(final ContO conto) {
        int i = conto.zy;
        int j = conto.xz;
        while (i > 360) {
            i -= 360;
        }
        while (i < 0) {
            i += 360;
        }
        if (i > 90 && i < 270) {
            this.tart += (180 - this.tart) / 3;
            this.yart += (100 - this.yart) / 3;
        }
        else {
            this.tart -= this.tart / 3;
            this.yart += (-100 - this.yart) / 3;
        }
        j += this.tart;
        if (i > 90) {
            i = 180 - i;
        }
        if (i < -90) {
            i = -180 - i;
        }
        final int k = conto.y + (int)((conto.y + this.yart - conto.y) * this.cs.getcos(conto.zy) - (conto.z + 800 - conto.z) * this.cs.getsin(conto.zy));
        final int l = conto.z + (int)((conto.y + this.yart - conto.y) * this.cs.getsin(conto.zy) + (conto.z + 800 - conto.z) * this.cs.getcos(conto.zy));
        final int i2 = conto.x + (int)(-(l - conto.z) * this.cs.getsin(conto.xz));
        final int j2 = conto.z + (int)((l - conto.z) * this.cs.getcos(conto.xz));
        this.zy = i;
        this.xz = -(j + 180);
        this.x += (i2 - this.cx - this.x) / 3;
        this.z += (int)((j2 - this.cz - this.z) / 1.5);
        this.y += (int)((k - this.cy - this.y) / 1.5);
    }
    
    public Medium() {
        this.isun = false;
        this.cs = new SinCos();
        this.focus_point = 400;
        this.ground = 250;
        this.er = 0;
        this.eg = 0;
        this.eb = 0;
        this.jumping = 0;
        this.cx = 250;
        this.cy = 150;
        this.cz = 50;
        this.xz = 0;
        this.zy = 0;
        this.x = 3000;
        this.y = -1000;
        this.z = -2000;
        this.w = 500;
        this.h = 360;
        this.tart = 0;
        this.yart = -100;
        this.zart = 0;
        this.ztgo = 0;
        this.td = false;
        this.vxz = 0;
        this.adv = -500;
        this.vert = false;
    }
    
    public void d(final Graphics g) {
        if (this.zy > 90) {
            this.zy = 90;
        }
        if (this.zy < -90) {
            this.zy = -90;
        }
        if (this.y > 0) {
            this.y = 0;
        }
        this.ground = 250 - this.y;
        int i = 70000;
        int j = 250;
        if (this.zy != 0) {
            j = this.cy + (int)((250 - this.cy) * this.cs.getcos(this.zy) - (70000 - this.cz) * this.cs.getsin(this.zy));
            i = this.cz + (int)((250 - this.cy) * this.cs.getsin(this.zy) + (70000 - this.cz) * this.cs.getcos(this.zy));
        }
        final int[] ai = new int[4];
        final int[] ai2 = new int[4];
        ai2[ai[0] = 0] = 0;
        ai[1] = this.w;
        ai2[1] = 0;
        ai[2] = this.w;
        ai2[2] = this.ys(j, i);
        if (ai2[2] > this.h) {
            ai2[2] = this.h;
        }
        ai[3] = 0;
        ai2[3] = ai2[2];
        if (ai2[2] > 0) {
            if (this.jumping != 0) {
                if (this.jumping == 3) {
                    ai2[2] = this.h;
                    ai2[3] = this.h;
                    g.setColor(new Color(240, 240, 240));
                    g.fillPolygon(ai, ai2, 4);
                }
            }
            else {
                if (!this.isun) {
                    g.setColor(new Color(159 + 52 * this.er, 180 + 56 * this.eg, 189 + 58 * this.eb));
                }
                else {
                    g.setColor(new Color(159 + 52 * this.er, 176 + 56 * this.eg, 191 + 58 * this.eb));
                }
                g.fillPolygon(ai, ai2, 4);
            }
        }
        ai[0] = -1;
        ai2[0] = this.ys(j, i);
        if (ai2[0] < 0) {
            ai2[0] = -1;
        }
        ai[1] = -1;
        ai2[1] = this.h;
        ai[2] = this.w;
        ai2[2] = this.h;
        ai[3] = this.w;
        ai2[3] = ai2[0];
        if (ai2[0] < this.h && this.jumping == 0) {
            if (!this.isun) {
                g.setColor(new Color(177 + 55 * this.er, 154 + 50 * this.eg, 120 + 44 * this.eb));
            }
            else {
                g.setColor(new Color(175 + 55 * this.er, 151 + 50 * this.eg, 112 + 44 * this.eb));
            }
            g.fillPolygon(ai, ai2, 4);
            ai[1] = -1;
            ai2[1] = ai2[0];
            ai[0] = -1;
            final int[] array = ai2;
            final int n = 0;
            array[n] -= 3;
            ai[2] = this.w;
            ai2[2] = ai2[1];
            ai[3] = this.w;
            ai2[3] = ai2[0];
            if (!this.isun) {
                g.setColor(new Color(169 + 55 * this.er, 171 + 50 * this.eg, 160 + 44 * this.eb));
            }
            else {
                g.setColor(new Color(167 + 55 * this.er, 164 + 50 * this.eg, 151 + 44 * this.eb));
            }
            g.fillPolygon(ai, ai2, 4);
        }
        if (this.jumping != 0) {
            --this.jumping;
        }
    }
    
    public void watch(final ContO conto) {
        if (!this.td) {
            this.y = conto.y + (int)((conto.y - 300 - conto.y) * this.cs.getcos(conto.zy) - (conto.z + 3000 - conto.z) * this.cs.getsin(conto.zy));
            final int i = conto.z + (int)((conto.y - 300 - conto.y) * this.cs.getsin(conto.zy) + (conto.z + 3000 - conto.z) * this.cs.getcos(conto.zy));
            this.x = conto.x + (int)((conto.x + 400 - conto.x) * this.cs.getcos(conto.xz) - (i - conto.z) * this.cs.getsin(conto.xz));
            this.z = conto.z + (int)((conto.x + 400 - conto.x) * this.cs.getsin(conto.xz) + (i - conto.z) * this.cs.getcos(conto.xz));
            this.td = true;
        }
        char c = '\0';
        if (conto.x - this.x - this.cx > 0) {
            c = '´';
        }
        final int j = -(int)('Z' + c + Math.atan((conto.z - this.z) / (double)(conto.x - this.x - this.cx)) / 0.017453292519943295);
        c = '\0';
        if (conto.y - this.y - this.cy < 0) {
            c = '\uff4c';
        }
        final int k = (int)Math.sqrt((conto.z - this.z) * (conto.z - this.z) + (conto.x - this.x - this.cx) * (conto.x - this.x - this.cx));
        final int l = (int)('Z' + c - Math.atan(k / (double)(conto.y - this.y - this.cy)) / 0.017453292519943295);
        this.xz = j;
        this.zy += (l - this.zy) / 5;
        if ((int)Math.sqrt((conto.z - this.z) * (conto.z - this.z) + (conto.x - this.x - this.cx) * (conto.x - this.x - this.cx) + (conto.y - this.y - this.cy) * (conto.y - this.y - this.cy)) > 3500) {
            this.td = false;
        }
    }
    
    public void around(final ContO conto, final int i) {
        byte byte0 = 1;
        if (i == 6000) {
            byte0 = 2;
        }
        this.y = conto.y + this.adv;
        this.x = conto.x + (int)((conto.x - i + this.adv * byte0 - conto.x) * this.cs.getcos(this.vxz));
        this.z = conto.z + (int)((conto.x - i + this.adv * byte0 - conto.x) * this.cs.getsin(this.vxz));
        if (i == 6000) {
            if (!this.vert) {
                this.adv -= 10;
            }
            else {
                this.adv += 10;
            }
            if (this.adv < -900) {
                this.vert = true;
            }
            if (this.adv > 1200) {
                this.vert = false;
            }
        }
        else {
            if (!this.vert) {
                this.adv -= 2;
            }
            else {
                this.adv += 2;
            }
            if (this.adv < -500) {
                this.vert = true;
            }
            if (this.adv > 150) {
                this.vert = false;
            }
            if (this.adv > 300) {
                this.adv = 300;
            }
        }
        this.vxz += 2;
        if (this.vxz > 360) {
            this.vxz -= 360;
        }
        char c = '\0';
        int j = this.y;
        if (j > 0) {
            j = 0;
        }
        if (conto.y - j - this.cy < 0) {
            c = '\uff4c';
        }
        final int k = (int)Math.sqrt((conto.z - this.z) * (conto.z - this.z) + (conto.x - this.x - this.cx) * (conto.x - this.x - this.cx));
        final int l = (int)('Z' + c - Math.atan(k / (double)(conto.y - j - this.cy)) / 0.017453292519943295);
        this.xz = -this.vxz + 90;
        this.zy += (l - this.zy) / 10;
    }
    
    public void left(final ContO conto) {
        final int i = conto.y;
        final int j = conto.x + (int)((conto.x + 600 - conto.x) * this.cs.getcos(conto.xz));
        final int k = conto.z + (int)((conto.x + 600 - conto.x) * this.cs.getsin(conto.xz));
        this.zy = 0;
        this.xz = -(conto.xz + 90);
        this.x += (int)((j - this.cx - this.x) / 1.5);
        this.z += (int)((k - this.cz - this.z) / 1.5);
        this.y += (int)((i - this.cy - this.y) / 1.5);
    }
    
    public void right(final ContO conto) {
        final int i = conto.y;
        final int j = conto.x + (int)((conto.x - 600 - conto.x) * this.cs.getcos(conto.xz));
        final int k = conto.z + (int)((conto.x - 600 - conto.x) * this.cs.getsin(conto.xz));
        this.zy = 0;
        this.xz = -(conto.xz - 90);
        this.x += (j - this.cx - this.x) / 3;
        this.z += (int)((k - this.cz - this.z) / 1.5);
        this.y += (int)((i - this.cy - this.y) / 1.5);
    }
    
    public void behinde(final ContO conto) {
        int i = conto.zy;
        int j = conto.xz;
        while (i > 360) {
            i -= 360;
        }
        while (i < 0) {
            i += 360;
        }
        if (i > 90 && i < 270) {
            this.tart += (180 - this.tart) / 3;
            this.yart += (100 - this.yart) / 4;
        }
        else {
            this.tart -= this.tart / 3;
            this.yart += (-100 - this.yart) / 4;
        }
        j += this.tart;
        if (i > 90) {
            i = 180 - i;
        }
        if (i < -90) {
            i = -180 - i;
        }
        final int k = conto.y + (int)((conto.y + this.yart - conto.y) * this.cs.getcos(conto.zy) - (conto.z - 600 - conto.z) * this.cs.getsin(conto.zy));
        final int l = conto.z + (int)((conto.y + this.yart - conto.y) * this.cs.getsin(conto.zy) + (conto.z - 600 - conto.z) * this.cs.getcos(conto.zy));
        final int i2 = conto.x + (int)(-(l - conto.z) * this.cs.getsin(conto.xz));
        final int j2 = conto.z + (int)((l - conto.z) * this.cs.getcos(conto.xz));
        this.zy = -i;
        this.xz = -j;
        this.x += (i2 - this.cx - this.x) / 3;
        this.z += (int)((j2 - this.cz - this.z) / 1.5);
        this.y += (int)((k - this.cy - this.y) / 1.5);
    }
}
