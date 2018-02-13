const MovingObject = require("./moving_object");
const Bullet = require("./bullet");
const Shield = require("./shield");
const Bomb = require("./bomb");
const Util = require("./util");
const FastEnemy = require("./fast_enemy");
const SlowEnemy = require("./slow_enemy");

const DEFAULTS = {
  COLOR: "red",
  SPEED: [0, 0],
  HEIGHT: 10,
  WIDTH: 10,
  HEALTH: 100,
};

class Avatar extends MovingObject {
  constructor(options) {
    options.pos = options.pos;
    options.height = DEFAULTS.HEIGHT,
    options.width = DEFAULTS.WIDTH,
    options.vel = DEFAULTS.SPEED;
    options.color = DEFAULTS.COLOR;
    super(options);
    this.flashActive;
    this.rectangle = true;
    this.ammo = 7;
    this.tpActive = false;
    this.shieldCount = 3;
    this.bombCount = 3;
    this.sound = options.sound;
    this.shieldActive = false;
    this.blasterFireActive = false;
    this.dead = false;
    this.tempInvinc = false;
    this.cursor = options.cursor;
    this.activePowers = {
      w: false,
      a: false,
      s: false,
      d: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowRight: false,
      ArrowLeft: false
    };
    this.MOVES = {
      w: [0, -.08],
      a: [-.08, 0],
      s: [0, .08],
      d: [.08, 0],
      ArrowUp: [0, -.08],
      ArrowLeft: [-.08, 0],
      ArrowDown: [0, .08],
      ArrowRight: [.08,0]
    };
  }

  resetAvatar() {
    this.pos = [this.game.DIM_X/2, this.game.DIM_Y/2];
    this.shieldCount = 3;
    this.ammo = 7;
    this.dead = false;
    this.tempInvinc = false;
    this.shieldActive = false;
    this.blasterFireActive = false;
    this.color = "red";
  }

  fireBullet() {
    if (this.dead) {
      return;
    }

    if (this.vel[0] === 0 && this.vel[1] === 0) {
      this.flash("Move!");
      return;
    }

    if (this.blasterFireActive || this.game.storyActive) {
      return;
    }

    if (this.ammo <= 0) {
      this.flash("Reload");
      this.sound.playSound("emptyClip");
      return;
    }

    const relVel = Util.scale(
      Util.dir(this.vel),
      Bullet.SPEED
    );

    const bulletVel = [
      relVel[0] + this.vel[0], relVel[1] + this.vel[1]
    ];

    const bullet = new Bullet({
      pos: this.pos,
      vel: bulletVel,
      color: "lightgreen",
      game: this.game,
      width: 4,
      height: 4
    });

    this.game.generate(bullet);
    this.sound.playSound("blasterFired");
    this.blasterFireActive = true;
    this.ammo -= 1;
    setTimeout(() => { this.blasterFireActive = false; }, 100);
  }

  velToBulletSize() {
    if (Math.abs(this.vel[0]) > Math.abs(this.vel[1])) {
      return {
        width: 8,
        height: 4
      };
    } else {
      return {
        width: 4,
        height: 8
      };
    }
  }

  respawn() {
    if (this.dead === true) {
      this.pos = [(this.game.DIM_X/2), (this.game.DIM_Y/2)];
      this.deployBomb("blue");
      this.color = "red";
      this.cursor.color = "red";
      this.dead = false;
      this.tempInvinc = true;
      setTimeout(() => { this.tempInvinc = false; }, 1400);
    }
  }

  killed () {
    if (this.game.lives <= 1) {
      this.dead = true;
      this.color = "transparent";
      this.cursor.color = "transparent";
      this.game.gameOver();
    } else {
      this.dead = true;
      this.cursor.color = "transparent";
      this.color = "transparent";
    }
  }

  deployShield() {
    if (this.shieldCount > 0 && !this.shieldActive) {
      const shield =  new Shield ({
        pos: [(this.pos[0] - this.vel[0] + (this.width/2)),
        (this.pos[1] - this.vel[1] + (this.height/2))],
        vel: this.vel,
        game: this.game,
        sound: this.sound
      });

      this.shieldCount -= 1;
      this.shieldActive = true;
      this.tempInvinc = true;
      setTimeout(() => { this.tempInvinc = false;
      this.shieldActive = false;}, 10300);
      this.sound.playSound("shield");
      this.game.generate(shield);
    }
  }

  deployBomb(color) {
    if (this.bombCount > 0) {
      const bomb =  new Bomb ({
        pos: [(this.pos[0] - this.vel[0] + (this.width/2)),
        (this.pos[1] - this.vel[1] + (this.height/2))],
        vel: [0, 0],
        game: this.game,
        sound: this.sound,
        color: color,
        bigBomb: true,
        radius: 1
      });

      this.bombCount -= 1;
      this.game.generate(bomb);
    } else if (this.dead) {
      const bomb =  new Bomb ({
        pos: [(this.pos[0] - this.vel[0] + (this.width/2)),
        (this.pos[1] - this.vel[1] + (this.height/2))],
        vel: [0, 0],
        game: this.game,
        sound: this.sound,
        color: color,
        bigBomb: true,
        radius: 1
      });

      this.game.generate(bomb);
    }
  }

  deployLittleBomb(newPos) {
    const bomb =  new Bomb ({
      pos: [newPos[0] + (this.width/2), newPos[1] + (this.height/2)],
      vel: [0, 0],
      game: this.game,
      sound: this.sound,
      color: "blue",
      littleBomb: true,
      radius: 1
    });

    this.game.generate(bomb);
  }

  deathExplosion() {
    const bomb =  new Bomb ({
      pos: [(this.pos[0] - this.vel[0] + (this.width/2)),
      (this.pos[1] - this.vel[1] + (this.height/2))],
      vel: [0, 0],
      game: this.game,
      sound: this.sound,
      color: "red",
      deathBomb: true,
      radius: 40
    });

    this.game.generate(bomb);
  }

  power(impulse) {
    if (!this.game.storyActive) {
      if (impulse[0] > 0 && this.vel[0] < 0) {
        this.vel[0] = 0;
      } else if (impulse[0] < 0 && this.vel[0] > 0) {
        this.vel[0] = 0;
      }

      if (impulse[1] > 0 && this.vel[1] < 0) {
        this.vel[1] = 0;
      } else if (impulse[1] < 0 && this.vel[1] > 0) {
        this.vel[1] = 0;
      }

      this.vel[0] += impulse[0];
      this.vel[1] += impulse[1];
    }
   }

   relocate() {
     this.sound.playSound("teleport");
     let newPos = this.game.randomPosition();
     this.deployLittleBomb(newPos);
     this.tempInvinc = true;
     this.pos = newPos;
     setTimeout(() => {
       this.tempInvinc = false;
     }, 500);
     this.vel = [0, 0];
   }

  flash(string) {
    let display = document.getElementById("flash");

    if (this.vel[0] === 0 && this.vel[1] === 0 && !this.flashActive) {
      this.flashActive = true;
      setTimeout(() => this.displayFlash(display, string), 0);
      setTimeout(() => this.displayFlash(display, ""), 650);
      this.flashActive = false;
    }

    if (this.ammo === 0 && !this.flashActive) {
      this.flashActive = setInterval(() =>
      this.displayFlash(display, string), 400);
    }
  }

  displayFlash(display, string) {
    if (display.innerHTML) {
      display.innerHTML = "";
    } else {
      display.innerHTML = string;
    }
  }

  collideWith(object) {
    if (!this.dead) {
      if (!this.tempInvinc) {
        if (object.constructor.name === "SlowEnemy") {
          object.damage();
          this.enemyCollision();
        } else if (object instanceof FastEnemy) {
          object.remove();
          this.enemyCollision();
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  enemyCollision() {
    this.deathExplosion();
    this.killed();
    this.sound.playSound("shutdown");
    this.sound.playDeathMusic();
    this.game.score.resetMultiplier();
    return true;
  }
}

module.exports = Avatar;
