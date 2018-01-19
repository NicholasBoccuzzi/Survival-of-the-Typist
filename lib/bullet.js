const MovingObject = require("./moving_object");

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
