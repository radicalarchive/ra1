// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import java.io.InputStream;
import java.security.AccessController;
import java.security.PrivilegedAction;

public class AudioPlayer extends Thread
{
    private AudioDevice devAudio;
    private static boolean DEBUG;
    public static final AudioPlayer player;
    
    private static ThreadGroup getAudioThreadGroup() {
        if (AudioPlayer.DEBUG) {
            System.out.println("AudioPlayer.getAudioThreadGroup()");
        }
        ThreadGroup g;
        for (g = Thread.currentThread().getThreadGroup(); g.getParent() != null && g.getParent().getParent() != null; g = g.getParent()) {}
        return g;
    }
    
    private static AudioPlayer getAudioPlayer() {
        if (AudioPlayer.DEBUG) {
            System.out.println("> AudioPlayer.getAudioPlayer()");
        }
        final PrivilegedAction action = new PrivilegedAction() {
            @Override
            public Object run() {
                final Thread t = new AudioPlayer((AudioPlayer$1)null);
                t.setPriority(10);
                t.setDaemon(true);
                t.start();
                return t;
            }
        };
        final AudioPlayer audioPlayer = AccessController.doPrivileged((PrivilegedAction<AudioPlayer>)action);
        return audioPlayer;
    }
    
    private AudioPlayer() {
        super(getAudioThreadGroup(), "Audio Player");
        if (AudioPlayer.DEBUG) {
            System.out.println("> AudioPlayer private constructor");
        }
        (this.devAudio = AudioDevice.device).open();
        if (AudioPlayer.DEBUG) {
            System.out.println("< AudioPlayer private constructor completed");
        }
    }
    
    public synchronized void start(final InputStream in) {
        if (AudioPlayer.DEBUG) {
            System.out.println("> AudioPlayer.start");
            System.out.println("  InputStream = " + in);
        }
        this.devAudio.openChannel(in);
        this.notify();
        if (AudioPlayer.DEBUG) {
            System.out.println("< AudioPlayer.start completed");
        }
    }
    
    public synchronized void stop(final InputStream in) {
        if (AudioPlayer.DEBUG) {
            System.out.println("> AudioPlayer.stop");
        }
        this.devAudio.closeChannel(in);
        if (AudioPlayer.DEBUG) {
            System.out.println("< AudioPlayer.stop completed");
        }
    }
    
    @Override
    public void run() {
        this.devAudio.play();
        Label_0021: {
            if (!AudioPlayer.DEBUG) {
                break Label_0021;
            }
            System.out.println("AudioPlayer mixing loop.");
            try {
                while (true) {
                    Thread.sleep(5000L);
                }
            }
            catch (final Exception e) {
                if (AudioPlayer.DEBUG) {
                    System.out.println("AudioPlayer exited.");
                }
            }
        }
    }
    
    static {
        AudioPlayer.DEBUG = false;
        player = getAudioPlayer();
    }
}
