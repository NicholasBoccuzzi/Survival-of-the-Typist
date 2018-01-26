const TextInput = require("./text_input");
const Story = require("./story");

class gameView {
  constructor(game, ctx, sound, score) {
    this.ctx = ctx;
    this.game = game;
    this.sound = sound;
    this.score = score;
    this.avatar = this.game.generateAvatar(this.sound);
    this.textInput = new TextInput({game: this.game, avatar: this.avatar, gameView: this});
    this.sound.playIntroMusic();
    this.started = false;
    this.playing = false;
    this.toggleInput = this.toggleInput.bind(this);
    this.start();
    this.keyControlsActive = true;
    this.howToPlayActive = false;
  }


  bindKeyHandlers() {
    const avatar = this.avatar;

    Object.keys(gameView.MOVES).forEach((k) => {
      const move = gameView.MOVES[k];

      key(k, (e) => { e.preventDefault(); avatar.power(move); });
    });

    key("space", () => { avatar.fireBullet(); });
  }

  bindEnter() {
    key("enter", this.toggleInput);

    key("tab", (e) => { e.preventDefault(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    // start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  play() {
    this.playing = true;
    setTimeout(this.bounceTitle, 1000);
    setTimeout(this.game.generateEnemies, 1000);
    document.getElementById("backgroundBeats").play();
    document.getElementById("myInput").setAttribute("placeholder",
    "Press Enter to Switch to Text Input");
    this.sound.stopIntroMusic();
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
    const curBombs = this.avatar.bombCount;
    const lives = this.game.lives;

    let ammoCount= document.getElementById("ammo");
    ammoCount.innerHTML = curAmmo;
    this.updateAmmoColor(ammoCount);
    let shieldCount = document.getElementById("shield");
    shieldCount.innerHTML = curShield;
    shieldCount.classList.add('shield-color');
    let bombCount = document.getElementById("bomb");
    bombCount.innerHTML = curBombs;
    bombCount.classList.add("bomb-color");
    let liveCont = document.getElementById("lives");
    liveCont.innerHTML = lives;
  }

  updateAmmoColor (el) {
    if (parseInt(el.innerHTML) >= 8) {
      el.classList.remove("white");
      el.classList.remove("yellow");
      el.classList.remove("red");
    } else if (parseInt(el.innerHTML) > 5) {
      el.classList.remove("yellow");
      el.classList.remove("red");
      if (el.classList[1] !== "white") {
        el.classList.add("white");
      }
    } else if (parseInt(el.innerHTML) > 3) {
      if (el.classList[2] !== "yellow") {
        el.classList.add("yellow");
      }
    } else {
      if (el.classList[3] !== "red") {
        el.classList.add("red");
      }
    }
  }

  switchOptions() {
    let howToPlay = document.getElementById("howToPlay");
    let keyControls = document.getElementById("keyControls");

    howToPlay.addEventListener("click", () => {
      keyControls = document.getElementById("keyControls");
      keyControls.classList.add('hide');
       this.classList.remove("hide");
     });

    keyControls.addEventListener("click", () => {
      howToPlay = document.getElementById("howToPlay");
      howToPlay.classList.add('hide');
       this.classList.remove("hide");
     });

  }

  playStory() {
    this.sound.stopIntroMusic();
    this.sound.playStoryMusic();
    this.game.storyActive = true;
    Story(this.game);
  }

  gameOver() {

  }
}

gameView.MOVES = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
  up: [0, -1],
  left: [-1, 0],
  down: [0, 1],
  right: [1,0]
};


module.exports = gameView;
