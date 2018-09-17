// ** finish one cursor game first

var fruitImages = ["watermelon", "red_apple", "mango"];
var bombImages = ["bomb"];
var flyingImages = [];
var cursorImages = ["machete", "broadsword", "karambit", "dagger"];
var width = 100;
var height = 100;
var radius = 50;
var gravity = 0.07;
var cursorW = 100;
var cursorH = 100;
var scoreText = [];
var timerText;
var timer = 15000;
// images are all 100 * 100

// thrown is obj thrown frome the side
class Thrown {
  constructor(images) {
    this.index = Math.floor(Math.random()*images.length);
    this.imageSrc = document.getElementById(images[this.index]); //need to use scene.add(new game.image(image, x, y, width, height);)
                                                                  // defined after define this.x and this.y
    this.choice = ["up", "down", "left", "right"];
    this.rand = Math.floor(Math.random()*4);
    this.side = "";
    
    // generalize randomized starting position and corresponding speed
    switch (this.choice[this.rand]) {
      case "up":
        this.x = Math.floor(Math.random()*1920 -960);
        this.y = -540+40;
        this.xSpeed = Math.random() - 0.5;
        this.ySpeed = Math.random();
        break;
      case "down":
        this.x = Math.floor(Math.random()*1920 - 960);
        this.y = 540-40;
        this.xSpeed = -this.x * 2 / 1920 + (Math.random() - 0.5);
        this.ySpeed = -2 * Math.random() - 8;
        break;
      case "left":
        this.x =-960;
        this.y = -Math.floor(Math.random()*1080/2);
        this.xSpeed = Math.random() + 4;
        this.ySpeed = -Math.random();
        break;
      case "right":
        this.x =960;
        this.y = -Math.floor(Math.random()*1080/2);
        this.xSpeed = -Math.random() - 4;
        this.ySpeed = -Math.random();
        break;
    }
    
    this.image = new game.image(this.imageSrc, this.x, this.y, width, height);
    if (images[this.index] == "watermelon") {
      this.image.size = 1.5;
    }
    scene.add(this.image);
  }
  
}


class Fruit extends Thrown {
  constructor(images) {
    super (images);
  }
  
}


class Bomb extends Thrown {
  constructor(images) {
    super(images);
  }
}

class FruitNinja extends Minigame {
  constructor() {
    scoreText = [];
    flyingImages = [];
    
    super("fruitninja", [new game.rectangle(0, 0, 200, 200, "#00f")]); // change to background image later
    
    this.obj = [];
    this.flyoff = [];
    this.timeFired = -1;
    this.cursor = [];
    this.cursorMoved = [-1, -1, -1, -1];
//     for (let i = 0; i < cursorImages.length; i++) {
//       var c = new game.image(document.getElementById(cursorImages[i]), -720 + 480 * i, 0, cursorW, cursorH);
//       this.cursor.push(c);
//       scene.add(c);
//     }
    
//     for (let i = 0; i < 4; i++) {
//       scoreText[i] = scene.add(new game.text(points[0], -720 + 480 * i, renderer.topOfScreen + 100, playerColors[i], "Polygon Party", "90"));
//       scoreText[i].text = 0;
//     }
  }
  
  init() {
    this.startTime = Date.now();
    for (let i = 0; i < cursorImages.length; i++) {
      var c = new game.image(document.getElementById(cursorImages[i]), -720 + 480 * i, 0, cursorW, cursorH);
      this.cursor.push(c);
      scene.add(c);
    }
    
    for (let i = 0; i < 4; i++) {
      scoreText[i] = scene.add(new game.text(scores[i], -720 + 480 * i, renderer.topOfScreen + 100, playerColors[i], "Polygon Party", "90"));
      scoreText[i].text = 0;
    }
    
    timerText = scene.add(new game.text("", 0, renderer.bottomOfScreen - 100, "#000", "Polygon Party", "90"));
  }
  
  update(input) {
    timerText.text = (timer / 1000) - Math.floor((Date.now() - this.startTime) / 1000);
    if(Date.now() - this.startTime > timer) {
      this.finished = true;
    }
    
    this.timeFired++; 
    
    for (let i = 0; i < this.cursor.length; i++) {
      if (input[i] !== null) {
        this.cursorMoved[i] = 0;
        var yAngle = input[i][1];
        var xAngle = input[i][0];
        this.cursor[i].position.x = (yAngle<180?-(yAngle/30*960):(360-yAngle)/30*960); // something relates to input tbd
        this.cursor[i].position.y = -xAngle/30*540; // ^^
        scene.add(new game.particle(this.cursor[i].position.x, this.cursor[i].position.y+cursorH/2, Math.random() * 20 + 10, playerColors[i], ( Math.floor( Math.random() * 2 ) - 0.5 ) * 0.2, 2, 0, 0, 0.5, 2))
      }
      
    }
    
    
    // generate new throwns
    if (this.timeFired%20===0) {
      var newThrownRand = Math.random();
      if (newThrownRand < 0.2) {
        var bomb = new Bomb(bombImages);
        this.obj.push(bomb);
      }
      else {
        var fruit = new Fruit(fruitImages);
        this.obj.push(fruit);
      }
    }
    
    // cut throwns sword is collided with
    // into two pieces
    // two pieces moves to opposite direction
    // remove the origin obj and add 2 flying obj to this.obj
    
    for (let i = this.obj.length - 1; i >= 0; i--) {
      // update later with all cursors
      for (let j = this.cursor.length - 1; j >= 0; j--) {
        var x = this.cursor[j].position.x;
        var y = this.cursor[j].position.y;
        
        var xObj = this.obj[i].image.position.x;
        var yObj = this.obj[i].image.position.y;
        if ((x - xObj)*(x - xObj) + (y - yObj)*(y - yObj)  < radius * radius && this.cursorMoved[j] === 0) {
          scene.remove(this.obj[i].image);
          if (this.obj[i] instanceof Bomb) {
            scores[j] -= 50;
            scoreText[j].text = scores[j];
          } else if (this.obj[i] instanceof Fruit) {
            scores[j] += 20;
            scoreText[j].text = scores[j];
          }
          this.obj.splice(i, 1);
          break;
        }
          
        
      }
    }
    
    // destroy pieces that fly off screen (-960, -540) to (960, 540)
    for (var i = 0; i < this.obj.length; i++) {
      if (Math.abs(this.obj[i].x) > 960 + width || Math.abs(this.obj[i].y) > 540 + height) {
        this.obj[i].destroy();
        this.obj.splice(i, 1);
      }
    }
    
    // update all this.obj with speed and gravity
    for (i = 0; i < this.obj.length; i++) {

      this.obj[i].image.position.x += this.obj[i].xSpeed;
      this.obj[i].image.position.y += this.obj[i].ySpeed;
      this.obj[i].ySpeed += gravity;
    }
    
    
    
    
  }
}
