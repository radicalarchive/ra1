// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import javax.sound.midi.MetaMessage;
import javax.sound.sampled.AudioFormat;
import java.io.BufferedInputStream;
import javax.sound.midi.MidiUnavailableException;
import javax.sound.midi.MetaEventListener;
import java.io.IOException;
import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;
import javax.sound.midi.Sequencer;
import com.sun.media.sound.DataPusher;
import javax.sound.sampled.Line;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.SourceDataLine;
import com.sun.media.sound.Toolkit;
import java.io.InputStream;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.Mixer;
import java.util.Vector;
import java.util.Hashtable;

public class AudioDevice
{
    private boolean DEBUG;
    private Hashtable clipStreams;
    private Vector infos;
    private boolean playing;
    private Mixer mixer;
    public static final AudioDevice device;
    
    private AudioDevice() {
        this.DEBUG = false;
        this.playing = false;
        this.mixer = null;
        this.clipStreams = new Hashtable();
        this.infos = new Vector();
    }
    
    private synchronized void startSampled(AudioInputStream as, final InputStream in) throws UnsupportedAudioFileException, LineUnavailableException {
        Info info = null;
        DataPusher datapusher = null;
        DataLine.Info lineinfo = null;
        SourceDataLine sourcedataline = null;
        as = Toolkit.getPCMConvertedAudioInputStream(as);
        if (as == null) {
            return;
        }
        lineinfo = new DataLine.Info(SourceDataLine.class, as.getFormat());
        if (!AudioSystem.isLineSupported(lineinfo)) {
            return;
        }
        sourcedataline = (SourceDataLine)AudioSystem.getLine(lineinfo);
        datapusher = new DataPusher(sourcedataline, as);
        info = new Info(null, in, datapusher);
        this.infos.addElement(info);
        datapusher.start();
    }
    
    private synchronized void startMidi(final InputStream bis, final InputStream in) throws InvalidMidiDataException, MidiUnavailableException {
        Sequencer sequencer = null;
        Info info = null;
        sequencer = MidiSystem.getSequencer();
        sequencer.open();
        try {
            sequencer.setSequence(bis);
        }
        catch (final IOException e) {
            throw new InvalidMidiDataException(e.getMessage());
        }
        info = new Info(sequencer, in, null);
        this.infos.addElement(info);
        sequencer.addMetaEventListener(info);
        sequencer.start();
    }
    
    public synchronized void openChannel(final InputStream in) {
        if (this.DEBUG) {
            System.out.println("AudioDevice: openChannel");
            System.out.println("input stream =" + in);
        }
        Info info = null;
        for (int i = 0; i < this.infos.size(); ++i) {
            info = this.infos.elementAt(i);
            if (info.in == in) {
                return;
            }
        }
        AudioInputStream as = null;
        Label_0368: {
            if (in instanceof AudioStream) {
                if (((AudioStream)in).midiformat != null) {
                    try {
                        this.startMidi(((AudioStream)in).stream, in);
                        break Label_0368;
                    }
                    catch (final Exception e) {
                        return;
                    }
                }
                if (((AudioStream)in).ais == null) {
                    break Label_0368;
                }
                try {
                    this.startSampled(((AudioStream)in).ais, in);
                    break Label_0368;
                }
                catch (final Exception e) {
                    return;
                }
            }
            if (in instanceof AudioDataStream) {
                if (in instanceof ContinuousAudioDataStream) {
                    try {
                        final AudioInputStream ais = new AudioInputStream(in, ((AudioDataStream)in).getAudioData().format, -1L);
                        this.startSampled(ais, in);
                        break Label_0368;
                    }
                    catch (final Exception e) {
                        return;
                    }
                }
                try {
                    final AudioInputStream ais = new AudioInputStream(in, ((AudioDataStream)in).getAudioData().format, ((AudioDataStream)in).getAudioData().buffer.length);
                    this.startSampled(ais, in);
                    break Label_0368;
                }
                catch (final Exception e) {
                    return;
                }
            }
            final BufferedInputStream bis = new BufferedInputStream(in, 1024);
            try {
                try {
                    as = AudioSystem.getAudioInputStream(bis);
                }
                catch (final IOException ioe) {
                    return;
                }
                this.startSampled(as, in);
            }
            catch (final UnsupportedAudioFileException e2) {
                try {
                    try {
                        MidiSystem.getMidiFileFormat(bis);
                    }
                    catch (final IOException ioe2) {
                        return;
                    }
                    this.startMidi(bis, in);
                }
                catch (final InvalidMidiDataException e3) {
                    final AudioFormat defformat = new AudioFormat(AudioFormat.Encoding.ULAW, 8000.0f, 8, 1, 1, 8000.0f, true);
                    try {
                        final AudioInputStream defaif = new AudioInputStream(bis, defformat, -1L);
                        this.startSampled(defaif, in);
                    }
                    catch (final UnsupportedAudioFileException es) {
                        return;
                    }
                    catch (final LineUnavailableException es2) {
                        return;
                    }
                }
                catch (final MidiUnavailableException e4) {
                    return;
                }
            }
            catch (final LineUnavailableException e5) {
                return;
            }
        }
        this.notify();
    }
    
    public synchronized void closeChannel(final InputStream in) {
        if (this.DEBUG) {
            System.out.println("AudioDevice.closeChannel");
        }
        if (in == null) {
            return;
        }
        for (int i = 0; i < this.infos.size(); ++i) {
            final Info info = this.infos.elementAt(i);
            if (info.in == in) {
                if (info.sequencer != null) {
                    info.sequencer.stop();
                    this.infos.removeElement(info);
                }
                else if (info.datapusher != null) {
                    info.datapusher.stop();
                    this.infos.removeElement(info);
                }
            }
        }
        this.notify();
    }
    
    public synchronized void open() {
    }
    
    public synchronized void close() {
    }
    
    public void play() {
        if (this.DEBUG) {
            System.out.println("exiting play()");
        }
    }
    
    public synchronized void closeStreams() {
        for (int i = 0; i < this.infos.size(); ++i) {
            final Info info = this.infos.elementAt(i);
            if (info.sequencer != null) {
                info.sequencer.stop();
                info.sequencer.close();
                this.infos.removeElement(info);
            }
            else if (info.datapusher != null) {
                info.datapusher.stop();
                this.infos.removeElement(info);
            }
        }
        if (this.DEBUG) {
            System.err.println("Audio Device: Streams all closed.");
        }
        this.clipStreams = new Hashtable();
        this.infos = new Vector();
    }
    
    public int openChannels() {
        return this.infos.size();
    }
    
    void setVerbose(final boolean v) {
        this.DEBUG = v;
    }
    
    static {
        device = new AudioDevice();
    }
    
    class Info implements MetaEventListener
    {
        Sequencer sequencer;
        InputStream in;
        DataPusher datapusher;
        
        Info(final Sequencer sequencer, final InputStream in, final DataPusher datapusher) {
            this.sequencer = sequencer;
            this.in = in;
            this.datapusher = datapusher;
        }
        
        @Override
        public void meta(final MetaMessage event) {
            if (event.getType() == 47 && this.sequencer != null) {
                this.sequencer.close();
            }
        }
    }
}
