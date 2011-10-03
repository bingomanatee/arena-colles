var mm = require(MVC_MODELS);
var scale_image = require('mola2/scale_image');
module.exports.run = function() {
    var scale = process.argv[3];

    mm.model('mapimage', function(err, mapimage_model) {

        var cursor = mapimage_model.find({"manifest.name" : "MEDIAN_TOPOGRAPHY"});

        function _on_next(err, mapimage) {
            if (!mapimage) {
                console.log('all done');
                return;
            }

            var image_path = mapimage_model.image_path(mapimage, scale);

            scale_image(image_path, scale, target_path, function() {
                console.log('shrunk', image_path, 'to', target_path);
                cursor.next(_on_next);
            })
        }

        cursor.next(_on_next);

    });
}