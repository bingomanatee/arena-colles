var mm = require(MVC_MODELS);

module.exports = function(sector, callback) {

    mm.model('map_tiles', function(err, mt_model) {

        var image_file = sector.image_file;

        function _on_find(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result[0]);
            }
        }

        mt_model.find({
            "data_file.image_file": image_file
        }).toArray(_on_find);

    });

}