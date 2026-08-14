// Transpiled from java-src/Control.java, line by line.
//
// Pure state: the eleven flags F51.keyDown/keyUp set and userCraft.preform
// reads. No probe — there is no behaviour to verify, only field names, and
// those are checked by every class that touches a Control.

export class Control {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.plus = false;
    this.mins = false;
    this.space = false;
    this.jump = 0;
    this.fire = false;
    this.radar = false;
    this.jade = false;
    this.canclick = false;
  }
}
