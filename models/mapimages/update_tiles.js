var fs = require('fs');
var mm = require(MVC_MODELS);

/**
 *
 * this function loads height data into the mapimage_tiles.
 * note - row spans are 1 + scale - so they are in increments of 65, 129, 257...
 *
 * @param image_id - the id of the mapimage being processed
 * @param min - the minimum row of the tile (in image_i)
 * @param max - the maximum row of the tile (in image_i)
 */

module.exports = function (map_id, scale, callback) {
    var self = this;

    this.for_map(map_id, function(err, images) {
        images.forEach(function(image) {
            _update_tiles_for_image(image, scale, function() {
                console.log('done with image ', image._id)
            });
        });
    })

    callback();
}


function _update_tiles_for_image(image, scale, callback) {
    var self = this;
   //@TODO: destroy previous tiles

    mm.model("mapimage_tiles", function(err, mit_model) {
        var work_queue = [];
        for (var min = 0; min < image.rows; min += scale) {
            var max = Math.min(image.rows, (min + scale));
            console.log('loading chunk row ', min, ', to ', max, ' of image ', image._id, '(', image.rows, ' rows)');

            work_queue.push({image: image, min: min, max: max});
        }

        var working = false;

        function _check_queue() {
            if (working) {
                return;
            }
            working = true;

            function _update_tiles(int_rows, work_def) {
                function _on_tile(err, tile) {
                    var first_row = tile.min_image_i - work_def.min; // should be zero
                    var last_row = tile.max_image_i - work_def.min;

                    if (isNaN(first_row) || isNaN(last_row)) {
                        console.log(__filename, ': error creating first , last rows for tile ', tile);
                        throw new Error('error slicing tiles');
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

                function _done_with_tiles(){
                    working = false;
                }

                var query = {
                    image: id,
                    min_image_i: {"$gte": min},
                    max_image_i: {"$lte": max},
                    scale: scale
                };

                //@TODO: index by scale, image

                var cursor = mit_model.find(query);

                cursor.forEach(_on_tile, _done_with_tiles);
            }

            function _load_image_chunk(work_def) {
                var byte_start = work_def.min * image.cols * 2;
                var byte_end = (1 + work_def.max) * image.cols * 2;

                var ints = [];
                var int_rows = [];

                var stream = fs.createReadStream(image.image_file, {start: byte_start, end: byte_end});
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
                    if (ints.length){
                        int_rows.push(row); // ????
                    }
                    _update_tiles(int_rows, work_def);
                });
            }

            if (work_queue.length) {
                var work_def = work_queue.pop();
                _load_image_chunk(work_def);
            }
        }
    });

    // var wqi = setInterval(_check_queue, 1000);
}