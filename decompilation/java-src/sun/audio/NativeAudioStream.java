// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import java.io.IOException;
import java.io.InputStream;
import java.io.FilterInputStream;

public class NativeAudioStream extends FilterInputStream
{
    public NativeAudioStream(final InputStream in) throws IOException {
        super(in);
    }
    
    public int getLength() {
        return 0;
    }
}
