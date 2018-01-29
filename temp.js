// Temp1
// temperEnemySpeed() {
//   if (this.vel[0] > MovingObject.MAXENEMYSPEED) {
//     this.vel[0] = MovingObject.MAXENEMYSPEED;
//   } else if (this.vel[0] < MovingObject.MINENEMYSPEED) {
//     this.vel[0] = MovingObject.MINENEMYSPEED;
//   }
//
//   if (this.vel[1] > MovingObject.MAXENEMYSPEED) {
//     this.vel[1] = MovingObject.MAXENEMYSPEED;
//   } else if (this.vel[1] < MovingObject.MINENEMYSPEED) {
//     this.vel[1] = MovingObject.MINENEMYSPEED;
//   }
// }

// <div class="directions-title">Intro</div>
// <div class="directions-el">
//   <p>You are a Typist.</p>
//   Typists are assigned Squares.
//   <p>
//     <div class="RedSquare"></div> Red is your Square.
//   </p>
//   Red can only function by your command.
//   <p>Keep Red alive!</p>
// </div>

drawSlowEnemy(ctx) {
  if (this.startingPos[0] === 0 && this.startingPos[1] === -50) {
    if (!this.velocityCheck){
      this.vel = [0, .2];
      this.velocityCheck += 1;
      this.endPoint = 650;
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.endPoint, this.pos[1]);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  } else if (this.startingPos[0] === -50 && this.startingPos[1] === 0) {
    if (!this.velocityCheck) {
      this.vel = [.2, 0];
      this.velocityCheck += 1;
      this.endPoint = 450;
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.pos[0], this.endPoint);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  } else if (this.startingPos[0] === 0 && this.startingPos[1] === this.game.DIM_Y + 50) {
    if (!this.velocityCheck) {
      this.vel = [0, -.2];
      this.velocityCheck += 1;
      this.endpoint = 400;
      console.log(this);
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.endPoint, this.pos[1]);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  } else if (this.startingPos[0] === this.game.DIM_X + 50 && this.startingPos[1] === 0) {
    if (!this.velocityCheck) {
      this.vel = [-.2, 0];
      this.velocityCheck += 1;
      this.endpoint = 450;
      console.log(this);
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.endPoint, this.pos[1]);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  }
}

drawSlowEnemy(ctx) {
  if (this.startingPos[0] === 0 && this.startingPos[1] === -50) {
    if (!this.velocityCheck){
      this.vel = [0, .2];
      this.velocityCheck += 1;
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(650, this.pos[1]);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  } else if (this.startingPos[0] === -50 && this.startingPos[1] === 0) {
    if (!this.velocityCheck) {
      this.vel = [.2, 0];
      this.velocityCheck += 1;
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.pos[0], 400);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  } else if (this.startingPos[0] === 0 && this.startingPos[1] === 450) {
    if (!this.velocityCheck) {
      this.vel = [0, -.2];
      this.velocityCheck += 1;
    }
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(650, this.pos[1] - 50);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  } else if (this.startingPos[0] === 650 && this.startingPos[1] === 0) {
    if (!this.velocityCheck) {
      this.vel = [-.2, 0];
      this.velocityCheck += 1;
    }
    ctx.moveTo(this.pos[0] - 50, this.pos[1]);
    ctx.lineTo(this.pos[0], 450);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 25;
    ctx.stroke();
  }
}
