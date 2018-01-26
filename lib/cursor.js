const MovingObject = require("./moving_object");
const Avatar = require("./avatar");

class Cursor extends MovingObject {
  constructor(options) {
    super(options);
    this.pos = options.pos;
    this.vel = options.vel;
    this.width = 4;
    this.height = 4;
    this.color = "red";
    this.rectangle = true;
    this.cursorTrue = true;
  }

  collideWith(object) {
    return false;
  }

  updatePos(pos, vel) {
    this.pos = pos;
    this.vel = vel;
  }
}



module.exports = Cursor;
