import java.awt.Graphics;

// 
// Decompiled by Procyon v0.6.0
// 

public class Craft
{
    cControl u;
    int rspeed;
    float speed;
    int rlift;
    double lift;
    boolean pexp;
    int ltyp;
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
    int gxz;
    int gzy;
    boolean responce;
    int trgxz;
    int trgzy;
    int out;
    int turnat;
    int tcnt;
    boolean engage;
    int enx;
    int eny;
    int enz;
    int ens;
    boolean targeting;
    int mode;
    int m3o;
    int m3cnt;
    int m1cnt;
    int relax;
    int runn;
    int liftup;
    boolean dracs;
    
    public void preform(final ContO conto, final ContO[] aconto, final int[] ai, final int i, final int j, final int k) {
        int l;
        for (l = Math.abs(conto.zy); l > 360; l -= 360) {}
        byte byte0 = 1;
        if (l > 90 && l < 270) {
            byte0 = -1;
        }
        if (conto.y < 207) {
            if (this.u.up) {
                conto.zy -= (int)(5.0f * conto.m.cs.getcos(conto.xy));
                conto.xz += (int)(byte0 * 3 * conto.m.cs.getsin(conto.xy));
            }
            if (this.u.down) {
                conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
                conto.xz -= (int)(byte0 * 3 * conto.m.cs.getsin(conto.xy));
            }
        }
        else {
            int i2;
            for (i2 = Math.abs(conto.zy); i2 > 90; i2 -= 180) {}
            int k2;
            for (k2 = Math.abs(conto.xy); k2 > 90; k2 -= 180) {}
            int i3;
            for (i3 = Math.abs(conto.zy); i3 > 270; i3 -= 360) {}
            int k3;
            for (k3 = Math.abs(conto.xy); k3 > 270; k3 -= 360) {}
            final boolean flag = (Math.abs(i3) < 90 && Math.abs(k3) < 90) || (Math.abs(i3) > 90 && Math.abs(k3) > 90);
            final boolean flag2 = Math.abs(i2) > 30 || Math.abs(k2) > 30;
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
            int i5;
            for (i5 = conto.zy; i5 > 90; i5 -= 180) {}
            while (i5 < -90) {
                i5 += 180;
            }
            if (i5 > 0) {
                --conto.zy;
                this.smoke = true;
            }
            if (i5 < 0) {
                ++conto.zy;
                this.smoke = true;
            }
            if (this.speed > 10.0f && this.u.down) {
                conto.zy += (int)(5.0f * conto.m.cs.getcos(conto.xy));
            }
        }
        if (this.u.left) {
            if (conto.y < 207) {
                if (conto.xy > -90) {
                    conto.xy -= 10;
                }
            }
            else {
                conto.xz += 2;
            }
        }
        if (this.u.right) {
            if (conto.y < 207) {
                if (conto.xy < 90) {
                    conto.xy += 10;
                }
            }
            else {
                conto.xz -= 2;
            }
        }
        final int j2 = (int)(byte0 * 4 * conto.m.cs.getsin(conto.xy));
        conto.xz -= j2;
        if (conto.nhits > conto.maxhits - conto.maxhits / 6 && !conto.exp) {
            if (this.rspeed > 60) {
                this.rspeed = 60;
                this.speed = 60.0f;
            }
            conto.xz += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
            conto.zy += (int)(Math.random() * (this.speed / 10.0f) - this.speed / 20.0f);
        }
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
        final int l2 = (int)(5.0f * (conto.m.cs.getcos(conto.zy) * conto.m.cs.getcos(conto.xy)));
        if (this.lift > l2) {
            this.lift = l2;
        }
        conto.y -= (int)this.lift;
        if (conto.x < -40000) {
            conto.x = -40000;
            if (j2 <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (conto.x > 40000) {
            conto.x = 40000;
            if (j2 <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (conto.z > 40000) {
            conto.z = 40000;
            if (j2 <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (conto.z < -40000) {
            conto.z = -40000;
            if (j2 <= 0) {
                conto.xz += 5;
            }
            else {
                conto.xz -= 5;
            }
        }
        if (!this.pexp && conto.exp) {
            if (this.speed > 30.0f) {
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
                this.speed -= 0.5;
            }
            if (this.speed < this.rspeed) {
                ++this.speed;
            }
        }
        if (this.u.fire && !conto.exp) {
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
        int j3 = 0;
        int l3 = 0;
        do {
            if (this.lstage[l3] != 0) {
                ++j3;
                if (this.ly[l3] > 240 && this.lhit[l3] == 0) {
                    this.lhit[l3] = 1;
                }
                if (this.lhit[l3] != 0) {
                    continue;
                }
                if (this.lstage[l3] > 10 && this.nf[l3] < 15) {
                    int i6 = -1;
                    int k4 = -1;
                    if (!aconto[j].exp) {
                        i6 = this.getpy(aconto[j].x, aconto[j].y, aconto[j].z, l3);
                        k4 = j;
                    }
                    for (int j4 = k; j4 < k + 13; ++j4) {
                        final int j5 = this.getpy(aconto[j4].x, aconto[j4].y, aconto[j4].z, l3);
                        if (j5 < i6 && j5 > 0 && !aconto[j4].exp) {
                            i6 = j5;
                            k4 = j4;
                        }
                    }
                    if (i6 < 22500 && i6 > 0) {
                        if (this.lspeed[l3] > 230) {
                            this.lspeed[l3] = 230;
                        }
                        final int k5 = aconto[k4].x;
                        final int k6 = aconto[k4].z;
                        final int i7 = aconto[k4].y;
                        char c4 = '\0';
                        if (k5 - this.lx[l3] > 0) {
                            c4 = '´';
                        }
                        this.lxz[l3] = (int)('Z' + c4 + Math.atan((k6 - this.lz[l3]) / (double)(k5 - this.lx[l3])) / 0.017453292519943295);
                        c4 = '\0';
                        if (i7 - this.ly[l3] < 0) {
                            c4 = '\uff4c';
                        }
                        final int k7 = (int)Math.sqrt((k6 - this.lz[l3]) * (k6 - this.lz[l3]) + (k5 - this.lx[l3]) * (k5 - this.lx[l3]));
                        this.lzy[l3] = -(int)('Z' + c4 - Math.atan(k7 / (double)(i7 - this.ly[l3])) / 0.017453292519943295);
                        final int[] nf = this.nf;
                        final int n = l3;
                        ++nf[n];
                    }
                }
                final int[] lx = this.lx;
                final int n2 = l3;
                lx[n2] -= (int)(this.lspeed[l3] * (conto.m.cs.getsin(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3])));
                final int[] lz = this.lz;
                final int n3 = l3;
                lz[n3] += (int)(this.lspeed[l3] * (conto.m.cs.getcos(this.lxz[l3]) * conto.m.cs.getcos(this.lzy[l3])));
                final int[] ly = this.ly;
                final int n4 = l3;
                ly[n4] -= (int)(this.lspeed[l3] * conto.m.cs.getsin(this.lzy[l3]));
                final int[] lstage = this.lstage;
                final int n5 = l3;
                ++lstage[n5];
                if (this.lstage[l3] <= 80) {
                    continue;
                }
                this.lstage[l3] = 0;
            }
        } while (++l3 < 20);
        if (j3 != 0) {
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
        if (conto.y > 215) {
            conto.y = 215;
        }
        if (conto.y < -25000) {
            conto.y = -25000;
        }
        if (this.tcnt > this.turnat) {
            if (this.targeting) {
                this.targeting = false;
            }
            if (this.mode != 1 && this.mode != 3) {
                if (this.engage) {
                    char c5 = '\0';
                    if (aconto[k + this.ens].x - conto.x > 0) {
                        c5 = '´';
                    }
                    this.gxz = (int)('Z' + c5 + Math.atan((aconto[k + this.ens].z - conto.z) / (double)(aconto[k + this.ens].x - conto.x)) / 0.017453292519943295);
                    c5 = '\0';
                    if (aconto[k + this.ens].y - conto.y < 0) {
                        c5 = '\uff4c';
                    }
                    final int l4 = (int)Math.sqrt((aconto[k + this.ens].z - conto.z) * (aconto[k + this.ens].z - conto.z) + (aconto[k + this.ens].x - conto.x) * (aconto[k + this.ens].x - conto.x));
                    this.gzy = -(int)('Z' + c5 - Math.atan(l4 / (double)(aconto[k + this.ens].y - conto.y)) / 0.017453292519943295);
                    l3 = this.getcpy(conto, aconto[k + this.ens]);
                    if (l3 > 0 && l3 < 15000) {
                        this.targeting = true;
                    }
                    if (l3 > 0 && l3 < 200 && Math.random() > 0.7) {
                        if (Math.random() > 0.5) {
                            this.enx = -6800 + (int)(2000.0 + 30000.0 * Math.random());
                        }
                        else {
                            this.enx = -6800 - (int)(2000.0 + 30000.0 * Math.random());
                        }
                        if (Math.random() > 0.5) {
                            this.enz = -1150 + (int)(2000.0 + 30000.0 * Math.random());
                        }
                        else {
                            this.enz = -1150 - (int)(2000.0 + 30000.0 * Math.random());
                        }
                        if (Math.random() > 0.7) {
                            this.eny = 0;
                        }
                        else {
                            this.eny = -(int)(Math.random() * 23000.0);
                        }
                        this.engage = false;
                        this.targeting = false;
                    }
                }
                else {
                    char c6 = '\0';
                    if (this.enx - conto.x > 0) {
                        c6 = '´';
                    }
                    this.gxz = (int)('Z' + c6 + Math.atan((this.enz - conto.z) / (double)(this.enx - conto.x)) / 0.017453292519943295);
                    c6 = '\0';
                    if (this.eny - conto.y < 0) {
                        c6 = '\uff4c';
                    }
                    final int i8 = (int)Math.sqrt((this.enz - conto.z) * (this.enz - conto.z) + (this.enx - conto.x) * (this.enx - conto.x));
                    this.gzy = -(int)('Z' + c6 - Math.atan(i8 / (double)(this.eny - conto.y)) / 0.017453292519943295);
                    l3 = this.getepy(conto);
                    if (l3 > 0 && l3 < 500) {
                        this.ens = 4 + (int)(Math.random() * 5.0);
                        this.engage = true;
                    }
                }
                this.turnat = (int)(Math.random() * 50.0);
            }
            l3 = this.getcpy(aconto[j], conto);
            if (l3 > 0) {
                if (l3 < 20000 && !aconto[j].exp) {
                    if (this.mode == 0 && this.mode != 3) {
                        if (Math.random() > 0.5 && conto.maxR != 151) {
                            this.mode = 2;
                        }
                        else {
                            this.mode = 1;
                            this.m1cnt = 0;
                        }
                    }
                }
                else if (this.mode != 0) {
                    this.mode = 0;
                }
            }
            if (this.mode == 1) {
                char c7 = '\0';
                if (aconto[j].x - conto.x > 0) {
                    c7 = '´';
                }
                this.gxz = (int)('Z' + c7 + Math.atan((aconto[j].z - conto.z) / (double)(aconto[j].x - conto.x)) / 0.017453292519943295);
                c7 = '\0';
                if (aconto[j].y - conto.y < 0) {
                    c7 = '\uff4c';
                }
                final int j6 = (int)Math.sqrt((aconto[j].z - conto.z) * (aconto[j].z - conto.z) + (aconto[j].x - conto.x) * (aconto[j].x - conto.x));
                this.gzy = -(int)('Z' + c7 - Math.atan(j6 / (double)(aconto[j].y - conto.y)) / 0.017453292519943295);
                this.turnat = (int)(Math.random() * 3.0);
                if (l3 < 7000) {
                    this.targeting = true;
                }
                ++this.m1cnt;
                if (this.m1cnt > this.relax) {
                    this.mode = 0;
                }
            }
            if (this.mode == 3) {
                char c8 = '\0';
                if (aconto[this.m3o].x - conto.x > 0) {
                    c8 = '´';
                }
                this.gxz = (int)('Z' + c8 + Math.atan((aconto[this.m3o].z - conto.z) / (double)(aconto[this.m3o].x - conto.x)) / 0.017453292519943295);
                c8 = '\0';
                if (aconto[this.m3o].y - conto.y < 0) {
                    c8 = '\uff4c';
                }
                final int k8 = (int)Math.sqrt((aconto[this.m3o].z - conto.z) * (aconto[this.m3o].z - conto.z) + (aconto[this.m3o].x - conto.x) * (aconto[this.m3o].x - conto.x));
                this.gzy = -(int)('Z' + c8 - Math.atan(k8 / (double)(aconto[this.m3o].y - conto.y)) / 0.017453292519943295);
                this.turnat = (int)(Math.random() * 10.0);
                ++this.m3cnt;
                if (this.m3cnt == this.runn) {
                    this.mode = 0;
                }
            }
            this.tcnt = 0;
        }
        else {
            ++this.tcnt;
        }
        if (this.mode != 3 && conto.hit && Math.random() > 0.85) {
            if (Math.random() > 0.5) {
                this.m3o = this.nearst(aconto, ai, i, j, conto);
                this.mode = 3;
                this.m3cnt = 0;
            }
            else if (this.mode == 2) {
                if (conto.zy < 15 && Math.random() < 0.5 && conto.maxR != 151) {
                    this.turnat = 20;
                    this.gzy = 80;
                    this.mode = 0;
                }
                else {
                    this.mode = 1;
                    this.m1cnt = 0;
                }
            }
            else if (conto.zy < 15 && Math.random() < 0.5) {
                this.turnat = 20;
                this.gzy = 80;
                this.mode = 0;
            }
            else {
                this.mode = 2;
            }
        }
        l3 = 0;
        if (conto.y > 100.0f + this.liftup * conto.m.cs.getsin(conto.zy)) {
            l3 = 1;
        }
        final int j7 = conto.y + (int)(-(conto.z + 1000 - conto.z) * conto.m.cs.getsin(conto.zy));
        final int l5 = conto.z + (int)((conto.z + 1000 - conto.z) * conto.m.cs.getcos(conto.zy));
        final int l6 = conto.x + (int)(-(l5 - conto.z) * conto.m.cs.getsin(conto.xz));
        final int l7 = conto.z + (int)((l5 - conto.z) * conto.m.cs.getcos(conto.xz));
        if (this.myway(aconto, ai, i, j, l6, j7, l7)) {
            l3 = 2;
        }
        if (this.u.left) {
            this.u.left = false;
        }
        if (this.u.right) {
            this.u.right = false;
        }
        if (this.u.up) {
            this.u.up = false;
        }
        if (this.u.down) {
            this.u.down = false;
        }
        if (l3 != 2) {
            int j8;
            for (j8 = conto.xz; j8 >= 360; j8 -= 360) {}
            while (j8 < 0) {
                j8 += 360;
            }
            if (Math.abs(j8 - this.gxz) > 5 && l3 == 0) {
                if (j8 > 270 && this.gxz < 90) {
                    this.u.left = true;
                    this.trgxz = 360 - j8 + this.gxz;
                }
                else if (j8 < 90 && this.gxz > 270) {
                    this.u.right = true;
                    this.trgxz = 360 - this.gxz + j8;
                }
                else if (j8 < this.gxz) {
                    this.u.left = true;
                    this.trgxz = this.gxz - j8;
                }
                else {
                    this.u.right = true;
                    this.trgxz = j8 - this.gxz;
                }
                if (this.dracs && Math.abs(conto.xy) > 80) {
                    this.u.down = true;
                }
            }
            else {
                if (conto.xy > 0) {
                    this.u.left = true;
                }
                if (conto.xy < 0) {
                    this.u.right = true;
                }
                if (l3 == 1 && Math.abs(conto.xy) < 30 && conto.zy < -30) {
                    this.gzy = 20;
                }
            }
            if (Math.abs(conto.zy - this.gzy) > 5 && Math.abs(conto.xy) < 45) {
                if (this.gzy < conto.zy) {
                    this.u.up = true;
                }
                if (this.gzy > conto.zy) {
                    this.u.down = true;
                }
                this.trgzy = Math.abs(conto.zy - this.gzy);
            }
        }
        else if (Math.abs(conto.xy) < 60 || conto.zy < 10) {
            if (conto.xy > 0) {
                this.u.left = true;
            }
            if (conto.xy < 0) {
                this.u.right = true;
            }
            if (conto.zy < 80) {
                this.u.down = true;
                this.gzy = 80;
            }
            this.tcnt = 0;
            this.turnat = (int)(Math.random() * 6.0 + 4.0);
        }
        else {
            if (conto.xy > 0) {
                this.u.right = true;
            }
            if (conto.xy < 0) {
                this.u.left = true;
            }
            if (conto.zy < 80) {
                this.u.down = true;
            }
            this.tcnt = 0;
            this.turnat = (int)(Math.random() * 4.0 + 3.0);
        }
        if (this.trgxz < 90 && this.trgzy < 40 && this.targeting) {
            if (!this.u.fire) {
                this.u.fire = true;
            }
        }
        else if (this.u.fire) {
            this.u.fire = false;
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
            if (conto.y > 200) {
                if (this.smoke && this.sms[this.ns] == -1) {
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
    }
    
    public int nearst(final ContO[] aconto, final int[] ai, final int i, final int j, final ContO conto) {
        int k = this.getcpy(aconto[ai[0]], conto);
        int l = ai[0];
        for (int i2 = 0; i2 < i; ++i2) {
            if (ai[i2] != j) {
                final int j2 = this.getcpy(aconto[ai[i2]], conto);
                if ((j2 > 0 && j2 < k && !aconto[ai[i2]].exp) || k < 0) {
                    k = j2;
                    l = ai[i2];
                }
            }
        }
        return l;
    }
    
    public void reset(final int i, final int j, final int k, final int l, final int i1, final int j1) {
        this.rspeed = i;
        this.speed = (float)i;
        this.rlift = 0;
        this.lift = 0.0;
        this.pexp = false;
        this.ltyp = j;
        this.mode = 0;
        this.relax = k;
        this.runn = l;
        this.liftup = i1;
        if (j1 == 1) {
            this.dracs = true;
        }
        else {
            this.dracs = false;
        }
        int k2 = 0;
        do {
            this.lstage[k2] = 0;
        } while (++k2 < 20);
    }
    
    public Craft(final Medium medium) {
        this.u = new cControl();
        this.rspeed = 0;
        this.speed = 0.0f;
        this.rlift = 0;
        this.lift = 0.0;
        this.pexp = false;
        this.ltyp = 3;
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
        this.gxz = 0;
        this.gzy = 0;
        this.responce = false;
        this.trgxz = 0;
        this.trgzy = 0;
        this.out = 0;
        this.turnat = (int)(Math.random() * 50.0);
        this.tcnt = 0;
        this.engage = true;
        this.enx = 0;
        this.eny = 0;
        this.enz = 0;
        this.ens = 4;
        this.targeting = false;
        this.mode = 0;
        this.m3o = 0;
        this.m3cnt = 0;
        this.m1cnt = 0;
        this.relax = 50;
        this.runn = 30;
        this.liftup = 500;
        this.dracs = false;
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
    
    public boolean myway(final ContO[] aconto, final int[] ai, final int i, final int j, final int k, final int l, final int i1) {
        final boolean flag = false;
        for (int k2 = 0; k2 < i; ++k2) {
            if (ai[k2] != j) {
                int l2 = aconto[ai[k2]].maxR / 20 * (aconto[ai[k2]].maxR / 20);
                if (l2 < 5000) {
                    l2 = 5000;
                }
                final int j2 = (aconto[ai[k2]].x - k) / 10 * ((aconto[ai[k2]].x - k) / 10) + (aconto[ai[k2]].y - l) / 10 * ((aconto[ai[k2]].y - l) / 10) + (aconto[ai[k2]].z - i1) / 10 * ((aconto[ai[k2]].z - i1) / 10);
                if (j2 > 0 && j2 < l2 && !aconto[ai[k2]].exp && aconto[ai[k2]].maxR > 75) {
                    return true;
                }
            }
        }
        return false;
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
    
    public int getepy(final ContO conto) {
        return (conto.x - this.enx) / 100 * ((conto.x - this.enx) / 100) + (conto.y - this.eny) / 100 * ((conto.y - this.eny) / 100) + (conto.z - this.enz) / 100 * ((conto.z - this.enz) / 100);
    }
}
