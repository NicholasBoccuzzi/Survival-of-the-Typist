const SlowEnemy = require("./slow_enemy");
const FastEnemy = require("./fast_enemy");
const Bullet = require("./bullet");
const Avatar = require("./avatar");
const Shield = require("./shield");
const Util = require("./util");

class Game {
  constructor() {
    this.enemies = [];
    this.bullets = [];
    this.avatar = [];
    this.shield = [];
    this.DIM_X = 600;
    this.DIM_Y = 400;

    this.newEnemies;
    this.enemyCount = 100;
    this.slowEnemyCount = 0;
    this.createEnemy = this.createEnemy.bind(this);
    this.generateEnemies = this.generateEnemies.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
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
    this.newEnemies = setInterval(this.createEnemy, 1250);
  }

  createEnemy() {
    let enemies = [SlowEnemy];
    let enemy = enemies[Math.floor(Math.random()*enemies.length)];
    console.log(this.slowEnemyCount);

    if (this.enemyCount > 0) {
      if (enemy === SlowEnemy && this.slowEnemyCount <= 2) {
        enemy = new enemy({
          pos: this.randomSlowEnemyPosition(),
          game: this,
          avatarPos: this.avatar.pos
        });
        this.slowEnemyCount += 1;
      } else {
        enemy = FastEnemy;
        enemy = new enemy({
          pos: this.randomEnemyPosition(),
          game: this,
          avatarPos: this.avatar.pos
        });
      }




      this.enemyCount -= 1;
      this.generate(enemy);
      console.log(this.enemies);
      return enemy;
    } else {
      clearInterval(this.newEnemies);
    }
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
