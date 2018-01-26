/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Util = {

  dist (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    ) * 1.1;
  },

  randomVec (length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
// Scale the length of a vector by the given amount.
  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },

  dir(vec) {
    const norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },

  norm(vec) {
    return Util.dist([0, 0], vec);
  },

};


module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

const NORMAL_FRAME_TIME_DELTA = 1000/100;

class MovingObject {

  constructor (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.width = options.width;
    this.height = options.height;
    this.game = options.game;
    this.color = options.color;
    this.radius = options.radius;
    this.triangle = options.triangle;
    this.temperSpeed = this.temperSpeed.bind(this);
    this.isCollidedWith = this.isCollidedWith.bind(this);
    this.drawSlowEnemy = this.drawSlowEnemy.bind(this);
    this.setPosToAvatar = this.setPosToAvatar.bind(this);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    this.slow();

    if (this.shield) {
      if (this.constructor.name === "Shield") {
        this.setPosToAvatar();
      }
      ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00f9ff';
      ctx.stroke();
    } else if (this.bomb) {
      this.drawBomb(ctx);
    } else if (this.triangle) {
      this.drawFastEnemy(ctx);
    } else if (this.line) {
      this.drawSlowEnemy(ctx);
    } else if (this.rectangle) {
      ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
      ctx.fill();
    }
  }

  drawBomb(ctx) {
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  drawFastEnemy(ctx) {
    if (this.game.avatar.length > 0){
      ctx.save();
      ctx.lineWidth = 1;
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.rotate(Math.atan2(this.pos[1] - this.game.avatar[0].pos[1],
      this.pos[0] - this.game.avatar[0].pos[1]) * Math.PI / 120);
      ctx.lineTo(this.pos[0], (this.pos[1] - this.legOffset));
      this.legOne = [this.pos[0], (this.pos[1] - this.legOffset)];
      ctx.lineTo((this.pos[0] - this.legOffset), this.pos[1]);
      this.legTwo = [(this.pos[0] - this.legOffset), this.pos[1]];
      this.calculateCenterPoint();
      ctx.closePath();
      ctx.strokeStyle = '#FF00FF';
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.lineWidth = 1;
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0], (this.pos[1] - this.legOffset));
      ctx.lineTo((this.pos[0] - this.legOffset), this.pos[1]);
      ctx.closePath();
      ctx.strokeStyle = '#FF00FF';
      ctx.stroke();
    }
  }

  drawSlowEnemy(ctx) {
    if (this.startingPos[0] === 0 && this.startingPos[1] === -50) {
      if (!this.velocityCheck){
        this.vel = [0, .2];
        this.velocityCheck += 1;
        this.endPoint = 650;
      }
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.endPoint, this.pos[1]);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 25;
      ctx.stroke();
    } else if (this.startingPos[0] === -50 && this.startingPos[1] === 0) {
      if (!this.velocityCheck) {
        this.vel = [.2, 0];
        this.velocityCheck += 1;
        this.endPoint = 450;
      }
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0], this.endPoint);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 25;
      ctx.stroke();
    } else if (this.startingPos[0] === 0 && this.startingPos[1] === 450) {
      if (!this.velocityCheck) {
        this.vel = [0, -.2];
        this.velocityCheck += 1;
        this.endpoint = 650;
      }
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.endPoint, this.pos[1]);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 25;
      ctx.stroke();
    } else if (this.startingPos[0] === 650 && this.startingPos[1] === 0) {
      if (!this.velocityCheck) {
        this.vel = [-.2, 0];
        this.velocityCheck += 1;
        this.endpoint = 450
      }
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0], this.endPoint);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 25;
      ctx.stroke();
    }
  }

  isCollidedWith(otherObject) {
    if (this == otherObject) {
      return;
    } else if (
      this.constructor.name === "Avatar"
      && otherObject.constructor.name === "Shield"
    ) {
      return;
    } else if (this.radius || otherObject.radius) {
      const centerDist = Util.dist(this.pos, otherObject.pos);
      if (this.radius) {
        return centerDist < (this.radius * 1.2);
      } else if (otherObject.radius) {
        return centerDist < (otherObject.radius * 1.2);
      }
    } else if (otherObject.triangle) {
      if (!otherObject.centerPoint) {
        return false;
      }
      const centerDist = Util.dist(this.pos, otherObject.centerPoint);
      return centerDist < (this.width * 2);
    } else if (this.width && otherObject.width) {
      const centerDist = Util.dist(this.pos, otherObject.pos);
      return centerDist < (this.width + otherObject.width);
    } else {
      return this.checkSlowEnemyCoords(this.pos, otherObject);
    }
  }

  checkSlowEnemyCoords(pos, otherObject) {

    if (this.constructor.name !== "SlowEnemy") {
      if (
        otherObject.startingPos[0] === 0
        && otherObject.startingPos[1] === -50
        && !otherObject.dead
      ){
        if (pos[1] <= otherObject.pos[1] + 10
          && pos[1] > (otherObject.pos[1] - 20
          && !otherObject.dead
          )) {
          return true;
        } else {
          return false;
        }
      } else if (
        otherObject.startingPos[0] === 0
        && otherObject.startingPos[1] === 450
        && !otherObject.dead
      ){
        if (pos[1] >= otherObject.pos[1] - 10
          && pos[1] < (otherObject.pos[1] + 20
          && !otherObject.dead
          )) {
          return true;
        } else {
          return false;
        }
      } else if (
        otherObject.startingPos[0] === -50
        && otherObject.startingPos[1] === 0
        && !otherObject.dead
      ){
        if (pos[0] <= otherObject.pos[0] + 10
          && pos[0] > (otherObject.pos[0] -20
          && !otherObject.dead
          )) {
          return true;
        } else {
          return false;
        }
      } else if (
        otherObject.startingPos[0] === 650
        && otherObject.startingPos[1] === 0
        && !otherObject.dead
      ){
        if (pos[0] >= otherObject.pos[0] - 10
          && pos[0] < (otherObject.pos[0] + 20
          && !otherObject.dead
          )) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }


  // timeDelta is number of milliseconds since last move
  // if the computer is busy the time delta will be larger
  // in this case the MovingObject should move farther in this frame
  // velocity of object is how far it should move in 1/60th of a second
  move(timeDelta) {
    if (this.constructor.name === "Avatar") {
      this.temperSpeed();
    }

    const velocityScale = (timeDelta / NORMAL_FRAME_TIME_DELTA) * 1.8,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    let checkingPosition = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.constructor.name === "Avatar") {
      this.setXCoordinate(offsetX);
      this.setYCoordinate(offsetY);
      this.cursor.updatePos([
        this.pos[0] + (this.width/2) + (this.vel[0] * 15),
        this.pos[1] + (this.height/2) + (this.vel[1] * 15)
      ]);
    } else {
      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    }

    if (this.game.isOutOfBounds(this.pos)) {
      this.remove();
    }
  }

  moveFastEnemy(targetPos) {
    if (targetPos) {
      this.vel[0] = ((targetPos[0] - this.pos[0]) / this.speedOffset);
      this.vel[1] = ((targetPos[1] - this.pos[1]) / this.speedOffset);
    } else {
      this.vel = this.vel;
    }

    // this.temperEnemySpeed();
    // best offset .997
    this.speedOffset = this.speedOffset * .99;
    if (this.speedOffset < 50) {
      this.speedOffset = 50;
    }

    if (this.pos[0] !== targetPos[0] && this.pos[1] !== targetPos[1]) {
      this.pos[0] = this.pos[0] + this.vel[0];
      this.pos[1] = this.pos[1] + this.vel[1];
    } else {
      this.pos[0] = targetPos[0];
      this.pos[1] = targetPos[1];
    }
  }

  moveSlowEnemy() {
    this.pos[0] = this.pos[0] + this.vel[0];
    this.pos[1] = this.pos[1] + this.vel[1];
  }

  slow() {
    if (this.constructor.name === "Avatar"){
      this.vel[0] = this.vel[0] * .95;
      this.vel[1] = this.vel[1] * .95;
    }
  }

  temperSpeed() {
    if (this.vel[0] > MovingObject.MAXSPEED) {
      this.vel[0] = MovingObject.MAXSPEED;
    } else if (this.vel[0] < MovingObject.MINSPEED) {
      this.vel[0] = MovingObject.MINSPEED;
    }

    if (this.vel[1] > MovingObject.MAXSPEED) {
      this.vel[1] = MovingObject.MAXSPEED;
    } else if (this.vel[1] < MovingObject.MINSPEED) {
      this.vel[1] = MovingObject.MINSPEED;
    }
  }

  // Temp1

  setXCoordinate(offsetX) {
    if (this.pos[0] + offsetX < 0) {
      this.pos[0] = this.width - (this.width - 1);
      if (this.vel[0] !== 0) {
        this.vel[0] = 0;
      }
    } else if (this.pos[0] + this.width + offsetX > this.game.DIM_X) {
      this.pos[0] = this.game.DIM_X - this.width;
      if (this.vel[0] !== 0) {
        this.vel[0] = 0;
      }
    } else {
      this.pos[0] = this.pos[0] + offsetX;
    }
  }

  setYCoordinate(offsetY) {
    if (this.pos[1] + offsetY < 0) {
      this.pos[1] = this.height - (this.height - 1);
      if (this.vel[1] !== 0) {
        this.vel[1] = 0;
      }
    } else if (this.pos[1] + this.height + offsetY > this.game.DIM_Y) {
      this.pos[1] = this.game.DIM_Y - (this.height + 1);
      if (this.vel[1] !== 0) {
        this.vel[1] = 0;
      }
    } else {
      this.pos[1] = this.pos[1] + offsetY;
    }
  }

  setPosToAvatar() {
    this.pos[0] = this.game.avatar[0].pos[0] + this.game.avatar[0].width/2;
    this.pos[1] = this.game.avatar[0].pos[1] + this.game.avatar[0].height/2;
  }

  randomEnemyPosition() {
    let possibleCoord = [
      (100 * Math.random()) - 100,
      (100 * Math.random()) - 100
    ];
  }

  remove() {
    this.game.remove(this);
  }

}

MovingObject.MAXSPEED = 1.8;
MovingObject.MINSPEED = -1.8;
MovingObject.MAXENEMYSPEED = 1;
MovingObject.MINENEMYSPEED = -1;

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Avatar = __webpack_require__(3);
const Bullet = __webpack_require__(4);
const FastEnemy = __webpack_require__(6);
const Shield = __webpack_require__(5);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Bullet = __webpack_require__(4);
const Shield = __webpack_require__(5);
const Bomb = __webpack_require__(13);
const Util = __webpack_require__(0);
const FastEnemy = __webpack_require__(6);
const SlowEnemy = __webpack_require__(2);

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
    this.lives = 3;
    this.shieldCount = 3;
    this.bombCount = 3;
    this.sound = options.sound;
    this.shieldActive = false;
    this.blasterFireActive = false;
    this.dead = false;
    this.tempInvinc = false;
    this.cursor = options.cursor;
  }

  resetAvatar() {
    this.pos = [this.game.DIM_X/2, this.game.DIM_Y/2];
    this.shieldCount = 3;
    this.ammo = 7;
    this.lives = 3;
    this.dead = false;
    this.tempInvinc = false;
    this.shieldActive = false;
    this.blasterFireActive = false;
  }

  fireBullet() {
    if (this.dead) {
      this.checkForRespawn();
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
      game: this.game
    });

    this.game.generate(bullet);
    this.sound.playSound("blasterFired");
    this.blasterFireActive = true;
    this.ammo -= 1;
    setTimeout(() => { this.blasterFireActive = false; }, 100);
  }

  respawn() {
    if (this.dead === true) {
      this.pos = [(this.game.DIM_X/2), (this.game.DIM_Y/2)];
      this.deployBomb("blue");
      this.color = "red";
      this.dead = false;
      this.tempInvinc = true;
      setTimeout(() => { this.tempInvinc = false; }, 1400);
    }
  }

  killed () {
    this.dead = true;
    this.color = "transparent";
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
      this.shieldActive = false;}, 15300);
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const SlowEnemy = __webpack_require__(2);
const Avatar = __webpack_require__(3);

class Bullet extends MovingObject {
  constructor(options) {
    options.area = Bullet.AREA;
    options.width = 5;
    options.height = 5;
    options.color = "white";
    super(options);
    this.rectangle = true;
  }

  collideWith(object) {
    if (object.constructor.name === "SlowEnemy") {
      object.damage();
      this.remove();
      return true;
    }
  }
}

Bullet.WIDTH = 2;
Bullet.HEIGHT = 2;
Bullet.AREA = 2;
Bullet.SPEED = 20;

module.exports = Bullet;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);

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
    this.reductionTimeout = setTimeout(() => { return this.reduceShield(); }, 15000);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const Bullet = __webpack_require__(4);
const Avatar = __webpack_require__(3);
const MovingObject = __webpack_require__(1);
const SlowEnemy = __webpack_require__(2);
const Shield = __webpack_require__(5);
const Bomb = __webpack_require__(13);


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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const SlowEnemy = __webpack_require__(2);
const FastEnemy = __webpack_require__(6);
const Bullet = __webpack_require__(4);
const Avatar = __webpack_require__(3);
const Cursor = __webpack_require__(15);
const Shield = __webpack_require__(5);
const Bomb = __webpack_require__(13);
const Util = __webpack_require__(0);

class Game {
  constructor(sound, score) {
    this.enemies = [];
    this.bullets = [];
    this.shield = [];
    this.bomb = [];
    this.avatar = [];
    this.cursor = [];
    this.DIM_X = 650;
    this.DIM_Y = 400;

    this.sound = sound;
    this.score = score;
    this.storyActive = false;
    this.newEnemies;
    this.currentEnemyCount = 0;
    this.remainingEnemyCount = 100;
    this.slowEnemyCount = 0;
    this.lives = 3;
    this.createEnemy = this.createEnemy.bind(this);
    this.generateEnemies = this.generateEnemies.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
    this.checkEnemyCount = this.checkEnemyCount.bind(this);
    }
    resetGame() {
      this.enemyCount = 100;
      this.enemies = [];
      this.bullets = [];
      this.shield = [];
      this.bomb = [];
      this.sound.allMusic.forEach((music) => {
        music.currentTime = 0;
      });
      this.score.resetScore();    
    }

  generate(object) {
    if (object instanceof SlowEnemy) {
      this.enemies.push(object);
    } else if (object instanceof FastEnemy) {
      this.enemies.push(object);
    } else if (object instanceof Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Shield) {
      this.shield.push(object);
    } else if (object instanceof Bomb) {
      this.bomb.push(object);
    } else if (object instanceof Avatar) {
      this.avatar.push(object);
    } else if (object instanceof Cursor) {
      this.cursor.push(object);
    } else {
      throw new Error("unknown object");
    }
  }

  generateEnemies() {
    this.newEnemies = setInterval(this.createEnemy, this.enemyRate());
  }

  enemyRate() {
    if (this.remainingEnemyCount > 90) {
      return 3000;
  } else if (this.remainingEnemyCount > 80) {
      return 2000;
  } else if (this.remainingEnemyCount > 60) {
      return 1250;
  } else if ( this.remainingEnemyCount > 40) {
      return 1000;
  } else if ( this.remainingEnemyCount > 20) {
      return 750;
  } else {
      return 400;
    }
  }

  createEnemy() {
    let enemies = [SlowEnemy, FastEnemy];
    let enemy = enemies[Math.floor(Math.random()*enemies.length)];

    if (this.currentEnemyCount <= 10) {
      if (this.remainingEnemyCount > 0) {
        if (enemy === SlowEnemy) {
          enemy = new enemy({
            pos: this.randomSlowEnemyPosition(),
            game: this,
            avatarPos: this.avatar.pos,
            sound: this.sound,
            score: this.score
          });
          this.slowEnemyCount += 1;
        } else {
          enemy = new enemy({
            pos: this.randomEnemyPosition(),
            game: this,
            avatarPos: this.avatar.pos,
            sound: this.sound,
            score: this.score
          });
        }
        this.remainingEnemyCount -= 1;
        this.checkEnemyCount();
        this.generate(enemy);
        return enemy;
      } else {
        clearInterval(this.newEnemies);
      }
    }

    return;
  }

  checkEnemyCount() {
    console.log(this.remainingEnemyCount);
    if (
      this.remainingEnemyCount === 90
      || this.remainingEnemyCount === 70
      || this.remainingEnemyCount === 50
      || this.remainingEnemyCount === 20
    ) {
      clearInterval(this.newEnemies);
      this.generateEnemies();
    }
  }

  generateAvatar(sound, position) {
    if (this.lives < 3) {
      this.sound.stopDeathMusic();
    }
    let avatarPos;

    if (position) {
      avatarPos = position;
    } else {
      avatarPos = [Game.DIM_X/2, Game.DIM_Y/2];
    }
    const avatar = new Avatar({
      pos: avatarPos,
      game: this,
      sound: sound,
      cursor: new Cursor(avatarPos)
    });

    this.generate(avatar);
    this.generate(avatar.cursor);
    return avatar;
  }

  randomEnemyNum () {
    return Math.floor(Math.random() * 2);
  }

  allObjects () {
    return [].concat(this.avatar, this.enemies, this.bullets, this.shield, this.bomb, this.cursor);
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  draw(ctx) {

    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    if (!this.storyActive) {
      this.score.displayScore();
    }

    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      if (object instanceof Avatar ||
         object instanceof Shield ||
         object instanceof Bullet) {
        object.move(delta);
      } else if (object instanceof FastEnemy){
        if (this.avatar[0]) {
          object.moveFastEnemy(this.avatar[0].pos);
        }

      } else if (object instanceof SlowEnemy){
        if (this.avatar[0]) {
          object.moveSlowEnemy();
        }
      }
    });
  }

  isOutOfBounds(pos) {
    return (pos[0] <= -100) || (pos[1] <= -100) ||
      (pos[0] >= Game.DIM_X + 100) || (pos[1] >= Game.DIM_Y + 100);
  }

  checkCollisions () {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision) return;
        }
      }
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof SlowEnemy) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } else if (object instanceof FastEnemy) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } else if (object instanceof Avatar) {
      this.avatar.splice(this.avatar.indexOf(object), 1);
    } else if (object instanceof Shield) {
      this.shield.splice(this.shield.indexOf(object), 1);
    } else if (object instanceof Bomb) {
      this.bomb.splice(this.bomb.indexOf(object), 1);
    } else {
      throw new Error("unknown type of object");
    }
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  randomEnemyPosition() {
    let possibleLowXCoord = [
      (100 * Math.random()) - 100,
      (Game.DIM_Y * Math.random())
    ];

    let possibleHighXCoord = [
      (100 * Math.random()) + Game.DIM_X,
      (Game.DIM_Y * Math.random())
    ];

    let possibleLowYCoord = [
      (Game.DIM_X * Math.random()),
      ((100 * Math.random()) - 100)
    ];

    let possibleHighYCoord = [
      (Game.DIM_X * Math.random()),
      ((100 * Math.random()) + Game.DIM_Y)
    ];

    const possibleCoords = [
      possibleLowXCoord,
      possibleHighXCoord,
      possibleLowYCoord,
      possibleHighYCoord
    ];

    return possibleCoords[Math.floor(Math.random()*possibleCoords.length)];
  }

  randomSlowEnemyPosition () {
    let possibleCoords = [[0,-50], [-50, 0], [0, (Game.DIM_Y + 50)], [(Game.DIM_X + 50), 0]];
    let coord = possibleCoords[Math.floor(Math.random()*possibleCoords.length)];

    return coord;

    // let coords = ([0,400], [600,400], [0]);
  }

}

Game.BG_COLOR = "black";
Game.DIM_X = 650;
Game.DIM_Y = 400;
Game.FPS = 60;

module.exports = Game;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(7);
const gameView = __webpack_require__(9);
const Sound = __webpack_require__(11);
const Score = __webpack_require__(12);


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("survivalTypist");
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;
  const audio = new Sound();
  audio.toggleMusic();


  const ctx = canvas.getContext("2d");
  const score = new Score();
  const game = new Game(audio, score);
  const currentGameView = new gameView(game, ctx, audio, score);
  score.gameView = currentGameView;
  currentGameView.bindEnter();

  const currentInput = document.getElementById("myInput");
  currentInput.addEventListener("keydown", currentGameView.textInput.handleInput);
});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const TextInput = __webpack_require__(10);
const Story = __webpack_require__(14);

class gameView {
  constructor(game, ctx, sound, score) {
    this.ctx = ctx;
    this.game = game;
    this.sound = sound;
    this.score = score;
    this.avatar = this.game.generateAvatar(this.sound);
    this.textInput = new TextInput({game: this.game, avatar: this.avatar, gameView: this});
    this.sound.playIntroMusic();
    this.started = false;
    this.playing = false;
    this.toggleInput = this.toggleInput.bind(this);
    this.start();
    this.keyControlsActive = true;
    this.howToPlayActive = false;
  }


  bindKeyHandlers() {
    const avatar = this.avatar;

    Object.keys(gameView.MOVES).forEach((k) => {
      const move = gameView.MOVES[k];

      key(k, (e) => { e.preventDefault(); avatar.power(move); });
    });

    key("space", () => { avatar.fireBullet(); });
  }

  bindEnter() {
    key("enter", this.toggleInput);

    key("tab", (e) => { e.preventDefault(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    // start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  play() {
    this.playing = true;
    setTimeout(this.bounceTitle, 1000);
    setTimeout(this.game.generateEnemies, 1000);
    document.getElementById("backgroundBeats").play();
    document.getElementById("myInput").setAttribute("placeholder",
    "Press Enter to Switch to Text Input");
    this.sound.stopIntroMusic();
  }

  toggleInput () {
      let input = document.getElementById("myInput");
      input.focus();
      input.removeAttribute("placeholder");
  }

  bounceTitle () {
    const title = document.getElementsByClassName("title-text");
    title[0].classList.add("animated");
    title[0].classList.add("pulse");
    title[0].classList.add("infinite");
  }

  animate(time) {
    const timeDelta = (time - this.lastTime);

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.updateUI();
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }

  updateUI () {
    const curAmmo = this.avatar.ammo;
    const curShield = this.avatar.shieldCount;
    const curBombs = this.avatar.bombCount;
    const lives = this.game.lives;

    let ammoCount= document.getElementById("ammo");
    ammoCount.innerHTML = curAmmo;
    this.updateAmmoColor(ammoCount);
    let shieldCount = document.getElementById("shield");
    shieldCount.innerHTML = curShield;
    shieldCount.classList.add('shield-color');
    let bombCount = document.getElementById("bomb");
    bombCount.innerHTML = curBombs;
    bombCount.classList.add("bomb-color");
    let liveCont = document.getElementById("lives");
    liveCont.innerHTML = lives;
  }

  updateAmmoColor (el) {
    if (parseInt(el.innerHTML) >= 8) {
      el.classList.remove("white");
      el.classList.remove("yellow");
      el.classList.remove("red");
    } else if (parseInt(el.innerHTML) > 5) {
      el.classList.remove("yellow");
      el.classList.remove("red");
      if (el.classList[1] !== "white") {
        el.classList.add("white");
      }
    } else if (parseInt(el.innerHTML) > 3) {
      if (el.classList[2] !== "yellow") {
        el.classList.add("yellow");
      }
    } else {
      if (el.classList[3] !== "red") {
        el.classList.add("red");
      }
    }
  }

  switchOptions() {
    let howToPlay = document.getElementById("howToPlay");
    let keyControls = document.getElementById("keyControls");

    howToPlay.addEventListener("click", () => {
      keyControls = document.getElementById("keyControls");
      keyControls.classList.add('hide');
       this.classList.remove("hide");
     });

    keyControls.addEventListener("click", () => {
      howToPlay = document.getElementById("howToPlay");
      howToPlay.classList.add('hide');
       this.classList.remove("hide");
     });

  }

  playStory() {
    this.sound.stopIntroMusic();
    this.sound.playStoryMusic();
    this.game.storyActive = true;
    Story(this.game);
  }

  gameOver() {

  }
}

gameView.MOVES = {
  w: [0, -.8],
  a: [-.8, 0],
  s: [0, .8],
  d: [.8, 0],
  up: [0, -.8],
  left: [-.8, 0],
  down: [0, .8],
  right: [.8,0]
};


module.exports = gameView;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(7);

class TextInput {
  constructor (options) {
    this.game = options.game;
    this.avatar = options.avatar;
    this.gameView = options.gameView;

    this.handleInput = this.handleInput.bind(this);
    this.checkForReload = this.checkForReload.bind(this);
  }

  handleInput(e) {
    if (e.key === "Tab") {
      e.preventDefault();
    }

    if (this.game.storyActive) {
      return;
    }

    e.target.value = e.target.value;
    let currentValue = e.target.value;

    if (e.key === "Enter") {
      if (this.checkForStart(currentValue)) {
        this.clearDisplays();
      } else if (this.checkForReload(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRelocate(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForShield(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForBomb(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRestart(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRespawn(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForStory(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else {
        e.target.value = "";
      }

      document.getElementById("myInput").blur();
    }
  }

  checkForStart(curVal) {
    if (curVal.toLowerCase() === "start" && !this.gameView.started) {
      this.gameView.started = true;
      this.gameView.play();
      this.game.enemyCount = 100;
      this.game.enemies = [];
      this.game.bullets = [];
      this.game.shield = [];
      this.game.bomb = [];
      this.avatar.pos = [this.game.DIM_X/2, this.game.DIM_Y/2];
      this.avatar.vel = [0,0];
      this.avatar.shieldCount = 3;
      this.avatar.ammo = 7;
      this.avatar.lives = 3;
      this.avatar.bombCount = 3;
      // this.gameView.sound.toggleIntroMusic();
    }
  }

  checkForRelocate(curVal) {
    if (curVal.toLowerCase() === "tp") {
      this.avatar.relocate();
    }
  }

  checkForShield(curVal) {
    if (curVal.toLowerCase() === "shield") {
      this.avatar.deployShield();
    }
  }

  checkForBomb(curVal) {
    if (curVal.toLowerCase() === "bomb" && !this.avatar.dead) {
      this.avatar.deployBomb("#ffaa00");
    }
  }

  checkForStory(curVal) {
    if (curVal.toLowerCase() === "story" && !this.gameView.playing) {
      this.gameView.playStory();
    }
  }

  checkForReload(curVal) {
    if (curVal.toLowerCase() === "rl" && this.avatar.ammo < 7) {
      this.avatar.ammo = 7;
      clearInterval(this.avatar.flashActive);
      this.avatar.flashActive = false;
      return true;
    } else if (curVal.toLowerCase() === "reload") {
      this.avatar.ammo = 14;
      clearInterval(this.avatar.flashActive);
      this.avatar.flashActive = false;
      return true;
    } else {
      return false;
    }
  }

  checkForRestart(curVal) {
    if (
      curVal.toLowerCase() === "restart" ||
      curVal.toLowerCase() === "reset"
    ){
      this.game.resetGame();
      this.avatar.resetAvatar();
      this.gameView.started = true;
      this.gameView.playing = true;
    }
  }

  checkForRespawn(curVal) {
    let avatar;

    if (
      curVal.toLowerCase() === "revive" ||
      curVal.toLowerCase() === "respawn"
    ){
      if (this.avatar.dead && this.game.lives > 0) {
        this.game.lives -= 1;
        this.avatar.respawn();
        this.avatar.dead = false;
        this.gameView.sound.stopDeathMusic();
      }
    } else {
      this.gameView.gameOver();
    }
  }

  clearDisplays() {
    let displays = document.getElementsByClassName("flash");
    for (let i = 0; i < displays.length; i++) {
      displays[i].innerHTML = "";
    }
  }
}


module.exports = TextInput;


/***/ }),
/* 11 */
/***/ (function(module, exports) {



class Sound {
  constructor () {
    this.introMusic;
    this.musicActive = true;
    this.introMusic = document.getElementById("intro");
    this.deathMusic = document.getElementById("deathmarch");
    this.backgroundBeats = document.getElementById("backgroundBeats");
    this.storyMusic = document.getElementById("storyMusic");
    this.allMusic = [
      this.introMusic, this.deathMusic, this.backgroundBeats, this.storyMusic
    ];
    this.toggleMusic = this.toggleMusic.bind(this);
    // this.toggleIntroMusic = this.toggleIntroMusic.bind(this);
  }

  toggleMusic () {
    const soundButtons = document.getElementsByClassName("sound-button");
    let muted;

    for (var i = 0; i < soundButtons.length; i++) {
      const gameMusic = [
        document.getElementById("backgroundBeats"),
        document.getElementById("intro"),
        document.getElementById("deathmarch"),
        document.getElementById("storyMusic")
      ];

      const that = this;
      soundButtons[i].addEventListener("click", () => {
        gameMusic.forEach((music) => {
          music.muted = !music.muted;
        } );
        this.musicActive = !this.musicActive;
        this.switchIcons(this.musicActive);
      });
    }
  }

  playIntroMusic() {
    this.introMusic.currentTime = 0;
    this.introMusic.play();
    this.introMusic.setAttribute("autoplay", true);
    this.introMusic.setAttribute("loop", true);
  }

  stopIntroMusic() {
    this.introMusic.pause();
  }

  playStoryMusic() {
    this.storyMusic.play();
  }

  playDeathMusic() {
    this.backgroundBeats.pause();
    this.deathMusic.setAttribute("loop", true);
    this.deathMusic.play();
  }

  stopDeathMusic() {
    this.backgroundBeats.play();
    this.deathMusic.pause();
    this.deathMusic.setAttribute("loop", false);
  }

  switchIcons (muted) {
    let volumeIcons;

    if (!muted) {
      volumeIcons = document.getElementsByClassName("volume");

      for (var i = 0; i < volumeIcons.length; i++) {
        volumeIcons[i].classList.remove("fa-volume-up");
        volumeIcons[i].classList.add("fa-volume-off");
      }
    } else {
      volumeIcons = document.getElementsByClassName("volume");

      for (var i = 0; i < volumeIcons.length; i++) {
        volumeIcons[i].classList.remove("fa-volume-off");
        volumeIcons[i].classList.add("fa-volume-up");

      }
    }
  }

  playSound(id) {
    if (this.musicActive) {
      let soundEffect = document.createElement("AUDIO");

      if (id === "blasterFired") {
        soundEffect.setAttribute("src", "./audio/blaster.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "teleport") {
        soundEffect.setAttribute("src", "./audio/teleport.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "shield") {
        soundEffect.setAttribute("src", "./audio/shield.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "emptyClip") {
        soundEffect.setAttribute("src", "./audio/emptyClip.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "shieldRemove") {
        soundEffect.setAttribute("src", "./audio/shieldRemove.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "shutdown") {
        soundEffect.setAttribute("src", "./audio/shutdown.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "bomb") {
        soundEffect.setAttribute("src", "./audio/bomb.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "littleBomb") {
        soundEffect.setAttribute("src", "./audio/littleBomb.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "removeFastEnemy") {
        soundEffect.setAttribute("src", "./audio/removeTriangle.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "removeSlowEnemy") {
        soundEffect.setAttribute("src", "./audio/removeWall.mp3");
        soundEffect.setAttribute("autoplay", "true");
      }
    }
  }

    // const gameMusic = document.getElementById("backgroundBeats");
    // const that = this;
    //
    // gameMusic.addEventListener("change", () => {
    //   if (gameMusic.muted) {
    //     that.active = false;
    //   } else {
    //     that.active = true;
    //   }
    // });

  // toggleIntroMusic() {
  //   if (!this.introMusic) {
  //       this.introMusic = setInterval( () => {
  //       const introMusic = document.createElement("AUDIO");
  //       introMusic.setAttribute("src", "./audio/intro2.mp3");
  //       introMusic.setAttribute("autoplay", "true");
  //     }, 935);
  //   } else {
  //     clearInterval(this.introMusic);
  //     this.introMusic = false;
    // }
  // }


}

module.exports = Sound;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

class Score {
  constructor () {
    this.gameView;
    this.score = 0;
    this.multiplier = 1;
    this.scoreBoard = document.getElementById("scoreBoard");
    this.currentKills = 0;
    this.killCount = 0;
    this.flashActive = false;
  }

  add() {
    if (this.gameView.playing){
      this.score += 25 * this.multiplier;
      this.currentKills += 1;
      this.displayScore();
    }

    if (this.currentKills - this.killCount === 8) {
      this.killCount = this.currentKills;
      this.multiplier = this.multiplier * 2;
      this.flashMultiplier();
    }

    if (this.multiplier >= 8) {

    }
  }

  resetScore() {
    this.score = 0;
    this.multiplier = 1;
    this.currentKills = 0;
    this.killCount = 0;
    this.flashActive = false;
  }

  displayScore() {
    this.scoreBoard.innerHTML = `${Math.round(this.score)}`;
  }

  flashMultiplier() {
    let display = document.getElementById("flash");

    setTimeout(() => this.displayFlash(display), 0);
    setTimeout(() => this.displayFlash(display), 400);
  }

  displayFlash(display) {
    display.innerHTML = `X${this.multiplier}`;
  }

  resetMultiplier() {
    this.multiplier = 1;
  }
}

module.exports = Score;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);

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
        if (this.radius < 600) {
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
    if (
      object.constructor.name === "SlowEnemy" ||
      object.constructor.name === "FastEnemy"
    ) {
      object.remove();
    } else {
      return;
    }
  }
}

module.exports = Bomb;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

const story = (game) => {
  let leftbox = document.getElementById("leftbox");
  let rightbox = document.getElementById("rightbox");
  let left = document.getElementById("flash");
  let middle = document.getElementById("myInput");
  let right = document.getElementById("scoreBoard");
  let sides = document.getElementsByClassName("directions-container");
  let canvas = document.getElementById("survivalTypist");
  let ui = document.getElementById("ui");
  let title = document.getElementById("title");
  title.classList.add("animated");
  title.classList.add("fadeOut");
  ui.classList.add("animated");
  ui.classList.add("fadeOut");
  canvas.classList.add("red-canvas");
  for (var i = 0; i < sides.length; i++) {
    sides[i].classList.add("animated");
    sides[i].classList.add("fadeOut");
  }
  rightbox.classList.add("animated");
  rightbox.classList.add("fadeOut");
  leftbox.classList.add("animated");
  leftbox.classList.add("fadeOut");
  middle.classList.add("red-box-shadow-middle");
  middle.setAttribute("placeholder", "");
  middle.focus();

  setTimeout(() => {
    for (let k = 0; k < sides.length; k++) {
      sides[k].classList.add("hide");
    }
    rightbox.classList.add("red-box-shadow-right");
    leftbox.classList.add("red-box-shadow-left");
    leftbox.classList.add("animated");
    rightbox.classList.add("animated");
    rightbox.classList.add("zoomIn");
    leftbox.classList.add("zoomIn");
    right.innerHTML = "";
  }, 3000);

  setTimeout(() => {

    left.innerHTML = "Hello";
    right.innerHTML = "Typist";
  }, 5000);
  setTimeout(() => {
    middle.setAttribute("placeholder", "My name is Red");
  }, 8000);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "your");
    right.innerHTML = "am";
  }, 11000);

  setTimeout(() => {
    left.innerHTML = "[ ]";
    middle.setAttribute("placeholder", "Square");
    right.innerHTML = "[ ]";
  }, 16000);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "your");
    right.innerHTML = "need";
  }, 20000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "help...");
    right.innerHTML = "";
  }, 22000);

  setTimeout(() => {
    left.innerHTML = "They";
    middle.setAttribute("placeholder", "coming");
    right.innerHTML = "are";
  }, 25000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "for");
    right.innerHTML = "";
  }, 26500);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "me.");
    right.innerHTML = "";
  }, 27500);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "function");
    right.innerHTML = "cannot";
  }, 30000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "without");
    right.innerHTML = "";
  }, 32000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "you.");
    right.innerHTML = "";
  }, 33000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "Typist...");
    right.innerHTML = "";
  }, 35500);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "");
    right.innerHTML = "am";
  }, 40000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "counting");
    right.innerHTML = "";
    leftbox.classList.add("animated");
    rightbox.classList.add("animated");
    rightbox.classList.add("zoomIn");
    leftbox.classList.add("zoomIn");
  }, 42000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "on");
    right.innerHTML = "";
  }, 45000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "you...");
    right.innerHTML = "";
  }, 48000);

  setTimeout(() => {
    leftbox.classList.remove("red-box-shadow-left");
    middle.classList.remove("red-box-shadow-middle");
    middle.setAttribute("placeholder", "Type Start and Press Enter To Begin");
    rightbox.classList.remove("red-box-shadow-right");
    canvas.classList.remove("red-canvas");
    title.classList.remove("fadeOut");
    title.classList.remove("animated");
    title.classList.remove("zoomInDown");
    title.classList.add("animated")
    title.classList.add("zoomInDown");
    ui.classList.remove("fadeOut");
    ui.classList.add("fadeIn");
    for (let j = 0; j < sides.length; j++) {
      sides[j].classList.remove("hide");
      sides[j].classList.remove("fadeOut");
      if (j === 0) {
        sides[j].classList.add("slideInLeft");
      } else {
        sides[j].classList.add("slideInRight");
      }
    }
    leftbox.classList.add("animated");
    leftbox.classList.add("slideInLeft");
    rightbox.classList.add("animated");
    rightbox.classList.add("slideInRight");
    game.storyActive = false;
    game.sound.playIntroMusic();
  }, 52000);
};

module.exports = story;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Avatar = __webpack_require__(3);

class Cursor extends MovingObject {
  constructor(options) {
    super(options);
    this.pos = options.pos;
    this.vel = options.vel;
    this.width = 4;
    this.height = 4;
    this.color = "red";
    this.rectangle = true;
    this.cursorTrue = true;
  }

  collideWith(object) {
    return false;
  }

  updatePos(pos, vel) {
    this.pos = pos;
    this.vel = vel;
  }
}



module.exports = Cursor;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map