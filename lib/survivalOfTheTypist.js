const Game = require("./game");
const GameView = require("./game_view");
const Sound = require("./sound");
const Score = require("./score");


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("survivalTypist");
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;
  const score = new Score();
  const audio = new Sound();
  audio.toggleMusic();


  const ctx = canvas.getContext("2d");
  const game = new Game(audio, score);
  const CurrentGameView = new GameView(game, ctx, audio);
  CurrentGameView.bindEnter();

  const currentInput = document.getElementById("myInput");
  currentInput.focus();
  currentInput.addEventListener("keydown", CurrentGameView.textInput.handleInput);
});
