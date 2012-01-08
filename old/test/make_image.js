var Canvas = require('canvas');
    var fs = require('fs')

module.exports.run = function(){
  var canvas = new Canvas(200,200)
  , ctx = canvas.getContext('2d');

ctx.font = '30px Impact';
ctx.rotate(.1);
ctx.fillText("Awesome!", 50, 100);

var te = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + te.width, 102);
ctx.stroke();

var buffer = canvas.toBuffer();
fs.writeFile(__dirname + '/out.png', buffer, function(err, out){
    console.log ('Written File');
})
}