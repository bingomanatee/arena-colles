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

    var handle = fs.createReadStream(image.image_file, read_config);

    handle.on('data', function(data) {
        //    console.log('data cunk of size', data.length, 'read');
        current_bin_position = _digest_data(data, row_buffers, current_bin_position);
    });

    handle.on('end', function() {
        console.log(row_buffers.length, 'rows read');
        _save_row_bins(row_buffers, image, scale, mib_model, callback, start_time);
    });

    var bin_chunks_read = 0;
}


function _digest_data(buffer, row_buffers, current_bin_position) {

    var data_start = 0;

    //console.log('reading a buffer that is', buffer.length, 'bytes long');
    //   console.log('========= start status ===========');
    //  console.log(row_buffers.length, 'bin, starting at position', current_bin_position);
    //   console.log('... buffer length:', buffer.length);
    var current_bin_row = row_buffers[row_buffers.length - 1];
    while (data_start < buffer.length) {

        var remaining_data_size = buffer.length - data_start;
        var remaining_row_room = current_bin_row.length - current_bin_position;

        //     console.log('remaining_data_size:', remaining_data_size);
        //     console.log('remaining_row_room:', remaining_row_room);

        var read_amount = Math.min(remaining_data_size, remaining_row_room);
        var data_end = data_start + read_amount;

        buffer.copy(current_bin_row, current_bin_position,
            data_start, data_end);

        //  console.log('... from', current_bin_position, 'to', current_bin_position + read_amount, '; reading from data', data_start, 'to', data_end);

        data_start = data_end;

        current_bin_position += read_amount;
        if (current_bin_position >= current_bin_row.length) {
            current_bin_row = new Buffer(current_bin_row.length);
            row_buffers.push(current_bin_row);
            current_bin_position = 0;
        }
    }
    //  console.log('done with buffer');

    return current_bin_position
}

function _save_row_bins(row_buffers, image, scale, mib_model, callback, start_time) {
    var buf_rows = parseInt(image.rows / scale);
    var buf_cols = parseInt(image.cols / scale);
    console.log('buffer rows: ', buf_rows, 'x', buf_cols);

    console.log('saving row_buffers to mongo');
    var buffer_columns = [];
    for (var c = 0; c < buf_cols; ++c) {
        buffer_columns[c] = [];
    }

    var c = 0;
    row_buffers.forEach(function(buffer, index) {
        buffer_columns[c].push(buffer);
        ++c;
        if (c >= buf_cols) {
            c = 0;
        }
    });

    var data_items = [];
    for (var r = 0; r < buf_rows; ++r) {
        for (var c = 0; c < buf_cols; ++c) {
            var column = buffer_columns[c];
            var b_columns = column.slice(c * scale, (c + 1) * scale);
            data_items.push({b_columns: b_columns, r: r, c: c});
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

    statics.mib_model.save_bin(statics.image, data_item.r, data_item.c, statics.scale, data_item.b_columns, after);
}