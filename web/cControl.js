// Transpiled from java-src/cControl.java, line by line.
//
// The AI's input state — the same idea as Control, minus everything only a
// human presses. Craft.preform writes it and reads it back the following tick.

export class cControl {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.fire = false;
  }
}
