const Game = require("./game");
const gameView = require("./game_view");
const Sound = require("./sound");
const Score = require("./score");


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("survivalTypist");
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;
  const audio = new Sound();
  audio.toggleMusic();


  const ctx = canvas.getContext("2d");
  const score = new Score();
  const game = new Game(audio, score);
  const currentGameView = new gameView(game, ctx, audio);
  score.gameView = currentGameView;
  currentGameView.bindEnter();

  const currentInput = document.getElementById("myInput");
  currentInput.addEventListener("keydown", currentGameView.textInput.handleInput);
});
