var cursorImages = ["cursor_0", "cursor_1", "cursor_2", "cursor_3"];
class Menu extends Minigame{
  constructor() {
    super('rotate', [new game.rectangle( 0, 0, 200, 200, "#F00" )]);
    this.imageSize = 400;
    this.startTime = Date.now();
    this.hoverToStart = new game.image(document.getElementById("bomb"), 0, 0, 400, 400);
    this.frequency = 0;
    this.gameChoice = 0;
    this.cursor = [];
    
    

//     scene.add(new game.image(document.getElementById("bomb"), 0, -300, 400, 100));
//     this.scoreText = [scene.add(new game.text(points[0], renderer.leftOfScreen + padding, renderer.topOfScreen + padding + scorePadding, playerColors[0], "Polygon Party", "90")),
//                     scene.add(new game.text(points[1], renderer.rightOfScreen - padding, renderer.topOfScreen + padding + scorePadding, playerColors[1], "Polygon Party", "90")),
//                     scene.add(new game.text(points[2], renderer.leftOfScreen + padding, renderer.bottomOfScreen - padding - scorePadding, playerColors[2], "Polygon Party", "90")),
//                     scene.add(new game.text(points[3], renderer.rightOfScreen - padding, renderer.bottomOfScreen - padding - scorePadding, playerColors[3], "Polygon Party", "90"))];
//     this.tags = [scene.add(new game.image(document.getElementById('tag_0'), renderer.leftOfScreen + 150, renderer.topOfScreen + 50, 300, 100)),
//                 scene.add(new game.image(document.getElementById('tag_1'), renderer.rightOfScreen - 150, renderer.topOfScreen + 50, 300, 100)),
//                 scene.add(new game.image(document.getElementById('tag_2'), renderer.leftOfScreen + 150, renderer.bottomOfScreen - 50, 300, 100)),
//                 scene.add(new game.image(document.getElementById('tag_3'), renderer.rightOfScreen - 150, renderer.bottomOfScreen - 50, 300, 100))];
//     scene.add(new game.text("Made with love in 24 hours\nby Ryan Luu, Mathew Matakovic, Jonathan Moore, Ben Morris, Isaac Tan\nfor Purdue's Hello World 2018", 0, 500));

  }
  
  init() {
    scene.add(this.hoverToStart);
    for (let i = 0; i < cursorImages.length; i++) {
      var c = new game.image(document.getElementById(cursorImages[i]), -720 + 480 * i, 0, cursorW, cursorH);
      this.cursor.push(c);
      scene.add(c);
    }
    this.tags = [scene.add(new game.image(document.getElementById('tag_0'), renderer.leftOfScreen + 150, renderer.topOfScreen + 50, 300, 100)),
                scene.add(new game.image(document.getElementById('tag_1'), renderer.rightOfScreen - 150, renderer.topOfScreen + 50, 300, 100)),
                scene.add(new game.image(document.getElementById('tag_2'), renderer.leftOfScreen + 150, renderer.bottomOfScreen - 50, 300, 100)),
                scene.add(new game.image(document.getElementById('tag_3'), renderer.rightOfScreen - 150, renderer.bottomOfScreen - 50, 300, 100))];
    scene.add(new game.text("Made with love in 24 hours for Purdue's Hello World 2018", 0, 360, "#000", "Polygon Party", 30));
    scene.add(new game.text("by Ryan Luu, Mathew Matakovic, Jonathan Moore, Ben Morris, Isaac Tan", 0, 420, "#000", "Polygon Party", 30));
    scene.add(new game.image(document.getElementById("title"), 0, -350, 984, 239));
    this.progressText = scene.add(new game.text("0", 0, 0, "#FFF", "Polygon Party", 90));

  }
  
  update(input) {
    //TODO: add cursor support, make a list of them
    for (let i = 0; i < this.cursor.length; i++) {
      if (input[i] !== null) {

        var yAngle = input[i][1];
        var xAngle = input[i][0];
        this.cursor[i].position.x = (yAngle<180?-(yAngle/30*960):(360-yAngle)/30*960); // something relates to input tbd
        this.cursor[i].position.y = -xAngle/30*540; // ^^
        scene.add(new game.particle(this.cursor[i].position.x, this.cursor[i].position.y+cursorH/2, Math.random() * 20 + 10, playerColors[i], ( Math.floor( Math.random() * 2 ) - 0.5 ) * 0.2, 2, 0, 0, 0.5, 2))
      }
    this.frequency = 0;
    for (let i = 0; i < this.cursor.length; i++) {
      if (this.checkCollision(this.cursor[i], this.hoverToStart)) {
        this.frequency += 1;
        
      }
    }
      
    this.progressText.text = this.frequency;
    
    if (this.frequency == 4) {
      this.end();
      this.finished = true;
      mainStatus = false;
    }
  }
    
  }
  
  checkCollision(cursor, circle) {
    return (cursor.position.x - circle.position.x)*(cursor.position.x - circle.position.x)  + (cursor.position.y - circle.position.y)*(cursor.position.y - circle.position.y) < (circle.width/2) *(circle.width/2);
  }
  
  end() {
    /*
    switch (this.frequencies.indexOf(this.frequencies.sort()[3])) {//most picked element
      case 0:
        this.gameChoice = 0;
        break;
      case 1:
        this.gameChoice = 1;
        break;
      case 2:
        this.gameChoice = 2;
        break;
    }*/
    //TODO: remove reference to menu object
  }
}