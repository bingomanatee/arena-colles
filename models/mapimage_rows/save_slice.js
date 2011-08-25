var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');
var DBref = require('mongolian').DBRef;
var Gate = require('util/gate');

module.exports = function(callback) {
    var self = this;

//  action(param_array_element, this.static_params, this._act_done_callback, this._pipe_done_callback);
    function _save_int_row_slice(ele, statics, act_done, pipe_done) {
        console.log(' ========  save_int_row_slice  ============');
        statics.mir_model.find({}).limit(1).toArray(function(err, rows) {
            if (err) {
                throw err;
            }
            if (!rows.length) {
                console.log('done with rows');
                return pipe_done();
            }
            var row = rows[0];
            console.log('next row:', row._id, '------------------');
            statics.mi_model.get(row._id.image, function(err, image) {

                console.log('image: ', image._id, image.image_file);

                var tile_j = 0;
                tiles = [];

                function _after_tiles() {
                    self.delete(row._id, act_done);
                }

                var query = {min_image_i: row._id.row * statics.scale,
                    image: image._id};
                var img_ref = new DBref("mapimage", image._id);
                j = 0

                var save_interval = false;

                function _do_tile_set() {
                    while ((tiles.length < 3) && (j < image.cols)) {
                        console.log('saving column', tile_j, '(', j, ')');

                        var lon_incs = image.cols / statics.scale;
                        var lat_incs = image.rows / statics.scale;
                        var w = parseInt(image.manifest.westernmost_longitude);
                        var e = parseInt(image.manifest.easternmost_longitude);
                        var lon_span = w - e;
                        var tile_lon_width = lon_span / lon_incs;
                        var n = parseInt(image.manifest.maximum_latitude);
                        var s = parseInt(image.manifest.minimum_latitude);
                        var lat_span = n - s;
                        var tile_lat_width = lat_span / lat_incs;
                        var tile_i = row._id.row;

                        var tile = {
                            img_ref: img_ref,
                            scale: statics.scale,
                            image: image._id,
                            tile_i: row.row,
                            tile_j: tile_j,
                            w: w - (tile_j * tile_lon_width),
                            e: w - ((1 + tile_j) * tile_lon_width),
                            n: n - (tile_i * tile_lat_width),
                            s: n - (tile_i * tile_lat_width),
                            heights: row.heights};
                        tiles.push(tile);
                        ++tile_j;
                        j += statics.scale;

                    }
                    console.log('done with tile loop');

					function _save_slice(){
						console.log('saving slice');
                        if (tiles.length > 0) {
                        	console.log('saving tile');
                            statics.mit_model.put(tiles.pop(), _save_slice);
                        } else  if (j >= image.cols) {
							console.log('done with row');
                            _after_tiles();
                    	} else {
                    		console.log('next cycle');
                  	  		_do_tile_set()
                    	}
					}

                   _save_slice();
                }

                function _start_tile_saving() {
                    process.nextTick(_do_tile_set);
                }

                console.log('deleting other tiles');
                statics.mit_model.remove(query, _start_tile_saving);
            })
        })
    }

    mm.model('mapimage', function(err, mi_model) {
        mm.model('mapimage_tile', function(err, mit_model) {
            var statics = {
                mir_model: self,
                mi_model: mi_model,
                mit_model: mit_model,
                scale: 128
            }

            //  console.log(statics);

            // function Pipe(callback, action, freq, param_array, static_params) {
            var pipe = new Pipe(callback, _save_int_row_slice, 1000, false, statics);
            pipe.start();
            console.log('pipe started');
        });
    });
}