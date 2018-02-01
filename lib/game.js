const SlowEnemy = require("./slow_enemy");
const FastEnemy = require("./fast_enemy");
const Bullet = require("./bullet");
const Avatar = require("./avatar");
const Cursor = require("./cursor");
const Shield = require("./shield");
const Bomb = require("./bomb");
const Util = require("./util");

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
    this.firstEnemyDeployed = false;
    this.currentEnemyCount = 0;
    this.remainingEnemyCount = 1000;
    this.lives = 2;
    this.createEnemy = this.createEnemy.bind(this);
    this.generateEnemies = this.generateEnemies.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
    this.checkEnemyCount = this.checkEnemyCount.bind(this);
    }

    resetGame() {
      this.enemyCount = 1000;
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
    if (this.remainingEnemyCount > 995) {
      return 5000;
    } else if (this.remainingEnemyCount > 990) {
        return 3500;
    } else if (this.remainingEnemyCount > 980) {
        return 2500;
    } else if (this.remainingEnemyCount > 960) {
        return 2000;
    } else if ( this.remainingEnemyCount > 940) {
        return 1750;
    } else if ( this.remainingEnemyCount > 920) {
        return 1500;
    } else if ( this.remainingEnemyCount > 900)  {
        return 1250;
    } else if (this.remainingEnemyCount > 880) {
        return 1000;
    } else if (this.remainingEnemyCount > 860) {
        return 1250;
    } else if ( this.remainingEnemyCount > 840) {
        return 1000;
    } else if ( this.remainingEnemyCount > 820) {
        return 750;
    } else if ( this.remainingEnemyCount > 800)  {
        return 400;
    } else {
        return 400;
    }
  }

  createEnemy() {
    let enemies = [FastEnemy, SlowEnemy];
    let enemy = enemies[Math.floor(Math.random()*enemies.length)];

    if (!this.avatar[0].dead) {
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
          this.currentEnemyCount += 1;
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
        this.currentEnemyCount += 1;
        this.checkEnemyCount();
        this.generate(enemy);
        this.firstEnemyDeployed = true;
        return enemy;
      } else {
        clearInterval(this.newEnemies);
      }
    }
  }

  checkEnemyCount() {
    if (this.currentEnemyCount === 0) {
      this.gameOver();
    } else if (
      this.remainingEnemyCount <= 990
      || this.remainingEnemyCount <= 980
      || this.remainingEnemyCount <= 960
      || this.remainingEnemyCount <= 940
      || this.remainingEnemyCount <= 920
      || this.remainingEnemyCount <= 900
      || this.remainingEnemyCount <= 880
      || this.remainingEnemyCount <= 860
      || this.remainingEnemyCount <= 840
      || this.remainingEnemyCount <= 820
      || this.remainingEnemyCount <= 800
    ) {
      clearInterval(this.newEnemies);
      this.generateEnemies();
    }
  }

  generateAvatar(sound, position) {
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

    let coord = possibleCoords[Math.floor(Math.random()*possibleCoords.length)];
    return coord;
  }

  randomSlowEnemyPosition () {
    let possibleCoords = [[0,-50], [-50, 0], [0, (Game.DIM_Y + 50)], [(Game.DIM_X + 50), 0]];
    let coord = possibleCoords[Math.floor(Math.random()*possibleCoords.length)];
    return coord;
  }

  gameOver() {
    if (this.lives === 0) {
      this.enemies = [];
      this.remainingEnemyCount = 0;

      const gameContainer = document.getElementById("gameContainer");
      const highScoreList = document.getElementById("highScoreList");

      gameContainer.classList.add("hide");
      highScoreList.classList.remove("hide");

    } else if (this.currentEnemyCount === 0 && this.firstEnemyDeployed) {

      const gameContainer = document.getElementById("gameContainer");
      const highScoreList = document.getElementById("highScoreList");

      gameContainer.classList.add("hide");
      highScoreList.classList.remove("hide");
    }
  }
}

Game.BG_COLOR = "black";
Game.DIM_X = 650;
Game.DIM_Y = 400;
Game.FPS = 60;

module.exports = Game;
