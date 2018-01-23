

class Sound {
  constructor () {
    this.introMusic;
    this.musicActive = true;
    this.introMusic = document.getElementById("intro");

    this.toggleMusic = this.toggleMusic.bind(this);
    // this.toggleIntroMusic = this.toggleIntroMusic.bind(this);
  }

  toggleMusic () {
    const soundButtons = document.getElementsByClassName("sound-button");
    let muted;

    for (var i = 0; i < soundButtons.length; i++) {
      const gameMusic = [
        document.getElementById("backgroundBeats"),
        document.getElementById("intro")
      ];

      const that = this;
      soundButtons[i].addEventListener("click", () => {
        gameMusic.forEach((music) => {
          music.muted = !music.muted;
        } );
        this.musicActive = false;
        this.switchIcons(this.musicActive);
      });
    }
  }

  playIntroMusic() {
    this.introMusic.setAttribute("autoplay", true);
    this.introMusic.setAttribute("loop", true);
  }

  stopIntroMusic() {
    this.introMusic.pause();
  }


  switchIcons (muted) {
    let volumeIcons;

    if (muted) {
      volumeIcons = document.getElementsByClassName("fa-volume-up");

      for (var i = 0; i < volumeIcons.length; i++) {
        volumeIcons[i].classList.remove("fa-volume-up");
        volumeIcons[i].classList.add("fa-volume-off");
      }
    } else {
      volumeIcons = document.getElementsByClassName("fa-volume-off");

      for (var i = 0; i < volumeIcons.length; i++) {
        volumeIcons[i].classList.remove("fa-volume-off");
        volumeIcons[i].classList.add("fa-volume-off");
      }
    }
  }


    // const gameMusic = document.getElementById("backgroundBeats");
    // const that = this;
    //
    // gameMusic.addEventListener("change", () => {
    //   if (gameMusic.muted) {
    //     that.active = false;
    //   } else {
    //     that.active = true;
    //   }
    // });

  // toggleIntroMusic() {
  //   if (!this.introMusic) {
  //       this.introMusic = setInterval( () => {
  //       const introMusic = document.createElement("AUDIO");
  //       introMusic.setAttribute("src", "./audio/intro2.mp3");
  //       introMusic.setAttribute("autoplay", "true");
  //     }, 935);
  //   } else {
  //     clearInterval(this.introMusic);
  //     this.introMusic = false;
    // }
  // }


}

module.exports = Sound;
