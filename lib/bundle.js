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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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

const MovingObject = __webpack_require__(2);

class Bullet extends MovingObject {
  constructor(options) {
    options.area = Bullet.AREA;
    options.width = 3;
    options.height = 3;
    options.color = "lightgreen";
    super(options);
    this.isWrappable = false;
  }
}

Bullet.WIDTH = 2;
Bullet.HEIGHT = 2;
Bullet.AREA = 2;
Bullet.SPEED = 20;

module.exports = Bullet;


/***/ }),
/* 2 */
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
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    this.slow();
    ctx.rect( this.pos[0], this.pos[1], this.width, this.height);
    ctx.fill();

  }

  moveToTarget(targetPos) {
    let distanceBetween = targetPos - this.pos;
    distanceBetween -= this.vel;
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }


  // timeDelta is number of milliseconds since last move
  // if the computer is busy the time delta will be larger
  // in this case the MovingObject should move farther in this frame
  // velocity of object is how far it should move in 1/60th of a second
  move(timeDelta) {

    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    let checkingPosition = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.__proto__.constructor["name"] === "Avatar") {
      this.setXCoordinate(offsetX);
      this.setYCoordinate(offsetY);
    } else {
      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    }

    if (this.game.isOutOfBounds(this.pos)) {
      this.remove();
    }
  }

  slow() {
    if (this.__proto__.constructor["name"] === "Avatar"){
      debugger
      this.vel[0] = this.vel[0] * .98;
      this.vel[1] = this.vel[1] * .98;
    }
  }


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

  remove() {
    this.game.remove(this);
  }



}

module.exports = MovingObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(2);
const Bullet = __webpack_require__(1);
const Sword = __webpack_require__(7);
const Util = __webpack_require__(0);

const DEFAULTS = {
  COLOR: "red",
  SPEED: [0, 0],
  HEIGHT: 7,
  WIDTH: 7,
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
    this.ammo = 10;
    this.shieldCount = 3;
    this.sound = options.sound;
  }

  fireBullet() {
    if (this.vel[0] === 0 && this.vel[1] === 0) {
      this.flash("Move!");
      return;
    }

    if (this.ammo <= 0) {
      this.flash("reload");
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
    this.ammo -= 1;
  }

  playSound(id) {
    let soundEffect = document.createElement("AUDIO");

    if (id === "blasterFired") {
      soundEffect.setAttribute("src", "./audio/blaster.mp3");
      soundEffect.setAttribute("autoplay", "true");
    } else if (id === "teleport") {
      soundEffect.setAttribute("src", "./audio/teleport.mp3");
      soundEffect.setAttribute("autoplay", "true");
    }
  }

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

    if (this.ammo === 0 && !this.flashActive) {
      this.flashActive = setInterval(() => this.displayFlash(displays, string), 650);
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

}

module.exports = Avatar;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(5);
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

  const currentInput = document.getElementById("myInput");
  currentInput.addEventListener("keydown", CurrentGameView.textInput.handleInput);
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const SlowEnemy = __webpack_require__(6);
const FastEnemy = __webpack_require__(8);
const Bullet = __webpack_require__(1);
const Avatar = __webpack_require__(3);
const Util = __webpack_require__(0);

class Game {
  constructor() {
    this.enemies = [];
    this.bullets = [];
    this.avatar = [];
    this.DIM_X = 600;
    this.DIM_Y = 400;

    this.generateEnemies();
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
    } else {
      throw new Error("unknown object");
    }
  }

  generateEnemies() {
    let enemies = [SlowEnemy, FastEnemy];
    return;
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
    return [].concat(this.avatar, this.enemies, this.bullets);
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
      object.move(delta);
    });
  }

  isOutOfBounds(pos) {
    return (pos[0] <= 0) || (pos[1] <= 0) ||
      (pos[0] >= Game.DIM_X) || (pos[1] >= Game.DIM_Y);
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
}

Game.BG_COLOR = "black";
Game.DIM_X = 600;
Game.DIM_Y = 400;
Game.FPS = 60;

module.exports = Game;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(2);
const Avatar = __webpack_require__(3);
const Bullet = __webpack_require__(1);

const DEFAULTS = {
  COLOR: "red",
  AREA: 40,
  HEALTH: 100,
  SPEED: 5
};

class SlowEnemy extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.area = DEFAULTS.AREA;
    options.pos = options.pos || options.game.randomStartingPos();
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


/***/ }),
/* 7 */
/***/ (function(module, exports) {



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(2);
const Avatar = __webpack_require__(3);
const Bullet = __webpack_require__(1);

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
    options.pos = options.pos || options.game.randomPosition();
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
    this.textInput = new TextInput({game: this.game, avatar: this.avatar, gameView: this});
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
    key("enter", this.toggleInput);

  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    // start the animation
    requestAnimationFrame(this.animate.bind(this));
    document.getElementById("backgroundBeats").play();
    setTimeout(this.bounceTitle, 3000);
  }

  toggleInput () {
      let input = document.getElementById("myInput")
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
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  w: [0, -2],
  a: [-2, 0],
  s: [0, 2],
  d: [2, 0],
  up: [0, -5],
  left: [-5, 0],
  down: [0, 5],
  right: [5,0]
};


module.exports = GameView;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

class TextInput {
  constructor (options) {
    this.game = options.game;
    this.avatar = options.avatar;
    this.gameView = options.gameView;

    this.handleInput = this.handleInput.bind(this);
    this.checkForReload = this.checkForReload.bind(this);
  }

  handleInput(e) {
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
      } else {
        e.target.value = "";
      }

      document.getElementById("myInput").blur();
    }
  }

  checkForStart(curVal) {
    if (curVal.toLowerCase() === "start" && !this.gameView.started) {
      this.gameView.start();
      this.gameView.started = true;
      // this.gameView.sound.toggleIntroMusic();
    }
  }

  checkForRelocate(curVal) {
    if (curVal.toLowerCase() === "teleport") {
      this.avatar.relocate();
    }
  }


  checkForReload(curVal) {
    if (curVal.toLowerCase() === "reload") {
      this.avatar.ammo = 10;
      clearInterval(this.avatar.flashActive);
      this.avatar.flashActive = !this.avatar.flashActive;
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

    this.toggleMusic = this.toggleMusic.bind(this);
    // this.toggleIntroMusic = this.toggleIntroMusic.bind(this);
  }

  toggleMusic () {
    const soundButtons = document.getElementsByClassName("sound-button");
    let muted;

    for (var i = 0; i < soundButtons.length; i++) {
      const gameMusic = document.getElementById("backgroundBeats");

      const that = this;
      soundButtons[i].addEventListener("click", () => {
        gameMusic.muted = !gameMusic.muted;
      });
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
  }

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