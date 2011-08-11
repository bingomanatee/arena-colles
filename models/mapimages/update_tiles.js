var fs = require('fs');
var mm = require(MVC_MODELS);

/**
 * note - row spans are 1 + scale - so they are in increments of 65, 129, 257...
 *
 * @param id
 * @param min - the minimum row of the tile (in image_i)
 * @param max - the maximum row of the tile (in image_i)
 */

module.exports = function(id, min, max, callback) {
    id = this._as_oid(id);
    var self = this;

    function _update_tiles(image, int_rows, min, max) {
        mm.model("mapimage_tiles", function(err, mit_model) {
            var query = {
                image: id,
                min_image_i: {"$gte": min},
                max_image_i: {"$lte": max}
            };

            var cursor = mit_model.find(query);

            function _on_tile(err, tile) {
                var first_row = tile.min_image_i - min;
                var last_row = tile.max_image_i - min;

                if (isNaN(first_row) || isNaN(last_row)) {
                    console.log(__filename, ': error creating first , last rows for tile ', tile);
                } else {
                    var heights = [];
                    for (var row = first_row; row <= last_row; ++row) {
                        var height_row = int_rows[row].slice(tile.min_image_j, tile.max_image_j + 1);
                        heights.push(height_row);
                    }
                    tile.heights = heights;
                    mit_model.put(tile); //@TODO: gate?
                }
            }

            cursor.forEach(_on_tile, callback);
        });
    }

    this.get(id, function(err, image) {
        var ints = [];
        var int_rows = [];
        var stream = fs.createReadStream(image.image_file);
        var raw_data = '';

        stream.on('data', function(data) {
            raw_data += data;
            ints = bin.int_array(raw_data);
            while (ints.length > image.cols) {
                var row = ints.slice(0, cols);
                int_rows.push(row);
                ints = ints.slice(cols);
            }
        });

        stream.on('end', function() {
            _update_tiles(image, int_rows, min, max);
        });
    })
}
