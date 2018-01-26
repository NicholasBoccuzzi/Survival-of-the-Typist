const story = (game) => {
  let leftbox = document.getElementById("leftbox");
  let rightbox = document.getElementById("rightbox");
  let left = document.getElementById("flash");
  let middle = document.getElementById("myInput");
  let right = document.getElementById("scoreBoard");
  let sides = document.getElementsByClassName("directions-container");
  let canvas = document.getElementById("survivalTypist");
  let ui = document.getElementById("ui");
  let title = document.getElementById("title");
  title.classList.add("animated");
  title.classList.add("fadeOut");
  ui.classList.add("animated");
  ui.classList.add("fadeOut");
  canvas.classList.add("red-canvas");
  for (var i = 0; i < sides.length; i++) {
    sides[i].classList.add("animated");
    sides[i].classList.add("fadeOut");
  }
  rightbox.classList.add("animated");
  rightbox.classList.add("fadeOut");
  leftbox.classList.add("animated");
  leftbox.classList.add("fadeOut");
  middle.classList.add("red-box-shadow-middle");
  middle.setAttribute("placeholder", "");
  middle.focus();

  setTimeout(() => {
    for (let k = 0; k < sides.length; k++) {
      sides[k].classList.add("hide");
    }
    rightbox.classList.add("red-box-shadow-right");
    leftbox.classList.add("red-box-shadow-left");
    leftbox.classList.add("animated");
    rightbox.classList.add("animated");
    rightbox.classList.add("zoomIn");
    leftbox.classList.add("zoomIn");
    right.innerHTML = "";
  }, 3000);

  setTimeout(() => {

    left.innerHTML = "Hello";
    right.innerHTML = "Typist";
  }, 5000);
  setTimeout(() => {
    middle.setAttribute("placeholder", "My name is Red");
  }, 8000);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "your");
    right.innerHTML = "am";
  }, 11000);

  setTimeout(() => {
    left.innerHTML = "[ ]";
    middle.setAttribute("placeholder", "Square");
    right.innerHTML = "[ ]";
  }, 16000);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "your");
    right.innerHTML = "need";
  }, 20000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "help...");
    right.innerHTML = "";
  }, 22000);

  setTimeout(() => {
    left.innerHTML = "They";
    middle.setAttribute("placeholder", "coming");
    right.innerHTML = "are";
  }, 25000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "for");
    right.innerHTML = "";
  }, 26500);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "me.");
    right.innerHTML = "";
  }, 27500);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "function");
    right.innerHTML = "cannot";
  }, 30000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "without");
    right.innerHTML = "";
  }, 32000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "you.");
    right.innerHTML = "";
  }, 33000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "Typist...");
    right.innerHTML = "";
  }, 35500);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "");
    right.innerHTML = "am";
  }, 40000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "counting");
    right.innerHTML = "";
    leftbox.classList.add("animated");
    rightbox.classList.add("animated");
    rightbox.classList.add("zoomIn");
    leftbox.classList.add("zoomIn");
  }, 42000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "on");
    right.innerHTML = "";
  }, 45000);

  setTimeout(() => {
    left.innerHTML = "";
    middle.setAttribute("placeholder", "you...");
    right.innerHTML = "";
  }, 48000);

  setTimeout(() => {
    leftbox.classList.remove("red-box-shadow-left");
    middle.classList.remove("red-box-shadow-middle");
    middle.setAttribute("placeholder", "Type Start and Press Enter To Begin");
    rightbox.classList.remove("red-box-shadow-right");
    canvas.classList.remove("red-canvas");
    title.classList.remove("fadeOut");
    title.classList.remove("animated");
    title.classList.remove("zoomInDown");
    title.classList.add("animated")
    title.classList.add("zoomInDown");
    ui.classList.remove("fadeOut");
    ui.classList.add("fadeIn");
    for (let j = 0; j < sides.length; j++) {
      sides[j].classList.remove("hide");
      sides[j].classList.remove("fadeOut");
      if (j === 0) {
        sides[j].classList.add("slideInLeft");
      } else {
        sides[j].classList.add("slideInRight");
      }
    }
    leftbox.classList.add("animated");
    leftbox.classList.add("slideInLeft");
    rightbox.classList.add("animated");
    rightbox.classList.add("slideInRight");
    game.storyActive = false;
    game.sound.playIntroMusic();
  }, 52000);
};

module.exports = story;
