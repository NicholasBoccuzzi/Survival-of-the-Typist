## Survival of the Typist

[Live Link](http://nicholasboccuzzi.com/Survival-of-the-Typist/)

### Background

A game to test your typing skills, as well as your ability to destroy enemy target: Survival of the Typist is a high-score-chasing JavaScript game that bestows the title "Typist" to its players and puts them in control of a Red Square. Complete with online high-scores, a backstory and, most importantly, addictive responsive gameplay, Survival of the Typist also features positional tracking for enemies, object collision detection, custom death animations, and unique sound effects.

### Functionality &amp; MVP  

With Survival of the Typist, users will be able to:

- [ ] Start and Reset for the the game
- [ ] Enjoy the game's backstory before starting the game
- [ ] Test and learn the game's mechanics before start the game
- [ ] Input "Typist Commands" to perform specific actions
- [ ] Compete for the high-score

In addition, this project will include:

- [ ] Enemy Positional Tracking
- [ ] Random Enemy Spawn Locations
- [ ] Hand-crafted Canvas animations for enemies and the player character
- [ ] Custom sound effects and background music for various aspects of the game
- [ ] Online high scores using Google's Firebase
- [ ] A production README

### Wireframes

This app will be single screened with the game board at the centerpiece. The game controls, and nav links to my Github, my LinkedIn, and my Personal site will be located surrounding the game board.

Original Vision

![wireframes](https://i.imgur.com/UrKPUnO.png)

End Vision

![wireframes](https://i.imgur.com/0TnOYiO.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- `JavaScript` for game logic,
  `HTML Canvas` for game graphics,
  `CSS` for frontend presentation
  `Animate CSS` for (some) HTML Element animations
  `Keymaster` for (some) keybindings
- `webpack.js` to bundle js files.


### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `Foo.js` installed. Write a basic entry file and the bare bones of all 3 scripts outlined above.  Learn the basics of `Foo.js`.  Goals for the day:

- Get a green bundle with `Webpack`
- Figure out what else is needed to make this project happen.

**Day 2**:

- Found and implemented Keymaster npm which is a useful tool for binding keys to particular inputs
- Created an HTML canvas to display game graphics
- Created an avatar class that inherits from the class Moving object
- Avatar renders on the HTML canvas

**Day 3**:

- Added the ability to move the shape through keypress which updates the velocity of the object
- Created a class for Bullets that inherits from the class Moving Object
- Bullets are generated on keypress of spacebar
- Bullets are given a relative velocity which takes the velocity of the bullet and multiplies it by 10
- Game class adds bullets to list of objects to render and draws each object on screen

**Day 4**:

- Created a class for Fast_Enemies that inherit from the class Moving Object
- Fast_Enemies start out with a given velocity pointed towards targets
- Fast Enemies are drawn as triangles
- Gave the Avatar parameters that will keep it within the walls of the canvas

**Day 5**:

- Created a class for Slow_Enemies that inherit from the class Moving Object
- Slow Enemies can either take up the entire width or height of the canvas
- Extended Out of bounds to be the canvas size + 50 in all directions to allow enemies to be generated off screen before working their way in

**Day 6**:

- Added first sound effect for bullet fire by creating new HTML Audio Elements any time space bar is pressed
- Created Input field for user typing
- Mapped "Enter" to toggle between input field and the canvas
- Gave the avatar a limit to number of bullets created
- Created HTML container that flashes "Reload" when out of ammo
- Created Event Listener for input field for given input "Reload" that will clear input value and reload avatar ammo stock

**Day 7**:
- Thought of and Implemented unique positional tracking
- Added background music for the game

**Day 8**:
- Thought of and Implemented unique collision detection
- Added sound effect for

**Day 9**
- Added Shield, Bomb, and Teleport functionality for the avatar
- Added text inputs for the Shield, Bomb, Teleport functionalities that are triggered through events
- Crafted death animations for avatar

**Day 10**:
- Implemented a main menu (game does not start until Typed "Start")
- Added a "Story" to the game
- Story is triggered by typing "Story"
- Tweaked difficulty of the game

**Day 11**:
- Began implementing high scores through firebase
- Added player directions to help new players understand how to play the game
- Tweaked difficulty of the game

**Day 12**:
- Added Directions
- Finished high score implementation
- Tweaked difficulty of the game


**Day 13**:
- Added onload event for background gif to smooth out the loading process for the game
- Full game live and linked to my personal website

### Bonus features

If time permits, I will try to make this game prettier or add music of some sort.

- [ ] Make it pretty!
</pre></body>
