var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var import = require('mola2/import');
var fs = require('fs');
var color_map_image = require('mola2/color_map_image');

/**
 * generate a color map of a large mapimage tile.
 *
 * @param image
 * @param callback
 */

module.exports = function(image, callback) {
    var self = this;

    if (!image) throw new Error('cannot find image ');
    console.log('image: rows ', image.rows, 'x', image.cols, ' cols');

    image.cols = parseInt(image.cols);
    image.rows = parseInt(image.rows);

    console.log('----- image----', JSON.stringify(image, null, 4));
    var canvas = new Canvas(image.cols, image.rows);

    var ctx = canvas.getContext('2d');

    ctx.fillMode = 'rgba(128, 255, 255, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    import(image, function(err, image_data) {
        if (err) {
            console.log('err: ', err);
            throw err;
        }

        if (image_data.length < image.rows) {
            throw new Error('mis match between image data rows ' + image_data.rows, ' and recorded rows ' + image.rows);
        }

        for (var row_block = 0; row_block < image.rows; row_block += 128) {
            console.log('row set ', row_block);
            var ctx_image = ctx.createImageData(canvas.width, 128);
            var base = 0;

            for (var i = 0; i < 128; ++i) for (var j = 0; j < image.cols; ++j) {
                var row_index = i + row_block;
                if (!image_data[row_index]) {
                    throw new Error(__filename + ': no row ' + row_index + ' of image data : ' + image_data.length);
                }
                var h = image_data[row_index][j];

                color_map_image(h, base, ctx_image);

                base += 4;
            }
            
            ctx.putImageData(ctx_image, 0, row_block);

        }
        console.log('calculated color map for ', image._id);
        canvas.createPNGStream().pipe(fs.createWriteStream(MVC_PUBLIC + '/img/mapimage/' + image._id + '.png'));
        callback(null, canvas);

    });
}