// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.IOException;
import java.io.InputStream;
import javax.sound.sampled.AudioSystem;
import java.io.ByteArrayInputStream;
import javax.sound.sampled.AudioFormat;

public class AudioData
{
    private static final AudioFormat DEFAULT_FORMAT;
    AudioFormat format;
    byte[] buffer;
    
    public AudioData(final byte[] buffer) {
        this.buffer = buffer;
        this.format = AudioData.DEFAULT_FORMAT;
        try {
            final AudioInputStream ais = AudioSystem.getAudioInputStream(new ByteArrayInputStream(buffer));
            this.format = ais.getFormat();
            ais.close();
        }
        catch (final IOException ex) {}
        catch (final UnsupportedAudioFileException ex2) {}
    }
    
    AudioData(final AudioFormat format, final byte[] buffer) {
        this.format = format;
        this.buffer = buffer;
    }
    
    static {
        DEFAULT_FORMAT = new AudioFormat(AudioFormat.Encoding.ULAW, 8000.0f, 8, 1, 1, 8000.0f, true);
    }
}
