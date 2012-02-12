var _ = require('underscore');
var util = require('util');
var path = require('path');
var mongoose_util = require('./../../mongoose');
var mapimage_model_f = require('./../../app/mars/models/mapimages');
var mapimages_model;
var import_data = require('mola3/import');
var fs = require('fs');
var Pipe = require('support/pipe');

module.exports = function (config, callback) {
    mapimages_model = mapimage_model_f();
    mongoose_util.connect(null, _on_connect);
    var c = require('child_process').spawn;
    c('ulimit -n 1000');

    function _on_connect() {
        console.log('tile = %s', config.tile);
        if (config.tile == 'all') {

            function _do_tile_pipe(image, static, on_done, pipe_done) {
                if (!image){
                    console.log('no image');
                    return pipe_done();
                }
                console.log('loading image %s, tile %s', util.inspect(image), image.image_file);
                _do_tile(image.image_file, on_done);
            }

            function _on_images(err, images) {
                var pipe = new Pipe(function(){
                    callback();
                }, _do_tile_pipe, images);
                pipe.start();
            }

            mapimages_model.topo_data(_on_images);

        }

        else {
            _do_tile(config.tile, callback);
        }
    }
}

function _do_tile(tile, callback) {

    var file_path = (tile.substr(0, 1) == '/') ? tile : util.format('/Users/dave/Documents/Arena_Colles/resources/mola_128/%s', tile);

    if (!path.existsSync(file_path)) {
        callback(new Error(util.format('file %s not found', file_path)));
    } else {
        console.log("------------------- \n LOADING %s \n --------------", file_path);
        function _on_mi(err, mi) {
            if (err) {
                return callback(err);
            } else if (mi) {
                console.log('loaded data for %s', mi.image_file);
                // callback(null, util.format('found record %s', mi._id));
                var rows = mi.manifest.lines;
                var cols = mi.manifest.line_samples;

                _data_to_files(mi, callback);
            } else {
                callback(new Error('cannog find record for image file %s', file_path));
            }
        }

        mapimages_model.find_one({image_file:file_path}, _on_mi);
    }
}

function slice_n_write(mi, grid, lat, lon, sw_callback) {
    var row_index = mi.manifest.maximum_latitude - lat - 1;
    var col_index = lon - mi.manifest.westernmost_longitude;
    console.log('lat: %s, lon: %s, row_index: %s, col_index: %s',
        lat, lon, row_index, col_index);
    if ((row_index < 0) || (col_index < 0)) {
        console.log('###### ERROR slice_n_write');
        return sw_callback();
    }
    var r1 = row_index * 128;
    var c1 = col_index * 128;
    var r2 = (1 + row_index) * 128 + 1;
    var c2 = (1 + col_index) * 128 + 1;

    console.log('.... from (r %s, c %s) to (r %s,c %s) out of [%s, %s]',
        r1, c1, r2, c2, grid.rows, grid.cols);
    var slice = grid.slice(r1, c1, r2, c2);
    console.log('... slice rows: %s, cols: %s', slice.rows, slice.cols)
    echo_grid(slice, 2, 2)

    var data_filename = path.join(__dirname, './../../resources/mapimages',
        util.format('lat_%s_lon_%s.bin', lat, lon));
    console.log('slice rows: %s, cols: %s', slice.rows, slice.cols);
    slice.write_to(data_filename, sw_callback);

}

function _data_to_files(mi, callback) {

    function _on_data(err, grid) {
        if (err) {
            return callback(err);
        }
        var lat_lon = {
            lat:mi.manifest.minimum_latitude,
            lon:mi.manifest.westernmost_longitude
        }

        function _on_done() {
            console.log('********************* _on_done: lat_lon = %s', util.inspect(lat_lon));
            _next_slice_and_write(lat_lon);
        }

        function _next_slice_and_write(lat_lon) {
            console.log('advancing next slice from %s, %s', lat_lon.lat, lat_lon.lon);
            if (lat_lon.lon < mi.manifest.easternmost_longitude - 1) {
                ++lat_lon.lon;
                console.log('... next lon, %s', lat_lon.lon);
                slice_n_write(mi, grid, lat_lon.lat, lat_lon.lon, _on_done);
            } else {
                lat_lon.lon = mi.manifest.westernmost_longitude;
                if (lat_lon.lat < mi.manifest.maximum_latitude - 1) {
                    ++lat_lon.lat;
                    console.log('next lat: %s', lat_lon.lat);
                    slice_n_write(mi, grid, lat_lon.lat, lat_lon.lon, _on_done);
                }
                else {
                    console.log('done with slices, at (lon %s, lat %s)', lat_lon.lon, lat_lon.lat);
                    callback();
                }
            }
        }

        slice_n_write(mi, grid, lat_lon.lat, lat_lon.lon, _on_done);

    }

    import_data(mi.image_file, mi.manifest.line_samples, _on_data);
}

function echo_grid(grid, rows, cols) {

    for (var r = 0; r < rows; ++r) {
        var vals = [];
        for (var c = 0; c < cols; ++c) {
            vals.push(fixnum(grid.get_value(r, c), 8));
        }
        console.log(vals.join(','));
    }
}

function fixnum(n, c) {
    return (util.format('                %s', n)).slice(-1 * c);
}