var perlin = require('./perlin');
var Canvas = require('canvas');
var draw_canvas = require('support/draw_canvas');

module.exports = function (size, o, f, p, outfile, cb) {

    var canvas = new Canvas(size, size);
    var ctx = canvas.getContext('2d');
    var id = ctx.getImageData(0, 0, size, size);

    for (var r = 0; r <  size; ++r) for (var c = 0; c < size; ++c) {
        var offset = (r * size) + c;
        offset *= 4;
        var n = perlin.Noise2D(c * f, r * f, o, f, p);
        var g = Math.floor(255 * n);
        console.log('r: %s, c: %s, n: %s, g: %s', r, c, n, g);
        id.data[offset] = id.data[offset + 1] = id.data[offset + 2] = g;
        id.data[offset + 3] = 255;
    }

    ctx.putImageData(id, 0, 0);

    draw_canvas(canvas, outfile(o, f, p), cb);

}