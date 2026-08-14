// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

public class ContinuousAudioDataStream extends AudioDataStream
{
    public ContinuousAudioDataStream(final AudioData data) {
        super(data);
    }
    
    @Override
    public int read() {
        int i = super.read();
        if (i == -1) {
            this.reset();
            i = super.read();
        }
        return i;
    }
    
    @Override
    public int read(final byte[] ab, final int i1, final int j) {
        int k = 0;
        while (k < j) {
            final int i2 = super.read(ab, i1 + k, j - k);
            if (i2 >= 0) {
                k += i2;
            }
            else {
                this.reset();
            }
        }
        return k;
    }
}
