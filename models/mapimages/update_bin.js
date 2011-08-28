var mm = require(MVC_MODELS);
var pm = require('path');
var fs = require('fs');
var Pipe = require('util/pipe');
var bin = require('util/binary');
var util = require('util');
var DBref = require('mongolian').DBRef;
var pm = require('path');
var util = require('util');
var texp = require('util/texp');
var neobuffer = require('neobuffer');
var import = require('mola2/import');
/**
 * Mapimage.update_bin
 *
 * does gridfs shuffling of binary data from image binaries.
 */


/* ************************ import data ************************ */
/**
 * mapimage: update_tiles
 * updates all the tiles for  a single image id
 * @param image
 * @param scale
 * @param callback
 */

module.exports = function(image, scale, callback) {
    var self = this;
    scale = parseInt(scale);
    var self = this;

    console.log('==================== UPDATE BIN ', image._id,
        image.image_file, ' =================');

    mm.model('mapimage_bin', function(err, mib_model) {

        var start_time = new Date().getTime();

        console.log('removing old bin records');

        mib_model.remove({image: image._id}, function(err) {
            if (err) {
                console.log('remove error:', err);
            }

            console.log(__filename, ': parsing image', image._id, 'at scale', scale);

            self.parse_image(image, function(err, image) {
                console.log('image parsed; reading image');
                _on_parse(image, scale, callback, mib_model, start_time)
            });

        });
    });

}

function _on_parse(image, scale, callback, mib_model, start_time) {
    console.log('_on_parse:', image._id, ',', image.rows, 'x', image.cols);
    var bytes_per_row = image.cols * 2;
    var current_bin_position = 0;
    var row_buffers = [new Buffer(scale * 2)];

    console.log(__filename, ': reading ', image._id, '-', image.image_file, 'r', image.rows, 'c', image.cols);
    if (!pm.existsSync(image.image_file)) {
        throw new Error(__filename + ': cannot find ' + image.image_file);
    }

    var file_info = fs.statSync(image.image_file);
    console.log(file_info);

    var read_config = {
        bufferSize: bytes_per_row //,
        // start: row * bytes_per_row,
        //    end: (row + 1) * bytes_per_row
    };

    import(image, function(err, heights) {
        _save_row_bins(heights, image, scale, mib_model, callback, start_time);
    });

    var bin_chunks_read = 0;
}


function _get_heights(heights, r, c, image, scale) {
    out = [];
    var last_row = (r + 1) * scale;
    for (var i = r * scale; i < last_row; ++i) {
        var j_start = c * scale;
        var j_end = (c + 1) * scale;
        var slice = heights[i].slice(j_start, j_end);
       // console.log('concatenating slice length ', slice.length);
        out = out.concat(slice);
    }

  //  util.log(['_get_heights: ', r,'x,',c, ':', out.length].join(' '));
    return out;
}

function _save_row_bins(heights, image, scale, mib_model, callback, start_time) {
    var buf_rows = parseInt(image.rows / scale);
    var buf_cols = parseInt(image.cols / scale);
    console.log('buffer rows: ', buf_rows, 'x', buf_cols);

    var data_items = [];
    for (var r = 0; r < buf_rows; ++r) {
        for (var c = 0; c < buf_cols; ++c) {
            var h = _get_heights(heights, r, c, image, scale);
            var hbuf = new neobuffer.Buffer(h.length * 2);
            h.forEach(function(v, vi){hbuf.writeInt16(v, vi * 2, 'big')});
            var b = new Buffer(hbuf.length);
            hbuf.copy(b);
            data_items.push({heights: b, r: r, c: c});
        }
    }

    var pipe = new Pipe(callback, _save_bin, data_items, {image: image, scale: scale, start_time: start_time, mib_model: mib_model});

    console.log('image bins saving: ', texp(new Date().getTime() - start_time));

    pipe.start();
}

function _save_bin(data_item, statics, after, done) {
    if (!data_item) {
        console.log('saved all images for ', statics.image._id, ': time = ', texp(statics.start_time, true));
        return done();
    }

    statics.mib_model.save_bin(statics.image, data_item.r, data_item.c, statics.scale, data_item.heights, after);
}