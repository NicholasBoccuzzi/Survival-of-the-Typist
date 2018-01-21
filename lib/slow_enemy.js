const Util = require("./util");
const MovingObject = require("./moving_object");
const Avatar = require("./avatar.js");
const Bullet = require("./bullet.js");

const DEFAULTS = {
  COLOR: "red",
  AREA: 40,
  HEALTH: 100,
  SPEED: 5
};

class SlowEnemy extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
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

module.exports = SlowEnemy;
