const MovingObject = require("./moving_object");
const Bullet = require("./bullet");
const Shield = require("./shield");
const Sword = require("./sword");
const Util = require("./util");
const FastEnemy = require("./fast_enemy");
const SlowEnemy = require("./slow_enemy");


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
    this.ammo = 10;
    this.shieldCount = 3;
    this.sound = options.sound;
    this.blasterFire = document.getElementById("blasterFired");
    this.shieldActive = false;
  }

  fireBullet() {
    if (this.vel[0] === 0 && this.vel[1] === 0) {
      this.flash("Move!");
      return;
    }
    //
    // if (this.aim === true) {
    //   this.fireHomingBullet();
    // }

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

  deployShield() {
    if (this.shieldCount > 0 && !this.shieldActive) {
      const shield =  new Shield ({
        pos: [(this.pos[0] - this.vel[0] + (this.width/2)),
        (this.pos[1] - this.vel[1] + (this.height/2))],
        vel: this.vel,
        game: this.game
      });

      this.shieldActive = true;
      this.game.generate(shield);
    }
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
      this.displayFlash(displays, string), 650);
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
    } else if (object instanceof SlowEnemy) {
      this.remove();
      return true;
    }
  }
}

module.exports = Avatar;