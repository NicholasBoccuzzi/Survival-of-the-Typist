class Score {
  constructor () {
    this.gameView;
    this.score = 0;
    this.multiplier = 1;
    this.scoreBoard = document.getElementById("scoreBoard");
    this.currentKills = 0;
    this.killCount = 0;
    this.flashActive = false;
  }

  add() {
    if (this.gameView.playing){
      this.score += 25 * this.multiplier;
      this.currentKills += 1;
      this.displayScore();
    }

    if (this.currentKills - this.killCount === 8 && this.multiplier < 128) {
      this.killCount = this.currentKills;
      this.multiplier = this.multiplier * 2;
      this.flashMultiplier();
      this.gameView.sound.playSound("addPoints");
    }

    if (this.multiplier >= 8) {

    }
  }

  resetScore() {
    this.score = 0;
    this.multiplier = 1;
    this.currentKills = 0;
    this.killCount = 0;
    this.flashActive = false;
  }

  displayScore() {
    this.scoreBoard.innerHTML = `${Math.round(this.score)}`;
  }

  flashMultiplier() {
    let display = document.getElementById("flash");

    setTimeout(() => this.displayFlash(display), 0);
    setTimeout(() => this.displayFlash(display), 400);
  }

  displayFlash(display) {
    display.innerHTML = `X${this.multiplier}`;
  }

  resetMultiplier() {
    this.multiplier = 1;
  }
}

module.exports = Score;
