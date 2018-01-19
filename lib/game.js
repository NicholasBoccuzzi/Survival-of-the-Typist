const SlowEnemy = require("./slow_enemy");
const FastEnemy = require("./fast_enemy");
const Bullet = require("./bullet");
const Avatar = require("./avatar");
const Util = require("./util");

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
