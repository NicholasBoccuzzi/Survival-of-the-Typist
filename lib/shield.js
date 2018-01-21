const MovingObject = require("./moving_object");

class Shield extends MovingObject {
  constructor(options) {
    options.radius = Shield.RADIUS;
    options.color = "transparent";
    super(options);
    this.isWrappable = false;
    this.pos = options.pos;
  }
}


Shield.RADIUS = 10;

module.exports = Shield;
