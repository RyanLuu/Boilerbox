var gameIO = require('gameio');
var express = require('express');
var compression = require('compression');

var game = new gameIO.game( { port : 8080 } );
game.timeStep = 1 / 30;

var mainClients = [];
var players = [ null, null, null, null ];
var audience = [];

var app = express();
app.use(compression());
app.use(express.static(__dirname + '/../client'));
app.get('/', function(req, res) {
});

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0");

game.wsopen = function() {
  //console.log( "Got something" );
}

game.wsclose = function( ws ) {
  for( var i = 0; i < mainClients.length; i++ ) {
    if( mainClients[ i ] == ws ) {
      mainClients.splice( i, 1 );
      return;
    }
  }
  for( var i = 0; i < players.length; i++ ) {
    if( players[ i ] != null && players[ i ].ws == ws ) {
      players[ i ] = null;
      return;
    }
  }
}

game.addPacketType( "start", function( packet, ws ) {
  if( packet.deviceType === undefined ) {
    return;
  }
  if( packet.deviceType == "mainClient" /*&& mainClient === undefined*/ ) {
    mainClients.push( ws );
  }
  if( packet.deviceType == "player" ) {
    var nullPlayers = 0;
    for( var i = 0; i < players.length; i++ ) {
      if( players[ i ] != null ) {
        if( players[ i ].ws == ws ) {
          ws.currentPackets.push( { t : "pCount", c : -1 } );
          return;
        }
      } else {
        nullPlayers++;
      }
    }
    if( nullPlayers == 4 ) {
      ws.currentPackets.push( { t : "pCount", c : -1 } );
    }
    for( var i = 0; i < players.length; i++ ) {
      if( players[ i ] == null ) {
        players[ i ] = { r : [ 0, 0, 0 ], ws : ws };
        ws.currentPackets.push( { t : "pCount", c : i } );
        return;
      }
    }
  }
  if( packet.deviceType == "audience" ) {
    audience.push( { ws : ws } );
  }
} );
game.addPacketType( "r", function( packet, ws ) {
  if( packet.r === undefined || packet.r.length != 3 ) {
    return;
  }
  for( var i = 0; i < players.length; i++ ) {
    if( players[ i ] != null && players[ i ].ws !== undefined && players[ i ].ws == ws ) {
      players[ i ].r = packet.r;
    }
  }
} );
game.addPacketType( "scores", function( packet, ws ) {
  console.log( packet.scores );
  if( packet.scores === undefined || packet.scores.length != 4 ) {
    return;
  }
  console.log( packet.scores );
  for( var i = 0; i < players.length; i++ ) {
    if( players[ i ] != null && players[ i ].ws !== undefined ) {
      players[ i ].ws.currentPackets.push( { t : "scores", scores : packet.scores } );
    }
  }
} );
game.mainLoop = function() {
  for( var i = 0; i < mainClients.length; i++ ) {
    var mainClient = mainClients[ i ];
    var ps = [];
    for( var a = 0; a < players.length; a++ ) {
      if( players[ a ] == null ) {
        ps.push( null );
      } else {
        ps.push( players[ a ].r );
      }
    }
    mainClient.currentPackets.push( { type : "r", players : ps } );
  }
}
setInterval( function() {
  for( var i = 0; i < players.length; i++ ) {
    if( players[ i ] != null )
      players[ i ].ws.currentPackets.push( { t : "pCount", c : i } );
  }
}, 1000)
game.start();