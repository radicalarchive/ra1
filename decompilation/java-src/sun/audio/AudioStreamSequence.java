// 
// Decompiled by Procyon v0.6.0
// 

package sun.audio;

import java.io.InputStream;
import java.util.Enumeration;
import java.io.SequenceInputStream;

public class AudioStreamSequence extends SequenceInputStream
{
    Enumeration e;
    InputStream in;
    
    public AudioStreamSequence(final Enumeration e) {
        super(e);
    }
}
