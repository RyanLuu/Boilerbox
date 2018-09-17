requestFrame = function(callback) {
  (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function( callback ) {
      setTimeout(callback, 1000 / 60);
    }
  )(callback);
};



window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var margin = window.innerWidth / 10;
  var playerColors = ["rgb(0, 168, 243)", "rgb(255, 48, 56)", "rgb(14, 204, 64)", "rgb(255, 242, 0)"];
  ctx.font = "20px Pipe Dream"; //TODO: choose good font
  canvas.addEventListener("touchmove", touchmove);
  canvas.addEventListener("touchstart", touchstart);
  
  function touchmove(e) {
    
    e.preventDefault();
  }
  
  function touchstart(e) {
    ctx.fillStyle = "FFFFFF";
    ctx.fillRect(0, 0, 1000, 1000);
  }

  function main() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "#000000"
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = playerColors[playerNum];
    ctx.fillRect(0, 100, canvas.width, canvas.height - 200);
    var playerTitle = "Player " + (playerNum + 1);
    var playerTitleFontWidth = (canvas.width) / playerTitle.length;
    
    ctx.font = playerTitleFontWidth + "px Super Mario Bros";
    ctx.fillText(playerTitle, margin, margin * 2);
    ctx.fillText("Score: " + scores[playerNum], 0, canvas.height - margin);

    
    

    requestFrame(main);
  }

  main();
}