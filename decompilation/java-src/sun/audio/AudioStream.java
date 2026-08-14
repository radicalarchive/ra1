// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import javax.sound.sampled.UnsupportedAudioFileException;
import javax.sound.midi.InvalidMidiDataException;
import java.io.IOException;
import javax.sound.midi.MidiSystem;
import javax.sound.sampled.AudioSystem;
import java.io.BufferedInputStream;
import java.io.InputStream;
import javax.sound.midi.MidiFileFormat;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import java.io.FilterInputStream;

public class AudioStream extends FilterInputStream
{
    protected AudioInputStream ais;
    protected AudioFormat format;
    protected MidiFileFormat midiformat;
    protected InputStream stream;
    
    public AudioStream(final InputStream in) throws IOException {
        super(in);
        this.ais = null;
        this.format = null;
        this.midiformat = null;
        this.stream = null;
        this.stream = in;
        if (!in.markSupported()) {
            this.stream = new BufferedInputStream(in, 1024);
        }
        try {
            this.ais = AudioSystem.getAudioInputStream(this.stream);
            this.format = this.ais.getFormat();
            this.in = this.ais;
        }
        catch (final UnsupportedAudioFileException e) {
            try {
                this.midiformat = MidiSystem.getMidiFileFormat(this.stream);
            }
            catch (final InvalidMidiDataException e2) {
                throw new IOException("could not create audio stream from input stream");
            }
        }
    }
    
    public AudioData getData() throws IOException {
        final int length = this.getLength();
        if (length < 1048576) {
            final byte[] buffer = new byte[length];
            try {
                this.ais.read(buffer, 0, length);
            }
            catch (final IOException ex) {
                throw new IOException("Could not create AudioData Object");
            }
            return new AudioData(this.format, buffer);
        }
        throw new IOException("could not create AudioData object");
    }
    
    public int getLength() {
        if (this.ais != null && this.format != null) {
            return (int)(this.ais.getFrameLength() * this.ais.getFormat().getFrameSize());
        }
        if (this.midiformat != null) {
            return this.midiformat.getByteLength();
        }
        return -1;
    }
}
