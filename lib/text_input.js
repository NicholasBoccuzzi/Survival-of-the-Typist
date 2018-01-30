const Game = require("./game");

class TextInput {
  constructor (options) {
    this.game = options.game;
    this.avatar = options.avatar;
    this.gameView = options.gameView;
    this.submitted = false;

    this.handleInput = this.handleInput.bind(this);
    this.handleHighScoreInput = this.handleHighScoreInput.bind(this);
    this.checkForReload = this.checkForReload.bind(this);
  }

  handleInput(e) {
    if (e.key === "Tab") {
      e.preventDefault();

      this.gameView.switchDirections();
    }

    if (this.game.storyActive) {
      return;
    }

    e.target.value = e.target.value;
    let currentValue = e.target.value;

    if (e.key === "Enter") {
      if (this.checkForStart(currentValue)) {
        this.clearDisplays();
      } else if (this.checkForReload(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRelocate(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForShield(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForBomb(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRestart(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRespawn(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForStory(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else {
        e.target.value = "";
      }

      document.getElementById("myInput").blur();
    }
  }

  handleHighScoreInput(e) {
    let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.gameView.sound.playSound("addInitial");
    if(
      !alphabet.includes(e.key)
      && e.key !== "Enter"
      && e.key !== "Backspace"
      && e.key !== "Shift"
    ) {
      e.preventDefault();
    }

    if (this.game.score.score === 0) {
      this.gameView.displayHighScores();
      setTimeout(this.gameView.reset, 20000);
    }

    if (e.currentTarget.value.length === 3
      && e.key === "Enter"
      && !this.submitted
      && this.game.score.score > 0
    ) {
      let initials = e.currentTarget.value;
      let score = `${this.game.score.score}`;

      this.gameView.database.ref("scores/SotT").push({
        initials: initials,
        score: score
      }, this.gameView.displayHighScores);

      this.submitted = true;
      e.currentTarget.value = "";
      setTimeout(this.gameView.reset, 10000);
    }

    if ((e.currentTarget.value + e.key).length > 3 && alphabet.includes(e.key)) {
      let initials = e.currentTarget.value.slice(1) + e.key;
      e.currentTarget.value = initials;
    }
  }

  checkForStart(curVal) {
    if (curVal.toLowerCase() === "start" && !this.gameView.started) {
      this.gameView.started = true;
      this.gameView.play();
      this.game.remainingEnemyCount = 100;
      this.game.enemies = [];
      this.game.bullets = [];
      this.game.shield = [];
      this.game.bomb = [];
      this.game.lives = 0;
      this.avatar.dead = false;
      this.avatar.pos = [this.game.DIM_X/2, this.game.DIM_Y/2];
      this.avatar.vel = [0,0];
      this.avatar.shieldCount = 3;
      this.avatar.ammo = 7;
      this.avatar.bombCount = 3;
      // this.gameView.sound.toggleIntroMusic();
    }
  }

  checkForRelocate(curVal) {
    if (curVal.toLowerCase() === "tp") {
      this.avatar.relocate();
    }
  }

  checkForShield(curVal) {
    if (curVal.toLowerCase() === "shield") {
      this.avatar.deployShield();
    }
  }

  checkForBomb(curVal) {
    if (curVal.toLowerCase() === "bomb" && !this.avatar.dead) {
      this.avatar.deployBomb("#ffaa00");
    }
  }

  checkForStory(curVal) {
    if (curVal.toLowerCase() === "story" && !this.gameView.playing) {
      this.gameView.playStory();
    }
  }

  checkForReload(curVal) {
    if (curVal.toLowerCase() === "rl" && this.avatar.ammo < 7) {
      this.avatar.ammo = 7;
      clearInterval(this.avatar.flashActive);
      this.avatar.flashActive = false;
      return true;
    } else if (curVal.toLowerCase() === "reload") {
      this.avatar.ammo = 14;
      clearInterval(this.avatar.flashActive);
      this.avatar.flashActive = false;
      return true;
    } else {
      return false;
    }
  }

  checkForRestart(curVal) {
    if (
      curVal.toLowerCase() === "restart" ||
      curVal.toLowerCase() === "reset"
    ){
      this.game.resetGame();
      this.avatar.resetAvatar();
      this.gameView.started = false;
      this.gameView.playing = false;
      this.gameView.sound.stopBeats();
    }
  }

  checkForRespawn(curVal) {
    let avatar;

    if (
      curVal.toLowerCase() === "revive" ||
      curVal.toLowerCase() === "respawn"
    ){
      if (this.avatar.dead && this.game.lives >= 1) {
        this.game.lives -= 1;
        this.avatar.respawn();
        this.avatar.dead = false;
        this.gameView.sound.playBeats();
        this.gameView.sound.stopDeathMusic();
      } else {
        this.game.gameOver();
      }
    }
  }

  clearDisplays() {
    let displays = document.getElementsByClassName("flash");
    for (let i = 0; i < displays.length; i++) {
      displays[i].innerHTML = "";
    }
  }
}


module.exports = TextInput;
