var Canvas = require('canvas');
var mm = require(MVC_MODELS);
var Image = Canvas.Image;
var fs = require('fs');
var canvas_to_image = require('util/canvas/to_image');

module.exports.run = function() {

    var scale = process.argv[3];

    var pix_per_degree = parseInt(128 / scale);

    var canvas = new Canvas(360 * pix_per_degree, 180 * pix_per_degree);
    console.log('making globe', canvas.width, 'x', canvas.height);
    var ctx = canvas.getContext('2d');

    mm.model('mapimage', function(err, mapimage_model) {

        var cursor = mapimage_model.find({"manifest.name" : "MEDIAN_TOPOGRAPHY"});

        function _on_next(err, mapimage) {
            if (!mapimage) {
                console.log('all done');
                canvas_to_image(canvas, MVC_PUBLIC + '/img/globe/normal_x_' + scale + '.png',
                    function() {
                        console.log('written');
                    });
                return;
            }
            console.log('placing image ' , mapimage.image_file);
            var image_path = mapimage_model.normal_path(mapimage, scale);

            var img = new Image();
            img.src= fs.readFileSync(image_path);

            var x = mapimage.west * pix_per_degree;
            var y = (180 - (90 + mapimage.north)) * pix_per_degree;

            ctx.drawImage(img, x, y);

            cursor.next(_on_next);
        }

        cursor.next(_on_next);

    });

}