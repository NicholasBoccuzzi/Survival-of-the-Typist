class Score {
  constructor () {
    this.score = DEFAULTS.score;
    this.multiplier = DEFAULTS.multiplier;
    this.scoreBoard = document.getElementById("scoreBoard");
  }

  add() {
    this.score += 25 * this.multiplier;
    this.multiplier += .05;
    this.displayScore();
  }

  displayScore() {
    this.scoreBoard.innerHTML = `${Math.round(this.score)}`;
  }




}

const DEFAULTS = {
  score: 0,
  multiplier: 1
};

module.exports = Score;
