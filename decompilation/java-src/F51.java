import java.awt.Toolkit;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.WindowListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowAdapter;
import java.awt.Frame;
import java.net.URISyntaxException;
import java.io.IOException;
import java.net.URI;
import java.awt.Desktop;
import java.io.Reader;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.PrintWriter;
import java.awt.Font;
import java.awt.Color;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.io.InputStream;
import java.io.DataInputStream;
import java.io.FileInputStream;
import javax.imageio.ImageIO;
import java.util.HashSet;
import java.awt.image.ImageObserver;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import java.io.File;
import java.awt.Event;
import java.util.Set;
import javax.sound.sampled.Clip;
import java.awt.Image;
import java.awt.Graphics;
import java.awt.Panel;

// 
// Decompiled by Procyon v0.6.0
// 

public class F51 extends Panel implements Runnable
{
    Graphics rd;
    Image offImage;
    Thread gamer;
    boolean mon;
    String moner;
    String[] obj;
    String sndfrm;
    boolean nounif;
    Control u;
    boolean tab;
    int view;
    int maxco;
    int maxmo;
    Clip upl;
    Clip low;
    Clip med;
    Clip downl;
    Clip ljump;
    Clip grnd;
    Clip exp;
    Clip exph;
    Clip hit;
    Clip hitl;
    Clip charged;
    Clip into;
    Clip miso;
    Clip mano;
    Clip selo;
    Clip[] las;
    Clip[] mtrak;
    boolean[] loadet;
    boolean plow;
    boolean pmed;
    boolean pexph;
    boolean pint;
    boolean pmis;
    boolean pman;
    boolean psel;
    boolean nomusic;
    boolean nosound;
    boolean enterd;
    boolean sosun;
    int pgrnd;
    int pdownl;
    int pupl;
    int lascnt;
    int crntt;
    int plcnt;
    int frags;
    int dnload;
    Set<Integer> viewOneKeys;
    Set<Integer> viewTwoKeys;
    Set<Integer> viewThreeKeys;
    Set<Integer> viewFourKeys;
    Set<Integer> viewFiveKeys;
    Set<Integer> nomusicKeys;
    Set<Integer> switchmusicKeys;
    Set<Integer> nosoundKeys;
    Set<Integer> radarKeys;
    Set<Integer> tabKeys;
    Set<Integer> plusKeys;
    Set<Integer> minsKeys;
    Set<Integer> jumpKeys;
    Set<Integer> enterKeys;
    Set<Integer> fireKeys;
    Set<Integer> leftKeys;
    Set<Integer> rightKeys;
    Set<Integer> downKeys;
    Set<Integer> upKeys;
    Set<Integer> viewOnePressedKeys;
    Set<Integer> viewTwoPressedKeys;
    Set<Integer> viewThreePressedKeys;
    Set<Integer> viewFourPressedKeys;
    Set<Integer> viewFivePressedKeys;
    Set<Integer> radarPressedKeys;
    Set<Integer> plusPressedKeys;
    Set<Integer> minsPressedKeys;
    Set<Integer> enterPressedKeys;
    Set<Integer> tabPressedKeys;
    Set<Integer> firePressedKeys;
    Set<Integer> leftPressedKeys;
    Set<Integer> rightPressedKeys;
    Set<Integer> downPressedKeys;
    Set<Integer> upPressedKeys;
    
    public void stop() {
        this.into.stop();
        this.miso.stop();
        this.selo.stop();
        this.mano.stop();
        this.upl.stop();
        this.downl.stop();
        this.low.stop();
        this.med.stop();
        this.ljump.stop();
        this.grnd.stop();
        this.exp.stop();
        this.exph.stop();
        this.hit.stop();
        this.hitl.stop();
        this.charged.stop();
        int i = 0;
        do {
            this.las[i].stop();
        } while (++i < 5);
        i = 0;
        do {
            if (this.loadet[i]) {
                this.mtrak[i].stop();
            }
        } while (++i < 7);
        if (this.gamer != null) {
            this.gamer.stop();
        }
        this.gamer = null;
        this.rd.dispose();
    }
    
    @Override
    public boolean lostFocus(final Event event, final Object obj1) {
        if (!this.nounif) {
            this.mon = true;
        }
        if (this.maxmo != -1) {
            this.view = 0;
            this.u.radar = false;
            this.u.plus = false;
            this.u.mins = false;
            this.enterd = false;
            this.tab = false;
            this.u.fire = false;
            this.u.left = false;
            this.u.right = false;
            this.u.down = false;
            this.u.up = false;
        }
        return false;
    }
    
    public void playsounds(final userCraft usercraft, final ContO conto, final boolean flag, final xtGraphics xtgraphics) {
        if (!flag) {
            if (!this.nosound) {
                if (!conto.exp && usercraft.speed > 10.0f && !this.pmed) {
                    if (!this.plow) {
                        this.low.loop(-1);
                        this.plow = true;
                    }
                }
                else if (this.plow) {
                    this.low.stop();
                    this.plow = false;
                }
                if (usercraft.speed > 65.0f) {
                    if (!this.pmed) {
                        this.med.loop(-1);
                        this.pmed = true;
                    }
                }
                else if (this.pmed) {
                    this.med.stop();
                    this.pmed = false;
                }
                if (usercraft.speed > 65.0f && this.u.up) {
                    if (this.pupl == 0) {
                        this.pupl = 70;
                        this.upl.setFramePosition(0);
                        this.upl.start();
                    }
                }
                else if (this.pupl != 0) {
                    --this.pupl;
                }
                if (usercraft.speed > 65.0f && this.u.down) {
                    if (this.pdownl == 0) {
                        this.pdownl = 70;
                        this.downl.setFramePosition(0);
                        this.downl.start();
                    }
                }
                else if (this.pdownl != 0) {
                    --this.pdownl;
                }
                if (usercraft.speed == 400.0f) {
                    this.ljump.setFramePosition(0);
                    this.ljump.start();
                }
                if (usercraft.ester == 1) {
                    this.charged.setFramePosition(0);
                    this.charged.start();
                }
                if (conto.hit && this.frags == 0) {
                    this.hit.setFramePosition(0);
                    this.hit.start();
                    if (this.sosun) {
                        this.frags = 3;
                    }
                }
                if (this.sosun && this.frags != 0) {
                    --this.frags;
                }
                if (this.u.fire && !conto.exp) {
                    if (this.lascnt == 0) {
                        this.las[usercraft.ltyp].setFramePosition(0);
                        this.las[usercraft.ltyp].start();
                        this.lascnt = 14;
                    }
                    else {
                        --this.lascnt;
                    }
                }
                else if (this.lascnt != 0) {
                    this.lascnt = 0;
                }
                if (this.pgrnd == 0) {
                    if (!conto.exp && conto.y > 200 && (usercraft.sms[0] == 1 || usercraft.sms[1] == 1 || usercraft.sms[2] == 1 || usercraft.sms[3] == 1)) {
                        this.grnd.setFramePosition(0);
                        this.grnd.start();
                        this.pgrnd = 2;
                    }
                }
                else {
                    --this.pgrnd;
                }
                if (conto.exp) {
                    if (!this.pexph) {
                        this.exph.setFramePosition(0);
                        this.exph.start();
                        this.pexph = true;
                    }
                }
                else if (this.pexph) {
                    this.pexph = false;
                }
            }
            else {
                if (this.pmed) {
                    this.med.stop();
                    this.pmed = false;
                }
                if (this.plow) {
                    this.low.stop();
                    this.plow = false;
                }
            }
            if (this.psel) {
                this.selo.stop();
                this.psel = false;
            }
            if (this.plcnt == 100) {
                ++this.crntt;
                if (this.crntt == 7) {
                    this.crntt = 0;
                }
                if (this.loadet[this.crntt]) {
                    this.mtrak[this.crntt].loop(-1);
                }
                else {
                    this.crntt = -1;
                    int i = 6;
                    do {
                        if (this.loadet[i]) {
                            this.crntt = i;
                        }
                    } while (--i >= 0);
                    if (this.crntt != -1) {
                        this.mtrak[this.crntt].loop(-1);
                    }
                }
            }
            if (this.plcnt != 2000) {
                if (!this.nomusic) {
                    ++this.plcnt;
                }
            }
            else {
                this.plcnt = 80;
                this.mtrak[this.crntt].stop();
            }
        }
        else {
            if (this.pmed) {
                this.med.stop();
                this.pmed = false;
            }
            if (this.plow) {
                this.low.stop();
                this.plow = false;
            }
            if (this.plcnt != 0 && this.crntt != -1 && xtgraphics.fase != -4 && xtgraphics.fase != 1 && xtgraphics.fase != 2) {
                if (this.plcnt >= 100) {
                    this.mtrak[this.crntt].stop();
                }
                if (xtgraphics.fase == 3 && this.plcnt >= 100) {
                    --this.crntt;
                }
                this.plcnt = 0;
            }
            if (xtgraphics.fase == -8 && xtgraphics.cnty < 351 && !this.nomusic) {
                if (!this.pint) {
                    this.into.loop(-1);
                    this.pint = true;
                }
            }
            else {
                if (this.pint) {
                    this.into.stop();
                    this.pint = false;
                }
                if (xtgraphics.cnty == 352) {
                    this.hit.setFramePosition(0);
                    this.hit.start();
                    xtgraphics.cnty = 353;
                }
            }
            if ((xtgraphics.fase == -5 || xtgraphics.fase == 7) && !this.nomusic) {
                if (!this.pman) {
                    this.mano.loop(-1);
                    this.pman = true;
                }
            }
            else if (this.pman) {
                this.mano.stop();
                this.pman = false;
            }
            if (xtgraphics.fase == -1 && !this.nomusic) {
                if (!this.pmis) {
                    this.miso.loop(-1);
                    this.pmis = true;
                }
            }
            else if (this.pmis) {
                this.miso.stop();
                this.pmis = false;
            }
            if ((xtgraphics.fase == 0 || xtgraphics.fase == 5 || xtgraphics.fase == 6) && !this.nomusic) {
                if (!this.psel) {
                    this.selo.loop(-1);
                    this.psel = true;
                }
            }
            else if (this.psel) {
                this.selo.stop();
                this.psel = false;
            }
            if (xtgraphics.fase == 7) {
                if (this.pupl == 0) {
                    this.pupl = 30;
                    this.upl.setFramePosition(0);
                    this.upl.start();
                }
                else {
                    --this.pupl;
                }
            }
        }
    }
    
    private Clip getSound(final String s) {
        Clip clip = null;
        try {
            final AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(new File(s));
            clip = AudioSystem.getClip();
            clip.open(audioInputStream);
        }
        catch (final Exception e) {
            e.printStackTrace();
        }
        return clip;
    }
    
    public String getstring(final String s, final String s1, final int i) {
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
        return s2;
    }
    
    public int getint(final String s, final String s1, final int i) {
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
    
    @Override
    public void paint(final Graphics g) {
        g.drawImage(this.offImage, 0, 0, this);
    }
    
    public F51() {
        this.viewOneKeys = new HashSet<Integer>();
        this.viewTwoKeys = new HashSet<Integer>();
        this.viewThreeKeys = new HashSet<Integer>();
        this.viewFourKeys = new HashSet<Integer>();
        this.viewFiveKeys = new HashSet<Integer>();
        this.nomusicKeys = new HashSet<Integer>();
        this.switchmusicKeys = new HashSet<Integer>();
        this.nosoundKeys = new HashSet<Integer>();
        this.radarKeys = new HashSet<Integer>();
        this.tabKeys = new HashSet<Integer>();
        this.plusKeys = new HashSet<Integer>();
        this.minsKeys = new HashSet<Integer>();
        this.jumpKeys = new HashSet<Integer>();
        this.enterKeys = new HashSet<Integer>();
        this.fireKeys = new HashSet<Integer>();
        this.leftKeys = new HashSet<Integer>();
        this.rightKeys = new HashSet<Integer>();
        this.downKeys = new HashSet<Integer>();
        this.upKeys = new HashSet<Integer>();
        this.viewOnePressedKeys = new HashSet<Integer>();
        this.viewTwoPressedKeys = new HashSet<Integer>();
        this.viewThreePressedKeys = new HashSet<Integer>();
        this.viewFourPressedKeys = new HashSet<Integer>();
        this.viewFivePressedKeys = new HashSet<Integer>();
        this.radarPressedKeys = new HashSet<Integer>();
        this.plusPressedKeys = new HashSet<Integer>();
        this.minsPressedKeys = new HashSet<Integer>();
        this.enterPressedKeys = new HashSet<Integer>();
        this.tabPressedKeys = new HashSet<Integer>();
        this.firePressedKeys = new HashSet<Integer>();
        this.leftPressedKeys = new HashSet<Integer>();
        this.rightPressedKeys = new HashSet<Integer>();
        this.downPressedKeys = new HashSet<Integer>();
        this.upPressedKeys = new HashSet<Integer>();
        this.mon = true;
        this.moner = "Click here to Start";
        this.obj = new String[53];
        this.sndfrm = "default";
        this.nounif = false;
        this.u = new Control();
        this.tab = false;
        this.view = 0;
        this.maxco = 0;
        this.maxmo = -1;
        this.las = new Clip[5];
        this.mtrak = new Clip[7];
        this.loadet = new boolean[7];
        this.plow = false;
        this.pmed = false;
        this.pexph = false;
        this.pint = false;
        this.pmis = false;
        this.pman = false;
        this.psel = false;
        this.nomusic = false;
        this.nosound = false;
        this.enterd = false;
        this.sosun = false;
        this.pgrnd = 0;
        this.pdownl = 0;
        this.pupl = 0;
        this.lascnt = 0;
        this.crntt = -1;
        this.plcnt = 0;
        this.frags = 0;
        this.dnload = 0;
    }
    
    public void savegame(final ContO[] aconto, final xtGraphics xtgraphics, final int i) {
        try {
            this.savecookie("radxv", String.valueOf(xtgraphics.level));
            for (int j = i; j < i + 13; ++j) {
                this.savecookie("radnhits" + String.valueOf(j), String.valueOf(aconto[j].nhits));
            }
            int k = 0;
            do {
                this.savecookie("raddest" + String.valueOf(k), String.valueOf((int)(xtgraphics.dest[k] ? 1 : 0)));
            } while (++k < 5);
            xtgraphics.sgame = 1;
        }
        catch (final Exception ex) {}
    }
    
    public void destroy() {
        if (this.gamer != null) {
            this.gamer.stop();
        }
        this.gamer = null;
    }
    
    public void loadrots(final ContO[] aconto, final boolean flag) {
        for (int i = 0; i < this.maxco; ++i) {
            aconto[i].loadrots(flag);
        }
    }
    
    private Image getImage(final String s) {
        Image image = null;
        try {
            image = ImageIO.read(new File(s));
        }
        catch (final Exception e) {
            e.printStackTrace();
        }
        return image;
    }
    
    public void loadbase(final ContO[] aconto, final Medium medium) {
        try {
            final File file = new File("graphics/models.zrad");
            final DataInputStream datainputstream = new DataInputStream(new FileInputStream(file));
            final ZipInputStream zipinputstream = new ZipInputStream(datainputstream);
            ZipEntry zipentry = zipinputstream.getNextEntry();
            final Object obj1 = null;
            int i = 0;
            while (zipentry != null) {
                int j = (int)zipentry.getSize();
                final byte[] abyte0 = new byte[j];
                int k = 0;
                while (j > 0) {
                    final int l = zipinputstream.read(abyte0, k, j);
                    k += l;
                    j -= l;
                }
                aconto[i] = new ContO(abyte0, medium, 0, 0, 0);
                this.obj[i] = zipentry.getName();
                ++i;
                zipentry = zipinputstream.getNextEntry();
            }
            zipinputstream.close();
            datainputstream.close();
        }
        catch (final Exception exception) {
            System.out.println("Error Reading Models: " + exception);
        }
        System.gc();
    }
    
    @Override
    public void update(final Graphics g) {
        this.paint(g);
    }
    
    public void loadmovers(final int[] ai, final int[] ai1, final ContO[] aconto, final Craft[] acraft, final Tank[] atank, final userCraft usercraft, final xtGraphics xtgraphics) {
        for (int i = 1; i < this.maxmo; ++i) {
            aconto[ai[i]].out = true;
        }
        this.maxmo = 1;
        xtgraphics.nb = 0;
        xtgraphics.mcomp = false;
        try {
            final File file = new File("levels/" + xtgraphics.level + ".txt");
            final DataInputStream datainputstream = new DataInputStream(new FileInputStream(file));
            String s;
            while ((s = datainputstream.readLine()) != null) {
                final String s2 = "" + s.trim();
                if (s2.startsWith("craft")) {
                    ai[this.maxmo] = this.getint("craft", s2, 0);
                    ai1[this.maxmo] = 0;
                }
                if (s2.startsWith("tank")) {
                    ai[this.maxmo] = this.getint("tank", s2, 0);
                    ai1[this.maxmo] = 1;
                }
                if (s2.startsWith("name")) {
                    xtgraphics.mname[this.maxmo - 1] = this.getstring("name", s2, 0);
                    xtgraphics.cnte[this.maxmo - 1] = 0;
                }
                if (s2.startsWith("l")) {
                    aconto[ai[this.maxmo]].x = this.getint("l", s2, 0) * 10;
                    aconto[ai[this.maxmo]].y = this.getint("l", s2, 1) * 10;
                    aconto[ai[this.maxmo]].z = this.getint("l", s2, 2) * 10;
                    aconto[ai[this.maxmo]].out = false;
                    aconto[ai[this.maxmo]].reset();
                }
                if (s2.startsWith("prompt")) {
                    if (this.getstring("prompt", s2, 0).equals("tank")) {
                        xtgraphics.tnk[xtgraphics.nb] = true;
                    }
                    else {
                        xtgraphics.tnk[xtgraphics.nb] = false;
                    }
                    xtgraphics.ob[xtgraphics.nb] = this.getint("prompt", s2, 1);
                    xtgraphics.nam[xtgraphics.nb] = this.getstring("prompt", s2, 2).replace('|', ',');
                    ++xtgraphics.nb;
                }
                if (s2.startsWith("stat")) {
                    if (ai1[this.maxmo] == 0) {
                        acraft[this.maxmo].reset(this.getint("stat", s2, 0), this.getint("stat", s2, 1), this.getint("stat", s2, 2), this.getint("stat", s2, 3), this.getint("stat", s2, 4), this.getint("stat", s2, 5));
                    }
                    else {
                        atank[this.maxmo].reset(this.getint("stat", s2, 0), this.getint("stat", s2, 1));
                    }
                    ++this.maxmo;
                }
            }
            datainputstream.close();
        }
        catch (final Exception ex) {}
        System.gc();
    }
    
    public void set0() {
        try {
            this.savecookie("radxv", "0");
        }
        catch (final Exception ex) {}
    }
    
    @Override
    public boolean keyUp(final Event event, final int i) {
        if (this.viewOnePressedKeys.contains(i)) {
            this.viewOnePressedKeys.remove(i);
            if (this.viewOnePressedKeys.isEmpty() && this.view == 1) {
                this.view = 0;
            }
        }
        if (this.viewTwoPressedKeys.contains(i)) {
            this.viewTwoPressedKeys.remove(i);
            if (this.viewTwoPressedKeys.isEmpty() && this.view == 2) {
                this.view = 0;
            }
        }
        if (this.viewThreePressedKeys.contains(i)) {
            this.viewThreePressedKeys.remove(i);
            if (this.viewThreePressedKeys.isEmpty() && this.view == 3) {
                this.view = 0;
            }
        }
        if (this.viewFourPressedKeys.contains(i)) {
            this.viewFourPressedKeys.remove(i);
            if (this.viewFourPressedKeys.isEmpty() && this.view == 4) {
                this.view = 0;
            }
        }
        if (this.viewFivePressedKeys.contains(i)) {
            this.viewFivePressedKeys.remove(i);
            if (this.viewFivePressedKeys.isEmpty() && this.view == 5) {
                this.view = 0;
            }
        }
        if (this.radarPressedKeys.contains(i)) {
            this.radarPressedKeys.remove(i);
            if (this.radarPressedKeys.isEmpty()) {
                this.u.radar = false;
            }
        }
        if (this.plusPressedKeys.contains(i)) {
            this.plusPressedKeys.remove(i);
            if (this.plusPressedKeys.isEmpty()) {
                this.u.plus = false;
            }
        }
        if (this.minsPressedKeys.contains(i)) {
            this.minsPressedKeys.remove(i);
            if (this.minsPressedKeys.isEmpty()) {
                this.u.mins = false;
            }
        }
        if (this.enterKeys.contains(i)) {
            this.enterPressedKeys.remove(i);
            if (this.enterPressedKeys.isEmpty()) {
                this.enterd = false;
            }
        }
        if (this.tabPressedKeys.contains(i)) {
            this.tabPressedKeys.remove(i);
            if (this.tabPressedKeys.isEmpty()) {
                this.tab = false;
            }
        }
        if (this.firePressedKeys.contains(i)) {
            this.firePressedKeys.remove(i);
            if (this.firePressedKeys.isEmpty()) {
                this.u.fire = false;
            }
        }
        if (this.leftPressedKeys.contains(i)) {
            this.leftPressedKeys.remove(i);
            if (this.leftPressedKeys.isEmpty()) {
                this.u.left = false;
            }
        }
        if (this.rightPressedKeys.contains(i)) {
            this.rightPressedKeys.remove(i);
            if (this.rightPressedKeys.isEmpty()) {
                this.u.right = false;
            }
        }
        if (this.downPressedKeys.contains(i)) {
            this.downPressedKeys.remove(i);
            if (this.downPressedKeys.isEmpty()) {
                this.u.down = false;
            }
        }
        if (this.upPressedKeys.contains(i)) {
            this.upPressedKeys.remove(i);
            if (this.upPressedKeys.isEmpty()) {
                this.u.up = false;
            }
        }
        return false;
    }
    
    public void start() {
        if (this.gamer == null) {
            this.gamer = new Thread(this);
        }
        this.gamer.start();
    }
    
    public void downloadall(final xtGraphics xtgraphics) {
        xtgraphics.radar = this.getImage("graphics/radar.gif");
        this.lstat("Loading Images...", 1);
        xtgraphics.stube = this.getImage("graphics/stube.gif");
        this.lstat("Loading Images...", 2);
        xtgraphics.sback = this.getImage("graphics/select.jpg");
        this.lstat("Loading Images...", 18);
        xtgraphics.destr = this.getImage("graphics/destroyed.gif");
        this.lstat("Loading Images...", 2);
        xtgraphics.saveit(this.getImage("graphics/failed.jpg"), xtgraphics.bpix);
        this.lstat("Loading Images...", 31);
        xtgraphics.saveit(this.getImage("graphics/mission.jpg"), xtgraphics.mpix);
        this.lstat("Loading Images...", 22);
        xtgraphics.saveit(this.getImage("graphics/over.jpg"), xtgraphics.opix);
        this.lstat("Loading Images...", 21);
        xtgraphics.saveit(this.getImage("graphics/paused.jpg"), xtgraphics.ppix);
        this.lstat("Loading Images...", 10);
        xtgraphics.lay = this.getImage("graphics/layout.gif");
        this.lstat("Loading Images...", 1);
        xtgraphics.complete = this.getImage("graphics/comp.gif");
        this.lstat("Loading Images...", 2);
        xtgraphics.main = this.getImage("graphics/main.gif");
        this.lstat("Loading Images...", 32);
        xtgraphics.rad = this.getImage("graphics/radicalplay.gif");
        this.lstat("Loading Images...", 2);
        int i = 0;
        do {
            xtgraphics.as[i] = this.getImage("graphics/a" + i + ".gif");
            this.lstat("Loading Images...", 1);
        } while (++i < 5);
        xtgraphics.inst1 = this.getImage("graphics/inst1.gif");
        this.lstat("Loading Images...", 10);
        xtgraphics.inst2 = this.getImage("graphics/inst2.gif");
        this.lstat("Loading Images...", 11);
        xtgraphics.inst3 = this.getImage("graphics/inst3.gif");
        this.lstat("Loading Images...", 4);
        xtgraphics.text = this.getImage("graphics/text.gif");
        this.lstat("Loading Images...", 6);
        xtgraphics.mars = this.getImage("graphics/mars.jpg");
        this.lstat("Loading Images...", 15);
        this.into = this.getSound("music/intro.wav");
        this.lstat("Loading Music...", 24);
        this.miso = this.getSound("music/mission.wav");
        this.lstat("Loading Music...", 29);
        this.selo = this.getSound("music/select.wav");
        this.lstat("Loading Music...", 52);
        this.mano = this.getSound("music/main.wav");
        this.lstat("Loading Music...", 50);
        this.upl = this.getSound("sounds/" + this.sndfrm + "/up.wav");
        this.lstat("Loading Sound Effects...", 11);
        this.hitl = this.getSound("sounds/" + this.sndfrm + "/hitl.wav");
        this.lstat("Loading Sound Effects...", 7);
        this.downl = this.getSound("sounds/" + this.sndfrm + "/down.wav");
        this.lstat("Loading Sound Effects...", 10);
        this.low = this.getSound("sounds/" + this.sndfrm + "/low.wav");
        this.lstat("Loading Sound Effects...", 11);
        this.med = this.getSound("sounds/" + this.sndfrm + "/med.wav");
        this.lstat("Loading Sound Effects...", 6);
        this.ljump = this.getSound("sounds/" + this.sndfrm + "/jump.wav");
        this.lstat("Loading Sound Effects...", 25);
        this.grnd = this.getSound("sounds/" + this.sndfrm + "/grnd.wav");
        this.lstat("Loading Sound Effects...", 5);
        this.exp = this.getSound("sounds/" + this.sndfrm + "/exp.wav");
        this.lstat("Loading Sound Effects...", 10);
        this.exph = this.getSound("sounds/" + this.sndfrm + "/exph.wav");
        this.lstat("Loading Sound Effects...", 12);
        this.hit = this.getSound("sounds/" + this.sndfrm + "/hit.wav");
        this.lstat("Loading Sound Effects...", 25);
        i = 0;
        do {
            this.las[i] = this.getSound("sounds/" + this.sndfrm + "/l" + i + ".wav");
            this.lstat("Loading Sound Effects...", 9);
        } while (++i < 5);
        this.charged = this.getSound("sounds/" + this.sndfrm + "/charged.wav");
        this.lstat("Loading Sound Effects...", 12);
    }
    
    @Override
    public boolean mouseDown(final Event event, final int i, final int j) {
        if (this.maxmo != -1) {
            this.mon = false;
            if (this.moner.equals("Click here to Start")) {
                this.moner = "Click here to Continue";
            }
        }
        if (this.u.canclick) {
            this.u.space = true;
        }
        return true;
    }
    
    public void setmover(final int[] ai, final ContO[] aconto, final userCraft usercraft, final xtGraphics xtgraphics) {
        int i = 0;
        do {
            aconto[i].out = true;
            aconto[i].wire = false;
        } while (++i < 5);
        ai[0] = xtgraphics.selected;
        aconto[ai[0]].x = 3000;
        aconto[ai[0]].y = 250;
        aconto[ai[0]].z = -500;
        aconto[ai[0]].out = false;
        usercraft.reset(ai[0]);
        aconto[ai[0]].reset();
        aconto[ai[0]].xz = 360;
        this.u.jump = 0;
        xtgraphics.creset();
    }
    
    public void loadobjects(final ContO[] aconto, final ContO[] aconto1, final Medium medium, final String s) {
        try {
            final File file = new File("siters/" + s + ".txt");
            final DataInputStream datainputstream = new DataInputStream(new FileInputStream(file));
            boolean flag = false;
            String s2;
            while ((s2 = datainputstream.readLine()) != null) {
                final String s3 = "" + s2.trim();
                if (s3.startsWith("l")) {
                    final String s4 = this.getstring("l", s3, 0);
                    int i;
                    int j;
                    int k;
                    if (!flag) {
                        i = this.getint("l", s3, 1) * 10;
                        j = this.getint("l", s3, 2) * 10;
                        k = this.getint("l", s3, 3) * 10;
                    }
                    else {
                        i = this.getint("l", s3, 1);
                        j = this.getint("l", s3, 2);
                        k = this.getint("l", s3, 3);
                    }
                    int l = 0;
                    do {
                        if (this.obj[l].equals(s4 + ".rad")) {
                            aconto[this.maxco] = new ContO(medium, aconto1[l], i, j, k);
                            ++this.maxco;
                        }
                    } while (++l < 53);
                }
                if (s3.startsWith("xy")) {
                    aconto[this.maxco - 1].xy = this.getint("xy", s3, 0);
                }
                if (s3.startsWith("xz")) {
                    aconto[this.maxco - 1].xz = this.getint("xz", s3, 0);
                }
                if (s3.startsWith("zy")) {
                    aconto[this.maxco - 1].zy = this.getint("zy", s3, 0);
                }
                if (s3.startsWith("xmult")) {
                    flag = !flag;
                }
            }
            datainputstream.close();
        }
        catch (final Exception ex) {}
        System.gc();
    }
    
    @Override
    public void run() {
        this.gamer.setPriority(10);
        final Medium medium = new Medium();
        final xtGraphics xtgraphics = new xtGraphics(medium, this.rd);
        int i = 5;
        final String s = System.getProperty("java.version");
        final String s2 = "";
        if (s2.startsWith("sun.")) {
            if (s.startsWith("1.3")) {
                xtgraphics.goodsun = true;
            }
            else if (s.startsWith("1.4")) {
                this.sosun = true;
            }
            else {
                this.sosun = true;
                this.sndfrm = "newsun";
            }
            i = 15;
        }
        this.lstat("Preparing for loading...", 0);
        final ContO[] aconto = new ContO[53];
        final ContO[] aconto2 = new ContO[3000];
        final userCraft usercraft = new userCraft(medium);
        final Tank[] atank = new Tank[20];
        int j = 0;
        do {
            atank[j] = new Tank(medium);
        } while (++j < 20);
        final Craft[] acraft = new Craft[20];
        int k = 0;
        do {
            acraft[k] = new Craft(medium);
        } while (++k < 20);
        this.loadbase(aconto, medium);
        this.lstat("Loading 3D Models...", 17);
        k = 0;
        this.loadobjects(aconto2, aconto, medium, "aces");
        this.lstat("Loading 3D Models...", 1);
        k = this.maxco;
        this.loadobjects(aconto2, aconto, medium, "base");
        this.lstat("Loading 3D Models...", 2);
        this.loadobjects(aconto2, aconto, medium, "smap");
        this.lstat("Loading 3D Models...", 44);
        this.loadobjects(aconto2, aconto, medium, "clmap" + (int)(Math.random() * 5.0) + "");
        this.lstat("Loading 3D Models...", 1);
        this.loadrots(aconto2, true);
        int l = 0;
        final int[] ai = new int[600];
        for (int i2 = 0; i2 < this.maxco; ++i2) {
            if (aconto2[i2].colides) {
                ai[l] = i2;
                ++l;
            }
        }
        final int[] ai2 = new int[20];
        final int[] ai3 = new int[20];
        int j2 = 0;
        do {
            this.loadet[j2] = false;
        } while (++j2 < 7);
        this.downloadall(xtgraphics);
        final Date date = new Date();
        final long l2 = 0L;
        long l3 = date.getTime();
        float f = 30.0f;
        float f2 = 35.0f;
        boolean flag = false;
        int k2 = 0;
        int i3 = 0;
        boolean flag2 = true;
        this.maxmo = 0;
        while (true) {
            Date date2 = new Date();
            final long l4 = date2.getTime();
            if (!this.mon) {
                if (!flag2) {
                    medium.d(this.rd);
                    int j3 = 0;
                    final int[] ai4 = new int[100];
                    for (int j4 = 0; j4 < this.maxco; ++j4) {
                        if (aconto2[j4].dist != 0) {
                            ai4[j3] = j4;
                            ++j3;
                        }
                        else {
                            aconto2[j4].d(this.rd);
                        }
                    }
                    final int[] ai5 = new int[j3];
                    for (int i4 = 0; i4 < j3; ++i4) {
                        ai5[i4] = 0;
                        for (int k3 = 0; k3 < j3; ++k3) {
                            if (aconto2[ai4[i4]].dist != aconto2[ai4[k3]].dist) {
                                if (aconto2[ai4[i4]].dist < aconto2[ai4[k3]].dist) {
                                    final int[] array = ai5;
                                    final int n = i4;
                                    ++array[n];
                                }
                            }
                            else if (k3 > i4) {
                                final int[] array2 = ai5;
                                final int n2 = i4;
                                ++array2[n2];
                            }
                        }
                    }
                    for (int j5 = 0; j5 < j3; ++j5) {
                        for (int l5 = 0; l5 < j3; ++l5) {
                            if (ai5[l5] == j5) {
                                if (aconto2[ai4[l5]].fire) {
                                    if (ai4[l5] == ai2[0]) {
                                        usercraft.dl(this.rd);
                                    }
                                    else {
                                        for (int k4 = 1; k4 < this.maxmo; ++k4) {
                                            if (ai4[l5] == ai2[k4]) {
                                                if (ai3[k4] == 0) {
                                                    acraft[k4].dl(this.rd);
                                                }
                                                if (ai3[k4] == 1) {
                                                    atank[k4].dl(this.rd);
                                                }
                                            }
                                        }
                                    }
                                }
                                aconto2[ai4[l5]].d(this.rd);
                            }
                        }
                    }
                    if (xtgraphics.level < 6) {
                        for (int k5 = 0; k5 < l; ++k5) {
                            for (int i5 = 0; i5 < this.maxmo; ++i5) {
                                if (ai2[i5] != ai[k5]) {
                                    aconto2[ai[k5]].tryexp(aconto2[ai2[i5]]);
                                    if (aconto2[ai2[i5]].fire) {
                                        if (i5 == 0) {
                                            usercraft.lasercolid(aconto2[ai[k5]]);
                                        }
                                        else {
                                            if (ai3[i5] == 0) {
                                                acraft[i5].lasercolid(aconto2[ai[k5]]);
                                            }
                                            if (ai3[i5] == 1) {
                                                atank[i5].lasercolid(aconto2[ai[k5]]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (int i6 = l - 1; i6 >= 0; --i6) {
                            for (int j6 = 0; j6 < this.maxmo; ++j6) {
                                if (ai2[j6] != ai[i6]) {
                                    if (xtgraphics.level != 15 || j6 != 1) {
                                        aconto2[ai[i6]].tryexp(aconto2[ai2[j6]]);
                                    }
                                    if (aconto2[ai2[j6]].fire) {
                                        if (j6 == 0) {
                                            usercraft.lasercolid(aconto2[ai[i6]]);
                                        }
                                        else {
                                            if (ai3[j6] == 0) {
                                                acraft[j6].lasercolid(aconto2[ai[i6]]);
                                            }
                                            if (ai3[j6] == 1) {
                                                atank[j6].lasercolid(aconto2[ai[i6]]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (int j7 = 1; j7 < this.maxmo; ++j7) {
                        if (ai3[j7] == 0) {
                            acraft[j7].dosmokes(this.rd, aconto2[ai2[j7]]);
                            acraft[j7].preform(aconto2[ai2[j7]], aconto2, ai, l, ai2[0], k);
                            if (aconto2[ai2[j7]].exp) {
                                if (!this.nosound) {
                                    this.exp.setFramePosition(0);
                                    this.exp.start();
                                }
                                ai3[j7] = -1;
                            }
                            if (aconto2[ai2[j7]].hit && !this.nosound && this.frags == 0) {
                                this.hitl.setFramePosition(0);
                                this.hitl.start();
                                if (this.sosun) {
                                    this.frags = 3;
                                }
                            }
                        }
                        if (ai3[j7] == 1) {
                            atank[j7].dosmokes(this.rd, aconto2[ai2[j7]]);
                            atank[j7].preform(aconto2[ai2[j7]], aconto2, ai2[0], k);
                            if (aconto2[ai2[j7]].exp) {
                                if (!this.nosound) {
                                    this.exp.setFramePosition(0);
                                    this.exp.start();
                                }
                                ai3[j7] = -1;
                            }
                            if (aconto2[ai2[j7]].hit && !this.nosound && this.frags == 0) {
                                this.hitl.setFramePosition(0);
                                this.hitl.start();
                                if (this.sosun) {
                                    this.frags = 3;
                                }
                            }
                        }
                    }
                    usercraft.dosmokes(this.rd, aconto2[ai2[0]]);
                    usercraft.preform(this.u, aconto2[ai2[0]], aconto2, ai2, this.maxmo);
                    int k6 = 0;
                    if (this.tab) {
                        k6 = xtgraphics.cl;
                    }
                    else if (this.view != 4 && this.view != 5) {
                        xtgraphics.dtrakers(this.rd, ai3, ai2, this.maxmo, aconto2, usercraft, this.u);
                    }
                    if (this.view == 0) {
                        medium.behinde(aconto2[ai2[k6]]);
                    }
                    if (this.view == 1) {
                        medium.right(aconto2[ai2[k6]]);
                    }
                    if (this.view == 2) {
                        medium.infront(aconto2[ai2[k6]]);
                    }
                    if (this.view == 3) {
                        medium.left(aconto2[ai2[k6]]);
                    }
                    if (this.view == 4) {
                        medium.around(aconto2[ai2[k6]], 800);
                    }
                    if (this.view == 5) {
                        medium.watch(aconto2[ai2[k6]]);
                    }
                    else if (medium.td) {
                        medium.td = false;
                    }
                    if (aconto2[ai2[0]].exp) {
                        int k7 = 0;
                        for (int l6 = 0; l6 < aconto2[ai2[0]].npl; ++l6) {
                            if (aconto2[ai2[0]].p[l6].exp == 7) {
                                ++k7;
                            }
                        }
                        if (k7 == aconto2[ai2[0]].npl) {
                            flag2 = true;
                            xtgraphics.dest[ai2[0]] = true;
                            if (xtgraphics.alldest()) {
                                xtgraphics.fase = 2;
                                xtgraphics.drawovimg(this.offImage);
                            }
                            else {
                                xtgraphics.fase = 1;
                                xtgraphics.drawefimg(this.offImage);
                            }
                        }
                        if (this.u.space) {
                            this.u.space = false;
                        }
                    }
                    else {
                        if (xtgraphics.mcomp) {
                            if (this.u.space) {
                                if (xtgraphics.level != 15) {
                                    xtgraphics.fase = -4;
                                    final xtGraphics xtGraphics = xtgraphics;
                                    ++xtGraphics.level;
                                }
                                else {
                                    xtgraphics.fase = 4;
                                    xtgraphics.oldfase = 7;
                                }
                                flag2 = true;
                                this.u.space = false;
                            }
                        }
                        else if (this.u.space) {
                            flag2 = true;
                            xtgraphics.drawpimg(this.offImage);
                            xtgraphics.fase = 3;
                            this.u.space = false;
                            xtgraphics.select = 0;
                        }
                        int l7 = 0;
                        for (int i7 = k; i7 < k + 13; ++i7) {
                            if (aconto2[i7].exp) {
                                ++l7;
                            }
                        }
                        if (l7 == 13) {
                            flag2 = true;
                            xtgraphics.drawovimg(this.offImage);
                            xtgraphics.fase = 2;
                        }
                    }
                }
                else {
                    if (xtgraphics.fase == -4) {
                        medium.d(this.rd);
                        int k8 = 0;
                        final int[] ai6 = new int[100];
                        for (int k9 = 0; k9 < this.maxco; ++k9) {
                            if (aconto2[k9].dist != 0) {
                                ai6[k8] = k9;
                                ++k8;
                            }
                            else {
                                aconto2[k9].d(this.rd);
                            }
                        }
                        final int[] ai7 = new int[k8];
                        for (int i8 = 0; i8 < k8; ++i8) {
                            ai7[i8] = 0;
                            for (int i9 = 0; i9 < k8; ++i9) {
                                if (aconto2[ai6[i8]].dist != aconto2[ai6[i9]].dist) {
                                    if (aconto2[ai6[i8]].dist < aconto2[ai6[i9]].dist) {
                                        final int[] array3 = ai7;
                                        final int n3 = i8;
                                        ++array3[n3];
                                    }
                                }
                                else if (i9 > i8) {
                                    final int[] array4 = ai7;
                                    final int n4 = i8;
                                    ++array4[n4];
                                }
                            }
                        }
                        for (int j8 = 0; j8 < k8; ++j8) {
                            for (int j9 = 0; j9 < k8; ++j9) {
                                if (ai7[j9] == j8) {
                                    aconto2[ai6[j9]].d(this.rd);
                                }
                            }
                        }
                        medium.around(aconto2[k + 4], 6000);
                        if (this.u.space) {
                            xtgraphics.drawl(this.rd, this.offImage);
                        }
                    }
                    xtgraphics.denter(this.rd, k, aconto2, usercraft, this.u);
                    if (xtgraphics.fase == -5 && this.u.space) {
                        if (xtgraphics.select == 0) {
                            this.loadrots(aconto2, false);
                            for (int i10 = k; i10 < k + 13; ++i10) {
                                aconto2[i10].out = false;
                            }
                            xtgraphics.reset();
                            xtgraphics.fase = -4;
                        }
                        if (xtgraphics.select == 1 && xtgraphics.sgame == 1) {
                            this.loadrots(aconto2, false);
                            xtgraphics.reset();
                            this.loadsaved(aconto2, xtgraphics, k);
                            xtgraphics.fase = -4;
                        }
                        if (xtgraphics.select == 4) {
                            this.moner = "Exiting game...";
                            this.mon = true;
                        }
                        this.u.space = false;
                    }
                    if (xtgraphics.fase == 4) {}
                    if (xtgraphics.fase == -33) {
                        if (xtgraphics.frst && xtgraphics.select == 0) {
                            this.savegame(aconto2, xtgraphics, k);
                        }
                        else if (!xtgraphics.frst) {
                            xtgraphics.frst = true;
                        }
                        while (i3 != 7) {
                            if (xtgraphics.goodsun) {
                                this.nounif = true;
                            }
                            this.mtrak[i3] = this.getSound("music/" + i3 + ".wav");
                            this.loadet[i3] = true;
                            ++i3;
                        }
                        if (xtgraphics.goodsun) {
                            xtgraphics.goodsun = false;
                        }
                        this.loadmovers(ai2, ai3, aconto2, acraft, atank, usercraft, xtgraphics);
                        this.nounif = false;
                        xtgraphics.fase = -2;
                    }
                    if (xtgraphics.fase == -3) {
                        xtgraphics.fase = -33;
                    }
                    if (xtgraphics.fase == 0 && this.u.space) {
                        if (!xtgraphics.dest[xtgraphics.selected]) {
                            this.setmover(ai2, aconto2, usercraft, xtgraphics);
                            flag2 = false;
                            this.view = 0;
                        }
                        this.u.space = false;
                    }
                    if (xtgraphics.fase == 2 && xtgraphics.sgame == 1 && !xtgraphics.alldest()) {
                        this.set0();
                        xtgraphics.sgame = 0;
                    }
                    if (xtgraphics.fase == 3 && this.u.space) {
                        if (xtgraphics.select == 0) {
                            System.gc();
                            flag2 = false;
                        }
                        this.u.space = false;
                    }
                    if (xtgraphics.fase == -8) {
                        if (xtgraphics.sgame == -1) {
                            this.getslevel(xtgraphics);
                        }
                        if (xtgraphics.cnty == 351) {
                            xtgraphics.drawop(this.rd, this.offImage);
                            xtgraphics.cnty = 352;
                        }
                    }
                    if (xtgraphics.fase == 7 && this.u.space) {
                        this.moner = "One moment...";
                        this.mon = true;
                        this.u.space = false;
                    }
                }
            }
            else {
                if (this.u.space) {
                    this.u.space = false;
                }
                this.rd.setColor(new Color(223, 223, 223));
                this.rd.fillRect(0, 0, 500, 360);
                xtgraphics.drawcs(this.rd, 170, this.moner, 0, 0, 0, false);
                if (this.moner.equals("Exiting game...")) {
                    this.repaint();
                    System.gc();
                    System.gc();
                    System.exit(0);
                }
                if (this.moner.equals("One moment...")) {
                    this.repaint();
                    System.gc();
                    try {
                        this.open("winner/index.html");
                    }
                    catch (final Exception ex) {}
                    System.gc();
                    System.exit(0);
                }
            }
            this.repaint();
            if (!this.mon) {
                this.playsounds(usercraft, aconto2[ai2[0]], flag2, xtgraphics);
            }
            date2 = new Date();
            final long l8 = date2.getTime();
            if (!flag2) {
                if (!flag) {
                    f = f2;
                    flag = true;
                    k2 = 0;
                }
                if (k2 == 10) {
                    if (l8 - l3 < 560L) {
                        f += 0.5;
                    }
                    else {
                        f -= 0.5;
                        if (f < 5.0f) {
                            f = 5.0f;
                        }
                    }
                    l3 = l8;
                    k2 = 0;
                }
                else {
                    ++k2;
                }
            }
            else {
                if (flag) {
                    f2 = f;
                    flag = false;
                    k2 = 0;
                }
                if (k2 == 10) {
                    if (l8 - l3 < 400L) {
                        f += 3.5;
                    }
                    else {
                        f -= 3.5;
                        if (f < 5.0f) {
                            f = 5.0f;
                        }
                    }
                    l3 = l8;
                    k2 = 0;
                }
                else {
                    ++k2;
                }
            }
            long l9 = Math.round(f) - (l8 - l4);
            if (l9 < i) {
                l9 = i;
            }
            try {
                Thread.sleep(l9);
            }
            catch (final InterruptedException ex2) {}
        }
    }
    
    public void lstat(final String s, final int i) {
        this.dnload += i;
        this.rd.setColor(new Color(223, 223, 223));
        this.rd.fillRect(0, 0, 500, 360);
        this.rd.setColor(new Color(174, 185, 198));
        this.rd.drawRect(150, 200, 200, 5);
        this.rd.fillRect(150, 200, 24 + (int)(this.dnload / 594.0f * 176.0f), 5);
        this.rd.setColor(new Color(151, 166, 183));
        this.rd.drawString(s, 290, 220);
        this.rd.drawString("Remaining: " + (594 - this.dnload) + " KB", 202, 250);
        this.rd.setColor(new Color(0, 0, 0));
        this.rd.drawString("Loading " + (int)((24 + (int)(this.dnload / 594.0f * 176.0f)) / 200.0f * 100.0f) + "%", 103, 194);
        this.repaint();
    }
    
    public void init() {
        this.offImage = this.createImage(500, 360);
        if (this.offImage != null) {
            this.rd = this.offImage.getGraphics();
        }
        this.rd.setFont(new Font("SansSerif", 1, 11));
        this.cookieDir();
        if (!this.initKeySettings()) {
            this.initDefaultKeySettings();
        }
        this.setFocusTraversalKeysEnabled(false);
    }
    
    public void getslevel(final xtGraphics xtgraphics) {
        try {
            final int i = this.readcookie("radxv");
            if (i == 0) {
                xtgraphics.sgame = 0;
            }
            else {
                xtgraphics.sgame = 1;
                xtgraphics.select = 1;
            }
        }
        catch (final Exception ex) {}
    }
    
    public void loadsaved(final ContO[] aconto, final xtGraphics xtgraphics, final int i) {
        try {
            xtgraphics.level = this.readcookie("radxv");
            for (int j = i; j < i + 13; ++j) {
                aconto[j].nhits = this.readcookie("radnhits" + String.valueOf(j));
                if (aconto[j].nhits >= aconto[j].maxhits) {
                    aconto[j].exp = true;
                    aconto[j].out = true;
                }
                else {
                    aconto[j].out = false;
                }
            }
            int k = 0;
            do {
                final int i2 = this.readcookie("raddest" + String.valueOf(k));
                if (i2 == 0) {
                    xtgraphics.dest[k] = false;
                }
                else {
                    xtgraphics.dest[k] = true;
                }
            } while (++k < 5);
        }
        catch (final Exception ex) {}
    }
    
    @Override
    public boolean keyDown(final Event event, final int i) {
        if (this.viewOneKeys.contains(i)) {
            this.viewOnePressedKeys.add(i);
            this.view = 1;
        }
        if (this.viewTwoKeys.contains(i)) {
            this.viewTwoPressedKeys.add(i);
            this.view = 2;
        }
        if (this.viewThreeKeys.contains(i)) {
            this.viewThreePressedKeys.add(i);
            this.view = 3;
        }
        if (this.viewFourKeys.contains(i)) {
            this.viewFourPressedKeys.add(i);
            this.view = 4;
        }
        if (this.viewFiveKeys.contains(i)) {
            this.viewFivePressedKeys.add(i);
            this.view = 5;
        }
        if (this.nomusicKeys.contains(i)) {
            if (this.nomusic) {
                this.nomusic = false;
            }
            else {
                this.nomusic = true;
                if (this.plcnt >= 100 && this.crntt != -1) {
                    this.mtrak[this.crntt].stop();
                    --this.crntt;
                    this.plcnt = 95;
                }
            }
        }
        if (this.switchmusicKeys.contains(i)) {
            if (this.plcnt >= 100) {
                this.mtrak[this.crntt].stop();
            }
            this.plcnt = 95;
        }
        if (this.nosoundKeys.contains(i)) {
            if (this.nosound) {
                this.nosound = false;
            }
            else {
                this.nosound = true;
            }
        }
        if (this.radarKeys.contains(i)) {
            this.radarPressedKeys.add(i);
            this.u.radar = true;
        }
        if (this.tabKeys.contains(i)) {
            this.tabPressedKeys.add(i);
            this.tab = true;
        }
        if (this.plusKeys.contains(i)) {
            this.plusPressedKeys.add(i);
            this.u.plus = true;
        }
        if (this.minsKeys.contains(i)) {
            this.minsPressedKeys.add(i);
            this.u.mins = true;
        }
        if (this.jumpKeys.contains(i) && this.u.jump == 0) {
            this.u.jump = 1;
            if (!this.u.jade) {
                this.u.jade = true;
            }
        }
        if (this.enterKeys.contains(i) && !this.enterd) {
            this.enterPressedKeys.add(i);
            this.u.space = true;
            this.enterd = true;
        }
        if (this.fireKeys.contains(i)) {
            this.firePressedKeys.add(i);
            this.u.fire = true;
        }
        if (this.leftKeys.contains(i)) {
            this.leftPressedKeys.add(i);
            this.u.left = true;
        }
        if (this.rightKeys.contains(i)) {
            this.rightPressedKeys.add(i);
            this.u.right = true;
        }
        if (this.downKeys.contains(i)) {
            this.downPressedKeys.add(i);
            this.u.down = true;
        }
        if (this.upKeys.contains(i)) {
            this.upPressedKeys.add(i);
            this.u.up = true;
        }
        return false;
    }
    
    public void savecookie(final String s, final String s1) {
        try {
            final PrintWriter pw = new PrintWriter(new File("cookies/" + s));
            pw.println(s1);
            pw.flush();
            pw.close();
        }
        catch (final Exception ex) {}
    }
    
    public int readcookie(final String s) {
        int i = 0;
        try {
            final BufferedReader br = new BufferedReader(new FileReader(new File("cookies/" + s)));
            i = Integer.parseInt(br.readLine());
        }
        catch (final Exception ex) {}
        return i;
    }
    
    public boolean cookieDir() {
        final File f = new File("cookies");
        return (f.exists() && f.isDirectory()) || f.mkdir();
    }
    
    public void open(final String url) {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            final Desktop desktop = Desktop.getDesktop();
            try {
                final File file = new File(url);
                if (file.exists()) {
                    desktop.browse(file.toURI());
                }
                else {
                    desktop.browse(new URI(url));
                }
            }
            catch (final IOException | URISyntaxException e) {
                e.printStackTrace();
            }
        }
        else {
            final Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec("xdg-open " + url);
            }
            catch (final IOException e2) {
                e2.printStackTrace();
            }
        }
    }
    
    public boolean initKeySettings() {
        try {
            final File file = new File("KeySettings.txt");
            final BufferedReader br = new BufferedReader(new FileReader(file));
            String string;
            while ((string = br.readLine()) != null) {
                if (string.startsWith("viewOne(")) {
                    this.viewOneKeys.add(this.getint("viewOne", string, 0));
                }
                if (string.startsWith("viewTwo(")) {
                    this.viewTwoKeys.add(this.getint("viewTwo", string, 0));
                }
                if (string.startsWith("viewThree(")) {
                    this.viewThreeKeys.add(this.getint("viewThree", string, 0));
                }
                if (string.startsWith("viewFour(")) {
                    this.viewFourKeys.add(this.getint("viewFour", string, 0));
                }
                if (string.startsWith("viewFive(")) {
                    this.viewFiveKeys.add(this.getint("viewFive", string, 0));
                }
                if (string.startsWith("nomusic(")) {
                    this.nomusicKeys.add(this.getint("nomusic", string, 0));
                }
                if (string.startsWith("switchmusic(")) {
                    this.switchmusicKeys.add(this.getint("switchmusic", string, 0));
                }
                if (string.startsWith("nosound(")) {
                    this.nosoundKeys.add(this.getint("nosound", string, 0));
                }
                if (string.startsWith("radar(")) {
                    this.radarKeys.add(this.getint("radar", string, 0));
                }
                if (string.startsWith("tab(")) {
                    this.tabKeys.add(this.getint("tab", string, 0));
                }
                if (string.startsWith("plus(")) {
                    this.plusKeys.add(this.getint("plus", string, 0));
                }
                if (string.startsWith("mins(")) {
                    this.minsKeys.add(this.getint("mins", string, 0));
                }
                if (string.startsWith("jump(")) {
                    this.jumpKeys.add(this.getint("jump", string, 0));
                }
                if (string.startsWith("enter(")) {
                    this.enterKeys.add(this.getint("enter", string, 0));
                }
                if (string.startsWith("fire(")) {
                    this.fireKeys.add(this.getint("fire", string, 0));
                }
                if (string.startsWith("left(")) {
                    this.leftKeys.add(this.getint("left", string, 0));
                }
                if (string.startsWith("right(")) {
                    this.rightKeys.add(this.getint("right", string, 0));
                }
                if (string.startsWith("down(")) {
                    this.downKeys.add(this.getint("down", string, 0));
                }
                if (string.startsWith("up(")) {
                    this.upKeys.add(this.getint("up", string, 0));
                }
            }
        }
        catch (final IOException ex) {
            return false;
        }
        return true;
    }
    
    public void initDefaultKeySettings() {
        this.viewOneKeys.add(49);
        this.viewTwoKeys.add(50);
        this.viewThreeKeys.add(51);
        this.viewFourKeys.add(52);
        this.viewFiveKeys.add(53);
        this.nomusicKeys.add(109);
        this.nomusicKeys.add(77);
        this.switchmusicKeys.add(116);
        this.switchmusicKeys.add(84);
        this.nosoundKeys.add(115);
        this.nosoundKeys.add(83);
        this.radarKeys.add(114);
        this.radarKeys.add(82);
        this.tabKeys.add(9);
        this.plusKeys.add(43);
        this.plusKeys.add(61);
        this.minsKeys.add(45);
        this.minsKeys.add(8);
        this.jumpKeys.add(106);
        this.jumpKeys.add(74);
        this.enterKeys.add(10);
        this.enterKeys.add(27);
        this.fireKeys.add(32);
        this.leftKeys.add(1006);
        this.rightKeys.add(1007);
        this.downKeys.add(1005);
        this.upKeys.add(1004);
    }
    
    public static void main(final String[] args) {
        final Frame f = new Frame();
        f.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(final WindowEvent e) {
                System.exit(0);
            }
        });
        final F51 f2 = new F51();
        f2.setPreferredSize(new Dimension(500, 360));
        f.add(f2);
        f.pack();
        f.setTitle("RADICAL ACES");
        f.setIconImage(Toolkit.getDefaultToolkit().getImage("graphics/icon.png"));
        f.show();
        f2.init();
        f2.start();
    }
}
