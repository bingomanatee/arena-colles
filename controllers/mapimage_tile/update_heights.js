var mm = require(MVC_MODELS);
var pm = require('path');
var fs = require('fs');

var Gate = require('util/gate');

module.exports = function(context) {
    var req_params = context.req_params(true);
    var tile_id = req_params.id;
    var start_time = new Date();
    var self = this;
    mm.model('mapimage', function(err, mi_model) {

        var image_url = '/img/mapimage_tiles/' + tile_id + '/color_map.png';
        if (pm.existsSync(MVC_PUBLIC + image_url)) {
            fs.unlinkSync(MVC_PUBLIC + image_url);
        }

        self.model.get(tile_id, function(err, tile) {

            mi_model.get(tile.image, function(err, image) {
                console.log('image_loaded', image._id);

                mi_model.import_image_data(image, function(err, image_data) {
                    self.model.update_tile(tile_id, function() {
                            var end_time = new Date().getTime() - start_time.getTime();
                            end_time /= 1000;
                            console.log('... ===== DONE ======= ');
                            context.flash('done updating image data', 'info', image_url);
                        },
                        image_data
                    );

                });
            })

        })
    });

}