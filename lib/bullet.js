const MovingObject = require("./moving_object");
const SlowEnemy = require("./slow_enemy");
const Avatar = require("./avatar");

class Bullet extends MovingObject {
  constructor(options) {
    options.area = Bullet.AREA;
    options.width = 5;
    options.height = 5;
    options.color = "lightgreen";
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
