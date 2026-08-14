// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import java.security.PrivilegedAction;

static final class AudioPlayer$1 implements PrivilegedAction {
    @Override
    public Object run() {
        final Thread t = new AudioPlayer((AudioPlayer$1)null);
        t.setPriority(10);
        t.setDaemon(true);
        t.start();
        return t;
    }
}