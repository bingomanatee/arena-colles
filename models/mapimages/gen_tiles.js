var mm = require(MVC_MODELS);

/**
 * Mapimage model method to generate tiles
 * 
 * @param id
 * @param callback
 */
module.exports = function(id, callback) {
    var map_id = this._as_oid(id);
    var mi_model = this;
    mm.model('mapimage_tile', function(err, mit_model) {
        mit_model.drop(function() {
            mi_model.for_map(map_id, function(err, images) {

                console.log('found ', images.length, ' for map ', map_id);

                // the "work flag" - allows the queue controller to get the next record
                var proc_image = false;

                /**
                 * after image has been completely saved,
                 * allow the next image to be loaded.
                 */
                function _after_image_tiled() {
                    proc_image = false
                }

                /**
                 * Main work queue controller
                 */
                function _check_proc_image() {
                    if (proc_image) return;
                    proc_image = true;

                    if (images.length) {
                        image = images.pop();
                        console.log('rendering image ', image._id, ', ', images.length, ' remaining');
                        mit_model.image_to_tiles(image, _after_image_tiled);
                    } else {
                        // THE END!
                        clearInterval(procInterval);
                        callback();
                    }

                }

                var procInterval = setInterval(_check_proc_image, 5000);

            }); // for_map
        }); // get mi model
    }); // drop
}