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
    right.innerHTML = "Hello";
  }, 4000);

  setTimeout(() => {

    left.innerHTML = "Typist...";
    right.innerHTML = "Typist...";
  }, 5000);

  setTimeout(() => {
    middle.setAttribute("placeholder", "My name is Red");
  }, 8000);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "");
    right.innerHTML = "I";
  }, 11000);

  setTimeout(() => {
    left.innerHTML = "am";
    right.innerHTML = "am";
  }, 11500);

  setTimeout(() => {
    left.innerHTML = "your";
    right.innerHTML = "your";
  }, 1200);

  setTimeout(() => {
    left.innerHTML = "[ ]";
    middle.setAttribute("placeholder", "Square");
    right.innerHTML = "[ ]";
  }, 16000);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "");
    right.innerHTML = "need";
  }, 20000);

  setTimeout(() => {
    left.innerHTML = "need";
    middle.setAttribute("placeholder", "");
    right.innerHTML = "need";
  }, 20500);

  setTimeout(() => {
    left.innerHTML = "your";
    middle.setAttribute("placeholder", "");
    right.innerHTML = "your";
  }, 2100);

  setTimeout(() => {
    left.innerHTML = "help...";
    middle.setAttribute("placeholder", "help...");
    right.innerHTML = "help...";
  }, 22000);

  setTimeout(() => {
    left.innerHTML = "They";
    middle.setAttribute("placeholder", "They");
    right.innerHTML = "They";
  }, 25000);

  setTimeout(() => {
    left.innerHTML = "are";
    middle.setAttribute("placeholder", "Are");
    right.innerHTML = "are";
  }, 25400);

  setTimeout(() => {
    left.innerHTML = "coming";
    middle.setAttribute("placeholder", "COMING");
    right.innerHTML = "coming";
  }, 25800);

  setTimeout(() => {
    left.innerHTML = "for";
    middle.setAttribute("placeholder", "FOR");
    right.innerHTML = "for";
  }, 26500);

  setTimeout(() => {
    left.innerHTML = "me";
    middle.setAttribute("placeholder", "ME");
    right.innerHTML = "me";
  }, 27500);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "function");
    right.innerHTML = "cannot";
  }, 30000);

  setTimeout(() => {
    left.innerHTML = "cannot";
    middle.setAttribute("placeholder", "cannot");
    right.innerHTML = "cannot";
  }, 30750);

  setTimeout(() => {
    left.innerHTML = "function";
    middle.setAttribute("placeholder", "function");
    right.innerHTML = "function";
  }, 31500);

  setTimeout(() => {
    left.innerHTML = "without";
    middle.setAttribute("placeholder", "without");
    right.innerHTML = "without";
  }, 32000);

  setTimeout(() => {
    left.innerHTML = "you";
    middle.setAttribute("placeholder", "you...");
    right.innerHTML = "you";
  }, 33000);

  setTimeout(() => {
    left.innerHTML = "Typist";
    middle.setAttribute("placeholder", "Typist");
    right.innerHTML = "Typist";
  }, 35500);

  setTimeout(() => {
    left.innerHTML = "I";
    middle.setAttribute("placeholder", "I");
    right.innerHTML = "I";
  }, 40000);

  setTimeout(() => {
    left.innerHTML = "am";
    middle.setAttribute("placeholder", "am");
    right.innerHTML = "am";
  }, 40000);

  setTimeout(() => {
    left.innerHTML = "counting";
    middle.setAttribute("placeholder", "counting");
    right.innerHTML = "counting";
    leftbox.classList.add("animated");
    rightbox.classList.add("animated");
    rightbox.classList.add("zoomIn");
    leftbox.classList.add("zoomIn");
  }, 42000);

  setTimeout(() => {
    left.innerHTML = "on";
    middle.setAttribute("placeholder", "on");
    right.innerHTML = "on";
  }, 45000);

  setTimeout(() => {
    left.innerHTML = "you...";
    middle.setAttribute("placeholder", "you...");
    right.innerHTML = "you...";
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
