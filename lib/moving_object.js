const Util = require("./util");

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
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    this.slow();

    if (this.radius) {
      ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00f9ff';
      ctx.stroke();
    } else if (this.triangle) {
      ctx.lineWidth = 1;
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0], (this.pos[1] - 40));
      ctx.lineTo((this.pos[0] - 40), this.pos[1]);
      ctx.closePath();
      ctx.strokeStyle = '#FF00FF';
      ctx.stroke();
    } else if (this.line) {
      ctx.moveTo(this.pos[0], this.pos[1]);
      ctx.lineTo(600, this.pos[1]);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 50;
      ctx.stroke();
    } else if (this.rectangle) {
      ctx.rect( this.pos[0], this.pos[1], this.width, this.height);
      ctx.fill();
    }

  }

  isCollidedWith(otherObject) {
    if (this == otherObject) {
      return;
    } else if (this.width && otherObject.width) {
      const centerDist = Util.dist(this.pos, otherObject.pos);
      return centerDist < (this.width + otherObject.width);
    } else {
      return this.checkSlowEnemyCoords(this.pos, otherObject.pos);
    }
  }

  checkSlowEnemyCoords(pos, pos1) {
    if (pos[1] <= pos1[1] && this.__proto__.constructor.name !== "SlowEnemy") {
      return true;
    } else {
      return false
    }
  }


  // timeDelta is number of milliseconds since last move
  // if the computer is busy the time delta will be larger
  // in this case the MovingObject should move farther in this frame
  // velocity of object is how far it should move in 1/60th of a second
  move(timeDelta) {
    if (this.__proto__.constructor["name"] === "Avatar") {
      this.temperSpeed();
    }

    const velocityScale = timeDelta / (NORMAL_FRAME_TIME_DELTA),
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

  moveFastEnemy(avatarPos) {


    this.vel[0] = ((avatarPos[0] - this.pos[0]) / this.speedOffset);
    this.vel[1] = ((avatarPos[1] - this.pos[1]) / this.speedOffset);

    // this.temperEnemySpeed();

    this.speedOffset = this.speedOffset * .997;

    if (this.speedOffset < 50) {
      this.speedOffset = 50;
    }


    if (this.pos[0] !== avatarPos[0] && this.pos[1] !== avatarPos[1]) {
      this.pos[0] = this.pos[0] + this.vel[0];
      this.pos[1] = this.pos[1] + this.vel[1];
    } else {
      this.pos[0] = avatarPos[0];
      this.pos[1] = avatarPos[1];
    }
  }

  moveSlowEnemy(avatarPos) {
    this.pos[0] = this.pos[0] + this.vel[0];
    this.pos[1] = this.pos[1] + this.vel[1];
  }

  slow() {
    if (this.__proto__.constructor["name"] === "Avatar"){
      this.vel[0] = this.vel[0] * .98;
      this.vel[1] = this.vel[1] * .98;
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
  //
  // temperEnemySpeed() {
  //   if (this.vel[0] > MovingObject.MAXENEMYSPEED) {
  //     this.vel[0] = MovingObject.MAXENEMYSPEED;
  //   } else if (this.vel[0] < MovingObject.MINENEMYSPEED) {
  //     this.vel[0] = MovingObject.MINENEMYSPEED;
  //   }
  //
  //   if (this.vel[1] > MovingObject.MAXENEMYSPEED) {
  //     this.vel[1] = MovingObject.MAXENEMYSPEED;
  //   } else if (this.vel[1] < MovingObject.MINENEMYSPEED) {
  //     this.vel[1] = MovingObject.MINENEMYSPEED;
  //   }
  // }

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