var mm = require(MVC_MODELS);

module.exports = function(image, callback) {
    var self = this;

    function _on_mit(err, mit_model) {
        console.log(__filename, ': image_to_tiles for ', image._id);
        mit_model.image_to_tiles(image, callback);
    }

    mm.model('mapimage_tiles', _on_mit);
}
