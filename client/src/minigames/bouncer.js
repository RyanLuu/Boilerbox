var platformRadius = 500; //Radius of the platform in pixels
var playerRadius = 50; //Radius of the players in pixels
var timesSurvived = [0, 0, 0, 0];
var startTime;
var scoresTexts = [];
var roundsLeft = 5;

class BounceObject {
   constructor(x, y, player, color) {
     this.circle = scene.add(new game.circle(x, y, playerRadius, color));
     this.radius = playerRadius;
     this.x = x || 0;
     this.y = y || 0;
     this.player = player;
     this.xVel = 0;
     this.yVel = 0;
     this.alive = true;
   }

   move(input) {
     this.ax = input[0]/120; // sholud be acceleration instead
     this.ay = -input[2]/120;
     
     this.xVel += this.ax;
     this.yVel += this.ay;
     
     this.x += this.xVel;
     this.y += this.yVel;
     
     this.circle.position.x = this.x;
     this.circle.position.y = this.y;
     
     console.log(this.circle.x,this.circle.y);
     
     if (this.alive) {
       scoresTexts[this.player].text = Math.round((Date.now() - startTime) / 100);
       
     }
     
   }
  
  checkCollision(other) {
     return (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y) < (this.radius + other.radius) * (this.radius + other.radius);
  }
  
  checkCollisionNextFrame(that) {
    var dx = (this.x + this.xVel) - (that.x + that.xVel);
    var dy = (this.y + this.yVel) - (that.y + that.yVel);
    return dx * dx + dy * dy < (this.radius + that.radius) * (this.radius + that.radius);
  }
  
  speed() {
    return Math.sqrt(this.xVel * this.xVel + this.yVel * this.yVel);
  }
  
  distanceTo(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  angle() {
    return Math.atan2(this.yVel, this.xVel);
  }
  
  destroy() {
    scene.remove(this.circle);
    timesSurvived[this.player] = Date.now() - startTime;
    this.alive = false;
  }
  
  /*
  setImpulse(object, angle, force) {          //TODO: use this???
      this.xVel = force * Math.cos(angle * (Math.PI / 180));
      this.yVel = force * Math.sin(angle * (Math.PI / 180));  
  }
  */
}


class Bouncer extends Minigame {
  constructor(game) {
    super('bouncer', [new game.rectangle( 0, 0, 200, 200, "#F00" )]);
    timesSurvived = [0, 0, 0, 0];
    this.players = [];
//     for (let i = 0; i < 4; i++) {
//       this.players[i] = new BounceObject(175 * ((i % 2 === 0) ? -1 : 1), 175 * ((Math.floor(i / 2) === 0) ? -1 : 1), i, playerColors[i]);
//     }
//     scoresTexts = [scene.add(new game.text(points[0], renderer.leftOfScreen + padding, renderer.topOfScreen + padding + scorePadding - 150, playerColors[0], "Polygon Party", "90")),
//                 scene.add(new game.text(points[1], renderer.rightOfScreen - padding, renderer.topOfScreen + padding + scorePadding - 150, playerColors[1], "Polygon Party", "90")),
//                 scene.add(new game.text(points[2], renderer.leftOfScreen + padding, renderer.bottomOfScreen - padding - scorePadding+150, playerColors[2], "Polygon Party", "90")),
//                 scene.add(new game.text(points[3], renderer.rightOfScreen - padding, renderer.bottomOfScreen - padding - scorePadding+150, playerColors[3], "Polygon Party", "90"))];
//     console.log(scoresTexts);
//     this.tags = [scene.add(new game.image(document.getElementById('tag_0'), renderer.leftOfScreen + 150, renderer.topOfScreen + 50, 300, 100)),
//             scene.add(new game.image(document.getElementById('tag_1'), renderer.rightOfScreen - 150, renderer.topOfScreen + 50, 300, 100)),
//             scene.add(new game.image(document.getElementById('tag_2'), renderer.leftOfScreen + 150, renderer.bottomOfScreen - 50, 300, 100)),
//             scene.add(new game.image(document.getElementById('tag_3'), renderer.rightOfScreen - 150, renderer.bottomOfScreen - 50, 300, 100))];
//     this.arena = scene.addBelow(new game.circle(0, 0, platformRadius));
//     startTime = Date.now();
  }
  
  applyImpulse(object, angle, force) {
    object.xVel += force * Math.cos( angle * ( Math.PI / 180 ) );
    object.yVel += force * Math.sin( angle * ( Math.PI / 180 ) );
  }
  
  init() {
    for (let i = 0; i < 4; i++) {
      this.players[i] = new BounceObject(175 * ((i % 2 === 0) ? -1 : 1), 175 * ((Math.floor(i / 2) === 0) ? -1 : 1), i, playerColors[i]);
    }
    scoresTexts = [scene.add(new game.text(scores[0], renderer.leftOfScreen + padding, renderer.topOfScreen + padding + scorePadding - 150, playerColors[0], "Polygon Party", "90")),
                scene.add(new game.text(scores[1], renderer.rightOfScreen - padding, renderer.topOfScreen + padding + scorePadding - 150, playerColors[1], "Polygon Party", "90")),
                scene.add(new game.text(scores[2], renderer.leftOfScreen + padding, renderer.bottomOfScreen - padding - scorePadding+150, playerColors[2], "Polygon Party", "90")),
                scene.add(new game.text(scores[3], renderer.rightOfScreen - padding, renderer.bottomOfScreen - padding - scorePadding+150, playerColors[3], "Polygon Party", "90"))];
    console.log(scoresTexts);
    this.tags = [scene.add(new game.image(document.getElementById('tag_0'), renderer.leftOfScreen + 150, renderer.topOfScreen + 50, 300, 100)),
            scene.add(new game.image(document.getElementById('tag_1'), renderer.rightOfScreen - 150, renderer.topOfScreen + 50, 300, 100)),
            scene.add(new game.image(document.getElementById('tag_2'), renderer.leftOfScreen + 150, renderer.bottomOfScreen - 50, 300, 100)),
            scene.add(new game.image(document.getElementById('tag_3'), renderer.rightOfScreen - 150, renderer.bottomOfScreen - 50, 300, 100))];
    this.arena = scene.addBelow(new game.circle(0, 0, platformRadius));
    startTime = Date.now();
  }
  
  update(input) {
    let temp = 0;
    for (let i = 0; i < 4; i++) {
      if (this.players[i].alive) {
        temp++;
      }
    }
    if (temp <= 1) {
      for (let i = 0; i < 4; i++) {
        if (this.players[i].alive) {
          scores[i] += 200;
        }
      }
      this.finished = true;
    }
    for (let i = 0; i < 4; i++) {
      if (this.players[i].alive){
        if (this.players[i].x * this.players[i].x + this.players[i].y * this.players[i].y > platformRadius * platformRadius) {
          this.players[i].destroy();
        }
//           if (!this.players[i].checkCollision(this.arena)) {
        for (let j = i+1; j < 4; j++) {
            /*this.players[i].xVel = -this.players[i].xVelinput[2];
            this.players[i].yVel = -this.players[i].yVel;
            this.players[j].xVel = -this.players[j].xVel;
            this.players[j].yVel = -this.players[j].yVel;*/
//             var force = 20;
//             var dist = Math.sqrt( ( this.players[ i ].x - this.players[ j ].x ) * ( this.players[ i ].x - this.players[ j ].x ) + ( this.players[ i ].y - this.players[ j ].y ) * ( this.players[ i ].y - this.players[ j ].y ) )
//             var angle = Math.asin( ( this.players[ i ].y - this.players[ j ].y ) / dist ) / ( Math.PI / 180 );
//             if( this.players[ i ].x < this.players[ j ].x ) {
//               this.applyImpulse( this.players[ i ], 360 - angle, -force );
//               this.applyImpulse( this.players[ j ], 360 - angle, force );
//             }
//             else {
//               this.applyImpulse( this.players[ i ], angle, force );
//               this.applyImpulse( this.players[ j ], angle, -force );
//             }
            
          if (this.players[i].checkCollision(this.players[j])) {
              var theta = Math.atan2((this.players[i].y - this.players[j].y), (this.players[i].x - this.players[j].x));
              var overlap = this.players[i].radius + this.players[j].radius - this.players[i].distanceTo(this.players[j]);
              var smallerObject = this.players[i].radius < this.players[j].radius ? i : j;
              this.players[smallerObject].x -= overlap * Math.cos(theta);
              this.players[smallerObject].y -= overlap * Math.sin(theta);
          }

          if (this.players[i].checkCollisionNextFrame(this.players[j])) {
              var theta1 = this.players[i].angle();
              var theta2 = this.players[j].angle();
              var phi = Math.atan2(this.players[j].y - this.players[i].y, this.players[j].x - this.players[i].x);
              var m1 = 1;
              var m2 = 1;
              var v1 = this.players[i].speed();
              var v2 = this.players[j].speed();

              var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
              var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
              var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
              var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

              this.players[i].xVel = dx1F;                
              this.players[i].yVel = dy1F;                
              this.players[j].xVel = dx2F;                
              this.players[j].yVel = dy2F;
          }
        }
      }
      if (input[i] != null) {
        this.players[i].move(input[i]);
      }
    }
  }
  
  end() {
    scene.objects = [];
    scene.belowObjects = [];
    console.log("i emp")
    //add up all players time survived, give % of 900, and give the winner a bonus 100 points
  }
}

  /*
  var angle = Math.asin( ( point.y - object.position.y ) / dist ) / ( Math.PI / 180 );
          if( point.x < object.position.x ) {
            setImpulse( object, 360 - angle, force );
                        object.velocity.y = Math.abs( object.velocity.y );
          }
          else {
            setImpulse( object, angle, -force );
                        object.velocity.y = Math.abs( object.velocity.y );
          }
                    object.velocity.y += 2;
  */

/*

ACCEL AND FRICTION
dx += input[i][1] // i.e. pitch
dy += input[i][2] // i.e. roll
friction = 0.9
dx *= friction
dx *= friction

COLLISIONS

function ballCollision() {
    for (var obj1 in objArray) {
        for (var obj2 in objArray) {
            if (obj1 !== obj2 && distanceNextFrame(objArray[obj1], objArray[obj2]) <= 0) {
                var theta1 = objArray[obj1].angle();
                var theta2 = objArray[obj2].angle();
                var phi = Math.atan2(objArray[obj2].y - objArray[obj1].y, objArray[obj2].x - objArray[obj1].x);
                var m1 = objArray[obj1].mass;
                var m2 = objArray[obj2].mass;
                var v1 = objArray[obj1].speed();
                var v2 = objArray[obj2].speed();

                var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                objArray[obj1].dx = dx1F;                
                objArray[obj1].dy = dy1F;                
                objArray[obj2].dx = dx2F;                
                objArray[obj2].dy = dy2F;
            }            
        }
    }
}

function staticCollision() {
    for (var obj1 in objArray) {
        for (var obj2 in objArray) {
            if (obj1 !== obj2 &&
                distance(objArray[obj1], objArray[obj2]) < objArray[obj1].radius + objArray[obj2].radius)
            {
                var theta = Math.atan2((objArray[obj1].y - objArray[obj2].y), (objArray[obj1].x - objArray[obj2].x));
                var overlap = objArray[obj1].radius + objArray[obj2].radius - distance (objArray[obj1], objArray[obj2]);
                var smallerObject = objArray[obj1].radius < objArray[obj2].radius ? obj1 : obj2
                objArray[smallerObject].x -= overlap * Math.cos(theta);
                objArray[smallerObject].y -= overlap * Math.sin(theta);
            }
        }
    }
}

*/
