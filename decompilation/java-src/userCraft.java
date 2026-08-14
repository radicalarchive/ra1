import java.awt.Graphics;

// 
// Decompiled by Procyon v0.6.0
// 

public class userCraft
{
    int rspeed;
    float speed;
    int rlift;
    double lift;
    boolean pexp;
    int ltyp;
    int[] maxspeed;
    int[] elev;
    int[] trnn;
    int[] dnjm;
    String[] name;
    int njumps;
    int ester;
    int[] lx;
    int[] ly;
    int[] lz;
    int[] lxz;
    int[] lzy;
    int[] lxy;
    int[] lstage;
    int[] lspeed;
    int[] lhit;
    int nl;
    Lasers lsr;
    boolean skip;
    int bulkc;
    int[] sms;
    int[] sx;
    int[] sy;
    int[] sz;
    int[] sxz;
    int[] szy;
    int ns;
    boolean smoke;
    int[] dms;
    int[] dx;
    int[] dy;
    int[] dz;
    int[] dxz;
    int[] dzy;
    int nd;
    
    public void preform(final Control control, final ContO conto, final ContO[] aconto, final int[] ai, final int i) {
        int j;
        for (j = Math.abs(conto.zy); j > 360; j -= 360) {}
        byte byte0 = 1;
        if (j > 90 && j < 270) {
            byte0 = -1;
        }
        if (conto.y < 207) {
            if (control.up) {
                conto.zy -= (int)((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy));
                conto.xz += (int)(byte0 * (2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy));
            }
            if (control.down) {
                conto.zy += (int)((4 + this.elev[this.ltyp]) * conto.m.cs.getcos(conto.xy));
                conto.xz -= (int)(byte0 * (2 + this.elev[this.ltyp]) * conto.m.cs.getsin(conto.xy));
            }
        }
        else {
            int k;
            for (k = Math.abs(conto.zy); k > 90; k -= 180) {}
            int i2;
            for (i2 = Math.abs(conto.xy); i2 > 90; i2 -= 180) {}
            int k2;
            for (k2 = Math.abs(conto.zy); k2 > 270; k2 -= 360) {}
            int i3;
            for (i3 = Math.abs(conto.xy); i3 > 270; i3 -= 360) {}
            final boolean flag = (Math.abs(k2) < 90 && Math.abs(i3) < 90) || (Math.abs(k2) > 90 && Math.abs(i3) > 90);
            final boolean flag2 = Math.abs(k) > 30 || Math.abs(i2) > 30;
            if ((!flag || flag2) && !conto.exp) {
                conto.exp = true;
                conto.y = 170;
                this.speed = 30.0f;
                this.pexp = true;
            }
            int i4;
            for (i4 = Math.abs(conto.zy); i4 > 270; i4 -= 360) {}
            if (i4 > 90) {
                conto.xy = 180;
            }
            else {
                conto.xy = 0;
            }
            int l3;
            for (l3 = conto.zy; l3 > 90; l3 -= 180) {}
            while (l3 < -90) {
                l3 += 180;
            }
            if (l3 > 0) {
                --conto.zy;
                this.smoke = true;
            }
            if (l3 < 0) {
                ++conto.zy;
                this.smoke = true;
            }
            if (this.speed > 10.0f && control.down) {
                conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
            }
        }
        if (control.left) {
            if (conto.y < 207) {
                conto.xy -= 10;
            }
            else {
                conto.xz += 2;
            }
        }
        if (control.right) {
            if (conto.y < 207) {
                conto.xy += 10;
            }
            else {
                conto.xz -= 2;
            }
        }
        final int m = (int)(byte0 * (3 + this.trnn[this.ltyp]) * conto.m.cs.getsin(conto.xy));
        conto.xz -= m;
        this.rlift = (int)(this.speed * (conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy))) - 40;
        if (this.lift < this.rlift) {
            this.lift += 0.5;
        }
        if (this.lift > this.rlift) {
            this.lift -= 0.5;
        }
        if (this.lift < -(50.0f - this.speed / 2.0f)) {
            this.lift = -(50.0f - this.speed / 2.0f);
        }
        final int j2 = (int)(5.0f * (conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy)));
        if (this.lift > j2) {
            this.lift = j2;
        }
        conto.y -= (int)this.lift;
        if (conto.x < -40000) {
            conto.x = -40000;
            if (m <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (conto.x > 40000) {
            conto.x = 40000;
            if (m <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (conto.z > 40000) {
            conto.z = 40000;
            if (m <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (conto.z < -40000) {
            conto.z = -40000;
            if (m <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (!this.pexp && conto.exp) {
            if (this.speed > 40.0f) {
                this.speed = -15.0f;
                this.pexp = true;
            }
            else if (conto.nhits > conto.maxhits) {
                this.pexp = true;
            }
            else {
                conto.exp = false;
                this.speed = -((this.rspeed + this.speed) / 2.0f);
            }
        }
        if (this.pexp) {
            if (this.speed > 0.0f) {
                this.speed -= (float)0.3;
            }
            if (this.speed < 0.0f) {
                this.speed += (float)0.3;
            }
        }
        else {
            if (this.speed > this.rspeed) {
                if (this.speed > this.maxspeed[this.ltyp]) {
                    this.speed -= (this.speed - this.rspeed) / 20.0f;
                }
                else {
                    this.speed -= 0.5;
                }
            }
            if (this.speed < this.rspeed) {
                ++this.speed;
            }
        }
        if (conto.nhits > conto.maxhits - conto.maxhits / 6 && !conto.exp) {
            if (this.speed > 60.0f) {
                this.speed = 60.0f;
            }
            conto.xz += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
            conto.zy += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
        }
        if (control.plus && this.rspeed < this.maxspeed[this.ltyp]) {
            this.rspeed += 2;
        }
        if (control.mins && this.rspeed > 0) {
            this.rspeed -= 2;
        }
        if (control.jump != 0 && this.njumps != 0) {
            if (control.jump == 1) {
                this.speed = 400.0f;
                control.jump = 2;
                conto.m.jumping = 5;
            }
            if (conto.m.jumping == 0) {
                this.speed = 800.0f;
                control.jump = 0;
                --this.njumps;
            }
        }
        if (control.fire && !conto.exp) {
            if (this.skip && this.bulkc < this.lsr.srate[this.ltyp]) {
                this.lx[this.nl] = conto.x;
                this.ly[this.nl] = conto.y;
                this.lz[this.nl] = conto.z;
                this.lxz[this.nl] = conto.xz;
                this.lzy[this.nl] = conto.zy;
                this.lxy[this.nl] = conto.xy;
                if (this.ly[this.nl] > 215) {
                    this.ly[this.nl] = 215;
                }
                this.lspeed[this.nl] = (int)(this.lsr.speed[this.ltyp] + this.speed);
                this.lstage[this.nl] = 1;
                this.lhit[this.nl] = 0;
                ++this.nl;
                if (this.nl == 20) {
                    this.nl = 0;
                }
                this.skip = false;
            }
            else if (!this.skip) {
                this.skip = true;
            }
            ++this.bulkc;
            if (this.bulkc > 12) {
                this.bulkc = 0;
            }
        }
        int l4 = 0;
        int j3 = 0;
        do {
            if (this.lstage[j3] != 0) {
                ++l4;
                if (this.ly[j3] > 240 && this.lhit[j3] == 0) {
                    this.lhit[j3] = 1;
                }
                if (this.lhit[j3] != 0) {
                    continue;
                }
                if (this.lstage[j3] > 10) {
                    int k3 = 22500;
                    int l5 = -1;
                    for (int j4 = 1; j4 < i; ++j4) {
                        final int i5 = this.getpy(aconto[ai[j4]].x, aconto[ai[j4]].y, aconto[ai[j4]].z, j3);
                        if (i5 < k3 && i5 > 0 && !aconto[ai[j4]].exp) {
                            k3 = i5;
                            l5 = j4;
                        }
                    }
                    if (l5 != -1) {
                        if (this.lspeed[j3] > 230) {
                            this.lspeed[j3] = 230;
                        }
                        final int k4 = aconto[ai[l5]].x;
                        final int j5 = aconto[ai[l5]].z;
                        final int k5 = aconto[ai[l5]].y;
                        char c = '\0';
                        if (k4 - this.lx[j3] > 0) {
                            c = '´';
                        }
                        this.lxz[j3] = (int)('Z' + c + Math.atan((j5 - this.lz[j3]) / (double)(k4 - this.lx[j3])) / 0.017453292519943295);
                        c = '\0';
                        if (k5 - this.ly[j3] < 0) {
                            c = '\uff4c';
                        }
                        final int l6 = (int)Math.sqrt((j5 - this.lz[j3]) * (j5 - this.lz[j3]) + (k4 - this.lx[j3]) * (k4 - this.lx[j3]));
                        this.lzy[j3] = -(int)('Z' + c - Math.atan(l6 / (double)(k5 - this.ly[j3])) / 0.017453292519943295);
                    }
                }
                final int[] lx = this.lx;
                final int n = j3;
                lx[n] -= (int)(this.lspeed[j3] * (conto.m.cs.getsin(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3])));
                final int[] lz = this.lz;
                final int n2 = j3;
                lz[n2] += (int)(this.lspeed[j3] * (conto.m.cs.getcos(this.lxz[j3]) * conto.m.cs.getcos(this.lzy[j3])));
                final int[] ly = this.ly;
                final int n3 = j3;
                ly[n3] -= (int)(this.lspeed[j3] * conto.m.cs.getsin(this.lzy[j3]));
                final int[] lstage = this.lstage;
                final int n4 = j3;
                ++lstage[n4];
                if (this.lstage[j3] <= 80) {
                    continue;
                }
                this.lstage[j3] = 0;
            }
        } while (++j3 < 20);
        if (l4 != 0) {
            if (!conto.fire) {
                conto.fire = true;
            }
        }
        else if (conto.fire) {
            conto.fire = false;
            this.bulkc = 0;
        }
        conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
        conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
        conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
        if (conto.y > 215) {
            conto.y = 215;
        }
        if (conto.y < -25000) {
            conto.y = -25000;
        }
        if (this.ester == 0) {
            if (conto.x > 2800 && conto.x < 3200 && conto.z > -2100 && conto.z < -1900 && conto.y > -30) {
                this.ester = 1;
                conto.nhits = 0;
                control.jump = 0;
                this.njumps = this.dnjm[this.ltyp];
            }
        }
        else {
            if (this.ester < 13) {
                if (this.ltyp == 0) {
                    if (conto.m.er == 0) {
                        conto.m.er = 1;
                    }
                    else {
                        conto.m.er = 0;
                    }
                }
                if (this.ltyp == 1) {
                    if (conto.m.eg == 0) {
                        conto.m.eg = 1;
                    }
                    else {
                        conto.m.eg = 0;
                    }
                }
                if (this.ltyp == 2) {
                    if (conto.m.eb == 0) {
                        conto.m.eb = 1;
                    }
                    else {
                        conto.m.eb = 0;
                    }
                }
                if (this.ltyp == 3) {
                    if (conto.m.er == 0) {
                        conto.m.er = 1;
                        conto.m.eg = 1;
                    }
                    else {
                        conto.m.er = 0;
                        conto.m.eg = 0;
                    }
                }
                if (this.ltyp == 4) {
                    if (conto.m.eb == 0) {
                        conto.m.eb = 1;
                        conto.m.eg = 1;
                    }
                    else {
                        conto.m.eb = 0;
                        conto.m.eg = 0;
                    }
                }
            }
            if (this.ester == 1) {
                conto.wire = true;
            }
            if (this.ester == 3) {
                conto.wire = false;
            }
            ++this.ester;
            if (this.ester == 45) {
                this.ester = 0;
            }
        }
    }
    
    public void dosmokes(final Graphics g, final ContO conto) {
        if (!conto.exp) {
            if (conto.nhits > conto.maxhits - conto.maxhits / 3) {
                if (this.dms[this.nd] == -1) {
                    this.dx[this.nd] = conto.x + (int)(Math.random() * 60.0 - 30.0);
                    this.dy[this.nd] = conto.y;
                    this.dz[this.nd] = conto.z;
                    this.dxz[this.nd] = conto.xz;
                    this.dzy[this.nd] = conto.zy;
                    this.dms[this.nd] = 0;
                    ++this.nd;
                    if (this.nd == 4) {
                        this.nd = 0;
                    }
                }
                int i = 0;
                do {
                    if (this.dms[i] != -1) {
                        if (this.dms[i] < 4) {
                            this.lsr.hsmoke(g, this.dx[i], this.dy[i], this.dz[i], this.dxz[i], this.dzy[i], this.dms[i]);
                        }
                        final int[] dy = this.dy;
                        final int n = i;
                        dy[n] -= 15;
                        final int[] dms = this.dms;
                        final int n2 = i;
                        ++dms[n2];
                        if (this.dms[i] < 7) {
                            continue;
                        }
                        this.dms[i] = -1;
                    }
                } while (++i < 4);
            }
            if (this.smoke && conto.y > 200 && this.sms[this.ns] == -1) {
                this.sx[this.ns] = conto.x + (int)(Math.random() * 80.0 - 40.0);
                this.sy[this.ns] = conto.y + 15;
                this.sz[this.ns] = conto.z;
                this.sxz[this.ns] = conto.xz;
                this.szy[this.ns] = conto.zy;
                this.sms[this.ns] = 0;
                ++this.ns;
                if (this.ns == 4) {
                    this.ns = 0;
                }
                this.smoke = false;
            }
            int j = 0;
            do {
                if (this.sms[j] != -1) {
                    if (this.sms[j] < 4) {
                        this.lsr.gsmoke(g, this.sx[j], this.sy[j], this.sz[j], this.sxz[j], this.szy[j], this.sms[j]);
                    }
                    final int[] sy = this.sy;
                    final int n3 = j;
                    sy[n3] -= 15;
                    final int[] sms = this.sms;
                    final int n4 = j;
                    ++sms[n4];
                    if (this.sms[j] != 10) {
                        continue;
                    }
                    this.sms[j] = -1;
                }
            } while (++j < 4);
        }
    }
    
    public void reset(final int i) {
        this.rspeed = 0;
        this.speed = 0.0f;
        this.rlift = 0;
        this.lift = 0.0;
        this.pexp = false;
        this.ltyp = i;
        this.njumps = this.dnjm[i];
        int j = 0;
        do {
            this.lstage[j] = 0;
        } while (++j < 20);
    }
    
    public userCraft(final Medium medium) {
        this.maxspeed = new int[] { 120, 100, 90, 80, 76 };
        this.elev = new int[] { 1, 2, 1, 1, 1 };
        this.trnn = new int[] { 0, 0, 1, 2, 1 };
        this.dnjm = new int[] { 7, 5, 4, 3, 4 };
        this.name = new String[] { "E-7 Sky Bullet", "BP-6 Hammer Head", "E-9 Dragon Bird", "EXA-1 Destroyer", "Silver F-51 Legend" };
        this.rspeed = 0;
        this.speed = 0.0f;
        this.rlift = 0;
        this.lift = 0.0;
        this.pexp = false;
        this.ltyp = 0;
        this.njumps = 0;
        this.ester = 0;
        this.lx = new int[20];
        this.ly = new int[20];
        this.lz = new int[20];
        this.lxz = new int[20];
        this.lzy = new int[20];
        this.lxy = new int[20];
        this.lstage = new int[20];
        this.lspeed = new int[20];
        this.lhit = new int[20];
        this.nl = 0;
        this.skip = false;
        this.bulkc = 0;
        this.sms = new int[4];
        this.sx = new int[4];
        this.sy = new int[4];
        this.sz = new int[4];
        this.sxz = new int[4];
        this.szy = new int[4];
        this.ns = 0;
        this.smoke = false;
        this.dms = new int[4];
        this.dx = new int[4];
        this.dy = new int[4];
        this.dz = new int[4];
        this.dxz = new int[4];
        this.dzy = new int[4];
        this.nd = 0;
        this.lsr = new Lasers(medium);
        int i = 0;
        do {
            this.sms[i] = -1;
        } while (++i < 4);
        i = 0;
        do {
            this.dms[i] = -1;
        } while (++i < 4);
    }
    
    public void lasercolid(final ContO conto) {
        if (!conto.exp && !conto.out) {
            int i = 0;
            do {
                if (this.lstage[i] != 0 && this.lhit[i] == 0) {
                    final int j = this.getpy(conto.x, conto.y, conto.z, i);
                    if (j >= conto.maxR / 10 * (conto.maxR / 10) || j <= 0) {
                        continue;
                    }
                    if (conto.rcol != 0 && j < conto.maxR / (10 * conto.rcol) * (conto.maxR / (10 * conto.rcol)) + this.lsr.rads[this.ltyp] / 10 * (this.lsr.rads[this.ltyp] / 10)) {
                        this.lhit[i] = 1;
                        if (conto.maxhits != -1) {
                            conto.hit = true;
                            if (Math.random() > 0.5) {
                                conto.nhits += this.lsr.damg[this.ltyp];
                            }
                            else {
                                conto.nhits += 2;
                            }
                        }
                    }
                    if (conto.pcol == 0) {
                        continue;
                    }
                    for (int k = 0; k < conto.npl; ++k) {
                        for (int l = 0; l < conto.p[k].n; ++l) {
                            if (!conto.hit && (this.lx[i] - (conto.x + conto.p[k].ox[l])) * (this.lx[i] - (conto.x + conto.p[k].ox[l])) + (this.ly[i] - (conto.y + conto.p[k].oy[l])) * (this.ly[i] - (conto.y + conto.p[k].oy[l])) + (this.lz[i] - (conto.z + conto.p[k].oz[l])) * (this.lz[i] - (conto.z + conto.p[k].oz[l])) < this.lsr.rads[this.ltyp] * 10 / conto.pcol * (this.lsr.rads[this.ltyp] * 10 / conto.pcol)) {
                                this.lhit[i] = 1;
                                if (conto.maxhits != -1) {
                                    conto.hit = true;
                                    if (Math.random() > 0.5) {
                                        conto.nhits += this.lsr.damg[this.ltyp];
                                    }
                                    else {
                                        conto.nhits += 2;
                                    }
                                }
                            }
                        }
                    }
                }
            } while (++i < 20);
        }
    }
    
    public int getpy(final int i, final int j, final int k, final int l) {
        return (i - this.lx[l]) / 10 * ((i - this.lx[l]) / 10) + (j - this.ly[l]) / 10 * ((j - this.ly[l]) / 10) + (k - this.lz[l]) / 10 * ((k - this.lz[l]) / 10);
    }
    
    public void dl(final Graphics g) {
        int i = 0;
        do {
            if (this.lstage[i] != 0) {
                this.lsr.d(g, this.ltyp, this.lx[i], this.ly[i], this.lz[i], this.lxz[i], this.lzy[i], this.lxy[i], this.lhit[i]);
                if (this.lhit[i] == 0) {
                    continue;
                }
                final int[] lhit = this.lhit;
                final int n = i;
                ++lhit[n];
                if (this.lhit[i] <= 2) {
                    continue;
                }
                this.lstage[i] = 0;
            }
        } while (++i < 20);
    }
}
