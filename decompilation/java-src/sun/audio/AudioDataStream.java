// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import java.io.ByteArrayInputStream;

public class AudioDataStream extends ByteArrayInputStream
{
    AudioData ad;
    
    public AudioDataStream(final AudioData data) {
        super(data.buffer);
        this.ad = data;
    }
    
    AudioData getAudioData() {
        return this.ad;
    }
}
