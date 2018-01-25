const Game = require("./game");

class TextInput {
  constructor (options) {
    this.game = options.game;
    this.avatar = options.avatar;
    this.GameView = options.GameView;

    this.handleInput = this.handleInput.bind(this);
    this.checkForReload = this.checkForReload.bind(this);
  }

  handleInput(e) {
    if (e.key === "Tab") {
      e.preventDefault();
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
      } else if (this.checkForRestart(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else if (this.checkForRespawn(currentValue)) {
        e.target.value = "";
        this.clearDisplays();
      } else {
        e.target.value = "";
      }

      document.getElementById("myInput").blur();
    }
  }

  checkForStart(curVal) {
    if (curVal.toLowerCase() === "start" && !this.GameView.started) {
      this.GameView.start();
      this.GameView.started = true;
      // this.GameView.sound.toggleIntroMusic();
    }
  }

  checkForRelocate(curVal) {
    if (curVal.toLowerCase() === "tp") {
      this.avatar.relocate();
    }
  }

  checkForShield(curVal) {
    if (curVal.toLowerCase() === "shield" && this.GameView.started) {
      this.avatar.deployShield();
    }
  }


  checkForReload(curVal) {
    if (curVal.toLowerCase() === "rl") {
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
    if (curVal.toLowerCase() === "restart") {
      this.GameView.game = new Game();
      this.GameView.avatar = this.GameView.game.generateAvatar(
        this.GameView.sound
      );
      return true;
    } else {
      return false;
    }
  }

  checkForRespawn(curVal) {
    let avatar;

    if (curVal.toLowerCase() === "respawn") {
      if (this.GameView.game.avatar.length === 0 && this.GameView.game.lives > 1) {
        avatar = this.GameView.game.generateAvatar(
          this.GameView.sound,
          this.game.randomPosition()
        );
        this.avatar = avatar;
        this.GameView.avatar = avatar;
        this.GameView.game.lives -= 1;
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
