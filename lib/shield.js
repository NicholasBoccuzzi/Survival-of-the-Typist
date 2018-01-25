const MovingObject = require("./moving_object");

class Shield extends MovingObject {
  constructor(options) {
    options.color = "transparent";
    super(options);
    this.radius = 10;
    this.growRadius();
    this.colorOutline = '#00f9ff';
    this.shield = true;
    this.growRad;
  }

  growRadius () {
    this.growRad = setInterval(() => {
      if (this.radius < 20) {
        this.radius = this.radius * 1.05;
      } else {
        clearInterval(this.growRad);
      }
    }, 10);
  }

  collideWith(object){

  }
}


Shield.RADIUS = 20;

module.exports = Shield;
