const Game = require("./game");
const GameView = require("./game_view");
const Sound = require("./sound");


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("survivalTypist");
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;
  const audio = new Sound();
  // audio.toggleIntroMusic();
  audio.toggleMusic();

  const ctx = canvas.getContext("2d");
  const game = new Game();
  const CurrentGameView = new GameView(game, ctx, audio);

  const currentInput = document.getElementById("myInput");
  currentInput.focus();
  currentInput.addEventListener("keydown", CurrentGameView.textInput.handleInput);
});
