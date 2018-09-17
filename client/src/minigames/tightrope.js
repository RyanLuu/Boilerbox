var FALL_THRESHOLD = 100;

class Tightrope extends Minigame {
  
  
  constructor() {
    super('tightrope', [new game.rectangle( 0, 0, 200, 200, "#F00" )]);
    this.tilts = [0, 0, 0, 0];
    this.times = [-1, -1, -1, -1];
    this.plWidth = 20;
    this.plHeight = 20;
    this.positions = [
      {
        x: -720,
        y: 540 - this.plHeight/2
      },
      {
        x: -240,
        y: 540 - this.plHeight/2
      },
      {
        x: 240,
        y: 540 - this.plHeight/2
      },
      {
        x: 720,
        y: 540 - this.plHeight/2
      }];
    // need 4 different images for players
    // id "pl<1-4>"
    
    // add player images to scene
    this.images = [
      document.getElementById("pl1"),
      document.getElementById("pl2"),
      document.getElementById("pl3"),
      document.getElementById("pl4")
    ];
    
    this.plObj =[ new game.image(this.images[0], 
               this.positions[0].x, this.positions[0].y, 
               this.plWidth/2, this.plHeight/2, 1),
                 
                 new game.image(this.images[1], 
               this.positions[1].x, this.positions[1].y, 
               this.plWidth/2, this.plHeight/2, 1),
                 
                 new game.image(this.images[2], 
               this.positions[2].x, this.positions[2].y, 
               this.plWidth/2, this.plHeight/2, 1),
                 
                  new game.image(this.images[3], 
               this.positions[3].x, this.positions[3].y, 
               this.plWidth/2, this.plHeight/2, 1),
    ];
    scene.add(this.plObj[0]);
    scene.add(this.plObj[1]);
    scene.add(this.plObj[2]);
    scene.add(this.plObj[3]);
  }
  
  update(input) {
    // [[152,743,133],[],[],[]]
    for (var i = 0; i < input.length; i++) {
      if (input[i] != null) {
        this.tilts[i] += input[i][1/* ? */];
      }
      if (Math.abs(this.tilts[i]) > FALL_THRESHOLD) {
        this.times[i] = Date.now();
        scene.remove(this.plObj[i]);
      }
    }
  }
}