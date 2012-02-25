var canvas = require('canvas');
var fs = require('fs');

module.exports = function (canvas, c_path) {
    console.log('drawing canvas to %s', c_path);

    var stream = canvas.createPNGStream();
    var out = fs.createWriteStream(c_path);

    stream.on('data', function (c) {
        out.write(c);
    });

    stream.on('end', function () {
        out.close();
    })

}