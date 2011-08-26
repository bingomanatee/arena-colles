var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');
/**
 * a script to update all
 * the tiles of all the images of a map
 */
module.exports.run = function() {
    var id = '4e57cd43a38325151a000003'; // current map

    console.log('Map ID: ', id);

    mm.model('mapimage', function(err, mi_model) {

        mi_model.for_map(id, function(err, images) {
            console.log('images to parse: ', images.length);
            var pipe = new Pipe(function() {
                console.log('parsed all images ... %%%%%%%%%%%%%%%%%%%%%%');
            }, _update_bin, images)

            function _update_bin(image, static, done, all_done) {
                if (image) {
                    mi_model.update_bin(image, 128, done);
                }
                else {
                    all_done();
                }
            }

            pipe.start();

        });

    });

}