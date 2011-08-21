var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var color_map_image = require('mola2/color_map_image');

module.exports = function(id, callback) {
    var self = this;

    this.get(id, function(err, tile) {
        if (!tile) throw new Error('cannot find id ' + id);
        if (err) console.log('err: ', err);
        var h = tile.heights;

        var canvas = new Canvas(tile.scale, tile.scale);
        var ctx = canvas.getContext('2d');
        var ctx_image = ctx.createImageData(canvas.width, canvas.height);
        console.log('coloring image');

        var base = 0;
        var max_i = Math.min(tile.heights.length - 1, 128);
        for (var i = 0; i <= max_i; ++i) {
            var max_j = Math.min(tile.heights[i].length - 1, 128);
            for (j = 0; j <= max_j; ++j) {
                if ((!(i % 16)) && (! (j % 16))) {
                    console.log('rendering image row ', i, 'x c ', j);
                }
                var height = tile.heights[i][j];
                var rgb = color_map_image(height);
                ctx_image.data[base] = rgb[0];
                ctx_image.data[base + 1] = rgb[1];
                ctx_image.data[base + 2] = rgb[2];
                ctx_image.data[base + 3] = 255;
                base += 4;
            }
        }
        ctx.putImageData(ctx_image, 0, 0);
        console.log('calculated color map for ', id);
        callback(null, canvas);
    });

}