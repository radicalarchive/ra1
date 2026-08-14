import java.awt.Graphics;
import java.io.InputStream;
import java.io.DataInputStream;
import java.io.ByteArrayInputStream;

// 
// Decompiled by Procyon v0.6.0
// 

public class ContO
{
    Medium m;
    Plane[] p;
    int npl;
    int x;
    int y;
    int z;
    int xz;
    int xy;
    int zy;
    int dist;
    int maxR;
    int disp;
    boolean shadow;
    boolean loom;
    int grounded;
    boolean colides;
    int rcol;
    int pcol;
    boolean out;
    boolean fire;
    boolean hit;
    int nhits;
    int maxhits;
    boolean wire;
    boolean exp;
    
    public int ys(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.m.focus_point) * (this.m.cy - i) / j + i;
    }
    
    public void reset() {
        this.exp = false;
        this.nhits = 0;
        this.xz = 0;
        this.xy = 0;
        this.zy = 0;
    }
    
    public ContO(final byte[] abyte0, final Medium medium, final int i, final int j, final int k) {
        this.npl = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.xz = 0;
        this.xy = 0;
        this.zy = 0;
        this.dist = 0;
        this.maxR = 0;
        this.disp = 0;
        this.shadow = false;
        this.loom = false;
        this.grounded = 1;
        this.colides = false;
        this.rcol = 0;
        this.pcol = 0;
        this.out = false;
        this.fire = false;
        this.hit = false;
        this.nhits = 0;
        this.maxhits = -1;
        this.wire = false;
        this.exp = false;
        this.m = medium;
        this.p = new Plane[100];
        this.x = i;
        this.y = j;
        this.z = k;
        boolean flag = false;
        int l = 0;
        float f = 1.0f;
        final int[] ai = new int[100];
        final int[] ai2 = new int[100];
        final int[] ai3 = new int[100];
        final int[] ai4 = { 50, 50, 50 };
        try {
            final DataInputStream datainputstream = new DataInputStream(new ByteArrayInputStream(abyte0));
            String s;
            while ((s = datainputstream.readLine()) != null) {
                final String s2 = "" + s.trim();
                if (s2.startsWith("<p>")) {
                    flag = true;
                    l = 0;
                }
                if (flag) {
                    if (s2.startsWith("c")) {
                        ai4[0] = this.getvalue("c", s2, 0);
                        ai4[1] = this.getvalue("c", s2, 1);
                        ai4[2] = this.getvalue("c", s2, 2);
                    }
                    if (s2.startsWith("p")) {
                        ai[l] = (int)(this.getvalue("p", s2, 0) * f);
                        ai2[l] = (int)(this.getvalue("p", s2, 1) * f);
                        ai3[l] = (int)(this.getvalue("p", s2, 2) * f);
                        ++l;
                    }
                }
                if (s2.startsWith("</p>")) {
                    this.p[this.npl] = new Plane(this.m, ai, ai3, ai2, l, ai4);
                    ++this.npl;
                    flag = false;
                }
                if (s2.startsWith("MaxRadius")) {
                    this.maxR = this.getvalue("MaxRadius", s2, 0);
                }
                if (s2.startsWith("disp")) {
                    this.disp = this.getvalue("disp", s2, 0);
                }
                if (s2.startsWith("shadow")) {
                    this.shadow = true;
                }
                if (s2.startsWith("loom")) {
                    this.loom = true;
                }
                if (s2.startsWith("out")) {
                    this.out = true;
                }
                if (s2.startsWith("hits")) {
                    this.maxhits = this.getvalue("hits", s2, 0);
                }
                if (s2.startsWith("colid")) {
                    this.colides = true;
                    this.rcol = this.getvalue("colid", s2, 0);
                    this.pcol = this.getvalue("colid", s2, 1);
                }
                if (s2.startsWith("grounded")) {
                    this.grounded = this.getvalue("grounded", s2, 0);
                }
                if (s2.startsWith("div")) {
                    f = this.getvalue("div", s2, 0) / 10.0f;
                }
            }
            datainputstream.close();
        }
        catch (final Exception ex) {}
    }
    
    public ContO(final Medium medium, final ContO conto, final int i, final int j, final int k) {
        this.npl = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.xz = 0;
        this.xy = 0;
        this.zy = 0;
        this.dist = 0;
        this.maxR = 0;
        this.disp = 0;
        this.shadow = false;
        this.loom = false;
        this.grounded = 1;
        this.colides = false;
        this.rcol = 0;
        this.pcol = 0;
        this.out = false;
        this.fire = false;
        this.hit = false;
        this.nhits = 0;
        this.maxhits = -1;
        this.wire = false;
        this.exp = false;
        this.m = medium;
        this.npl = conto.npl;
        this.maxR = conto.maxR;
        this.disp = conto.disp;
        this.loom = conto.loom;
        this.colides = conto.colides;
        this.maxhits = conto.maxhits;
        this.out = conto.out;
        this.rcol = conto.rcol;
        this.pcol = conto.pcol;
        this.shadow = conto.shadow;
        this.grounded = conto.grounded;
        this.p = new Plane[conto.npl];
        this.x = i;
        this.y = j;
        this.z = k;
        for (int l = 0; l < this.npl; ++l) {
            this.p[l] = new Plane(this.m, conto.p[l].ox, conto.p[l].oz, conto.p[l].oy, conto.p[l].n, conto.p[l].c);
        }
    }
    
    public void d(final Graphics g) {
        if (this.dist != 0) {
            this.dist = 0;
        }
        int i = 0;
        for (int j = 0; j < this.npl; ++j) {
            if (!this.exp) {
                if (this.p[j].exp != 0) {
                    this.p[j].exp = 0;
                }
            }
            else if (this.p[j].exp == 0) {
                this.p[j].exp = 1;
            }
            else if (this.p[j].exp == 7) {
                ++i;
            }
        }
        if (!this.out && i != this.npl) {
            if (this.fire) {
                this.dist = 1;
            }
            final int k = this.m.cx + (int)((this.x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz) - (this.z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz));
            final int l = this.m.cz + (int)((this.x - this.m.x - this.m.cx) * this.m.cs.getsin(this.m.xz) + (this.z - this.m.z - this.m.cz) * this.m.cs.getcos(this.m.xz));
            final int i2 = this.m.cz + (int)((this.y - this.m.y - this.m.cy) * this.m.cs.getsin(this.m.zy) + (l - this.m.cz) * this.m.cs.getcos(this.m.zy));
            if ((this.xs(k + this.maxR, i2) > 0 && this.xs(k - this.maxR, i2) < this.m.w && i2 > -this.maxR && i2 < 50000 && this.xs(k + this.maxR, i2) - this.xs(k - this.maxR, i2) > this.disp) || this.exp) {
                if (this.shadow || this.exp) {
                    final int j2 = this.m.cy + (int)((this.m.ground - this.m.cy) * this.m.cs.getcos(this.m.zy) - (l - this.m.cz) * this.m.cs.getsin(this.m.zy));
                    final int l2 = this.m.cz + (int)((this.m.ground - this.m.cy) * this.m.cs.getsin(this.m.zy) + (l - this.m.cz) * this.m.cs.getcos(this.m.zy));
                    if ((this.ys(j2 + this.maxR, l2) > 0 && this.ys(j2 - this.maxR, l2) < this.m.h) || this.exp) {
                        for (int i3 = 0; i3 < this.npl; ++i3) {
                            this.p[i3].s(g, this.x - this.m.x, this.y - this.m.y, this.z - this.m.z, this.xz, this.xy, this.zy, this.loom);
                        }
                    }
                }
                final int k2 = this.m.cy + (int)((this.y - this.m.y - this.m.cy) * this.m.cs.getcos(this.m.zy) - (l - this.m.cz) * this.m.cs.getsin(this.m.zy));
                if ((this.ys(k2 + this.maxR, i2) > 0 && this.ys(k2 - this.maxR, i2) < this.m.h) || this.exp) {
                    if (this.m.jumping != 0 && this.m.jumping < 4) {
                        this.hit = true;
                    }
                    final int[] ai = new int[this.npl];
                    for (int j3 = 0; j3 < this.npl; ++j3) {
                        ai[j3] = 0;
                        for (int l3 = 0; l3 < this.npl; ++l3) {
                            if (this.p[j3].av != this.p[l3].av) {
                                if (this.p[j3].av < this.p[l3].av) {
                                    final int[] array = ai;
                                    final int n = j3;
                                    ++array[n];
                                }
                            }
                            else if (j3 > l3) {
                                final int[] array2 = ai;
                                final int n2 = j3;
                                ++array2[n2];
                            }
                        }
                    }
                    for (int k3 = 0; k3 < this.npl; ++k3) {
                        for (int i4 = 0; i4 < this.npl; ++i4) {
                            if (ai[i4] == k3) {
                                this.p[i4].d(g, this.x - this.m.x, this.y - this.m.y, this.z - this.m.z, this.xz, this.xy, this.zy, this.hit, this.wire, this.loom);
                            }
                        }
                    }
                    this.dist = (int)Math.sqrt((int)Math.sqrt((this.m.x + this.m.cx - this.x) * (this.m.x + this.m.cx - this.x) + (this.m.z - this.z) * (this.m.z - this.z) + (this.m.y + this.m.cy - this.y) * (this.m.y + this.m.cy - this.y))) * this.grounded;
                }
            }
        }
        if (this.hit) {
            this.hit = false;
            if (this.m.jumping == 0 && this.nhits > this.maxhits) {
                this.exp = true;
            }
        }
    }
    
    public void tryexp(final ContO conto) {
        if (!conto.exp && !this.out && !this.exp) {
            final int i = this.getpy(conto.x, conto.y, conto.z);
            if (i < this.maxR / 10 * (this.maxR / 10) + conto.maxR / 10 * (conto.maxR / 10) && i > 0) {
                if (this.pcol != 0) {
                    for (int j = 0; j < this.npl; ++j) {
                        for (int k = 0; k < this.p[j].n; ++k) {
                            if ((conto.x - (this.x + this.p[j].ox[k])) * (conto.x - (this.x + this.p[j].ox[k])) + (conto.y - (this.y + this.p[j].oy[k])) * (conto.y - (this.y + this.p[j].oy[k])) + (conto.z - (this.z + this.p[j].oz[k])) * (conto.z - (this.z + this.p[j].oz[k])) < conto.maxR * 10 / this.pcol * (conto.maxR * 10 / this.pcol)) {
                                conto.exp = true;
                                break;
                            }
                        }
                    }
                }
                if (this.rcol != 0 && i < this.maxR / (10 * this.rcol) * (this.maxR / (10 * this.rcol)) + conto.maxR / 10 * (conto.maxR / 10)) {
                    conto.exp = true;
                }
            }
        }
    }
    
    public int getpy(final int i, final int j, final int k) {
        return (i - this.x) / 10 * ((i - this.x) / 10) + (j - this.y) / 10 * ((j - this.y) / 10) + (k - this.z) / 10 * ((k - this.z) / 10);
    }
    
    public void loadrots(final boolean flag) {
        if (!flag) {
            this.reset();
        }
        for (int i = 0; i < this.npl; ++i) {
            this.p[i].rot(this.p[i].ox, this.p[i].oy, 0, 0, this.xy, this.p[i].n);
            this.p[i].rot(this.p[i].oy, this.p[i].oz, 0, 0, this.zy, this.p[i].n);
            this.p[i].rot(this.p[i].ox, this.p[i].oz, 0, 0, this.xz, this.p[i].n);
            this.p[i].loadprojf();
        }
        if (flag) {
            this.reset();
        }
    }
    
    public int getvalue(final String s, final String s1, final int i) {
        int k = 0;
        String s2 = "";
        for (int j = s.length() + 1; j < s1.length(); ++j) {
            final String s3 = "" + s1.charAt(j);
            if (s3.equals(",") || s3.equals(")")) {
                ++k;
                ++j;
            }
            if (k == i) {
                s2 += s1.charAt(j);
            }
        }
        return Integer.valueOf(s2);
    }
    
    public int xs(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.m.focus_point) * (this.m.cx - i) / j + i;
    }
}
