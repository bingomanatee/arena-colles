var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');

/**
 * a script to update all
 * the tiles of all the images of a map
 */
module.exports.run = function() {
    var id = process.argv[3];

    console.log('Map ID: ', id);

    mm.model('mapimage', function(err, mi_model) {
        mi_model.for_map(id, function(err, images) {
            function callback() {
                console.log('... ===== DONE ======= ');
            }

            function _update_tiles(image, static, act_done_callback, pipe_done_callback) {
                if (image) {
                    mi_model.update_tiles(image, 128, act_done_callback);
                } else {
                    pipe_done_callback();
                }

            }

            var pipe = new Pipe(callback, _update_tiles, 500, images, {});

            pipe.start();

        })
    });
}
