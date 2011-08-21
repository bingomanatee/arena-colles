var mm = require(MVC_MODELS);
//var Pipe = require('util/pipe');
var Gate = require('util/gate');
/**
 * mapimage: update_tiles
 * updates all the tiles for  a single image id
 * @param image
 * @param scale
 * @param callback
 */
module.exports = function (image, scale, callback) {
    var self = this;
    var start_time = new Date().getTime();
    mm.model('mapimage_tile', function(err, mit_model) {

        function _import_data(err, image_data) {
            var tile_est = image.rows * image.cols / (scale * scale);
            var image_done_count = 0;
            var tile_cursor;
            var statics;
            //          var pipe_2;

            console.log('estimated ', tile_est, ', tiles');
/*
//            tile_cursor = mit_model.find({image: image._id}, {heights: 0});
            tile_cursor.count(function(err, c) {
                tile_est = c;
            });*/
            var image_load_time = new Date().getTime();

         //   var gate = new Gate(callback);
         //   var gcb = gate.task_done_callback(false);
            console.log('image rows: ', image.rows, 'image.cols:', image.cols);
            console.log('image_data.rows: ', image_data.length, 'image_data.cols', image_data[0].length);
            var i_limit = image.rows - scale;
            var j_limit = image.cols - scale;
            console.log('i_limit:', i_limit, 'j_limit:', j_limit);
            
            for (var i = 0; i < i_limit; i += scale)
                for (var j = 0; j < j_limit; j += scale) {
                  //  if (i > i_limit) continue;
                 //   if (j > j_limit) continue;
                    var heights = _chunk(image_data, i, i + scale, j, j + scale);
                    var query = {min_image_i: i, min_image_j: j, image: image._id};
                    var set_heights = {"$set": {heights: heights}};
                    mit_model.update(query, _stub, set_heights);
                  //  gate.task_start();
                    ++image_done_count;
                    if (!(image_done_count % 100)) {
                        _report_times(start_time, image_load_time, tile_est, image_done_count);
                    }
                }
            callback();
            /*
             //        statics = {tile_cursor: tile_cursor, mit_model: mit_model};
             //      var no_tile_count = 0;

             function _update_tile(param, static_params, a2_done, p2_done) {
             tile_cursor.next(function(err, tile) {
             if (!tile) {
             if (++ no_tile_count > 4) {
             console.log('no tile - done with image ', image._id);
             p2_done();
             }
             return;
             }
             // if (!(image_done_count % 10)) {
             //      console.log(__filename, 'updating tile ', tile._id);
             //   }
             //  mit_model.update_tile(tile, a2_done, image_data);

             var height_rows = [];

             for (var i = tile.min_image_i; i < tile.max_image_i; ++i) {
             if (i >= image_data.length) {
             throw new Error('attempting to read row ' + i + ', past image length ' + image_data.length);
             }
             var row = image_data[i];
             // console.log('row: ', row.length, '; ', tile.min_image_j, 'x', tile.max_image_j);
             height_rows.push(row.slice(tile.min_image_j, tile.max_image_j));
             }

             tile.heights = height_rows;
             mit_model.put(tile, a2_done);
             ++image_done_count;
             if (!(image_done_count % 100)) {
             _report_times(start_time, image_load_time, tile_est, image_done_count);
             }
             })
             }

             pipe_2 = new Pipe(callback, _update_tile, 200, false, statics);
             pipe_2.start();

             */
        }

        console.log(__filename, ': image: ', image);
        self.import_image_data(image, _import_data);

    });

}

function _stub(){}

function _chunk(image_data, i_start, i_end, j_start, j_end) {
    var height_rows = [];
    if (i_start >= image_data.length){
        throw new Error('out of range i_start: ' + i_start);
    }

    if (j_start >= image_data[0].length){
        throw new Error('out of range j_start: ' + j_start);

    }

    i_end = Math.min(i_end, image_data.length - 1);
    j_end = Math.min(j_end, image_data[0].length - 1);
  //  console.log('chunking i: ', i_start, i_end,'j: ', j_start, j_end);
    
    for (var i = i_start; i < i_end; ++i) {
        if (i >= image_data.length) {
            throw new Error('attempting to read row ' + i + ', past image length ' + image_data.length);
        }
        var row = image_data[i];
        // console.log('row: ', row.length, '; ', tile.min_image_j, 'x', tile.max_image_j);
        height_rows.push(row.slice(j_start, j_end));
    }

    return height_rows;
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