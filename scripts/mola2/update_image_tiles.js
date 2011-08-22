var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');

/**
 * a script to update all
 * the tiles of all the images of a map
 */
module.exports.run = function() {
    var id = process.argv[3];
    var start_row = parseInt(process.argv[4]);

    console.log('Map ID: ', id);
    mm.model('mapimage', function(err, mi_model){

        mi_model.get(id, function(err, image) {
            function callback() {
                console.log('... ===== DONE ======= ');
            }

            mi_model.update_tiles(image, 128, start_row, callback);
        })

    })
}