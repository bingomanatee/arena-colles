var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var color_map_image = require('mola2/color_map_image');
var fs = require('fs');
var import = require('mola2/import');

module.exports = function(id, callback) {
    var self = this;

    this.get(id, function(err, tile) {
        if (!tile) throw new Error('cannot find id ' + id);
        if (err) console.log('err: ', err);

        var bin_path = tile.bin_path[0];
        console.log('drawing bin', bin_path);

        var data_image = {image_file: bin_path.filename, rows: bin_path.scale, cols: bin_path.scale};
        import(data_image, function(err, heights) {
            console.log('heights:');
          //  _echo_heights(heights);
            var canvas = new Canvas(bin_path.scale, bin_path.scale);
            var ctx = canvas.getContext('2d');
            var ctx_image = ctx.createImageData(canvas.width, canvas.height);
            console.log('coloring image');

            var base = 0;
            for (var i = 0; i < bin_path.scale; ++i) {
                for (j = 0; j < bin_path.scale; ++j) {
                    var height = heights[i][j];
                    var rgb = color_map_image(height);
                 //   console.log('image point: r', i, ', c', j, ': ', rgb);
                    ctx_image.data[base    ] = rgb[0];
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

    });

}

function _echo_heights(heights){
    for(var r = 0; r < 20; ++r){
        console.log.apply(console, heights[r].slice(0, 20));
    }
}