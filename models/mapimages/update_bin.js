var mm = require(MVC_MODELS);
var pm = require('path');
var fs = require('fs');
var Pipe = require('util/pipe');
var bin = require('util/binary');
var util = require('util');
var DBref = require('mongolian').DBRef;
var pm = require('path');

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

    console.log(__filename, ': parsing image', image._id, 'at scale', scale);

    function _on_parse() {

        var start_time = new Date().getTime();

        mm.model('mapimage_bin', function(err, mib_model) {

            console.log(__filename, ': input ', image._id);

            console.log(__filename, ': reading ', image.image_file, 'r', image.rows, 'c', image.cols);
            if (!pm.existsSync(image.image_file)) {
                throw new Error(__filename + ': cannot find ' + image.image_file);
            }

            var file_info = fs.statSync(image.image_file);
            console.log(file_info);

            var bytes_per_row = image.cols * 2;
            var row_buffers = [];
            var data_buffers = [];
            var read_config = {
                bufferSize: bytes_per_row //,
                // start: row * bytes_per_row,
                //    end: (row + 1) * bytes_per_row
            };

            var digesting = false;

            function _digest_data(){
                if (digesting) return;
                digesting = true;

                var row_buffer;
                var row_buffer_place = 0;
                var data_start = 0;

                while (data_start < data.length) {
                    if (!row_buffer) {
                        row_buffer = new Buffer(image.cols * 2);
                    }

                    var read_size = Math.min(data.length - data_start, row_buffer.length - row_buffer_place);
                    var data_end = data_start + read_size;
                    console.log('reading from data ', data_start, 'to', data_end, 'into place', row_buffer_place, 'of row buffer');
                    row_buffer.copy(data, row_buffer_place, data_start, data_end);
                    row_buffer_place += read_size;
                    data_start += read_size;

                    if (row_buffer_place >= row_buffer.length) {
                        row_buffers.push(row_buffer);
                        row_buffer_place = 0;
                        console.log(row_buffers.length, 'rows read');
                        delete row_buffer;
                    }
                }

            }


            var handle = fs.createReadStream(image.image_file, read_config);

            handle.on('data', function(data) {
                console.log('data cunk of size', data.length, 'read');
                data_buffers.push(data);
                _digest_data();
            });

            handle.on('end', function() {
                console.log(row_buffers.length, 'rows read');
                //  _read_row();
                _slice_rows();
            });

            var bin_chunks_read = 0;

            function _slice_rows() {
                for (var row = 0; row < image.rows; row += scale)
                    for (var col = 0; col < image.cols * 2; col += scale * 2) {

                        console.log('slicing row', row, ', col', col);

                        var bin_buffer = new Buffer(scale * scale * 2);
                        var bin_buffer_start = 0;
                        var chunk_size = scale * 2;

                        for (r2 = row; r2 <= row + scale; ++r2) {
                            for (c2 = col; c2 <= col + chunk_size; ++c2) {
                                bin_buffer.copy(row_buffer[r2], bin_buffer_start, c2, c2 + chunk_size);
                                bin_buffer_start += chunk_size;
                            }
                        }

                        var gridfs = mib_model.config.db.gridfs();
                        var stream = gridfs.create({
                            filename: image._id + '/' + scale + '/' + row + '/' + col,
                            image: image._id,
                            row: row,
                            col: col,
                            scale: scale
                        });

                        stream.write(bin_buffer);
                        stream.end();
                        ++ bin_chunks_read;
                        if (bin_chunks_read >= (img.rows * image.cols / (scale * scale))) {
                            callback();
                        }
                    }
            }

        });
    }

    this.parse_image(image, _on_parse);

}


function texp(mil) {
    mil /= 1000;
    mil = parseInt(mil);

    var mins = parseInt(mil / 60);
    var secs = mil % 60;

    if (mins) {
        return mins + ' mins, ' + secs + ' secs';
    } else {
        return secs + ' seconds';
    }
}

var last_rem_est = 0;
var last_percent = 0;

function _report_times(start_time, il_time, total_tiles, done_tiles) {
    var now = new Date().getTime();
    var tile_elapse = now - il_time;

    var fract_done = done_tiles / total_tiles;
    var time_per_tile = tile_elapse / done_tiles;

    var rem_tiles = total_tiles - done_tiles;
    var rem_time = rem_tiles * time_per_tile;

    console.log(' total time elapsed: ', texp(now - start_time), ' for <<<<', done_tiles, '>>>> of ', total_tiles, ' tiles');
    console.log('% done: ', parseInt(fract_done * 100), '% time remaining:', texp(rem_time));
    console.log('time per tile: ', parseInt(time_per_tile), 'mills, ', '----------------');
}