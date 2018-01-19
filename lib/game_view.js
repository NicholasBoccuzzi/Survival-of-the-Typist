const TextInput = require("./text_input");

class GameView {
  constructor(game, ctx, sound) {
    this.ctx = ctx;
    this.game = game;
    this.sound = sound;
    this.avatar = this.game.generateAvatar(this.sound);
    this.textInput = new TextInput({game: this.game, avatar: this.avatar, gameView: this});
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
    setTimeout(this.bounceTitle, 3000);
  }

  toggleInput () {
      let input = document.getElementById("myInput")
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
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  w: [0, -2],
  a: [-2, 0],
  s: [0, 2],
  d: [2, 0],
  up: [0, -5],
  left: [-5, 0],
  down: [0, 5],
  right: [5,0]
};


module.exports = GameView;
