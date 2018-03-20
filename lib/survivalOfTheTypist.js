const Game = require("./game");
const GameView = require("./game_view");
const Sound = require("./sound");
const Score = require("./score");

let loading = document.getElementById("loading");
let main = document.getElementById("main");
let backgroundEl = document.getElementById("background");

document.addEventListener("DOMContentLoaded", () => {
  let background = new Image();
  background.src = "images/backup.jpg";
  background.onload = () => {
    document.body.style.backgroundColor = "black";
    loading.classList.remove("animated");
    loading.classList.remove("fadeIn");
    loading.classList.add("animated");
    loading.classList.add("fadeOut");
    backgroundEl.classList.add("animated");
    backgroundEl.classList.add("fadeIn");
    backgroundEl.src = "images/backup.jpg";

    setTimeout(() => {

      loading.classList.add("hide");
      const canvas = document.getElementById("survivalTypist");
      canvas.width = Game.DIM_X;
      canvas.height = Game.DIM_Y;
      const audio = new Sound();
      audio.toggleMusic();


      const ctx = canvas.getContext("2d");
      const score = new Score();
      const game = new Game(audio, score);
      const currentGameView = new GameView(game, ctx, audio, score);
      score.gameView = currentGameView;
      currentGameView.bindEnter();

      const currentInput = document.getElementById("myInput");
      currentInput.addEventListener("keydown", currentGameView.textInput.handleInput);

      const highScoreInput = document.getElementById("highScoreInput");
      highScoreInput.addEventListener("keydown", currentGameView.textInput.handleHighScoreInput);
      main.classList.remove('hide');
      main.classList.add('center-main');
    }, 1000);
  };
});
