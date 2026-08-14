// 
// Decompiled by Procyon v0.6.0
// 

public class SinCos
{
    float[] tcos;
    float[] tsin;
    
    public SinCos() {
        this.tcos = new float[360];
        this.tsin = new float[360];
        int i = 0;
        do {
            this.tcos[i] = (float)Math.cos(i * 0.017453292519943295);
        } while (++i < 360);
        i = 0;
        do {
            this.tsin[i] = (float)Math.sin(i * 0.017453292519943295);
        } while (++i < 360);
    }
    
    public float getsin(int i) {
        while (i >= 360) {
            i -= 360;
        }
        while (i < 0) {
            i += 360;
        }
        return this.tsin[i];
    }
    
    public float getcos(int i) {
        while (i >= 360) {
            i -= 360;
        }
        while (i < 0) {
            i += 360;
        }
        return this.tcos[i];
    }
}
