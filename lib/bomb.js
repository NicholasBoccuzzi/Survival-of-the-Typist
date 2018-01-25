const MovingObject = require("./moving_object");

class Bomb extends MovingObject {
  constructor(options) {
    options.color = "#ffaa00";
    super(options);
    this.radius = 1;
    this.lineThickness = 10;
    this.sound = options.sound;
    this.growRadius();
    this.colorOutline = '#ffaa00';
    this.bomb = true;
    this.changeRad;
    this.removeBomb();
    this.reductionTimeout;
    this.growRadius = this.growRadius.bind(this);
  }


  growRadius () {
    this.changeRad = setInterval(() => {
      if (this.radius < 400) {
        this.radius = this.radius * 1.08;
      } else {
        this.clearChangeRad();
        this.removeBomb();
      }
    }, 10);
  }

  removeBomb() {
    this.remove();
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

module.exports = Bomb;
