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
    super(options);
    this.vel = [0,0];
    this.startingPos = options.pos.slice(0);
    this.checkCoordsForVel();
    this.sound = options.sound;
    this.score = options.score;
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
    this.game.currentEnemyCount -= 1;
  }

  clearChangeBlock() {
    clearInterval(this.changeSize);
  }

  checkCoordsForVel(pos) {
    if (this.startingPos[0] === 0 && this.startingPos[1] === -50) {
      this.vel = [0, .2];
      this.endPoint = 650;
    } else if (this.startingPos[0] === -50 && this.startingPos[1] === 0) {
      this.vel = [.2, 0];
      this.endPoint = 450;
    } else if (this.startingPos[0] === 0 && this.startingPos[1] === this.game.DIM_Y + 50) {
      this.vel = [0, -.2];
      this.endPoint = 650;
    } else if (this.startingPos[0] === this.game.DIM_X + 50 && this.startingPos[1] === 0) {
      this.vel = [-.2, 0];
      this.endPoint = 450;
    }
  }

  checkForBullet(object) {
    if (object.constructor.name === "Bullet"){
      if (object.pos[1] <= this.pos[1] + 25
        && object.pos[1] > (this.pos[1] - 25
        )) {
        return true;
      } else if (object.pos[1] >= this.pos[1] - 25
        && object.pos[1] < (this.pos[1] + 25
        )) {
        return true;
      }
    }
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
      this.vel[0] = this.vel[0] * 1.5;
      this.vel[1] = this.vel[1] * 1.5;
      this.color = '#FF00FF';
    } else if (this.health <= 2) {
      this.vel[0] = this.vel[0] * 1.5;
      this.vel[1] = this.vel[1] * 1.5;
      this.color = '#00FFFF';
    } else {
      return;
    }
  }
}

module.exports = SlowEnemy;
