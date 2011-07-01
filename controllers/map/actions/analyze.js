var Canvas = require('canvas');
var fs = require('fs');
var path_module = require('path');
var colors = require('util/colors');

module.exports = function(context) {
    var id = context.request.params.id;
    id = this.model._as_oid(id);

    var self = this;

    function _with_map(err, map) {
        if (err) {
            throw (err);
        }

        console.log('reading map ', map);

        var map_path = MVC_PUBLIC + map.path;

        //console.log(__filename, ': getting map ', map_path);

        if (path_module.existsSync(map_path)) {
            var map_image = fs.readFileSync(map_path);
            console.log(__filename, ': map data = ', map_image);
            var img = new Canvas.Image();
            img.src = map_image;

            var bs = [];
            var hs = [];

            var canvas = new Canvas(img.width, img.height);
            ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, img.width, img.height);

            var image_data = ctx.getImageData(0, 0, img.width, img.height).data;
         //   console.log(__filename, ': image data = ', image_data);
            for (var i = 0, data_length = image_data.length - 3; i < data_length; i += 4) {
                // Index of the pixel in the array
                var idx = i * 4;

                // If you want to know the values of the pixel
                var r = image_data[idx + 0];
                var g = image_data[idx + 1];
                var b = image_data[idx + 2];
                var a = image_data[idx + 3];
                
                var hsv = colors.rgb_to_hsv(r, g, b);
                
                if (hs[hsv[0]]){
                    ++ hs[hsv[0]];
                } else {
                    hs[hsv[0]] = 1;
                }
                
             //   console.log('analyzing color: r = ', r, ', g = ', g, ', b = ', b);
                var brightness = r + g + b;
                if (bs[brightness]) {
                    bs[brightness]++;
                } else {
                    bs[brightness] = 1;
                }
            }
            context.render('map/analyze.html', {
                map: map,
                data: bs,
                hs: hs
            });
        } else {
            throw new Error('cannot get file ' + map_path);
        }
    }

    console.log('looking for map', id);

    this.model.get(id, _with_map);


}