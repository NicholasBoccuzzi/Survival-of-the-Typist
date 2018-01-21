class TextInput {
  constructor (options) {
    this.game = options.game;
    this.avatar = options.avatar;
    this.gameView = options.gameView;

    this.handleInput = this.handleInput.bind(this);
    this.checkForReload = this.checkForReload.bind(this);
  }

  handleInput(e) {
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
      } else {
        e.target.value = "";
      }

      document.getElementById("myInput").blur();
    }
  }

  checkForStart(curVal) {
    if (curVal.toLowerCase() === "start" && !this.gameView.started) {
      this.gameView.start();
      this.gameView.started = true;
      // this.gameView.sound.toggleIntroMusic();
    }
  }

  checkForRelocate(curVal) {
    if (curVal.toLowerCase() === "teleport") {
      this.avatar.relocate();
    }
  }

  checkForShield(curVal) {
    if (curVal.toLowerCase() === "shield" && this.gameView.started) {
      this.avatar.deployShield();
    }
  }


  checkForReload(curVal) {
    if (curVal.toLowerCase() === "reload") {
      this.avatar.ammo = 10;
      clearInterval(this.avatar.flashActive);
      this.avatar.flashActive = !this.avatar.flashActive;
      return true;
    } else {
      return false;
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
