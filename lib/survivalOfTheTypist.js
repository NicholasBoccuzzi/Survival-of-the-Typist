const Game = require("./game");
const GameView = require("./game_view");
const Sound = require("./sound");
const Score = require("./score");
document.body.classList.add('hide');
document.addEventListener("DOMContentLoaded", () => {
  let backgroundGif = new Image();
  backgroundGif.src = "images/trippybackground.gif";
  backgroundGif.onload = () => {
    document.body.style.backgroundImage = "url('images/trippybackground.gif')";
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

    document.body.classList.remove('hide');
    const currentInput = document.getElementById("myInput");
    currentInput.addEventListener("keydown", currentGameView.textInput.handleInput);

    const highScoreInput = document.getElementById("highScoreInput");
    highScoreInput.addEventListener("keydown", currentGameView.textInput.handleHighScoreInput);
  };
});
