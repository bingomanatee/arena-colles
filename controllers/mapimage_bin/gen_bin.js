var mm = require(MVC_MODELS);

var Gate = require('util/gate');

module.exports = function(context) {
    var req_params = context.req_params(true);
    var map_id = req_params.map_id;

    mm.model('mapimage', function(err, mi_model) {
        mm.model('mapimage_tile', function(err, mit_model) {
            mi_model.for_map(map_id, function(err, images) {

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

                    if (images.length){
                        image = images.pop();
                        console.log('rendering image ', image._id, ', ', images.length, ' remaining');
                        mit_model.image_to_tiles(image, _after_image_tiled);
                    } else {
                        // THE END!
                        clearInterval(procInterval);
                        context.flash('Tiles Generated', 'info', '/mapimage_tiles/' + map_id);
                    }

                }

                var procInterval = setInterval(_check_proc_image, 5000);

            });

        });
    });

}