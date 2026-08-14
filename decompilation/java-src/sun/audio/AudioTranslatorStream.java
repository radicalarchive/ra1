// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import java.io.IOException;
import java.io.InputStream;

public class AudioTranslatorStream extends NativeAudioStream
{
    private int length;
    
    public AudioTranslatorStream(final InputStream in) throws IOException {
        super(in);
        this.length = 0;
        throw new InvalidAudioFormatException();
    }
    
    @Override
    public int getLength() {
        return this.length;
    }
}
