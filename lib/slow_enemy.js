const Util = require("./util");
const MovingObject = require("./moving_object");
const Avatar = require("./avatar.js");
const Bullet = require("./bullet.js");
const FastEnemy = require("./fast_enemy");
const Shield = require("./shield");

const DEFAULTS = {
  COLOR: '#FFFF00',
  HEALTH: 3,
  SPEED: 2,
};

class SlowEnemy extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.pos = options.pos;
    options.vel = [0, .5];
    super(options);
    this.sound = options.sound;
    this.score = options.score;
    this.startingPos = options.pos.slice(0);
    this.line = true;
    this.health = DEFAULTS.HEALTH;
    this.velocityCheck = 0;
    this.dead = false;
  }

  collideWith(object) {
    if (object instanceof Avatar) {
      if (!this.dead) {
        object.remove();
        return true;
      } else {
        return false;
      }
    } else if (object instanceof Bullet) {
      this.damage();
      object.remove();
      return true;
    // } else if (object instanceof Shield) {
    //   this.remove();
    //   this.sound.playSound("shieldRemove");
    //   object.remove();
    //   return true;
    // }
    } else {
      return false;
    }
  }

  reduceWall () {
    this.dead = true;
    this.changeSize = setInterval(() => {
      if (this.endPoint > 0) {
        this.endPoint = this.endPoint * .92;
      } else {
        this.removeBlock();
        this.clearChangeBlock();
      }
    }, 10);

  }

  removeBlock() {
    this.dead = true;
    this.remove();
  }

  clearChangeBlock() {
    clearInterval(this.changeSize);
  }

  damage() {
    this.health -= 1;
    if (this.health <= 0) {
      this.dead = true;
      this.sound.playSound("removeSlowEnemy");
      this.reduceWall();
      this.score.add();
      this.game.slowEnemyCount -= 1;
    } else if (this.health <= 1) {
      this.vel[0] = this.vel[0] * 3;
      this.vel[1] = this.vel[1] * 3;
      this.color = '#FF00FF';
    } else if (this.health <= 2) {
      this.vel[0] = this.vel[0] * 2;
      this.vel[1] = this.vel[1] * 2;
      this.color = '#00FFFF';
    } else {
      return;
    }
  }
}

module.exports = SlowEnemy;
