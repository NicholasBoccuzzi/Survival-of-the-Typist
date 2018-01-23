const TextInput = require("./text_input");

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
    key("enter", this.toggleInput);

  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    // start the animation
    requestAnimationFrame(this.animate.bind(this));
    document.getElementById("backgroundBeats").play();
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
    if (parseInt(el.innerHTML) > 6) {
      el.classList.remove("yellow");
      el.classList.remove("red");
    } else if (parseInt(el.innerHTML) > 3) {
      if (el.classList[0] !== "yellow") {
        el.classList.add("yellow");
      }
    } else {
      if (el.classList[1] !== "red") {
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
  up: [0, -5],
  left: [-5, 0],
  down: [0, 5],
  right: [5,0]
};


module.exports = GameView;
