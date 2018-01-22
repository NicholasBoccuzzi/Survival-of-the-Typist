const MovingObject = require("./moving_object");

class Shield extends MovingObject {
  constructor(options) {
    options.radius = Shield.RADIUS;
    options.color = "transparent";
    super(options);
    this.colorOutline = '#00f9ff';
    this.pos = options.pos;
  }

  collideWith(object){
  }
}


Shield.RADIUS = 20;

module.exports = Shield;
