var MOLA = require('mola');

var path = __dirname + '/sector_files/4e17cb22113cd08606000004/megc00n180hb.img';

module.exports.run = function(){
    var mola = new MOLA(path, 11520/2,  5632);
    mola.read(function(){
       mola.draw(__dirname + '/megc00n180hb.png');        
    });
}