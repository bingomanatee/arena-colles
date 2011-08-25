var mm = require(MVC_MODELS);
/**
 * a script to update all
 * the tiles of all the images of a map
 */
module.exports.run = function() {
    var id = '4e454599f404e8d51c000001'; // current map

    function callback() {
        console.log('... ===== DONE ======= ');
    }

    console.log('Map ID: ', id);

    mm.model('mapimage_row', function(err, mir_model) {
        console.log('saving slices');
        mir_model.save_slice(callback);
    });
}