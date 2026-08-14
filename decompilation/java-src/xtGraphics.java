import java.awt.image.PixelGrabber;
import java.awt.image.ImageProducer;
import java.awt.image.MemoryImageSource;
import java.awt.image.ImageObserver;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.FontMetrics;
import java.awt.Panel;

// 
// Decompiled by Procyon v0.6.0
// 

public class xtGraphics extends Panel
{
    Medium m;
    FontMetrics ftm;
    boolean goodsun;
    int cl;
    Image radar;
    Image stube;
    Image sback;
    Image destr;
    Image mback;
    Image lay;
    Image complete;
    Image main;
    Image rad;
    Image inst1;
    Image inst2;
    Image inst3;
    Image mars;
    Image text;
    Image[] as;
    int[] pix;
    int[] bpix;
    int[] mpix;
    int[] opix;
    int[] ppix;
    int cnt;
    boolean flik;
    int cnts;
    String[] mname;
    int[] cnte;
    int cntf;
    boolean left;
    int wcnt;
    int rcnt;
    int cnty;
    int fase;
    int selected;
    int select;
    int[] ws;
    boolean frst;
    int oldfase;
    int nb;
    int[] ob;
    String[] nam;
    boolean[] tnk;
    int[] obx;
    int[] oby;
    int[] obz;
    int sgame;
    int level;
    boolean[] dest;
    boolean mcomp;
    int tcnt;
    
    public void denter(final Graphics g, final int i, final ContO[] aconto, final userCraft usercraft, final Control control) {
        if (this.fase == 4) {
            int j = 0;
            do {
                aconto[j].out = false;
                aconto[j].wire = true;
                aconto[j].x = 0;
                aconto[j].y = 180;
                aconto[j].z = 0;
                aconto[j].xy = 90;
            } while (++j < 5);
            this.m.x = -100;
            this.m.y = 0;
            this.m.ground = 950 - this.m.y;
            this.m.z = -50;
            this.m.xz = -90;
            this.m.zy = 0;
            aconto[0].zy = 0;
            g.setColor(new Color(255, 255, 0));
            j = 0;
            do {
                g.drawLine(j * 2, 0, j * 2, 360);
            } while (++j < 250);
            if (this.oldfase == 7) {
                this.fase = 7;
                this.oldfase = 0;
                this.cnt = 0;
            }
            else {
                this.fase = 5;
            }
        }
        if (this.fase == -8) {
            if (this.cnty < 351) {
                g.drawImage(this.mars, 0, 0, null);
                g.drawImage(this.text, 10, 380 - this.cnty, null);
                if (this.cnty != 350) {
                    ++this.cnty;
                }
                else {
                    this.drawcs(g, 345, "Press Enter to continue", 225, 225, 225, true);
                    this.cnty = 351;
                }
            }
            if (control.space) {
                this.fase = -5;
                if (this.sgame == 1) {
                    this.select = 1;
                }
                else {
                    this.select = 2;
                }
                control.space = false;
            }
        }
        if (this.fase == -7) {
            g.drawImage(this.inst1, 0, 0, null);
            this.drawcs(g, 354, "Press Enter to continue >", 170, 170, 170, false);
            if (control.space) {
                this.fase = -6;
                control.space = false;
            }
        }
        if (this.fase == -6) {
            g.drawImage(this.inst2, 0, 0, null);
            this.drawcs(g, 354, "Press Enter to continue >", 170, 170, 170, false);
            if (control.space) {
                this.fase = -55;
                control.space = false;
            }
        }
        if (this.fase == -55) {
            g.drawImage(this.inst3, 0, 0, null);
            this.drawcs(g, 354, "Press Enter to continue >", 170, 170, 170, false);
            if (control.space) {
                this.fase = this.oldfase;
                control.space = false;
            }
        }
        if (this.fase == -5) {
            g.drawImage(this.main, 0, 0, null);
            if (this.cnt < 7) {
                g.drawImage(this.as[this.select], 25, 283, null);
                g.drawImage(this.as[this.select], 423, 283, null);
                ++this.cnt;
            }
            else {
                this.cnt = 0;
            }
            g.setColor(new Color(225, 230, 255));
            int k = 50 + (int)(Math.random() * 150.0);
            g.drawLine((int)(Math.random() * 400.0), k, (int)(Math.random() * 200.0), k);
            k = 50 + (int)(Math.random() * 150.0);
            g.drawLine(500 - (int)(Math.random() * 400.0), k, 500 - (int)(Math.random() * 200.0), k);
            if (this.cnts < -900) {
                this.cnts = 0;
                this.cntf = (int)(Math.random() * 150.0);
            }
            else {
                this.cnts -= 7;
            }
            if (control.space) {
                this.cnts = 10;
            }
            g.drawImage(this.rad, 500 + this.cnts, 50 + this.cntf, null);
            this.drawcs(g, 274, "Start New Game", 0, 0, 0, false);
            if (this.sgame != 0) {
                this.drawcs(g, 289, "Resume Saved Game", 0, 0, 0, false);
            }
            else {
                if (control.space && this.select == 1) {
                    this.wcnt = 20;
                }
                if (this.wcnt != 0) {
                    this.drawcs(g, 289, "No Saved Game!", 100, 0, 0, false);
                    --this.wcnt;
                }
                else {
                    this.drawcs(g, 289, "Resume Saved Game", 200, 200, 200, false);
                }
            }
            this.drawcs(g, 304, "Game Controls", 0, 0, 0, false);
            this.drawcs(g, 319, "Credits", 0, 0, 0, false);
            this.drawcs(g, 334, "Exit Game", 0, 0, 0, false);
            if (!this.flik) {
                g.setColor(new Color(225, 230, 255));
                this.flik = true;
                g.drawLine(250 - this.ws[this.select], 271 + 15 * this.select, 250 + this.ws[this.select], 271 + 15 * this.select);
                g.drawRect(250 - this.ws[this.select], 264 + 15 * this.select, this.ws[this.select] * 2, 11);
                g.setColor(new Color(0, 0, 0));
                g.drawLine(251 - this.ws[this.select], 271 + 15 * this.select, 255 - this.ws[this.select], 271 + 15 * this.select);
                g.drawLine(245 + this.ws[this.select], 271 + 15 * this.select, 249 + this.ws[this.select], 271 + 15 * this.select);
            }
            else {
                g.setColor(new Color(168, 183, 255));
                g.drawRect(250 - this.ws[this.select], 264 + 15 * this.select, this.ws[this.select] * 2, 11);
                this.flik = false;
            }
            if (control.down) {
                ++this.select;
                control.down = false;
            }
            if (control.up) {
                --this.select;
                control.up = false;
            }
            if (this.select == 5) {
                this.select = 0;
            }
            if (this.select == -1) {
                this.select = 4;
            }
            if (control.space) {
                if (this.select == 2) {
                    this.fase = -7;
                    this.oldfase = -5;
                    control.space = false;
                }
                if (this.select == 3) {
                    this.fase = 4;
                    control.space = false;
                }
            }
            this.drawcs(g, 354, "( use keyboard arrows to select and press Enter )", 170, 170, 170, false);
            if (this.frst) {
                this.frst = false;
            }
        }
        if (this.fase == -4) {
            if (control.space) {
                this.fase = -3;
                control.space = false;
            }
            else {
                int l = 0;
                int j2 = 0;
                for (int k2 = i; k2 < i + 13; ++k2) {
                    l += aconto[k2].nhits;
                    j2 += aconto[k2].maxhits;
                }
                if (l > j2) {
                    l = j2;
                }
                final int l2 = (int)(l / (float)j2 * 100.0f);
                this.drawcs(g, 30, "The Mars Station..", 255, 255, 255, true);
                if (l2 < 90 || this.flik) {
                    this.drawcs(g, 60, "Damage status:  " + l2 + "%", 0, 0, 0, false);
                    this.flik = false;
                }
                else {
                    this.drawcs(g, 60, "Damage status:  " + l2 + "%", 255, 0, 0, false);
                    this.flik = true;
                }
                if (!this.frst) {
                    this.drawcs(g, 340, "Press Enter to continue", 255, 255, 255, false);
                }
                else {
                    this.drawcs(g, 300, "Mission " + this.level + " completed, do you wish to save game here?", 255, 255, 255, false);
                    if (this.select == 0) {
                        g.setColor(new Color(255, 255, 255));
                        g.fillRect(220, 319, 29, 14);
                        g.setColor(new Color(192, 192, 192));
                        g.drawRect(220, 319, 29, 14);
                    }
                    if (this.select != 0) {
                        g.setColor(new Color(255, 255, 255));
                        g.fillRect(256, 319, 22, 14);
                        g.setColor(new Color(192, 192, 192));
                        g.drawRect(256, 319, 22, 14);
                    }
                    if (control.up || control.down || control.left || control.right) {
                        if (this.select == 0) {
                            this.select = 1;
                        }
                        else {
                            this.select = 0;
                        }
                        control.up = false;
                        control.down = false;
                        control.left = false;
                        control.right = false;
                    }
                    this.drawcs(g, 330, "Yes     No", 0, 0, 0, false);
                }
            }
        }
        if (this.fase == -3) {
            g.setColor(new Color(225, 230, 255));
            g.drawRect(1, 1, 497, 357);
            this.drawcs(g, 180, "Loading Mission " + (this.level + 1) + " ...", 225, 230, 255, true);
        }
        if (this.fase == -2) {
            this.rcnt = 0;
            int i2 = 0;
            do {
                aconto[i2].reset();
                aconto[i2].out = false;
                aconto[i2].x = (i2 - this.selected) * 500;
                aconto[i2].y = 180;
                aconto[i2].z = 0;
            } while (++i2 < 5);
            this.m.x = -this.m.cx;
            this.m.y = 0;
            this.m.ground = 250 - this.m.y;
            this.m.z = -620;
            this.m.xz = 0;
            this.m.zy = 0;
            aconto[0].zy = 15;
            aconto[0].xy = -15;
            aconto[2].xy = -30;
            aconto[3].zy = -15;
            aconto[1].zy = 30;
            for (int j3 = 0; j3 < this.nb; ++j3) {
                this.obx[j3] = aconto[this.ob[j3]].x;
                this.oby[j3] = aconto[this.ob[j3]].y;
                this.obz[j3] = aconto[this.ob[j3]].z;
                aconto[this.ob[j3]].x = -525;
                if (this.tnk[j3]) {
                    aconto[this.ob[j3]].y = 95 + 305 * j3;
                    aconto[this.ob[j3]].zy = 0;
                }
                else {
                    aconto[this.ob[j3]].y = 55 + 305 * j3;
                    aconto[this.ob[j3]].zy = 20;
                }
                aconto[this.ob[j3]].z = 1000;
                aconto[this.ob[j3]].xy = 0;
                aconto[this.ob[j3]].xz = (int)(Math.random() * 270.0);
                aconto[this.ob[j3]].out = false;
            }
            this.cmback(this.nb);
            this.fase = -1;
        }
        if (this.fase == 0) {
            if (!this.dest[this.selected]) {
                if (this.wcnt < 5) {
                    aconto[this.selected].wire = true;
                }
                else {
                    aconto[this.selected].wire = false;
                }
                if (this.wcnt > 9) {
                    this.wcnt = 0;
                }
                else {
                    ++this.wcnt;
                }
            }
            if (this.rcnt == 0) {
                if (control.left) {
                    this.left = true;
                    this.rcnt = 1;
                }
                if (control.right) {
                    this.left = false;
                    this.rcnt = 1;
                }
            }
            else {
                int k3 = 0;
                do {
                    if (aconto[k3].x == 2000) {
                        aconto[k3].x = -500;
                    }
                    if (aconto[k3].x == -2000) {
                        aconto[k3].x = 500;
                    }
                    if (this.left) {
                        final ContO contO = aconto[k3];
                        contO.x -= 100;
                    }
                    else {
                        final ContO contO2 = aconto[k3];
                        contO2.x += 100;
                    }
                } while (++k3 < 5);
                aconto[this.selected].wire = false;
                ++this.rcnt;
                if (this.rcnt == 6) {
                    this.wcnt = 7;
                    this.rcnt = 0;
                    if (this.left) {
                        if (this.selected != 4) {
                            ++this.selected;
                        }
                        else {
                            this.selected = 0;
                        }
                    }
                    else if (this.selected != 0) {
                        --this.selected;
                    }
                    else {
                        this.selected = 4;
                    }
                    aconto[this.selected].hit = true;
                    aconto[this.selected].nhits = 0;
                }
            }
            if (control.space) {
                aconto[this.selected].wire = false;
            }
            g.drawImage(this.sback, 0, 0, null);
            int l3 = 0;
            do {
                aconto[l3].d(g);
                final ContO contO3 = aconto[l3];
                contO3.xz += 2;
            } while (++l3 < 5);
            if (this.dest[this.selected] && this.rcnt == 0) {
                g.drawImage(this.destr, 117, 103, null);
            }
            this.drawcs(g, 16, "Select your Ship", 255, 255, 255, false);
            this.drawcs(g, 354, "( use keyboard arrows to select )", 150, 150, 160, false);
            this.drawcs(g, 265, usercraft.name[this.selected], 190, 200, 255, false);
            if (control.space && this.dest[this.selected]) {
                this.drawcs(g, 80, "Cannot Select Ship!", 255, 230, 230, true);
            }
            final int[] ai = new int[3];
            final int[] ai2 = new int[3];
            g.setColor(new Color(100, 100, 100));
            if (this.rcnt == 1 && this.left) {
                g.setColor(new Color(225, 225, 225));
            }
            ai[0] = 50;
            ai2[0] = 255;
            ai[1] = 75;
            ai2[1] = 250;
            ai[2] = 75;
            ai2[2] = 260;
            g.fillPolygon(ai, ai2, 3);
            g.setColor(new Color(100, 100, 100));
            if (this.rcnt == 1 && !this.left) {
                g.setColor(new Color(225, 225, 225));
            }
            ai[0] = 450;
            ai2[0] = 255;
            ai[1] = 425;
            ai2[1] = 250;
            ai[2] = 425;
            ai2[2] = 260;
            g.fillPolygon(ai, ai2, 3);
            g.setColor(new Color(225, 225, 255));
            g.drawString("Max Speed", 57, 300);
            g.setColor(new Color(190, 200, 255));
            g.fillRect(125, 295, (int)(100.0f * (usercraft.maxspeed[this.selected] / 120.0f)), 4);
            g.setColor(new Color(225, 225, 255));
            g.drawString(" Fire Power", 57, 315);
            g.setColor(new Color(190, 200, 255));
            g.fillRect(125, 310, (int)(100.0f * ((usercraft.lsr.damg[this.selected] + 2) / 6.0f)), 4);
            g.setColor(new Color(225, 225, 255));
            g.drawString("  Tolerance", 57, 330);
            g.setColor(new Color(190, 200, 255));
            g.fillRect(125, 325, (int)(100.0f * (aconto[this.selected].maxhits / 300.0f)), 4);
            g.setColor(new Color(225, 225, 255));
            g.drawString("       Turning", 285, 300);
            g.setColor(new Color(190, 200, 255));
            g.fillRect(355, 295, (int)(100.0f * ((usercraft.trnn[this.selected] + 3) / 5.0f)), 4);
            g.setColor(new Color(225, 225, 255));
            g.drawString("     Elevation", 285, 315);
            g.setColor(new Color(190, 200, 255));
            g.fillRect(355, 310, (int)(100.0f * ((usercraft.elev[this.selected] + 3) / 5.0f)), 4);
            g.setColor(new Color(225, 225, 255));
            g.drawString("Light Speed Jumps:  " + usercraft.dnjm[this.selected], 285, 330);
        }
        if (this.fase == -1) {
            g.drawImage(this.mback, 0, 0, null);
            if (this.level == 15) {
                this.drawcs(g, 30, "Final Mission !", 255, 255, 255, true);
            }
            else {
                this.drawcs(g, 30, "Mission " + (this.level + 1), 255, 255, 255, true);
            }
            this.drawcs(g, 60, "Incoming Enemies:", 240, 240, 220, false);
            for (int i3 = 0; i3 < this.nb; ++i3) {
                g.drawImage(this.lay, 79, 90 + 80 * i3, null);
                aconto[this.ob[i3]].d(g);
                final ContO contO4 = aconto[this.ob[i3]];
                contO4.xz += 7 + i3;
                this.drawcs(g, 125 + 80 * i3, this.nam[i3], 0, 0, 0, false);
            }
            if (this.nb == 0) {
                this.drawcs(g, 180, "- Error loading mission " + (this.level + 1) + " -", 255, 255, 255, false);
                this.drawcs(g, 200, "Connection Error!", 255, 255, 255, false);
                this.drawcs(g, 280, "Click screen or Press Enter to continue >", 180, 180, 150, true);
            }
            else if (this.goodsun) {
                if (this.flik) {
                    this.drawcs(g, 110 + 80 * this.nb, "Click Screen to Continue >", 180, 180, 150, true);
                    this.flik = false;
                }
                else {
                    this.drawcs(g, 110 + 80 * this.nb, "Click Screen to Continue >", 255, 255, 240, true);
                    this.flik = true;
                }
            }
            else {
                this.drawcs(g, 110 + 80 * this.nb, "Click screen or Press Enter to continue >", 180, 180, 150, true);
            }
            if (!control.canclick) {
                control.canclick = true;
            }
            if (control.space) {
                control.canclick = false;
                if (this.nb != 0) {
                    for (int j4 = 0; j4 < this.nb; ++j4) {
                        aconto[this.ob[j4]].x = this.obx[j4];
                        aconto[this.ob[j4]].y = this.oby[j4];
                        aconto[this.ob[j4]].z = this.obz[j4];
                    }
                    this.fase = 0;
                }
                else {
                    this.fase = -5;
                    if (this.sgame == 1) {
                        this.select = 1;
                    }
                    else {
                        this.select = 0;
                    }
                }
                control.space = false;
            }
        }
        if (this.fase == 1) {
            g.drawImage(this.mback, 0, 0, null);
            if (this.frst) {
                this.frst = false;
            }
            if (control.space) {
                this.fase = -3;
                control.space = false;
                this.drawcs(g, 230, "Loading Mission " + (this.level + 1) + " again...", 255, 255, 255, true);
            }
            else {
                if (!control.jade) {
                    this.drawcs(g, 250, "Don't forget to press the  [J]  key to escape lasers...", 225, 225, 225, false);
                }
                this.drawcs(g, 300, "Press Enter to continue", 225, 225, 225, false);
            }
        }
        if (this.fase == 2) {
            g.drawImage(this.mback, 0, 0, null);
            if (this.alldest()) {
                this.drawcs(g, 180, "All your ships were destroyed!", 255, 255, 255, true);
            }
            else {
                this.drawcs(g, 180, "The mars station was destroyed!", 255, 255, 255, true);
            }
            this.drawcs(g, 320, "Press Enter to continue", 225, 225, 225, true);
            if (control.space) {
                this.fase = -5;
                if (this.alldest() && this.sgame == 1) {
                    this.select = 1;
                }
                else {
                    this.select = 0;
                }
                control.space = false;
            }
        }
        if (this.fase == 3) {
            g.drawImage(this.mback, 0, 0, null);
            this.drawcs(g, 163, "Resume Game", 255, 255, 255, false);
            this.drawcs(g, 183, "Game Controls", 255, 255, 255, false);
            this.drawcs(g, 203, "Quit Game", 255, 255, 255, false);
            if (this.flik) {
                g.setColor(new Color(255, 0, 0));
                this.flik = false;
            }
            else {
                g.setColor(new Color(0, 128, 255));
                this.flik = true;
            }
            g.drawRect(190, 153 + this.select * 20, 120, 11);
            if (control.down) {
                ++this.select;
                control.down = false;
            }
            if (control.up) {
                --this.select;
                control.up = false;
            }
            if (this.select == 3) {
                this.select = 0;
            }
            if (this.select == -1) {
                this.select = 2;
            }
            if (control.space) {
                if (this.select == 1) {
                    this.fase = -7;
                    this.oldfase = 3;
                    control.space = false;
                }
                if (this.select == 2) {
                    this.fase = -5;
                    if (this.sgame == 1) {
                        this.select = 1;
                    }
                    else {
                        this.select = 0;
                    }
                    control.space = false;
                }
            }
            this.drawcs(g, 354, "( use keyboard arrows to select )", 210, 210, 210, false);
        }
        if (this.fase == 5 || this.fase == 6 || this.fase == 7) {
            g.setColor(new Color(255, 255, 255));
            g.fillRect(80, 60, 340, 190);
            aconto[(int)(Math.random() * 5.0)].d(g);
            int k4 = 0;
            do {
                final ContO contO5 = aconto[k4];
                contO5.zy += 5;
                final ContO contO6 = aconto[k4];
                --contO6.xy;
            } while (++k4 < 5);
            if (aconto[0].zy == 360) {
                aconto[0].zy = 0;
                g.setColor(new Color(255, 255, 0));
                int l4 = 0;
                do {
                    g.drawLine(l4 * 2, 0, l4 * 2, 360);
                } while (++l4 < 250);
            }
            g.drawImage(this.rad, 93, 32, null);
            if (this.fase == 5) {
                this.drawcs(g, 84, "Wild Polygons 3D engine by:", 0, 0, 0, false);
                this.drawcs(g, 96, "Omar Waly", 100, 100, 100, false);
                this.drawcs(g, 114, "3D models by:", 0, 0, 0, false);
                this.drawcs(g, 126, "Omar Waly", 100, 100, 100, false);
                this.drawcs(g, 144, "Game programming by:", 0, 0, 0, false);
                this.drawcs(g, 156, "Omar Waly", 100, 100, 100, false);
                this.drawcs(g, 174, "Graphics by:", 0, 0, 0, false);
                this.drawcs(g, 186, "Omar Waly", 100, 100, 100, false);
                this.drawcs(g, 204, "This version of the game was updated and is maintained by:", 0, 0, 0, false);
                this.drawcs(g, 216, "Jaroslav Paska (Phyrexian)", 100, 100, 100, false);
            }
            if (this.fase == 6) {
                this.drawcs(g, 80, "Music was obtained from FlashKit.com", 0, 0, 0, false);
                this.drawcs(g, 92, "and by the following artists:", 0, 0, 0, false);
                this.drawcs(g, 118, ".::Dj Hemp::.", 100, 100, 100, false);
                this.drawcs(g, 130, "Gen A Dee", 100, 100, 100, false);
                this.drawcs(g, 142, "Alex Volkmar", 100, 100, 100, false);
                this.drawcs(g, 154, "Empty", 100, 100, 100, false);
                this.drawcs(g, 166, "[BoD]Raven", 100, 100, 100, false);
                this.drawcs(g, 178, "Jeff Heysen", 100, 100, 100, false);
                this.drawcs(g, 190, "Degz", 100, 100, 100, false);
                this.drawcs(g, 202, "Justin Perkins", 100, 100, 100, false);
                this.drawcs(g, 214, "and Vika", 100, 100, 100, false);
            }
            if (this.fase == 7) {
                if (this.flik) {
                    this.drawcs(g, 140, "G a m e   C o m p l e t e !", 255, 0, 0, false);
                    this.flik = false;
                }
                else {
                    this.drawcs(g, 140, "G a m e   C o m p l e t e !", 0, 128, 255, true);
                    this.flik = true;
                }
                this.drawcs(g, 180, ">  Press Enter to continue  >", 150, 150, 150, false);
                ++this.cnt;
                if (this.cnt > 140) {
                    control.space = true;
                }
            }
            else {
                this.drawcs(g, 246, "Press Enter to continue >", 150, 150, 150, false);
            }
            this.drawcs(g, 354, "Copyright © RadicalPlay.com", 255, 255, 255, true);
            if (control.space && this.fase != 7) {
                if (this.fase == 5) {
                    this.fase = 6;
                }
                else {
                    int i4 = 0;
                    do {
                        aconto[i4].out = true;
                        aconto[i4].wire = false;
                    } while (++i4 < 5);
                    this.fase = -5;
                }
                control.space = false;
            }
        }
    }
    
    public void drawefimg(final Image image) {
        this.saveit(image, this.pix);
        int i = 0;
        do {
            final Color color = new Color(this.pix[i]);
            final Color color2 = new Color(this.bpix[i]);
            int j = (color.getRed() + color2.getRed()) / 2;
            if (j > 225) {
                j = 225;
            }
            if (j < 0) {
                j = 0;
            }
            int k = (color.getGreen() + color2.getGreen()) / 2;
            if (k > 225) {
                k = 225;
            }
            if (k < 0) {
                k = 0;
            }
            int l = (color.getBlue() + color2.getBlue()) / 2;
            if (l > 225) {
                l = 225;
            }
            if (l < 0) {
                l = 0;
            }
            final Color color3 = new Color(j, k, l);
            this.pix[i] = color3.getRGB();
        } while (++i < 180000);
        this.mback = this.createImage(new MemoryImageSource(500, 360, this.pix, 0, 500));
    }
    
    public boolean alldest() {
        int i = 0;
        int j = 0;
        do {
            if (this.dest[j]) {
                ++i;
            }
        } while (++j < 5);
        return i == 5;
    }
    
    public void drawpimg(final Image image) {
        this.saveit(image, this.pix);
        int i = 0;
        do {
            int j = 0;
            do {
                final Color color = new Color(this.pix[i + j * 500]);
                final Color color2 = new Color(this.ppix[i + j * 500]);
                int k = 0;
                int l = 0;
                int i2 = 0;
                if (i > 150 && i < 350 && j > 130 && j < 230) {
                    k = (color.getRed() + color2.getRed()) / 4;
                    if (k > 225) {
                        k = 225;
                    }
                    if (k < 0) {
                        k = 0;
                    }
                    l = (color.getGreen() + color2.getGreen()) / 4;
                    if (l > 225) {
                        l = 225;
                    }
                    if (l < 0) {
                        l = 0;
                    }
                    i2 = (color.getBlue() + color2.getBlue()) / 4;
                    if (i2 > 225) {
                        i2 = 225;
                    }
                    if (i2 < 0) {
                        i2 = 0;
                    }
                }
                else {
                    k = (color.getRed() + color2.getRed()) / 2;
                    if (k > 225) {
                        k = 225;
                    }
                    if (k < 0) {
                        k = 0;
                    }
                    l = (color.getGreen() + color2.getGreen()) / 2;
                    if (l > 225) {
                        l = 225;
                    }
                    if (l < 0) {
                        l = 0;
                    }
                    i2 = (color.getBlue() + color2.getBlue()) / 2;
                    if (i2 > 225) {
                        i2 = 225;
                    }
                    if (i2 < 0) {
                        i2 = 0;
                    }
                }
                final Color color3 = new Color(k, l, i2);
                this.pix[i + j * 500] = color3.getRGB();
            } while (++j < 360);
        } while (++i < 500);
        this.mback = this.createImage(new MemoryImageSource(500, 360, this.pix, 0, 500));
    }
    
    public int ys(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.m.focus_point) * (this.m.cy - i) / j + i;
    }
    
    public void reset() {
        int i = 0;
        do {
            this.dest[i] = false;
        } while (++i < 5);
        this.level = 0;
    }
    
    public void creset() {
        this.cnt = 0;
        this.flik = false;
        this.cnts = 10;
        this.cntf = 0;
        this.left = false;
        this.wcnt = 0;
        this.rcnt = 0;
        this.cnty = 0;
    }
    
    public xtGraphics(final Medium medium, final Graphics g) {
        this.ws = new int[] { 62, 73, 59, 40, 50 };
        this.goodsun = false;
        this.cl = 1;
        this.as = new Image[5];
        this.pix = new int[180000];
        this.bpix = new int[180000];
        this.mpix = new int[180000];
        this.opix = new int[180000];
        this.ppix = new int[180000];
        this.cnt = 0;
        this.flik = false;
        this.cnts = 10;
        this.mname = new String[19];
        this.cnte = new int[19];
        this.cntf = 0;
        this.left = false;
        this.wcnt = 0;
        this.rcnt = 0;
        this.cnty = 0;
        this.fase = -8;
        this.selected = 4;
        this.select = 0;
        this.frst = false;
        this.oldfase = -5;
        this.nb = 0;
        this.ob = new int[3];
        this.nam = new String[3];
        this.tnk = new boolean[3];
        this.obx = new int[3];
        this.oby = new int[3];
        this.obz = new int[3];
        this.sgame = -1;
        this.level = 0;
        this.dest = new boolean[10];
        this.mcomp = false;
        this.tcnt = 1;
        this.m = medium;
        this.ftm = g.getFontMetrics();
    }
    
    public void saveit(final Image image, final int[] ai) {
        final PixelGrabber pixelgrabber = new PixelGrabber(image, 0, 0, 500, 360, ai, 0, 500);
        try {
            pixelgrabber.grabPixels();
        }
        catch (final InterruptedException ex) {}
    }
    
    public int xs(final int i, int j) {
        if (j < 10) {
            j = 10;
        }
        return (j - this.m.focus_point) * (this.m.cx - i) / j + i;
    }
    
    public int getcpy(final ContO conto, final ContO conto1) {
        return (conto.x - conto1.x) / 100 * ((conto.x - conto1.x) / 100) + (conto.y - conto1.y) / 100 * ((conto.y - conto1.y) / 100) + (conto.z - conto1.z) / 100 * ((conto.z - conto1.z) / 100);
    }
    
    public void drawop(final Graphics g, final Image image) {
        this.saveit(image, this.pix);
        int i = 0;
        do {
            final Color color = new Color(this.pix[i]);
            int j = Math.abs(255 - color.getRed());
            if (j > 255) {
                j = 255;
            }
            if (j < 0) {
                j = 0;
            }
            int k = Math.abs(255 - color.getGreen());
            if (k > 255) {
                k = 255;
            }
            if (k < 0) {
                k = 0;
            }
            int l = Math.abs(255 - color.getBlue());
            if (l > 255) {
                l = 255;
            }
            if (l < 0) {
                l = 0;
            }
            final Color color2 = new Color(j, k, l);
            this.pix[i] = color2.getRGB();
        } while (++i < 180000);
        g.drawImage(this.createImage(new MemoryImageSource(500, 360, this.pix, 0, 500)), 0, 0, null);
    }
    
    public void cmback(final int i) {
        int j = 0;
        do {
            int k = 0;
            do {
                this.pix[j + k * 500] = this.mpix[j + k * 500];
                for (int l = 0; l < i; ++l) {
                    if (j > 82 && j < 416 && k > 95 + l * 80 && k < 147 + l * 80) {
                        final Color color = new Color(222, 184, 34);
                        final Color color2 = new Color(this.pix[j + k * 500]);
                        int i2 = (color.getRed() + color2.getRed()) / 2;
                        if (i2 > 225) {
                            i2 = 225;
                        }
                        if (i2 < 0) {
                            i2 = 0;
                        }
                        int j2 = (color.getGreen() + color2.getGreen()) / 2;
                        if (j2 > 225) {
                            j2 = 225;
                        }
                        if (j2 < 0) {
                            j2 = 0;
                        }
                        int k2 = (color.getBlue() + color2.getBlue()) / 2;
                        if (k2 > 225) {
                            k2 = 225;
                        }
                        if (k2 < 0) {
                            k2 = 0;
                        }
                        final Color color3 = new Color(i2, j2, k2);
                        this.pix[j + k * 500] = color3.getRGB();
                    }
                }
            } while (++k < 360);
        } while (++j < 500);
        this.mback = this.createImage(new MemoryImageSource(500, 360, this.pix, 0, 500));
    }
    
    public void drawl(final Graphics g, final Image image) {
        this.saveit(image, this.pix);
        int i = 0;
        do {
            final Color color = new Color(this.pix[i]);
            int j = Math.abs((color.getRed() - 15) / 2);
            if (j > 225) {
                j = 225;
            }
            if (j < 0) {
                j = 0;
            }
            int k = Math.abs((color.getGreen() - 10) / 2);
            if (k > 225) {
                k = 225;
            }
            if (k < 0) {
                k = 0;
            }
            int l = Math.abs((color.getBlue() + 20) / 2);
            if (l > 225) {
                l = 225;
            }
            if (l < 0) {
                l = 0;
            }
            final Color color2 = new Color(j, k, l);
            this.pix[i] = color2.getRGB();
        } while (++i < 180000);
        g.drawImage(this.createImage(new MemoryImageSource(500, 360, this.pix, 0, 500)), 0, 0, null);
    }
    
    public void drawovimg(final Image image) {
        this.saveit(image, this.pix);
        int i = 0;
        do {
            final Color color = new Color(this.pix[i]);
            final Color color2 = new Color(this.opix[i]);
            int j = (int)((color.getRed() / 1.7 + color2.getRed()) / 2.0);
            if (j > 225) {
                j = 225;
            }
            if (j < 0) {
                j = 0;
            }
            int k = (int)((color.getGreen() / 1.7 + color2.getGreen()) / 2.0);
            if (k > 225) {
                k = 225;
            }
            if (k < 0) {
                k = 0;
            }
            int l = (int)((color.getBlue() / 1.7 + color2.getBlue()) / 2.0);
            if (l > 225) {
                l = 225;
            }
            if (l < 0) {
                l = 0;
            }
            final Color color3 = new Color(j, k, l);
            this.pix[i] = color3.getRGB();
        } while (++i < 180000);
        this.mback = this.createImage(new MemoryImageSource(500, 360, this.pix, 0, 500));
    }
    
    public void dtrakers(final Graphics g, final int[] ai, final int[] ai1, final int i, final ContO[] aconto, final userCraft usercraft, final Control control) {
        this.cl = 1;
        int j = this.getcpy(aconto[ai1[0]], aconto[ai1[1]]);
        for (int l = 2; l < i; ++l) {
            if (j == 0 || aconto[ai1[this.cl]].exp) {
                this.cl = l;
                j = this.getcpy(aconto[ai1[0]], aconto[ai1[l]]);
            }
            else {
                final int i2 = this.getcpy(aconto[ai1[0]], aconto[ai1[l]]);
                if ((i2 > 0 || j == 0) && i2 < j && !aconto[ai1[l]].exp) {
                    j = i2;
                    this.cl = l;
                }
            }
        }
        final int[] ai2 = new int[4];
        final int[] ai3 = new int[4];
        boolean flag = false;
        boolean flag2 = false;
        int j2 = 0;
        for (int k1 = 1; k1 < i; ++k1) {
            char c = '\u03e8';
            if (ai[k1] == 1) {
                c = '\u0fa0';
            }
            final int m = this.getcpy(aconto[ai1[0]], aconto[ai1[k1]]);
            if (m > c && !aconto[ai1[k1]].exp) {
                final int l2 = this.m.cx + (int)((aconto[ai1[k1]].x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz) - (aconto[ai1[k1]].z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz));
                final int k2 = this.m.cz + (int)((aconto[ai1[k1]].x - this.m.x - this.m.cx) * this.m.cs.getsin(this.m.xz) + (aconto[ai1[k1]].z - this.m.z - this.m.cz) * this.m.cs.getcos(this.m.xz));
                final int j3 = this.m.cz + (int)((aconto[ai1[k1]].y - this.m.y - this.m.cy) * this.m.cs.getsin(this.m.zy) + (k2 - this.m.cz) * this.m.cs.getcos(this.m.zy));
                if (j3 > 100) {
                    final int i3 = this.m.cy + (int)((aconto[ai1[k1]].y - this.m.y - this.m.cy) * this.m.cs.getcos(this.m.zy) - (k2 - this.m.cz) * this.m.cs.getsin(this.m.zy));
                    final int k3 = this.xs(l2, j3);
                    final int i4 = this.ys(i3, j3);
                    if (k3 > 0 && k3 < this.m.w && i4 > 0 && i4 < this.m.h) {
                        if (!flag && m != 0 && m < 10000) {
                            flag = true;
                        }
                        if (ai[k1] == 0) {
                            if (!aconto[ai1[k1]].fire) {
                                g.setColor(new Color(164, 209, 255));
                            }
                            else {
                                g.setColor(new Color(164, 229, 255));
                            }
                        }
                        else if (!aconto[ai1[k1]].fire) {
                            g.setColor(new Color(255, 150, 100));
                        }
                        else {
                            g.setColor(new Color(255, 180, 100));
                        }
                        ai2[0] = k3 - 10;
                        ai3[0] = i4 - 10;
                        ai2[1] = k3 + 10;
                        ai3[1] = i4 - 10;
                        ai2[2] = k3 + 10;
                        ai3[2] = i4 + 10;
                        ai2[3] = k3 - 10;
                        ai3[3] = i4 + 10;
                        g.drawPolygon(ai2, ai3, 4);
                    }
                }
            }
            if (aconto[ai1[k1]].exp) {
                if (this.cnte[k1 - 1] < 20 && !flag2) {
                    if (this.cntf < 2) {
                        if (aconto[ai1[k1]].nhits >= aconto[ai1[k1]].maxhits) {
                            this.drawcs(g, 120, this.mname[k1 - 1] + " distroyd!", 255, 255, 128, false);
                        }
                        else {
                            this.drawcs(g, 120, this.mname[k1 - 1] + " Crashed!", 255, 255, 128, false);
                        }
                    }
                    else if (aconto[ai1[k1]].nhits >= aconto[ai1[k1]].maxhits) {
                        this.drawcs(g, 120, this.mname[k1 - 1] + " distroyd!", 186, 223, 57, false);
                    }
                    else {
                        this.drawcs(g, 120, this.mname[k1 - 1] + " Crashed!", 186, 223, 57, false);
                    }
                    if (this.cntf < 2) {
                        ++this.cntf;
                    }
                    else {
                        this.cntf = 0;
                    }
                    final int[] cnte = this.cnte;
                    final int n = k1 - 1;
                    ++cnte[n];
                    flag2 = true;
                }
                else {
                    ++j2;
                }
            }
        }
        if (!this.mcomp && j2 == i - 1) {
            this.mcomp = true;
            this.select = 0;
        }
        if (this.mcomp && !aconto[ai1[0]].exp) {
            if (this.rcnt == 0) {
                this.rcnt = 1;
            }
            else {
                g.setColor(new Color(50 + (int)(Math.random() * 200.0), 50 + (int)(Math.random() * 200.0), 50 + (int)(Math.random() * 200.0)));
                g.fillRect(110, 67, 270, 13);
                this.rcnt = 0;
            }
            g.drawImage(this.complete, 105, 60, null);
            this.drawcs(g, 300, "Press Enter to continue", 0, 0, 0, false);
        }
        if (!flag && !aconto[ai1[this.cl]].exp) {
            boolean flag3 = false;
            final int j4 = this.m.cx + (int)((aconto[ai1[this.cl]].x - this.m.x - this.m.cx) * this.m.cs.getcos(this.m.xz) - (aconto[ai1[this.cl]].z - this.m.z - this.m.cz) * this.m.cs.getsin(this.m.xz));
            final int i5 = this.m.cz + (int)((aconto[ai1[this.cl]].x - this.m.x - this.m.cx) * this.m.cs.getsin(this.m.xz) + (aconto[ai1[this.cl]].z - this.m.z - this.m.cz) * this.m.cs.getcos(this.m.xz));
            final int l3 = this.m.cz + (int)((aconto[ai1[this.cl]].y - this.m.y - this.m.cy) * this.m.cs.getsin(this.m.zy) + (i5 - this.m.cz) * this.m.cs.getcos(this.m.zy));
            final int k4 = this.m.cy + (int)((aconto[ai1[this.cl]].y - this.m.y - this.m.cy) * this.m.cs.getcos(this.m.zy) - (i5 - this.m.cz) * this.m.cs.getsin(this.m.zy));
            int j5 = this.ys(k4, l3);
            int l4 = this.xs(j4, l3);
            if (l4 < this.m.w && l4 > 0) {
                if (j5 > this.m.h || j5 < 0) {
                    if (l4 > this.m.w - 10) {
                        l4 = this.m.w - 50;
                    }
                    if (l4 < 5) {
                        l4 = 50;
                    }
                    if (k4 > this.m.cy) {
                        ai2[0] = l4;
                        ai3[0] = this.m.h - 1;
                        ai2[1] = l4 - 5;
                        ai3[1] = this.m.h - 20;
                        ai2[2] = l4 + 5;
                        ai3[2] = this.m.h - 20;
                        flag3 = true;
                    }
                    else {
                        ai3[0] = 1;
                        ai2[0] = l4;
                        ai3[1] = 20;
                        ai2[1] = l4 - 5;
                        ai3[2] = 20;
                        ai2[2] = l4 + 5;
                        flag3 = true;
                    }
                }
            }
            else {
                if (j5 > this.m.h - 10) {
                    j5 = this.m.h - 50;
                }
                if (j5 < 5) {
                    j5 = 50;
                }
                if (j4 > this.m.cx) {
                    ai2[0] = this.m.w - 1;
                    ai3[0] = j5;
                    ai2[1] = this.m.w - 20;
                    ai3[1] = j5 - 5;
                    ai2[2] = this.m.w - 20;
                    ai3[2] = j5 + 5;
                    flag3 = true;
                }
                else {
                    ai2[0] = 1;
                    ai3[0] = j5;
                    ai2[1] = 20;
                    ai3[1] = j5 - 5;
                    ai2[2] = 20;
                    ai3[2] = j5 + 5;
                    flag3 = true;
                }
            }
            if (flag3) {
                if (ai[this.cl] == 0) {
                    g.setColor(new Color(164, 209, 255));
                }
                else {
                    g.setColor(new Color(255, 180, 100));
                }
                g.fillPolygon(ai2, ai3, 3);
            }
        }
        if (aconto[ai1[0]].nhits > aconto[ai1[0]].maxhits - aconto[ai1[0]].maxhits / 3 && !aconto[ai1[0]].exp && !this.mcomp) {
            if (this.cnt > 90) {
                if (this.flik) {
                    this.drawcs(g, 300, "Recharge Ship !", 255, 255, 255, false);
                    this.flik = false;
                }
                else {
                    this.drawcs(g, 300, "Recharge Ship !", 200, 200, 200, false);
                    this.flik = true;
                }
            }
            else {
                this.drawcs(g, 300, "Damage Critical", 255, 0, 0, false);
            }
            ++this.cnt;
            if (this.cnt == 130) {
                this.cnt = 0;
            }
        }
        if (control.jump >= 1 && usercraft.njumps == 0) {
            this.drawcs(g, 330, "Light speed jumps expired - Recharge Ship !", 255, 255, 255, false);
            ++control.jump;
            if (control.jump == 40) {
                control.jump = 0;
            }
        }
        if (usercraft.ester != 0 && !aconto[ai1[0]].exp && !this.mcomp) {
            this.drawcs(g, 300, "Ship Recharged !", 255 * this.m.er, 255 - this.m.eg * 100, 64 + this.m.eb * 191, false);
        }
        if (control.radar && !this.mcomp) {
            g.drawImage(this.radar, 200, 60, null);
            int l5 = aconto[ai1[0]].zy;
            int k5 = -aconto[ai1[0]].xz;
            while (l5 > 360) {
                l5 -= 360;
            }
            while (l5 < 0) {
                l5 += 360;
            }
            if (l5 > 90 && l5 < 270) {
                k5 += 180;
            }
            for (int j6 = 1; j6 < i; ++j6) {
                if (!aconto[ai1[j6]].exp) {
                    int i6 = this.m.cx + (int)((aconto[ai1[j6]].x - this.m.x - this.m.cx) * this.m.cs.getcos(k5) - (aconto[ai1[j6]].z - this.m.z - this.m.cz) * this.m.cs.getsin(k5));
                    int l6 = this.m.cz + (int)((aconto[ai1[j6]].x - this.m.x - this.m.cx) * this.m.cs.getsin(k5) + (aconto[ai1[j6]].z - this.m.z - this.m.cz) * this.m.cs.getcos(k5));
                    g.setColor(new Color(0, 255, 128));
                    i6 = i6 / 400 + 249;
                    l6 = -l6 / 400 + 109;
                    if (i6 < 204) {
                        i6 = 204;
                    }
                    if (i6 > 296) {
                        i6 = 296;
                    }
                    if (l6 < 64) {
                        l6 = 64;
                    }
                    if (l6 > 156) {
                        l6 = 156;
                    }
                    g.fillRect(i6, l6, 2, 2);
                }
            }
        }
        if (control.plus || control.mins || this.cnts < 10) {
            g.setColor(new Color(0, 0, 0));
            g.drawString("" + usercraft.rspeed + " zic/tes", 50, 55);
            g.drawImage(this.stube, 50, 60, null);
            final int i7 = (int)(260.0f - usercraft.rspeed * (200.0f / usercraft.maxspeed[usercraft.ltyp]));
            g.setColor(new Color(255, i7 - 10, 0));
            g.fillRect(61, i7, 12, 260 - i7);
            if (control.plus || control.mins) {
                this.cnts = 0;
            }
            else {
                ++this.cnts;
            }
        }
        if (this.tcnt != 0) {
            if (usercraft.rspeed == 0) {
                ++this.tcnt;
            }
            else {
                this.tcnt = 0;
            }
            if (!control.space) {
                if (this.tcnt > 90) {
                    this.drawcs(g, 80, "Press Enter for game controls and to pause game!", 255, 255, 255, false);
                }
            }
            else {
                this.tcnt = 0;
            }
        }
    }
    
    public void drawcs(final Graphics g, final int i, final String s, final int j, final int k, final int l, final boolean flag) {
        if (flag) {
            g.setColor(new Color(0, 0, 0));
            g.drawString(s, 250 - this.ftm.stringWidth(s) / 2 + 1, i + 1);
        }
        g.setColor(new Color(j, k, l));
        g.drawString(s, 250 - this.ftm.stringWidth(s) / 2, i);
    }
}
