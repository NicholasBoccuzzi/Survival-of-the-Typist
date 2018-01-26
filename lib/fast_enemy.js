const Util = require("./util");
const Bullet = require("./bullet.js");
const Avatar = require("./avatar");
const MovingObject = require("./moving_object");
const SlowEnemy = require("./slow_enemy");
const Shield = require("./shield");
const Bomb = require("./bomb");


const DEFAULTS = {
  COLOR: "#FF00FF",
  HEIGHT: 30,
  WIDTH: 40,
  HEALTH: 100,
  SPEED: [3, 3]
};

class FastEnemy extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.width = DEFAULTS.WIDTH;
    options.height = DEFAULTS.HEIGHT;
    options.vel = DEFAULTS.SPEED;
    options.pos = options.pos;
    super(options);
    this.legOffset = 40;
    this.legOne;
    this.legTwo;
    this.sound = options.sound;
    this.score = options.score;
    this.triangle = true;
    this.speedOffset = 2000;
    this.centerPoint;
  }

  reduceTri () {
    this.changeSize = setInterval(() => {
      if (this.legOffset > 20) {
        this.legOffset = this.legOffset * .90;
      } else {
        this.removeTri();
        this.clearChangeRad();
      }
    }, 10);

  }

  removeTri() {
    this.remove();
    this.sound.playSound("removeFastEnemy");
  }

  clearChangeRad() {
    clearInterval(this.changeSize);
  }

  collideWith(object) {
    if (object instanceof Bullet) {
      object.remove();
      this.reduceTri();
      this.score.add();
      return true;
    } else if (object instanceof Shield) {
      this.remove();
      return true;
    } else {
      return false;
    }
  }

  calculateCenterPoint() {
    let x = (this.pos[0] + this.legOne[0] + this.legTwo[0])/3;
    let y = (this.pos[1] + this.legOne[1] + this.legTwo[1])/3;

    this.centerPoint = [x, y];
  }
}

module.exports = FastEnemy;
