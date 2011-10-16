var mm = require(MVC_MODELS);
var util = require('util');
var Pipe = require('util/pipe');

/**
 * a script to update all
 * the tiles of all the images of a map
 */
module.exports.run = function() {
    var id = process.argv[3];

    console.log('Mapimage ID: ', id);
    mm.model('mapimage', function(err, mi_model) {
        var cursor = mi_model.find({"manifest.name" : "MEDIAN_TOPOGRAPHY"});

        function pipe_done_callback() {
            console.log('... ===== ALL DONE ======= ');
        }

        function _tile_image(image, statics, act_done, pipe_done) {
            console.log(__filename, '_tile_image');
            if (!image) {
                console.log('_tile_image:no image');
                pipe_done();
                return;
            }
            console.log(__filename, 'updating tiles for ', image._id);
            try {
                statics.mi_model.update_tiles(image, act_done);
            } catch(e) {
                console.log('error on update_tiles:', util.inspect(e));
            }
        }

        cursor.toArray(function(err, images) {
            console.log(images.length, ' images found');
            var pipe = new Pipe(pipe_done_callback, _tile_image, images, {mi_model: mi_model});
            pipe.start();
            console.log('pipe started');
        })

    })
}