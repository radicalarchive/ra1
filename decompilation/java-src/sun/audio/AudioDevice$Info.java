// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import javax.sound.midi.MetaMessage;
import com.sun.media.sound.DataPusher;
import java.io.InputStream;
import javax.sound.midi.Sequencer;
import javax.sound.midi.MetaEventListener;

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
