const TextInput = require("./text_input");
const Story = require("./story");
const Database = require("./database");

class gameView {
  constructor(game, ctx, sound, score) {
    this.ctx = ctx;
    this.database = Database;
    this.game = game;
    this.sound = sound;
    this.score = score;
    this.avatar = this.game.generateAvatar(this.sound);
    this.textInput = new TextInput({game: this.game, avatar: this.avatar, gameView: this});
    this.sound.playIntroMusic();
    this.bindSwitchInputs();
    this.started = false;
    this.playing = false;
    this.toggleInput = this.toggleInput.bind(this);
    this.start();
    this.keyControlsActive = true;
    this.howToPlayActive = false;
    this.displayHighScores = this.displayHighScores.bind(this);
    this.displayHighScores();
    this.reset = this.reset.bind(this);
    this.sortedHighScores = this.sortedHighScores.bind(this);
  }


  bindKeyHandlers() {
    const avatar = this.avatar;

    Object.keys(gameView.MOVES).forEach((k) => {

      document.addEventListener("keydown", (e) => {
        if (e.key === k) {
          console.log(e.key);
          avatar.activePowers[e.key] = true;
        }
      });

      document.addEventListener("keyup", (e) => {
        if (e.key === k) {
          avatar.activePowers[e.key] = false;
        }
      });
    });

    key("space", () => { avatar.fireBullet(); });
  }

  bindEnter() {
    key("enter", this.toggleInput);

    key("Tab", (e) => { e.preventDefault(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    // start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  play() {
    this.playing = true;
    this.avatar.cursor.color = "red";
    setTimeout(this.bounceTitle, 1000);
    setTimeout(this.game.generateEnemies, 1000);
    document.getElementById("backgroundBeats").play();
    document.getElementById("myInput").setAttribute("placeholder",
    "Press Enter to Switch to Text Input");
    this.sound.stopIntroMusic();
    this.switchCommands();
  }

  toggleInput () {
      let input = document.getElementById("myInput");
      this.game.textInputActive = true;
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

  bindSwitchInputs() {

    const switchDirections = document.getElementById("switchDirections");

    switchDirections.addEventListener("click", () => {
      this.switchDirections();
    });

    const switchCommands = document.getElementById("switchCommands");

    switchCommands.addEventListener("click", ()=> {
      this.switchCommands();
    });
  }

  switchDirections() {
    const keyControls = document.getElementById("keyControls");
    const howToPlay = document.getElementById("howToPlay");

    if (keyControls.classList.contains("hide")) {
      keyControls.classList.remove("hide");
      howToPlay.classList.add("hide");
    } else {
      keyControls.classList.add("hide");
      howToPlay.classList.remove("hide");
    }
  }

  switchCommands() {
    const outgame = document.getElementById("outgame");
    const ingame = document.getElementById("ingame");

    if (!this.playing) {
      if (outgame.classList.contains("hide")) {
        outgame.classList.remove("hide");
        ingame.classList.add("hide");
      } else {
        outgame.classList.add("hide");
        ingame.classList.remove("hide");
      }
    } else {
      if (outgame.classList.contains("hide")) {
        return;
      } else {
        outgame.classList.add("hide");
        ingame.classList.remove("hide");
      }
    }
  }

  playStory() {
    this.sound.stopIntroMusic();
    this.sound.playStoryMusic();
    this.game.storyActive = true;
    Story(this.game);
  }

  reset() {
    const gameContainer = document.getElementById("gameContainer");
    const highScoreList = document.getElementById("highScoreList");

    gameContainer.classList.remove("hide");
    highScoreList.classList.add("hide");
    this.score.multiplier = 0;
    this.score.score = 0;
    this.sound.stopDeathMusic();
    this.sound.playIntroMusic();
    this.game.resetGame();
    this.avatar.resetAvatar();
    this.started = false;
    this.playing = false;
    this.textInput.submitted = false;
    this.switchCommands();
  }

  displayHighScores() {
    let highscores = [];

    let highScoreResults = this.database.ref("scores/SotT");
    highScoreResults = highScoreResults.orderByValue().on('child_added', (snapshot) => {
    highscores.push(snapshot.val());
    this.sortedHighScores(highscores);
  });

  }


  sortedHighScores (scores) {
    let highScoreUL = document.getElementById("highScoreUL");
    scores.sort( (score1, score2) => {
      return parseInt(score2.score) - parseInt(score1.score);
    });

    scores = scores.slice(0,5);

    let sortedScores = "";
    let first = true;
    scores.forEach( (score) => {
      if (first){
        sortedScores += `<li class="high-score-li colors">${score.initials} ${score.score} </li>`;
        first = false;
      } else {
        sortedScores += `<li class="high-score-li">${score.initials} ${score.score} </li>`;
      }
    });
    highScoreUL.innerHTML = "";
    highScoreUL.innerHTML = sortedScores;
  }
}

gameView.MOVES = {
  w: [0, -.8],
  a: [-.8, 0],
  s: [0, .8],
  d: [.8, 0],
  up: [0, -.8],
  left: [-.8, 0],
  down: [0, .8],
  right: [.8,0]
};


module.exports = gameView;
