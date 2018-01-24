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
    );
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

    if (this.radius) {
      if (this.constructor.name === "Shield") {
        this.setPosToAvatar();
      }
      ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00f9ff';
      ctx.stroke();
    } else if (this.triangle) {
      this.drawFastEnemy(ctx);
    } else if (this.line) {
      this.drawSlowEnemy(ctx);
    } else if (this.rectangle) {
      ctx.rect( this.pos[0], this.pos[1], this.width, this.height);
      ctx.fill();
    }
  }

  drawFastEnemy(ctx) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.rotate(Math.atan2(this.pos[1] - this.game.avatar[0].pos[1],
    this.pos[0] - this.game.avatar[0].pos[1]) * Math.PI / 120);
    ctx.lineTo(this.pos[0], (this.pos[1] - 40));
    this.legOne = [this.pos[0], (this.pos[1] - 40)];
    ctx.lineTo((this.pos[0] - 40), this.pos[1]);
    this.legTwo = [(this.pos[0] - 40), this.pos[1]];
    this.calculateCenterPoint();
    ctx.closePath();
    ctx.strokeStyle = '#FF00FF';
    ctx.stroke();
    ctx.restore();
  }

  drawSlowEnemy(ctx) {
    if (this.startingPos[0] === 0 && this.startingPos[1] === -50) {
      this.vel = [0, .2];
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(600, this.pos[1]);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 20;
      ctx.stroke();
    } else if (this.startingPos[0] === -50 && this.startingPos[1] === 0) {
      this.vel = [.2, 0];
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0], 400);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 20;
      ctx.stroke();
    } else if (this.startingPos[0] === 0 && this.startingPos[1] === 450) {
      this.vel = [0, -.2];
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(600, this.pos[1]);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 20;
      ctx.stroke();
    } else if (this.startingPos[0] === 650 && this.startingPos[1] === 0) {
      this.vel = [-.2, 0];
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0], 450);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 20;
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
        return centerDist < (this.radius + otherObject.width);
      } else if (otherObject.radius) {
        return centerDist < (this.width + otherObject.radius);
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
      if (otherObject.startingPos[0] === 0 && otherObject.startingPos[1] === -50) {
        if (pos[1] <= otherObject.pos[1]
          && pos[1] > (otherObject.pos[1] - 20)) {
          return true;
        } else {
          return false;
        }
      } else if (otherObject.startingPos[0] === 0 && otherObject.startingPos[1] === 450) {
        if (pos[1] >= otherObject.pos[1]
          && pos[1] < (otherObject.pos[1] + 20)) {
          return true;
        } else {
          return false;
        }
      } else if (otherObject.startingPos[0] === -50 && otherObject.startingPos[1] === 0) {
        if (pos[0] <= otherObject.pos[0]
          && pos[0] > (otherObject.pos[0] -20)) {
          return true;
        } else {
          return false;
        }
      } else if (otherObject.startingPos[0] === 650 && otherObject.startingPos[1] === 0) {
        if (pos[0] >= otherObject.pos[0]
          && pos[0] < (otherObject.pos[0] + 20)) {
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

    const velocityScale = timeDelta / (NORMAL_FRAME_TIME_DELTA),
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    let checkingPosition = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.constructor.name === "Avatar") {
      this.setXCoordinate(offsetX);
      this.setYCoordinate(offsetY);
    } else {
      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    }

    if (this.game.isOutOfBounds(this.pos)) {
      this.remove();
    }
  }

  moveFastEnemy(targetPos) {

    this.vel[0] = ((targetPos[0] - this.pos[0]) / this.speedOffset);
    this.vel[1] = ((targetPos[1] - this.pos[1]) / this.speedOffset);

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
      this.vel[0] = this.vel[0] * .96;
      this.vel[1] = this.vel[1] * .96;
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

MovingObject.MAXSPEED = 4;
MovingObject.MINSPEED = -4;
MovingObject.MAXENEMYSPEED = 1.25;
MovingObject.MINENEMYSPEED = -1.25;

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
    options.vel = [0, +.2];
    super(options);
    this.startingPos = options.pos.slice(0);
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
    } else if (this.health <= 1) {
      this.vel[0] = this.vel[0] * 1.5;
      this.vel[1] = this.vel[1] * 1.5;
      this.color = '#FF00FF';
    } else if (this.health <= 2) {
      this.vel[0] = this.vel[0] * 1.25;
      this.vel[1] = this.vel[1] * 1.25;
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
    this.sound = options.sound;
    this.blasterFire = document.getElementById("blasterFired");
    this.shieldActive = false;
    this.blasterFireActive = false;
  }

  fireBullet() {
    if (this.vel[0] === 0 && this.vel[1] === 0) {
      this.flash("Move!");
      return;
    }

    if (this.blasterFireActive) {
      return;
    }

    if (this.ammo <= 0) {
      this.flash("Reload");
      this.playSound("emptyClip");
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
    this.playSound("blasterFired");
    this.blasterFireActive = true;
    this.ammo -= 1;
    setTimeout(() => { this.blasterFireActive = false; }, 100);
  }

  deployShield() {
    if (this.shieldCount > 0 && !this.shieldActive) {
      const shield =  new Shield ({
        pos: [(this.pos[0] - this.vel[0] + (this.width/2)),
        (this.pos[1] - this.vel[1] + (this.height/2))],
        vel: this.vel,
        game: this.game
      });

      this.shieldCount -= 1;
      this.shieldActive = true;
      this.playSound("shield");
      this.game.generate(shield);
    }
  }

  playSound(id) {
    if (this.sound.musicActive) {
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
      }
    }
  }

  /*
  playSound(id) {
    let soundEffect = document.createElement("AUDIO");

    if (id === "blasterFired") {
      this.blasterFired.currentTime = 0.05;
      this.blasterFired.play();
    } else if (id === "teleport") {
      soundEffect.setAttribute("src", "./audio/teleport.mp3");
      soundEffect.setAttribute("autoplay", "true");
    }
  }
  */
  //
  // aim () {
  //   this.aim = true;
  // }

  power(impulse) {
     this.vel[0] += impulse[0];
     this.vel[1] += impulse[1];

   }

   relocate() {
     this.playSound("teleport");
     this.pos = this.game.randomPosition();
     this.vel = [0, 0];
   }

  flash(string) {
    let displays = document.getElementsByClassName("flash");

    if (this.vel[0] === 0 && this.vel[1] === 0 && !this.flashActive) {
      this.flashActive = true;
      setTimeout(() => this.displayFlash(displays, string), 0);
      setTimeout(() => this.displayFlash(displays, ""), 650);
      this.flashActive = false;
    }

    if (this.ammo === 0 && !this.flashActive) {
      this.flashActive = setInterval(() =>
      this.displayFlash(displays, string), 400);
    }
  }

  displayFlash(displays, string) {
    for (let i = 0; i < displays.length; i++) {
      if (displays[i].innerHTML) {
        displays[i].innerHTML = "";
      } else {
        displays[i].innerHTML = string;
      }
    }
  }

  collideWith(object) {
    if (object.__proto__.constructor.name === "SlowEnemy") {
      object.damage();
      this.remove();
      return true;
    } else if (object instanceof FastEnemy) {
      object.remove();
      this.remove();
      return true;
    } else {
      return false;
    }
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
    if (object.__proto__.constructor.name === "SlowEnemy") {
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
    options.radius = Shield.RADIUS;
    options.color = "transparent";
    super(options);
    this.colorOutline = '#00f9ff';
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
    this.triangle = true;
    this.speedOffset = 500;
    this.legOne;
    this.legTwo;
    this.centerPoint;
  }

  collideWith(object) {
    if (object instanceof Bullet) {
      object.remove();
      this.remove();
      return true;
    } else if (object instanceof Shield) {
      this.remove();
      object.remove();
      this.game.avatar[0].shieldActive = false;
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
const Shield = __webpack_require__(5);
const Util = __webpack_require__(0);

class Game {
  constructor() {
    this.enemies = [];
    this.bullets = [];
    this.shield = [];
    this.avatar = [];
    this.DIM_X = 600;
    this.DIM_Y = 400;

    this.newEnemies;
    this.enemyCount = 100;
    this.slowEnemyCount = 0;
    this.createEnemy = this.createEnemy.bind(this);
    this.generateEnemies = this.generateEnemies.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
    this.checkEnemyCount = this.checkEnemyCount.bind(this);
    }

  generate(object) {
    if (object instanceof SlowEnemy) {
      this.enemies.push(object);
    } else if (object instanceof FastEnemy) {
      this.enemies.push(object);
    } else if (object instanceof Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Avatar) {
      this.avatar.push(object);
    } else if (object instanceof Shield) {
      this.shield.push(object);
    } else {
      throw new Error("unknown object");
    }
  }

  generateEnemies() {
    this.newEnemies = setInterval(this.createEnemy, this.enemyRate());
  }

  enemyRate() {
    if (this.enemyCount > 80) {
      return 2500;
  } else if (this.enemyCount > 60) {
      return 1250;
  } else if ( this.enemyCount > 40) {
      return 1000;
  } else if ( this.enemyCount > 20) {
      return 750;
  } else {
      return 400;
    }
  }

  createEnemy() {
    let enemies = [SlowEnemy, FastEnemy];
    let enemy = enemies[Math.floor(Math.random()*enemies.length)];

    if (this.enemyCount > 0) {
      if (enemy === SlowEnemy) {
        enemy = new enemy({
          pos: this.randomSlowEnemyPosition(),
          game: this,
          avatarPos: this.avatar.pos
        });
        this.slowEnemyCount += 1;
      } else {
        enemy = new enemy({
          pos: this.randomEnemyPosition(),
          game: this,
          avatarPos: this.avatar.pos
        });
      }

      this.enemyCount -= 1;
      this.checkEnemyCount();
      this.generate(enemy);
      return enemy;
    } else {
      clearInterval(this.newEnemies);
    }
    return;
  }

  checkEnemyCount() {
    console.log(this.enemyCount);
    if (
      this.enemyCount === 90
      || this.enemyCount === 70
      || this.enemyCount === 50
      || this.enemyCount === 20
    ) {
      clearInterval(this.newEnemies);
      this.generateEnemies();
    }
  }

  generateAvatar(sound) {
    const avatar = new Avatar({
      pos: [Game.DIM_X/2, Game.DIM_Y/2],
      game: this,
      sound: sound
    });

    this.generate(avatar);
    return avatar;
  }

  randomEnemyNum () {
    return Math.floor(Math.random() * 2);
  }

  allObjects () {
    return [].concat(this.avatar, this.enemies, this.bullets, this.shield);
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  draw(ctx) {

    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

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
        } else {
          object.moveFastEnemy([this.randomPosition(), this.randomPosition()]);
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
      this.shield.splice(this.avatar.indexOf(object), 1);
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
Game.DIM_X = 600;
Game.DIM_Y = 400;
Game.FPS = 60;

module.exports = Game;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(7);
const GameView = __webpack_require__(9);
const Sound = __webpack_require__(11);


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("survivalTypist");
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;
  const audio = new Sound();
  // audio.toggleIntroMusic();
  audio.toggleMusic();

  const ctx = canvas.getContext("2d");
  const game = new Game();
  const CurrentGameView = new GameView(game, ctx, audio);
  CurrentGameView.bindEnter();

  const currentInput = document.getElementById("myInput");
  currentInput.focus();
  currentInput.addEventListener("keydown", CurrentGameView.textInput.handleInput);
});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const TextInput = __webpack_require__(10);

class GameView {
  constructor(game, ctx, sound) {
    this.ctx = ctx;
    this.game = game;
    this.sound = sound;
    this.avatar = this.game.generateAvatar(this.sound);
    this.textInput = new TextInput({game: this.game, avatar: this.avatar, GameView: this});
    this.sound.playIntroMusic();
    this.started = false;
    this.toggleInput = this.toggleInput.bind(this);
  }


  bindKeyHandlers() {
    const avatar = this.avatar;

    Object.keys(GameView.MOVES).forEach((k) => {
      const move = GameView.MOVES[k];

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
    document.getElementById("backgroundBeats").play();
    document.getElementById("myInput").setAttribute("placeholder",
     "Press Enter to Switch to Text Input");
    this.sound.stopIntroMusic();
    setTimeout(this.bounceTitle, 1000);
    setTimeout(this.game.generateEnemies, 1000);
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
    const lives = this.avatar.lives;

    let ammoCont= document.getElementById("ammo");
    ammoCont.innerHTML = curAmmo;
    this.updateAmmoColor(ammoCont);
    let shieldCont = document.getElementById("shield");
    shieldCont.innerHTML = curShield;
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
}

GameView.MOVES = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
  up: [0, -1],
  left: [-1, 0],
  down: [0, 1],
  right: [1,0]
};


module.exports = GameView;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(7);

class TextInput {
  constructor (options) {
    this.game = options.game;
    this.avatar = options.avatar;
    this.GameView = options.GameView;

    this.handleInput = this.handleInput.bind(this);
    this.checkForReload = this.checkForReload.bind(this);
  }

  handleInput(e) {
    if (e.key === "Tab") {
      e.preventDefault();
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
      } else if (this.checkForRestart(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else {
        e.target.value = "";
      }

      document.getElementById("myInput").blur();
    }
  }

  checkForStart(curVal) {
    if (curVal.toLowerCase() === "start" && !this.GameView.started) {
      this.GameView.start();
      this.GameView.started = true;
      // this.GameView.sound.toggleIntroMusic();
    }
  }

  checkForRelocate(curVal) {
    if (curVal.toLowerCase() === "tp") {
      this.avatar.relocate();
    }
  }

  checkForShield(curVal) {
    if (curVal.toLowerCase() === "shield" && this.GameView.started) {
      this.avatar.deployShield();
    }
  }


  checkForReload(curVal) {
    if (curVal.toLowerCase() === "rl") {
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
    if (curVal.toLowerCase() === "restart") {
      this.GameView.game = new Game();
      this.GameView.avatar = this.GameView.game.generateAvatar(
        this.GameView.sound
      );
      return true;
    } else {
      return false;
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

    this.toggleMusic = this.toggleMusic.bind(this);
    // this.toggleIntroMusic = this.toggleIntroMusic.bind(this);
  }

  toggleMusic () {
    const soundButtons = document.getElementsByClassName("sound-button");
    let muted;

    for (var i = 0; i < soundButtons.length; i++) {
      const gameMusic = [
        document.getElementById("backgroundBeats"),
        document.getElementById("intro")
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
    this.introMusic.setAttribute("autoplay", true);
    this.introMusic.setAttribute("loop", true);
  }

  stopIntroMusic() {
    this.introMusic.pause();
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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map