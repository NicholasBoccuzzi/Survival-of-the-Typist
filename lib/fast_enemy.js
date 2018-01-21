const Util = require("./util");
const MovingObject = require("./moving_object");
const Avatar = require("./avatar.js");
const Bullet = require("./bullet.js");

const DEFAULTS = {
  COLOR: "pink",
  HEIGHT: 4,
  WIDTH: 4,
  HEALTH: 100,
  SPEED: [4, 4]
};

class FastEnemy extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.width = DEFAULTS.WIDTH;
    options.height = DEFAULTS.HEIGHT;
    options.vel = DEFAULTS.SPEED;
    options.pos = options.pos;
    super(options);
  }

  collision(object) {
    if (object instanceof Avatar) {
      object.loseHealth();
      object.tempInvinc();
      return true;
    } else if (object instanceof Bullet) {
      this.remove();
      object.remove();
      return true;
    }

    return false;
  }
}

module.exports = FastEnemy;
