var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var import = require('mola2/import');
var fs = require('fs');
var color_map_image = require('mola2/color_map_image');
var util = require('util');
var ccd = require('mola2/ccd');
var crop = require('mola2/crop');
/**
 * mapimage::normal_map
 * generate a color map of a large mapimage tile.
 *
 * @param image
 * @param callback
 */

module.exports = function(image, callback, config) {
    if (!image) throw new Error('cannot find image ');
    var self = this;

    var clip = ccd(image, config);
    if ((clip.cols < 1) || (clip.rows < 1)) {
        console.log(__filename, ': *********** no write space - returning false', clip.cols, clip.rows);
        return callback(null, false);
    }

    function _proc_image(err, image_data) {
        if (err) {
            console.log('err: ', err);
            throw err;
        }
        else if (!image_data) {
            console.log('no image data');
            return false;
        }
        image_data = crop(image_data, clip);

        var first_row = 0;
        var last_row = image_data.length;
        var first_col = 0;
        var last_col = image_data[0].length;

        var canvas = new Canvas(last_col, last_row);
        var ctx = canvas.getContext('2d');

        function _dump_image_data(row_block, last_block_row) {
            var ctx_image = ctx.createImageData(last_col, last_block_row - row_block);
            var base = 0;

            for (var i = row_block; i < last_block_row; i += 1) {
                for (var j = first_col; j < last_col; j += 1) {
                    var rgba = color_map_image(image_data, j, i, clip.zoom);
                   // console.log('rgba: ', rgba, 'base: ', base);
                    ctx_image.data[base] = rgba[0];
                    ctx_image.data[base + 1] = rgba[1];
                    ctx_image.data[base + 2] = rgba[2];
                    ctx_image.data[base + 3] = rgba[3];
                    base += 4;
                }
            }

            ctx.putImageData(ctx_image, 0, row_block);
        }

        /* to keep bandwidth down we do several 128 pixel tall swipes of the data

         */
        var per = 0;
        for (var row_block = first_row; row_block < last_row; row_block += 128) {
            var next_per = (100 * row_block / clip.rows);
            if ((next_per - per) > 10) {
                console.log(parseInt(next_per), '% DONE ');
                per = next_per;
            }
            var last_block_row = Math.min(row_block + 128, image_data.length - 1);

            _dump_image_data(row_block, last_block_row);

        }
        // console.log('calculated color map for ', image._id);
        var image_path = self.image_path(image, clip.zoom);
        canvas.createPNGStream().pipe(fs.createWriteStream(image_path));
        callback(null, canvas);

    }

    import(image, _proc_image, clip.zoom);

}

function degm(n, zoom) {
    var nd = zoom ? zoom * n : n
    return n + '(' + nd / 128 + ' deg)';
}