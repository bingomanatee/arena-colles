var Mola = require('mola');
var color_module = require('util/colors/scale');

module.exports.run = function() {
    
    var scale = [];
    
    scale.push(color_module.measure(-10000, 0,     0,   0)); 
    scale.push(color_module.measure(-5000,  0,     0,  60)); 
    scale.push(color_module.measure(-1000, 60,     0, 200)); 
    scale.push(color_module.measure(-100,   0,    80, 255)); 
    scale.push(color_module.measure(-10,    0,   125, 255)); 
    scale.push(color_module.measure(-1,    80,   200, 255)); 
    scale.push(color_module.measure(0,    255,   255, 200)); 
    scale.push(color_module.measure(100,  255,   200, 150)); 
    scale.push(color_module.measure(500,  255,   100,  60)); 
    scale.push(color_module.measure(1000, 200,    60,  30)); 
    scale.push(color_module.measure(2000, 180,    50,  30)); 
    scale.push(color_module.measure(4000,  60,    50, 120)); 
    scale.push(color_module.measure(5000, 100,    50, 150)); 
    scale.push(color_module.measure(10000, 255,  200, 100)); 
    scale.push(color_module.measure(20000, 255,  255, 255)); 

   var mola = new Mola(__dirname + '/megt90n000fb.img', 5760, 23040 / 2, scale);
  //  var mola = new Mola(__dirname + '/megt90n000cb.img', 1440, scale);

    mola.read(function() {
        console.log('read data ... ');
        mola.measure();

        mola.draw(__dirname + '/mola_map32.png', function() {
            console.log('drawn');
        })
    });

}