var playerColors = ["rgb(0, 168, 243)", "rgb(224, 26, 24)", "rgb(41, 121, 25)", "rgb(255, 216, 0)"];
var scene, game, input, renderer, scores;
var testObject, testObject2;
var mainStatus;
var main;
var gamecode = 0;

window.onload = function() {
  
  game = new gameIO();
  renderer = new game.renderer();
  scene = new game.scene();

  var state;
  var States = Object.freeze({"MAIN_MENU": 0, "MINIGAME": 1, "RESULTS": 2});
  
  var mg;
  var Minigames = [ new Menu(game), new Bouncer(game), new Bouncer(game), new Bouncer(game), new FruitNinja(game), new Rotate(game) ];
  
  var socket;
  var initSent = false;
  
  scores = [ 0, 0, 0, 0 ];
  
  var playerImgs = [];
  for( var i = 0; i < 4; i++ ) {
    var img = new game.image( document.getElementById( "cursor_" + i ), 0, 0, 100, 100 );
    scene.add( img );
    playerImgs.push( img );
  }
  
  input = [ null, null, null, null ];
 game.addPacketType( "r", function( packet ) {
    input = packet.players;
    for( var i = 0; i < input.length; i++ ) {
      if( input[ i ] == null )
        continue;
      /*input[ 0 ] *= Math.PI / 180;
      input[ 1 ] *= Math.PI / 180;
      input[ 2 ] *= Math.PI / 180;*/
      /*var tempInput = [ 0, 0, 0 ];
      tempInput.x = Math.cos( input[ 0 ] ) * Math.cos( input[ 2 ] );
      */
    }
  } );

  function init() {
    state = States.MINIGAME;
    
    t = 0;
//     rect = new game.rectangle( 0, 0, 200, 200, "#F00" );
//     scene.add( rect );
//     main = new Menu(game);
    game.createSocket( "ws://helloworld-goaliesave2563793.codeanyapp.com:8080" );
    
    //test
//     startMinigame(3);//ROTATE
    //test
    
    // real
    startMinigame(0);
    mainStatus = true;
    // real
    
    
    //testObject = scene.add( new game.rectangle( 0, 0, 300, 600, "#000" ) );
//     testObject = scene.add(new game.rectangle(0, 0, 10, 10, "#F00"));
  }
  
  init();
  
  function update() {
    if( !initSent && game.ws.readyState == 1 ) {
      game.ws.send( msgpack.encode( [ { type : "start", deviceType : "mainClient" } ] ) );
      initSent = true;
    }
    switch(state) {
      case States.MAIN_MENU:
        if (mg != null) {
            mg.update(input);
        }
        if (mainStatus===false) {
            state = States.MINIGAME;
          scene.objects = [];
          gamecode++;
          startMinigame(gamecode);
        }
        // update main menu
        break;
      case States.MINIGAME:
        if (mg != null) {
          mg.update(input);
          if (mg.finished) {
            console.log("fished");
            scene.objects = [];
            gamecode = (gamecode + 1) % Minigames.length;
            if (gamecode ===0){
            mainStatus = true;
            state = States.MAIN_MENU;}
            startMinigame(gamecode);
          }
        }
        break;
      case States.RESULTS:
        
        break;
    }
    
    
//     rect.position.x = Math.sin( t ) * 200;
//     t += game.clientDetails.dt / 50;
    if( input != null ) {
       for( var i = 0; i < input.length; i++ ) {
        if( input[ i ] != null ) {
          playerImgs[ i ].rotation = input[ i ][ 2 ] * Math.PI / 180;
          var size = 10;
          playerImgs[ i ].position.x = -input[ i ][ 1 ] * size;
          playerImgs[ i ].position.y = -input[ i ][ 0 ] * size;
        }
      }
    }
    
    if (input[0] !== null) {
      /*var x = Math.cos(input[0][0] * Math.PI/180) * Math.cos(input[0][1] * Math.PI/180);
      var y = Math.sin(input[0][0] * Math.PI/180) * Math.cos(input[0][1] * Math.PI/180);
      var z = Math.sin(input[0][1] * Math.PI/180);*/
      /*var euler = new THREE.Euler();
      euler.set( THREE.Math.degToRad( input[0][0] ), THREE.Math.degToRad( input[0][1] ), -THREE.Math.degToRad( input[0][1] ), 'YXZ' );
      var y = euler.y;
      euler.reorder( "XYZ" );
      var x = euler.x;
      euler.reorder( "ZXY" );
      var z = euler.z;*/
      
      //console.log(input[0]);

      //testObject.rotation = -Math.atan2(y,z);
    }
    renderer.render( scene );
    requestFrame( update );
  }
  
  update();
  
  setInterval( function() {
    if( game.ws.readyState == 1 ) {
      game.ws.send( msgpack.encode( [ { type : "scores", scores : scores } ] ) );
    }
  }, 300 );
  
  function startMinigame(minigame) {
    console.log("start", minigame);
    state = States.MINIGAME;
    if (mg != null) {
      mg.end();
    }
    mg = Minigames[minigame];
    mg.init(scene);
  }
}