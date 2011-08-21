var fs = require('fs');
var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');
var bin = require('util/binary');
var import = require('mola2/import');
/**
 *
 * this function loads height data into the mapimage_tiles.
 * note - row spans are 1 + scale - so they are in increments of 65, 129, 257...
 *
 * @param image_id - the id of the mapimage being processed
 * @param min - the minimum row of the tile (in image_i)
 * @param max - the maximum row of the tile (in image_i)
 */

//        this.action(params, this.static_params, this._act_done_callback(), this._pipe_done_callback());

function _import_image_data(image, static_params, act_done, pipe_done) {
    console.log('importing image ', image);

    import(image, function(err, image_data) {

        function _update_tile(param, sp2, a2_done, p2_done) {
            tile_cursor.next(function(err, tile) {
                if (!tile) {
                    console.log('no tile - done with image ', image._id);
                    return p2_done();
                }
                console.log('updating tile ', tile._id, tile.min_image_i, 'x', tile.min_image_j);

                var height_rows = image_data.slice(tile.min_image_i, tile.max_image_i);
                height_rows.forEach(function(row, i) {
                    height_rows[i] = row.slice(tile.min_image_j, tile.max_image_j);
                })

                tile.heights = height_rows;
                static_params.mit_model.put(tile, a2_done);

            })
        }

     //   console.log('data read from image file: ', image_data.length, 'rows', image.rows, 'expected');
        
        var tile_cursor = static_params.mit_model.find({image: image._id, heights: {"$exists": false}});

        //  tile_cursor.forEach(_update_tile, function(){ console.log('done with tiles'); act_done(); });

        var pipe_2 = new Pipe(act_done, _update_tile, 200, false);
        pipe_2.start();
    });

}

module.exports = function (map_id, scale, callback) {
    var self = this;

    mm.model("mapimage_tiles", function(err, mit_model) {
        self.for_map(map_id, function(err, images) {

            var params = {scale: scale, mit_model: mit_model};

            var pipe = new Pipe(callback, _import_image_data, 500, images, params);

            pipe.start();
        })
    })
}