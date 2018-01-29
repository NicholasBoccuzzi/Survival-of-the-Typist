const MovingObject = require("./moving_object");
const SlowEnemy = require("./slow_enemy");
const Avatar = require("./avatar");

class Bullet extends MovingObject {
  constructor(options) {
    options.area = Bullet.AREA;
    options.color = "white";
    super(options);
    this.width = options.width;
    this.height = options.height;
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

Bullet.AREA = 2;
Bullet.SPEED = 12;

module.exports = Bullet;
