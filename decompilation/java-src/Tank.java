import java.awt.Graphics;

// 
// Decompiled by Procyon v0.6.0
// 

public class Tank
{
    cControl u;
    int rspeed;
    int ltyp;
    float speed;
    boolean pexp;
    boolean left;
    boolean right;
    int[] lx;
    int[] ly;
    int[] lz;
    int[] lxz;
    int[] lzy;
    int[] lxy;
    int[] lstage;
    int[] lspeed;
    int[] lhit;
    int[] nf;
    int nl;
    Lasers lsr;
    boolean skip;
    int bulkc;
    int[] sms;
    int[] sx;
    int[] sy;
    int[] sz;
    int[] sxz;
    int ns;
    boolean smoke;
    int turnat;
    int tcnt;
    int gxz;
    int attack;
    boolean responce;
    int trgxz;
    int trgt;
    
    public void preform(final ContO conto, final ContO[] aconto, final int i, final int j) {
        int k;
        for (k = Math.abs(conto.zy); k > 270; k -= 360) {}
        if (k > 90) {
            if (conto.xy < 180) {
                ++conto.xy;
                this.smoke = true;
            }
            if (conto.xy > 180) {
                --conto.xy;
                this.smoke = true;
            }
        }
        else {
            if (conto.xy < 0) {
                ++conto.xy;
                this.smoke = true;
            }
            if (conto.xy > 0) {
                --conto.xy;
                this.smoke = true;
            }
        }
        int l;
        for (l = conto.zy; l > 90; l -= 180) {}
        while (l < -90) {
            l += 180;
        }
        if (l > 0) {
            if (l > 4) {
                conto.zy -= 2;
            }
            else {
                --conto.zy;
            }
        }
        if (l < 0) {
            if (l < -4) {
                conto.zy += 2;
            }
            else {
                ++conto.zy;
            }
        }
        if (this.u.left) {
            conto.xz += 5;
            if ((conto.xy == 0 || conto.xy == 180) && !this.left) {
                conto.xy += (int)(this.speed / 5.0f);
                this.left = true;
            }
        }
        else if (this.left) {
            this.left = false;
        }
        if (this.u.right) {
            conto.xz -= 5;
            if ((conto.xy == 0 || conto.xy == 180) && !this.right) {
                conto.xy -= (int)(this.speed / 5.0f);
                this.right = true;
            }
        }
        else if (this.right) {
            this.right = false;
        }
        if (conto.x < -40000) {
            conto.x = -40000;
        }
        if (conto.x > 40000) {
            conto.x = 40000;
        }
        if (conto.z > 40000) {
            conto.z = 40000;
        }
        if (conto.z < -40000) {
            conto.z = -40000;
        }
        if (!this.pexp && conto.exp) {
            if (conto.nhits < conto.maxhits) {
                conto.exp = false;
                if (this.u.left) {
                    conto.xz += 5;
                }
                else {
                    conto.xz -= 5;
                }
                conto.xy += 15 - (int)(Math.random() * 30.0);
                conto.zy += 5 + (int)(Math.random() * 5.0);
                conto.y -= 30 + (int)(Math.random() * 15.0);
            }
            else {
                this.pexp = true;
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
                this.speed -= (float)0.2;
            }
            if (this.speed < this.rspeed) {
                ++this.speed;
            }
            if (conto.y > 240) {
                conto.y = 240;
            }
            else if (conto.y > 235) {
                ++conto.y;
            }
            else {
                conto.y += 5;
            }
        }
        if (this.u.fire && !conto.exp) {
            if (this.skip && this.bulkc < this.lsr.srate[this.ltyp]) {
                this.lx[this.nl] = conto.x;
                this.ly[this.nl] = conto.y;
                this.lz[this.nl] = conto.z;
                this.lxz[this.nl] = conto.xz;
                this.lzy[this.nl] = conto.zy + 10;
                this.lxy[this.nl] = conto.xy;
                if (this.ly[this.nl] > 215) {
                    this.ly[this.nl] = 215;
                }
                this.lspeed[this.nl] = (int)(this.lsr.speed[this.ltyp] + this.speed);
                this.lstage[this.nl] = 1;
                this.lhit[this.nl] = 0;
                this.nf[this.nl] = 0;
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
        int i2 = 0;
        int j2 = 0;
        do {
            if (this.lstage[j2] != 0) {
                ++i2;
                if (this.ly[j2] > 240 && this.lhit[j2] == 0) {
                    this.lhit[j2] = 1;
                }
                if (this.lhit[j2] != 0) {
                    continue;
                }
                if (this.lstage[j2] > 10 && this.nf[j2] < 15) {
                    int i3 = -1;
                    int k2 = -1;
                    if (!aconto[i].exp) {
                        i3 = this.getpy(aconto[i].x, aconto[i].y, aconto[i].z, j2);
                        k2 = i;
                    }
                    for (int l2 = j; l2 < j + 13; ++l2) {
                        final int j3 = this.getpy(aconto[l2].x, aconto[l2].y, aconto[l2].z, j2);
                        if (j3 < i3 && j3 > 0 && !aconto[l2].exp) {
                            i3 = j3;
                            k2 = l2;
                        }
                    }
                    if (i3 < 22500 && i3 > 0) {
                        if (this.lspeed[j2] > 230) {
                            this.lspeed[j2] = 230;
                        }
                        final int i4 = aconto[k2].x;
                        final int k3 = aconto[k2].z;
                        final int l3 = aconto[k2].y;
                        char c2 = '\0';
                        if (i4 - this.lx[j2] > 0) {
                            c2 = '´';
                        }
                        this.lxz[j2] = (int)('Z' + c2 + Math.atan((k3 - this.lz[j2]) / (double)(i4 - this.lx[j2])) / 0.017453292519943295);
                        c2 = '\0';
                        if (l3 - this.ly[j2] < 0) {
                            c2 = '\uff4c';
                        }
                        final int i5 = (int)Math.sqrt((k3 - this.lz[j2]) * (k3 - this.lz[j2]) + (i4 - this.lx[j2]) * (i4 - this.lx[j2]));
                        this.lzy[j2] = -(int)('Z' + c2 - Math.atan(i5 / (double)(l3 - this.ly[j2])) / 0.017453292519943295);
                        final int[] nf = this.nf;
                        final int n = j2;
                        ++nf[n];
                    }
                }
                final int[] lx = this.lx;
                final int n2 = j2;
                lx[n2] -= (int)(this.lspeed[j2] * (conto.m.cs.getsin(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2])));
                final int[] lz = this.lz;
                final int n3 = j2;
                lz[n3] += (int)(this.lspeed[j2] * (conto.m.cs.getcos(this.lxz[j2]) * conto.m.cs.getcos(this.lzy[j2])));
                final int[] ly = this.ly;
                final int n4 = j2;
                ly[n4] -= (int)(this.lspeed[j2] * conto.m.cs.getsin(this.lzy[j2]));
                final int[] lstage = this.lstage;
                final int n5 = j2;
                ++lstage[n5];
                if (this.lstage[j2] <= 80) {
                    continue;
                }
                this.lstage[j2] = 0;
            }
        } while (++j2 < 20);
        if (i2 != 0) {
            if (!conto.fire) {
                conto.fire = true;
            }
        }
        else if (conto.fire) {
            conto.fire = false;
        }
        conto.x -= (int)(this.speed * (conto.m.cs.getsin(conto.xz) * conto.m.cs.getcos(conto.zy)));
        conto.z += (int)(this.speed * (conto.m.cs.getcos(conto.xz) * conto.m.cs.getcos(conto.zy)));
        conto.y -= (int)(this.speed * conto.m.cs.getsin(conto.zy));
        if (this.tcnt > this.turnat) {
            if (this.trgt != 0) {
                this.trgt = 0;
            }
            char c3 = '\0';
            if (aconto[j + 4].x - conto.x > 0) {
                c3 = '´';
            }
            this.gxz = (int)('Z' + c3 + Math.atan((aconto[j + 4].z - conto.z) / (double)(aconto[j + 4].x - conto.x)) / 0.017453292519943295);
            this.turnat = (int)(Math.random() * 200.0);
            int k4 = this.getcpy(aconto[j + 4], conto);
            if (k4 < 1500 && k4 > 0) {
                if (Math.random() > 0.5) {
                    this.gxz += (int)(70.0 + Math.random() * 20.0);
                }
                else {
                    this.gxz -= (int)(70.0 + Math.random() * 20.0);
                }
            }
            else {
                this.gxz += (int)(Math.random() * 40.0 - 20.0);
                this.trgt = 1;
            }
            k4 = this.getcpy(aconto[i], conto);
            if (k4 < 15000 && k4 > 0 && !aconto[i].exp) {
                if (this.attack == 0) {
                    if (Math.random() > 0.5) {
                        this.attack = 1;
                    }
                    else {
                        this.attack = 2;
                    }
                }
                if (this.attack == 1) {
                    char c4 = '\0';
                    if (aconto[i].x - conto.x > 0) {
                        c4 = '´';
                    }
                    this.gxz = (int)('Z' + c4 + Math.atan((aconto[i].z - conto.z) / (double)(aconto[i].x - conto.x)) / 0.017453292519943295);
                    this.turnat = (int)(Math.random() * 3.0);
                    this.trgt = 2;
                }
            }
            else if (this.attack != 0) {
                this.attack = 0;
            }
            if (this.gxz >= 360) {
                this.gxz -= 360;
            }
            if (this.gxz < 0) {
                this.gxz += 360;
            }
            this.tcnt = 0;
        }
        else {
            ++this.tcnt;
        }
        if (conto.hit && Math.random() > 0.5) {
            this.attack = 1;
            this.turnat = (int)(Math.random() * 10.0);
        }
        if (this.u.fire) {
            this.u.fire = false;
        }
        if (this.trgt == 1 && this.trgxz < 90) {
            final int l4 = this.getcpy(aconto[j + 4], conto);
            if (l4 > 0 && l4 < 10000) {
                this.u.fire = true;
            }
        }
        if (this.trgt == 2 && this.trgxz < 90) {
            this.u.fire = true;
        }
        if (this.responce) {
            if (this.u.left) {
                this.u.left = false;
            }
            if (this.u.right) {
                this.u.right = false;
            }
            int j4;
            for (j4 = conto.xz; j4 >= 360; j4 -= 360) {}
            while (j4 < 0) {
                j4 += 360;
            }
            if (Math.abs(j4 - this.gxz) > 5) {
                if (j4 > 270 && this.gxz < 90) {
                    this.u.left = true;
                    this.trgxz = 360 - j4 + this.gxz;
                }
                else if (j4 < 90 && this.gxz > 270) {
                    this.u.right = true;
                    this.trgxz = 360 - this.gxz + j4;
                }
                else if (j4 < this.gxz) {
                    this.u.left = true;
                    this.trgxz = this.gxz - j4;
                }
                else {
                    this.u.right = true;
                    this.trgxz = j4 - this.gxz;
                }
            }
            this.responce = false;
        }
        else {
            this.responce = true;
        }
    }
    
    public void dosmokes(final Graphics g, final ContO conto) {
        if (conto.y > 200) {
            if (this.smoke && !conto.exp && this.sms[this.ns] == -1) {
                this.sx[this.ns] = conto.x + (int)(Math.random() * 150.0 - 75.0);
                this.sy[this.ns] = conto.y + 10;
                this.sz[this.ns] = conto.z;
                this.sxz[this.ns] = conto.xz;
                this.sms[this.ns] = 0;
                ++this.ns;
                if (this.ns == 4) {
                    this.ns = 0;
                }
                this.smoke = false;
            }
            int i = 0;
            do {
                if (this.sms[i] != -1) {
                    if (this.sms[i] < 5) {
                        this.lsr.gsmoke(g, this.sx[i], this.sy[i], this.sz[i], this.sxz[i], 0, this.sms[i]);
                    }
                    final int[] sy = this.sy;
                    final int n = i;
                    sy[n] -= 10;
                    final int[] sms = this.sms;
                    final int n2 = i;
                    ++sms[n2];
                    if (this.sms[i] != 10) {
                        continue;
                    }
                    this.sms[i] = -1;
                }
            } while (++i < 4);
        }
    }
    
    public void reset(final int i, final int j) {
        this.rspeed = i;
        this.pexp = false;
        this.ltyp = j;
        int k = 0;
        do {
            this.lstage[k] = 0;
        } while (++k < 20);
    }
    
    public Tank(final Medium medium) {
        this.u = new cControl();
        this.rspeed = 0;
        this.ltyp = 0;
        this.speed = 0.0f;
        this.pexp = false;
        this.left = false;
        this.right = false;
        this.lx = new int[20];
        this.ly = new int[20];
        this.lz = new int[20];
        this.lxz = new int[20];
        this.lzy = new int[20];
        this.lxy = new int[20];
        this.lstage = new int[20];
        this.lspeed = new int[20];
        this.lhit = new int[20];
        this.nf = new int[20];
        this.nl = 0;
        this.skip = false;
        this.bulkc = 0;
        this.sms = new int[4];
        this.sx = new int[4];
        this.sy = new int[4];
        this.sz = new int[4];
        this.sxz = new int[4];
        this.ns = 0;
        this.smoke = false;
        this.turnat = (int)(Math.random() * 50.0);
        this.tcnt = 0;
        this.gxz = 0;
        this.attack = 0;
        this.responce = false;
        this.trgxz = 180;
        this.trgt = 0;
        this.lsr = new Lasers(medium);
        int i = 0;
        do {
            this.sms[i] = -1;
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
                            conto.nhits += this.lsr.damg[this.ltyp];
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
                                    conto.nhits += this.lsr.damg[this.ltyp];
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
    
    public int getcpy(final ContO conto, final ContO conto1) {
        return (conto.x - conto1.x) / 100 * ((conto.x - conto1.x) / 100) + (conto.y - conto1.y) / 100 * ((conto.y - conto1.y) / 100) + (conto.z - conto1.z) / 100 * ((conto.z - conto1.z) / 100);
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
