const MovingObject = require("./moving_object");

class Shield extends MovingObject {
  constructor(options) {
    options.color = "transparent";
    super(options);
    this.radius = 1;
    this.sound = options.sound;
    this.growRadius();
    this.colorOutline = '#00f9ff';
    this.shield = true;
    this.changeRad;
    this.removeShield();
    this.reductionTimeout;
    this.reduceShield = this.reduceShield.bind(this);
    this.removeShield = this.removeShield.bind(this);
    this.growRadius = this.growRadius.bind(this);
  }

  growRadius () {
    this.changeRad = setInterval(() => {
      if (this.radius < 20) {
        this.radius = this.radius * 1.08;
      } else {
        this.clearChangeRad();
      }
    }, 10);
  }

  removeShield() {
    this.reductionTimeout = setTimeout(() => { return this.reduceShield(); }, 10000);
  }

  reduceShield() {
    this.changeRad = setInterval(() => {
      if (this.radius > 5) {
        this.radius = this.radius * .93;
      } else {
        this.sound.playSound("shieldRemove");
        this.clearChangeRad();
        this.remove();
      }
    }, 10);
  }

  clearChangeRad() {
    clearInterval(this.changeRad);
  }

  collideWith(object){
  }
}


Shield.RADIUS = 20;

module.exports = Shield;
