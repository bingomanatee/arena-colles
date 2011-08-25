var mm = require(MVC_MODELS);
var pm = require('path');
var fs = require('fs');
var Pipe = require('util/pipe');
var bin = require('util/binary');
var util = require('util');
var Gate = require('util/gate');
var DBref = require('mongolian').DBRef;

//var Gate = require('util/gate');

function _stub() {
}

/* ************************ proc_int_row_slice ***************** */

function proc_int_row_slice(image_id, i_offset, data, mir_model, callback) {
    setTimeout(function() {
        var record = {
            _id: {
                image: image_id,
                row: i_offset
            },
            heights: data
        };
        mir_model.put(record, callback);
    }, 10);
}

/* ************************ import data ************************ */
/**
 * mapimage: update_tiles
 * updates all the tiles for  a single image id
 * @param image
 * @param scale
 * @param callback
 */

module.exports = function(image, scale, start_row, callback) {
    var self = this;
    start_row = parseInt(start_row);
    scale = parseInt(scale);
    console.log('start row: ', start_row);

    function _on_parse() {

        var start_time = new Date().getTime();

        mm.model('mapimage_row', function(err, mir_model) {

            var path = image.image_file,
                rows = image.rows,
                cols = image.cols,
                tile_i = start_row,
                tile_j = 0,
                i_offset = 0;

            console.log(__filename, ': input ', image._id);
//            if (start_row == 0) {
//                mir_model.delete({image: image._id, scale: scale});
//            }

            console.log(__filename, ': reading ', path, 'r', rows, 'c', cols);
            if (!pm.existsSync(path)) {
                throw new Error(__filename + ': cannot find ' + path);
            }

            var file_info = fs.statSync(path);
            console.log(file_info);

            var bytes_per_row = image.cols * 2;
            var read_config = {
                bufferSize: 64 * 1024,
                start: scale * start_row * bytes_per_row,
                end: file_info.size
            };
            console.log('bytes_per_row: ', bytes_per_row);
            console.log('estimated bytes', bytes_per_row * image.rows);
            console.log('size:', file_info.size);
            console.log('read config: ', read_config);

            var ints = [];
            var int_rows = [];

            var handle = fs.createReadStream(path, read_config);
            var read_size = 0;
            var last_percent = 0;
            var data_count = 0;
            var expected = (read_config.end - read_config.start) / 2;

            handle.on('data', function(data) {
                ++data_count;
                var new_data = bin.int_array(data);
                read_size += new_data.length;
                var percent = read_size * 100 / expected;

                ints = ints.concat(new_data);
                while (ints.length >= cols) {
                    int_rows.push(ints.slice(0, cols));
                    ints = ints.slice(cols);
                }
            });

            handle.on('end', function() {
                if (ints.length) {
                    int_rows.push(ints);
                }

                var processing = false;
                var write_interval = setInterval(function() {
                    if (processing) {
                        return;
                    }
                    processing = true;
                    if (int_rows.length) {
                        var int_row_slice = int_rows.slice(0, scale + 1);
                        int_rows = int_rows.slice(scale);
                        console.log('initializing ', tile_i);
                        proc_int_row_slice(image._id, tile_i, int_row_slice, mir_model, function() {
                            processing = false;
                            console.log('row saved');
                        });
                        ++tile_i;
                    } else {
                        clearInterval(write_interval);
                        callback();
                    }

                }, 100);


                console.log(__filename, 'done reading image ', image._id);
            })

        });
    }

    ;
    if (start_row == 0) {
        this.parse_image(image, _on_parse);
    } else {
        _on_parse();
    }
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