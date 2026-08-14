import java.awt.Color;
import java.awt.Graphics;

// 
// Decompiled by Procyon v0.6.0
// 

public class Plane
{
    Medium m;
    int[] ox;
    int[] oy;
    int[] oz;
    int n;
    int[] c;
    float deltaf;
    float projf;
    int av;
    int exp;
    int ofx;
    int adx;
    int ofy;
    int adz;
    int ofz;
    double ady;
    int ofcx;
    int ofcy;
    int ofcz;
    int nx;
    int ny;
    int nz;
    int ezy;
    int exy;
    int azy;
    int axy;
    int[] sx;
    int[] sy;
    int[] sz;
    int sdx;
    int sdz;
    double sdy;
    int sr;
    int sg;
    
    public void loadprojf() {
        this.projf = 1.0f;
        int i = 0;
        do {
            int j = 0;
            do {
                if (j != i) {
                    this.projf *= (float)(Math.sqrt((this.ox[i] - this.ox[j]) * (this.ox[i] - this.ox[j]) + (this.oz[i] - this.oz[j]) * (this.oz[i] - this.oz[j])) / 100.0);
                }
            } while (++j < 3);
        } while (++i < 3);
        this.projf /= 3.0f;
    }
    
    public int ys(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.m.focus_point) * (this.m.cy - i) / j + i;
    }
    
    public Plane(final Medium medium, final int[] ai, final int[] ai1, final int[] ai2, final int i, final int[] ai3) {
        this.c = new int[3];
        this.deltaf = 1.0f;
        this.projf = 1.0f;
        this.av = 0;
        this.exp = 0;
        this.ofx = 0;
        this.adx = 0;
        this.ofy = 0;
        this.adz = 0;
        this.ofz = 0;
        this.ady = 0.0;
        this.ofcx = 0;
        this.ofcy = 0;
        this.ofcz = 0;
        this.nx = 0;
        this.ny = 0;
        this.nz = 0;
        this.ezy = 0;
        this.exy = 0;
        this.azy = 0;
        this.axy = 0;
        this.sx = new int[4];
        this.sy = new int[4];
        this.sz = new int[4];
        this.sdx = 0;
        this.sdz = 0;
        this.sdy = 0.0;
        this.sr = 255;
        this.sg = 220;
        this.m = medium;
        this.n = i;
        this.ox = new int[this.n];
        this.oz = new int[this.n];
        this.oy = new int[this.n];
        for (int j = 0; j < this.n; ++j) {
            this.ox[j] = ai[j];
            this.oy[j] = ai2[j];
            this.oz[j] = ai1[j];
        }
        int k = 0;
        do {
            this.c[k] = ai3[k];
        } while (++k < 3);
        k = 0;
        do {
            int l = 0;
            do {
                if (l != k) {
                    this.deltaf *= (float)(Math.sqrt((this.ox[l] - this.ox[k]) * (this.ox[l] - this.ox[k]) + (this.oy[l] - this.oy[k]) * (this.oy[l] - this.oy[k]) + (this.oz[l] - this.oz[k]) * (this.oz[l] - this.oz[k])) / 100.0);
                }
            } while (++l < 3);
        } while (++k < 3);
        this.deltaf /= 3.0f;
    }
    
    public void d(final Graphics g, final int i, final int j, final int k, final int l, final int i1, final int j1, final boolean flag, final boolean flag1, final boolean flag2) {
        if (this.exp != 7) {
            final int[] ai = new int[this.n];
            final int[] ai2 = new int[this.n];
            final int[] ai3 = new int[this.n];
            for (int k2 = 0; k2 < this.n; ++k2) {
                ai[k2] = this.ox[k2] + i;
                ai3[k2] = this.oy[k2] + j;
                ai2[k2] = this.oz[k2] + k;
            }
            this.rot(ai, ai3, i, j, i1, this.n);
            this.rot(ai3, ai2, j, k, j1, this.n);
            this.rot(ai, ai2, i, k, l, this.n);
            if (this.exp == 2) {
                this.sdx = (int)(Math.random() * 100.0 - 50.0);
                this.sdz = (int)(Math.random() * 100.0 - 50.0);
                this.sdy = Math.random() * 100.0 - 50.0;
                this.sx[0] = this.ofcx + ai[this.nx] + 2 - i;
                this.sx[1] = this.ofcx + ai[this.nx] - 2 - i;
                this.sy[0] = this.ofcy + ai3[this.ny] + 2 - j;
                this.sy[1] = this.ofcy + ai3[this.ny] - 2 - j;
                this.sz[0] = this.ofcz + ai2[this.nx] + 2 - k;
                this.sz[1] = this.ofcz + ai2[this.nx] - 2 - k;
                this.sx[2] = this.sx[1] - this.sdx;
                this.sx[3] = this.sx[0] - this.sdx;
                this.sy[2] = (int)(this.sy[1] - this.sdy);
                this.sy[3] = (int)(this.sy[0] - this.sdy);
                this.sz[2] = this.sz[1] - this.sdz;
                this.sz[3] = this.sz[0] - this.sdz;
                this.sr = 255;
                this.sg = 220;
                this.exp = 3;
            }
            if (this.exp != 0) {
                this.ofx += this.adx;
                this.ofz += this.adz;
                this.ofy += (int)this.ady;
                for (int l2 = 0; l2 < this.n; ++l2) {
                    final int[] array = ai;
                    final int n = l2;
                    array[n] += this.ofx;
                    final int[] array2 = ai2;
                    final int n2 = l2;
                    array2[n2] += this.ofz;
                    final int[] array3 = ai3;
                    final int n3 = l2;
                    array3[n3] += this.ofy;
                }
                this.rot(ai3, ai2, this.ofcy + ai3[this.ny], this.ofcz + ai2[this.nx], this.ezy, this.n);
                this.rot(ai, ai3, this.ofcx + ai[this.nx], this.ofcy + ai3[this.ny], this.exy, this.n);
                for (int i2 = 0; i2 < this.n; ++i2) {
                    if (ai3[i2] > this.m.ground) {
                        this.exp = 7;
                    }
                }
                this.ezy += this.azy;
                this.exy += this.axy;
                this.ady += 0.5;
                if (this.sy[3] < this.m.ground) {
                    final int[] ai4 = new int[4];
                    final int[] ai5 = new int[4];
                    final int[] ai6 = new int[4];
                    int l3 = 0;
                    do {
                        if (this.exp < 6) {
                            ai4[l3] = this.sx[l3] + i + (int)(Math.random() * 50.0 - 25.0);
                            ai5[l3] = this.sy[l3] + j + (int)(Math.random() * 50.0 - 25.0);
                            ai6[l3] = this.sz[l3] + k + (int)(Math.random() * 50.0 - 25.0);
                            if (this.exp >= 4) {
                                ++this.exp;
                            }
                        }
                        else {
                            ai4[l3] = this.sx[l3] + i;
                            ai5[l3] = this.sy[l3] + j;
                            ai6[l3] = this.sz[l3] + k;
                        }
                        final int[] sx = this.sx;
                        final int n4 = l3;
                        sx[n4] += this.sdx;
                        final int[] sy = this.sy;
                        final int n5 = l3;
                        sy[n5] += (int)this.sdy;
                        final int[] sz = this.sz;
                        final int n6 = l3;
                        sz[n6] += this.sdz;
                    } while (++l3 < 4);
                    this.sdy += 0.5;
                    this.rot(ai4, ai6, this.m.cx, this.m.cz, this.m.xz, 4);
                    this.rot(ai5, ai6, this.m.cy, this.m.cz, this.m.zy, 4);
                    final int[] ai7 = new int[4];
                    final int[] ai8 = new int[4];
                    boolean flag3 = false;
                    int i3 = 0;
                    do {
                        ai7[i3] = this.xs(ai4[i3], ai6[i3]);
                        ai8[i3] = this.ys(ai5[i3], ai6[i3]);
                        if (ai8[i3] > 0 && ai8[i3] < this.m.h && ai7[i3] > 0 && ai7[i3] < this.m.w && ai6[i3] > 10 && ai5[i3] < this.m.ground) {
                            flag3 = true;
                        }
                    } while (++i3 < 4);
                    if (flag3 && this.sr > 111) {
                        g.setColor(new Color(this.sr, this.sg, 111));
                        if (this.exp == 3) {
                            g.setColor(new Color(255, 255, 255));
                            this.exp = 4;
                        }
                        g.fillPolygon(ai7, ai8, 4);
                        if (this.sr > 111) {
                            this.sr -= 2;
                        }
                        if (this.sg > 111) {
                            this.sg -= 2;
                        }
                    }
                }
            }
            if (i1 != 0 || j1 != 0 || this.exp != 0 || l != 0) {
                this.projf = 1.0f;
                int j2 = 0;
                do {
                    int k3 = 0;
                    do {
                        if (k3 != j2) {
                            this.projf *= (float)(Math.sqrt((ai[j2] - ai[k3]) * (ai[j2] - ai[k3]) + (ai2[j2] - ai2[k3]) * (ai2[j2] - ai2[k3])) / 100.0);
                        }
                    } while (++k3 < 3);
                } while (++j2 < 3);
                this.projf /= 3.0f;
            }
            this.rot(ai, ai2, this.m.cx, this.m.cz, this.m.xz, this.n);
            boolean flag4 = false;
            final int[] ai9 = new int[this.n];
            final int[] ai10 = new int[this.n];
            int i4 = 500;
            for (int j3 = 0; j3 < this.n; ++j3) {
                ai9[j3] = this.xs(ai[j3], ai2[j3]);
                ai10[j3] = this.ys(ai3[j3], ai2[j3]);
            }
            int k4 = 0;
            int l4 = 1;
            for (int j4 = 0; j4 < this.n; ++j4) {
                for (int i5 = 0; i5 < this.n; ++i5) {
                    if (j4 != i5 && Math.abs(ai9[j4] - ai9[i5]) - Math.abs(ai10[j4] - ai10[i5]) < i4) {
                        l4 = j4;
                        k4 = i5;
                        i4 = Math.abs(ai9[j4] - ai9[i5]) - Math.abs(ai10[j4] - ai10[i5]);
                    }
                }
            }
            if (ai10[k4] < ai10[l4]) {
                final int k5 = k4;
                k4 = l4;
                l4 = k5;
            }
            if (this.spy(ai[k4], ai2[k4]) > this.spy(ai[l4], ai2[l4])) {
                flag4 = true;
                int l5 = 0;
                for (int j5 = 0; j5 < this.n; ++j5) {
                    if (ai2[j5] < 50 && ai3[j5] > this.m.cy) {
                        flag4 = false;
                    }
                    else if (ai3[j5] == ai3[0]) {
                        ++l5;
                    }
                }
                if (l5 == this.n && ai3[0] > this.m.cy) {
                    flag4 = false;
                }
            }
            this.rot(ai3, ai2, this.m.cy, this.m.cz, this.m.zy, this.n);
            boolean flag5 = true;
            boolean flag6 = false;
            final int[] ai11 = new int[this.n];
            final int[] ai12 = new int[this.n];
            int k6 = 0;
            int l6 = 0;
            int i6 = 0;
            int j6 = 0;
            int k7 = 0;
            for (int l7 = 0; l7 < this.n; ++l7) {
                ai11[l7] = this.xs(ai[l7], ai2[l7]);
                ai12[l7] = this.ys(ai3[l7], ai2[l7]);
                if (ai12[l7] < 0 || ai2[l7] < 10) {
                    ++k6;
                }
                if (ai12[l7] > this.m.h || ai2[l7] < 10) {
                    ++l6;
                }
                if (ai11[l7] < 0 || ai2[l7] < 10) {
                    ++i6;
                }
                if (ai11[l7] > this.m.w || ai2[l7] < 10) {
                    ++j6;
                }
                if (ai2[l7] > 50000) {
                    ++k7;
                }
            }
            if (i6 == this.n || k6 == this.n || l6 == this.n || j6 == this.n || k7 == this.n) {
                flag5 = false;
            }
            if (i6 != 0 || k6 != 0 || l6 != 0 || j6 != 0 || ai2[0] > 2000) {
                flag6 = true;
            }
            if (flag5) {
                float f = (float)(this.projf / this.deltaf + 0.5);
                if (f > 1.2) {
                    f = 1.2f;
                }
                if (!flag2) {
                    if (f < 0.5 || flag4) {
                        f = 0.5f;
                    }
                }
                else if (f < 0.9 || flag4) {
                    f = 0.9f;
                }
                int j7;
                int k8;
                int l8;
                if (!flag) {
                    if (this.m.er == 0) {
                        j7 = (int)(this.c[0] * f);
                    }
                    else {
                        j7 = this.c[0];
                    }
                    if (j7 > 225) {
                        j7 = 225;
                    }
                    if (this.m.eg == 0) {
                        k8 = (int)(this.c[1] * f);
                    }
                    else {
                        k8 = this.c[1];
                    }
                    if (k8 > 225) {
                        k8 = 225;
                    }
                    if (this.m.eb == 0) {
                        l8 = (int)(this.c[2] * f);
                    }
                    else {
                        l8 = this.c[2];
                    }
                    if (l8 > 225) {
                        l8 = 225;
                    }
                }
                else {
                    j7 = (int)(400.0f * f);
                    if (j7 > 255) {
                        j7 = 255;
                    }
                    k8 = (int)(400.0f * f);
                    if (k8 > 255) {
                        k8 = 255;
                    }
                    l8 = (int)(400.0f * f);
                    if (l8 > 255) {
                        l8 = 255;
                    }
                }
                g.setColor(new Color(j7, k8, l8));
                if (!flag1) {
                    g.fillPolygon(ai11, ai12, this.n);
                }
                if (!flag6) {
                    if (!flag1) {
                        j7 -= 15;
                        if (j7 < 0) {
                            j7 = 0;
                        }
                        k8 -= 15;
                        if (k8 < 0) {
                            k8 = 0;
                        }
                        l8 -= 15;
                        if (l8 < 0) {
                            l8 = 0;
                        }
                        g.setColor(new Color(j7, k8, l8));
                    }
                    else {
                        g.setColor(new Color(j7 / 2, (k8 + 255) / 2, l8 / 2));
                    }
                    g.drawPolygon(ai11, ai12, this.n);
                }
            }
            this.av = 0;
            for (int i7 = 0; i7 < this.n; ++i7) {
                this.av += (int)Math.sqrt((this.m.cy - ai12[i7]) * (this.m.cy - ai12[i7]) + (this.m.cx - ai11[i7]) * (this.m.cx - ai11[i7]) + ai2[i7] * ai2[i7]);
            }
            this.av /= this.n;
        }
    }
    
    public void rot(final int[] ai, final int[] ai1, final int i, final int j, final int k, final int l) {
        if (k != 0) {
            for (int i2 = 0; i2 < l; ++i2) {
                final int j2 = ai[i2];
                final int k2 = ai1[i2];
                ai[i2] = i + (int)((j2 - i) * this.m.cs.getcos(k) - (k2 - j) * this.m.cs.getsin(k));
                ai1[i2] = j + (int)((j2 - i) * this.m.cs.getsin(k) + (k2 - j) * this.m.cs.getcos(k));
            }
        }
    }
    
    public int xs(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.m.focus_point) * (this.m.cx - i) / j + i;
    }
    
    public void s(final Graphics g, final int i, final int j, final int k, final int l, final int i1, final int j1, final boolean flag) {
        if (this.exp != 7) {
            final int[] ai = new int[this.n];
            final int[] ai2 = new int[this.n];
            final int[] ai3 = new int[this.n];
            for (int k2 = 0; k2 < this.n; ++k2) {
                ai[k2] = this.ox[k2] + i;
                ai3[k2] = this.oy[k2] + j;
                ai2[k2] = this.oz[k2] + k;
            }
            this.rot(ai, ai3, i, j, i1, this.n);
            this.rot(ai3, ai2, j, k, j1, this.n);
            this.rot(ai, ai2, i, k, l, this.n);
            if (this.exp == 1) {
                this.adx = (int)(Math.random() * 30.0 - 15.0);
                this.adz = (int)(Math.random() * 30.0 - 15.0);
                this.ady = -(Math.random() * 20.0);
                this.ofcx = (int)(Math.random() * 10.0 - 5.0);
                this.ofcy = (int)(Math.random() * 10.0 - 5.0);
                this.ofcz = (int)(Math.random() * 10.0 - 5.0);
                this.nx = (int)(Math.random() * this.n);
                this.ny = (int)(Math.random() * this.n);
                this.nz = (int)(Math.random() * this.n);
                this.azy = (int)(Math.random() * 30.0 - 15.0);
                this.axy = (int)(Math.random() * 30.0 - 15.0);
                this.exy = 0;
                this.ezy = 0;
                this.ofx = 0;
                this.ofy = 0;
                this.ofz = 0;
                this.exp = 2;
            }
            if (this.exp != 0) {
                this.ofx += this.adx;
                this.ofz += this.adz;
                this.ofy += (int)this.ady;
                for (int l2 = 0; l2 < this.n; ++l2) {
                    final int[] array = ai;
                    final int n = l2;
                    array[n] += this.ofx;
                    final int[] array2 = ai2;
                    final int n2 = l2;
                    array2[n2] += this.ofz;
                    final int[] array3 = ai3;
                    final int n3 = l2;
                    array3[n3] += this.ofy;
                }
                this.rot(ai3, ai2, this.ofcy + ai3[this.ny], this.ofcz + ai2[this.nz], this.ezy, this.n);
                this.rot(ai, ai3, this.ofcx + ai[this.nx], this.ofcy + ai3[this.nx], this.exy, this.n);
            }
            int i2 = 0;
            for (int j2 = 0; j2 < this.n; ++j2) {
                if (ai3[j2] >= this.m.ground) {
                    ++i2;
                }
                else {
                    ai3[j2] = this.m.ground;
                }
            }
            if (i2 != this.n) {
                this.rot(ai, ai2, this.m.cx, this.m.cz, this.m.xz, this.n);
                this.rot(ai3, ai2, this.m.cy, this.m.cz, this.m.zy, this.n);
                boolean flag2 = false;
                final int[] ai4 = new int[this.n];
                final int[] ai5 = new int[this.n];
                for (int k3 = 0; k3 < this.n; ++k3) {
                    ai4[k3] = this.xs(ai[k3], ai2[k3]);
                    ai5[k3] = this.ys(ai3[k3], ai2[k3]);
                    if (ai5[k3] > 0 && ai5[k3] < this.m.h && ai4[k3] > 0 && ai4[k3] < this.m.w && ai2[k3] > 10 && ai2[k3] < 50000) {
                        flag2 = true;
                    }
                }
                if (flag2) {
                    if (!flag) {
                        g.setColor(new Color(60, 54, 42));
                    }
                    else {
                        g.setColor(new Color(60, 60, 60));
                    }
                    g.fillPolygon(ai4, ai5, this.n);
                }
            }
        }
    }
    
    public int spy(final int i, final int j) {
        return (int)Math.sqrt((i - this.m.cx) * (i - this.m.cx) + j * j);
    }
}
