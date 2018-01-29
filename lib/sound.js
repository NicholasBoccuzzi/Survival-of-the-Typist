

class Sound {
  constructor () {
    this.introMusic;
    this.musicActive = true;
    this.introMusic = document.getElementById("intro");
    this.deathMusic = document.getElementById("deathmarch");
    this.backgroundBeats = document.getElementById("backgroundBeats");
    this.storyMusic = document.getElementById("storyMusic");
    this.allMusic = [
      this.introMusic, this.deathMusic, this.backgroundBeats, this.storyMusic
    ];
    this.toggleMusic = this.toggleMusic.bind(this);
    // this.toggleIntroMusic = this.toggleIntroMusic.bind(this);
  }

  toggleMusic () {
    const soundButtons = document.getElementsByClassName("sound-button");
    let muted;

    for (var i = 0; i < soundButtons.length; i++) {
      const gameMusic = [
        document.getElementById("backgroundBeats"),
        document.getElementById("intro"),
        document.getElementById("deathmarch"),
        document.getElementById("storyMusic")
      ];

      const that = this;
      soundButtons[i].addEventListener("click", () => {
        gameMusic.forEach((music) => {
          music.muted = !music.muted;
        } );
        this.musicActive = !this.musicActive;
        this.switchIcons(this.musicActive);
      });
    }
  }

  playIntroMusic() {
    this.introMusic.currentTime = 0;
    this.introMusic.play();
    this.introMusic.setAttribute("autoplay", true);
    this.introMusic.setAttribute("loop", true);
  }

  stopIntroMusic() {
    this.introMusic.pause();
  }

  playStoryMusic() {
    this.storyMusic.play();
  }

  playDeathMusic() {
    this.backgroundBeats.pause();
    this.deathMusic.setAttribute("loop", true);
    this.deathMusic.play();
  }

  stopDeathMusic() {
    this.deathMusic.pause();
    this.deathMusic.setAttribute("loop", false);
  }

  playBeats() {
    this.backgroundBeats.play();
  }



  switchIcons (muted) {
    let volumeIcons;

    if (!muted) {
      volumeIcons = document.getElementsByClassName("volume");

      for (var i = 0; i < volumeIcons.length; i++) {
        volumeIcons[i].classList.remove("fa-volume-up");
        volumeIcons[i].classList.add("fa-volume-off");
      }
    } else {
      volumeIcons = document.getElementsByClassName("volume");

      for (var i = 0; i < volumeIcons.length; i++) {
        volumeIcons[i].classList.remove("fa-volume-off");
        volumeIcons[i].classList.add("fa-volume-up");

      }
    }
  }

  playSound(id) {
    if (this.musicActive) {
      let soundEffect = document.createElement("AUDIO");

      if (id === "blasterFired") {
        soundEffect.setAttribute("src", "./audio/blaster.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "teleport") {
        soundEffect.setAttribute("src", "./audio/teleport.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "shield") {
        soundEffect.setAttribute("src", "./audio/shield.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "emptyClip") {
        soundEffect.setAttribute("src", "./audio/emptyClip.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "shieldRemove") {
        soundEffect.setAttribute("src", "./audio/shieldRemove.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "shutdown") {
        soundEffect.setAttribute("src", "./audio/shutdown.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "bomb") {
        soundEffect.setAttribute("src", "./audio/bomb.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "littleBomb") {
        soundEffect.setAttribute("src", "./audio/littleBomb.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "removeFastEnemy") {
        soundEffect.setAttribute("src", "./audio/removeTriangle.mp3");
        soundEffect.setAttribute("autoplay", "true");
      } else if (id === "removeSlowEnemy") {
        soundEffect.setAttribute("src", "./audio/removeWall.mp3");
        soundEffect.setAttribute("autoplay", "true");
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
