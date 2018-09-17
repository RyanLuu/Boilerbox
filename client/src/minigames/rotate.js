
var minChange = Math.PI/4; //minimum angle change for each update, so that there aren't 2 rotations in a row that are nearly identical
var marginOfError = Math.PI/12; //the maximum angle away from position that a player's phone can be for it to count.
var REQUIRED_TIME = 1000; //The amount of time that a player needs to hold their phone within the margin of error in order to win the point
var currentObject;
var ratio = 3;
var padding = 200;
var scorePadding = 115;

//array of images - duplicates are there because it removes elements when it chooses them
//TODO: repopulate the list whenever the game is instantiated. Possibly move this list into the game.
var images = ["red_apple", "red_apple", "mango", "mango", "karambit", "broadsword", "broadsword", "dagger", "karambit", "machete"];
function getRandomImage() {
  return images.splice(Math.floor(Math.random() * images.length), 1);
}

class Pulse {
  constructor(x, y, color) {
    this.circle = scene.add(new game.circle(x, y, 0, color));
    this.circle.update = function(dt) {
      this.radius += 20 * dt;
      this.opacity *= 0.85;
      if (this.radius > 1000) {
        scene.remove(this);
        game.particles.splice(game.particles.indexOf(this), 1);
      }
    }
    game.particles.push(this.circle);
  }
}


class RotatingObject {
  constructor(image, player, x, y, width, height, targetAngle) {
    this.image = scene.add(new game.image(document.getElementById(image), x, y, width, height));
    if (player === 0){
      this.text = scene.add(new game.text(scores[player], renderer.leftOfScreen + padding, renderer.topOfScreen + padding + scorePadding, playerColors[player], "Polygon Party", "90"));
    }
    else if (player === 1){
      this.text = scene.add(new game.text(scores[player], renderer.rightOfScreen - padding, renderer.topOfScreen + padding + scorePadding, playerColors[player], "Polygon Party", "90"));
    }
    else if (player === 2){
      this.text = scene.add(new game.text(scores[player], renderer.leftOfScreen + padding, renderer.bottomOfScreen - padding - scorePadding, playerColors[player], "Polygon Party", "90"));
    }
    else if (player === 3){
      this.text = scene.add(new game.text(scores[player], renderer.rightOfScreen - padding, renderer.bottomOfScreen - padding - scorePadding, playerColors[player], "Polygon Party", "90"));
    }
    
  
    this.player = player;
    this.x = x || 0;
    this.y = y || 0;
    this.image.rotation = 0;
    
    if (player === -1) {
      this.children = [new RotatingObject(image, 0, renderer.leftOfScreen + padding, renderer.topOfScreen + padding, width / ratio, height / ratio),
                       new RotatingObject(image, 1, renderer.rightOfScreen - padding, renderer.topOfScreen + padding, width / ratio, height / ratio),
                       new RotatingObject(image, 2, renderer.leftOfScreen + padding, renderer.bottomOfScreen - padding, width / ratio, height / ratio),
                       new RotatingObject(image, 3, renderer.rightOfScreen - padding, renderer.bottomOfScreen - padding, width / ratio, height / ratio)]; 
      this.image.rotation = targetAngle;
    }
  }
  
  rotate(θ) {
    if (θ  < 0){
      θ += 2*Math.PI;
    }
    
    this.image.rotation = θ;

    //check correctness
    if (this.player != -1) {
      var dθ = Math.abs(θ - currentObject.image.rotation); //maybe TODO: fix transition from 2pi to 0
      if (Math.abs(dθ) < marginOfError) {
        
        if (!this.correct) {
          this.correct = true;
          this.correctTime = Date.now();
        }
        if (Date.now() - this.correctTime > REQUIRED_TIME) {
          scores[this.player] += 100;
          new Pulse(this.x, this.y, playerColors[this.player]);
          currentObject.destroy();
        }
      } else {
        this.correct = false;
      }
    }
  }
  
  destroy() {
    scene.remove(this.children[0].image);
    scene.remove(this.children[1].image);
    scene.remove(this.children[2].image);
    scene.remove(this.children[3].image);
    scene.remove(this.children[0].text);
    scene.remove(this.children[1].text);
    scene.remove(this.children[2].text);
    scene.remove(this.children[3].text);
    scene.remove(this.image);
    
    if (!images.length) {
      currentObject = undefined;
      var finalScores = [scene.add(new game.text(scores[0], renderer.leftOfScreen + padding, renderer.topOfScreen + padding + scorePadding, playerColors[0], "Polygon Party", "90")),
                        scene.add(new game.text(scores[1], renderer.rightOfScreen - padding, renderer.topOfScreen + padding + scorePadding, playerColors[1], "Polygon Party", "90")),
                        scene.add(new game.text(scores[2], renderer.leftOfScreen + padding, renderer.bottomOfScreen - padding - scorePadding, playerColors[2], "Polygon Party", "90")),
                          scene.add(new game.text(scores[3], renderer.rightOfScreen - padding, renderer.bottomOfScreen - padding - scorePadding, playerColors[3], "Polygon Party", "90"))];
      var maxScore = scores[0], iMaxScore = 0;
      for (let i = 1; i < 4; i++) {
        if (scores[i] > maxScore) {
          iMaxScore = i;
          maxScore = scores[i];
        }
      }
      
      scene.add(new game.text("Player " + (iMaxScore + 1) + " wins!", 0, -100, "#000", "Polygon Party", "90"));
      
      scene.add(new game.text("Thanks for playing the demo!", 0, 0, "#000", "Polygon Party", "90"));
      this.finished = true;
      //TODO: maybe end the minigame
    } else {
      currentObject = new RotatingObject(getRandomImage(), -1, 0, 0, 400, 400, rotate());
    }
  }
}

class Rotate extends Minigame {
  constructor(game) {
    super('rotate', [new game.rectangle( 0, 0, 200, 200, "#F00" )]);
//     this.scene.push(new game.image(document.getElementById('tag_0'), renderer.leftOfScreen + 150, renderer.topOfScreen + 50, 300, 100));
//     this.scene.push(new game.image(document.getElementById('tag_1'), renderer.rightOfScreen - 150, renderer.topOfScreen + 50, 300, 100));
//     this.scene.push(new game.image(document.getElementById('tag_2'), renderer.leftOfScreen + 150, renderer.bottomOfScreen - 50, 300, 100));
//     this.scene.push(new game.image(document.getElementById('tag_3'), renderer.rightOfScreen - 150, renderer.bottomOfScreen - 50, 300, 100));
//     currentObject = new RotatingObject(getRandomImage(), -1, 0, 0, 400, 400, rotate());
    this.angles = [null, null, null, null];
    console.log("Constructer finished: " + this.finished);
  }
  
  init() {
    scene.add(new game.image(document.getElementById('tag_0'), renderer.leftOfScreen + 150, renderer.topOfScreen + 50, 300, 100));
    scene.add(new game.image(document.getElementById('tag_1'), renderer.rightOfScreen - 150, renderer.topOfScreen + 50, 300, 100));
    scene.add(new game.image(document.getElementById('tag_2'), renderer.leftOfScreen + 150, renderer.bottomOfScreen - 50, 300, 100));
    scene.add(new game.image(document.getElementById('tag_3'), renderer.rightOfScreen - 150, renderer.bottomOfScreen - 50, 300, 100));
    currentObject = new RotatingObject(getRandomImage(), -1, 0, 0, 400, 400, rotate());
  }
  
  update(input) {
    
    
    for (var i = 0; i < 4; i++) {
      if (input[i] !== null) {
        
        
//         if (this.angles[i] == null) {
          this.angles[i] = -input[i][1];
//         } else {
//           if (this.angles[i] - input[i][2] > 90) {
//             while(input[i][2] < this.angles[i]) {
//               input[i][2];
//             }
//           } else if (this.angles[i] - input[i][2] < 90) {
            
//           }
//         }
        if (currentObject !== undefined) {
          currentObject.children[i].rotate(this.angles[i] * Math.PI/180); //TODO: get angle according to input for each player
        }
      } else {
        //currentObject.children[i].rotate(Math.random() * 2 * Math.PI);
        
      }
    }
  }
  
  end() {
    scene.objects = [];
    console.log("empty scene");
  }
}

function rotate() { /*TODO: rewrite this method in one of the classes*/
  
  while(true) {
    var newPos = Math.random() * 2*Math.PI;
    if (currentObject === undefined){
      if (newPos < Math.PI/2 || newPos > Math.PI*3/2){ // REMOVE THIS LINE
        return newPos;
      }
    }
    else if (Math.abs(currentObject.image.rotation - newPos) > minChange){
      if (newPos < Math.PI/2 || newPos > Math.PI*3/2){ //REMOVE THIS LINE
        return newPos;
      }
    }
  }
}
