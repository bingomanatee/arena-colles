var mm = require(MVC_MODELS);
var pm = require('path');
var fs = require('fs');
var Pipe = require('util/pipe');
var bin = require('util/binary');
//var Gate = require('util/gate');
/**
 * mapimage: update_tiles
 * updates all the tiles for  a single image id
 * @param image
 * @param scale
 * @param callback
 */

function _stub() {
}
/* ************************ save_int_row_slice ***************** */

function save_int_row_slice(image, i_offset, data, scale, mit_model) {
    for (var j = 0; j < image.cols; j += scale) {
        var heights = [];
        for (var i = 0; i < data.length; ++i) {
            heights[i] = data[i].slice(j, j + scale);
        }

        var query = {min_image_i: i_offset, min_image_j: j, image: image._id};
        mit_model.update({"$set": {heights: heights}}, null, query);
    }
}

/* ************************ import data ************************ */

module.exports = function(image, scale, callback) {

    mm.model('mapimage_tile', function(err, mit_model) {
        console.log(__filename, ': input ', image._id);

        var path = image.image_file,
            rows = image.rows,
            cols = image.cols,
            i_offset = 0;

        console.log(__filename, ': reading ', path, 'r', rows, 'c', cols);
        if (!pm.existsSync(path)) {
            throw new Error(__filename + ': cannot find ' + path);
        }

        var file_info = fs.statSync(path);
        console.log(file_info);

        var read_config = {
            bufferSize: 64 * 1024
        };

        var ints = [];
        var int_rows = [];

        var handle = fs.createReadStream(path, read_config);
        var read_size = 0;
        var last_percent = 0;
        var data_count = 0;
        var expected = rows * cols;

        handle.on('data', function(data) {
            ++data_count;
            var new_data = bin.int_array(data);
            ints = ints.concat(new_data);
            while (ints.length >= cols) {
                int_rows.push(ints.slice(0, cols));
                ints = ints.slice(cols);

                if (int_rows.length > scale) {

                    var int_row_slice = int_rows.slice(0, scale + 1);
                    int_rows = int_rows.slice(scale);

                    save_int_row_slice(image, i_offset, int_row_slice, scale, mit_model);
                    i_offset += scale;
                }
            }
            read_size += new_data.length;
            var percent = read_size * 100 / expected;
            if ((percent - last_percent) >= 10) {
                console.log(parseInt(percent), '% read ', read_size, ' of ', expected, ' ints');
                last_percent = percent;
            }
        });

        handle.on('end', function() {
            if (ints.length) {
                int_rows.push(ints);
            }
            save_int_row_slice(image, i_offset, int_rows, scale, mit_model);
            console.log(__filename, ' >>>>>>>>>>>>>>>>>>>>>>>>>> DONE! ');
            callback();
        })

    });
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