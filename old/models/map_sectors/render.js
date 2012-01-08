var Canvas = require('canvas');
var fs = require('fs');
var path = require('path');


module.exports = function(sector, callback) {
    var dim = 200;
    var canvas = new Canvas(dim, dim),
        ctx = canvas.getContext('2d');

    _write_sector_to_canvas(sector, dim, ctx, min_color, max_color);


    function _write_buffer() {
        var file_path = root + '/' + sector._id + '.png';

        var out = fs.createWriteStream(file_path);
        var stream = canvas.createPNGStream();

        stream.on('data', function(chunk) {
            out.write(chunk);
        });

        stream.on('end', callback);
    }

    var root = MVC_PUBLIC + '/img/sectors/' + sector.map + '/';

    path.exists(root, function(exists) {
        if (exists) {
            _write_buffer();
        } else {
            fs.mkdir(root, 0775, _write_buffer);
        }
    });

}

function _write_sector_to_canvas(sector, dim, ctx, min, max) {
    var mins = [];
    var maxs = [];

    if (arguments.length < 4) {
        sector.height.forEach(function(heights) {
            console.log('analyzing ', heights);

            mins.push(Math.min.apply(Math, heights));
            maxs.push(Math.max.apply(Math, heights));

            console.log('maxs: ', maxs, '; mins: ', mins);
        });
        min = Math.min.apply(Math, mins);
        max = Math.max.apply(Math, maxs);
    }

    var range = max - min;

    console.log('min: ', min, '; max: ', max);

    var max_lon = sector.height.length;
    var max_lat = sector.height[0].length;
    var lon_x_ratio = dim / max_lon;
    var lat_y_ratio = dim / max_lat;

    for (var x = 0; x < max_lon; ++x) for (var y = 0; y < max_lat; ++y) {
        var grey = parseInt((sector.height[x][y] - min) * 255 / range);
        console.log('grey at ', x, ',', y, ': ', grey);
        grey = Math.max(0, Math.min(255, grey));
        color = _grey_color(grey);

        console.log('color set to ', color);

        ctx.fillStyle = color;
        ctx.fillRect(x * lon_x_ratio, y * lat_y_ratio, dim, dim);
    }
}

_colors = [];

function _grey_color(grey) {
    if (!colors[grey]) {
        var color = 'rgb(' + [parseInt(grey * 0.75), grey, parseInt(grey * 0.66)].join(',') + ')';
        _colors[grey] = color;
    }

    return _colors[grey];
}