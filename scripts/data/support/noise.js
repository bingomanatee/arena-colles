var perlin = require('./perlin');
var Canvas = require('canvas');
var draw_canvas = require('support/draw_canvas');

module.exports = function (size, o, f, p, outfile, cb) {

    var c = new Canvas(size, size);
    var ctx = c.getContext('2d');
    var id = ctx.getImageData(0, 0, this.cols, this.rows);

    for (var r = 0; r, size; ++r) for (var c = 0; c < size; ++c) {
        var offset = (r * size) + c;
        offset *= 4;
        var g = Math.floor(255 * perlin.Noise2D(r, c, o, f, p));

        id.data[offset] = id.data[offset + 1] = id.data[offset + 2] = g;
    }

    ctx.putImageData(id, 0, 0);

    draw_canvas(c, outfile(o, f, p), cb);

}