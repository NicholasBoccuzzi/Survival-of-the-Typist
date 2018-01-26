const MovingObject = require("./moving_object");

class Bomb extends MovingObject {
  constructor(options) {
    super(options);
    this.radius = options.radius;
    this.lineThickness = 10;
    this.sound = options.sound;
    this.colorOutline = options.color;
    this.bomb = true;
    this.bigBomb = options.bigBomb;
    this.littleBomb = options.littleBomb;
    this.deathBomb = options.deathBomb;
    this.growRadius();
    this.changeRad;
    this.reductionTimeout;
    this.growRadius = this.growRadius.bind(this);
  }


  growRadius () {
    if (this.bigBomb) {
      this.changeRad = setInterval(() => {
        if (this.radius < 400) {
          this.radius = this.radius * 1.08;
        } else {
          this.clearChangeRad();
          this.removeBomb();
        }
      }, 10);
      this.sound.playSound("bomb");
    } else if (this.littleBomb) {
      this.changeRad = setInterval(() => {
        if (this.radius < 60) {
          this.radius = this.radius * 1.08;
        } else {
          this.clearChangeRad();
          this.removeBomb();
        }
      }, 5);
      this.sound.playSound("littleBomb");
    } else if (this.deathBomb) {
      this.changeRad = setInterval(() => {
        if (this.radius > 1) {
          this.radius = this.radius * .96;
        } else {
          this.clearChangeRad();
          this.removeBomb();
        }
      }, 5);
      this.sound.playSound("littleBomb");
    }
  }

  removeBomb() {
    this.remove();
  }

  clearChangeRad() {
    clearInterval(this.changeRad);
  }

  collideWith(object){

  }
}

module.exports = Bomb;
