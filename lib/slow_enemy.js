const Util = require("./util");
const MovingObject = require("./moving_object");
const Avatar = require("./avatar.js");
const Bullet = require("./bullet.js");
const FastEnemy = require("./fast_enemy");
const Shield = require("./shield");

const DEFAULTS = {
  COLOR: 'white',
  HEALTH: 8,
  SPEED: 2,
};

class SlowEnemy extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.width = DEFAULTS.WIDTH;
    options.height = DEFAULTS.HEIGHT;
    options.pos = [0, 0];
    options.vel = [0, +.2];
    super(options);
    this.line = true;
    this.health = DEFAULTS.HEALTH;
  }

  collideWith(object) {
    if (object instanceof Avatar) {
      object.remove();
      return true;
    } else if (object instanceof Bullet) {
      this.damage();
      object.remove();
      return true;
    } else {
      return false;
    }
  }

  damage() {
    this.health -= 1;
    if (this.health <= 0) {
      this.remove();
      this.game.slowEnemyCount -= 1;
    } else if (this.health <= 2) {
      this.vel[0] = this.vel[0] * 1.5;
      this.vel[1] = this.vel[1] * 1.5;
      this.color = '#ff9138';
    } else if (this.health <= 5) {
      this.vel[0] = this.vel[0] * 1.25;
      this.vel[1] = this.vel[1] * 1.25;
      this.color = '#fffa00';
    } else {
      return;
    }
  }
}

module.exports = SlowEnemy;
