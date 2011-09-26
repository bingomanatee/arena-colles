var mm = require(MVC_MODELS);
var fsu = require('util/fs');
var fs = require('fs');
var Pipe = require('util/pipe');
var pm = require('path');

module.exports.run = function() {

    var divs = parseInt(process.argv[3]);
    var zoom = parseInt(process.argv[4]);

    console.log(__filename, 'divs:', divs, 'zoom:', zoom);

    var configs = [];

    for (var lat = -90; lat < 90; lat += divs) {
        for (var lon = 0; lon < 360; lon += divs) {
            var data = {
                south: lat, north: lat + divs, east: lon + divs, west: lon,  zoom: zoom
            };
            console.log('data: ', data);
            configs.push(data);

        }
    }

    console.log('processing ', configs.length, 'configurations');

    mm.model('mapimage', function(err, mi_model) {
        var statics = {mi_model: mi_model};
        var pipe = new Pipe(function() {
            console.log(' ======= FINISHED ');
        }, _make_segment, configs, statics);
        pipe.start();
    });

}

function _neg(value) {
    value = parseInt(value);
    if (value < 0) {
        return Math.abs(value) + 'n';
    }
    return new String(value);
}

function _make_segment(config, static, seg_done, finish) {
    if (!config) {
        console.log(' ........ all done ........ ')
        return finish();
    }

    var dir = MVC_PUBLIC + '/img/mapimage_segments/'
        + _.filter([config.north, config.south,
        config.east, config.west, config.zoom], _neg).join('/');
    var file = dir + '/normal_map.png';

    if (pm.existsSync(file)) {
        console.log('file exists:', file);
        return seg_done();
    }
    console.log(__filename, ': making segment ', config);

    static.mi_model.normal_map_segment(config, function(err, canvas) {
        // console.log('streaming PNG data from ', canvas);

        var stream = canvas.createPNGStream();

        fsu.ensure_dir(dir);
        var stream = canvas.createPNGStream();
        var istream = fs.createWriteStream(file);
        console.log('writing ', file, ', based on', config);
        stream.pipe(istream);
        stream.on('end', seg_done);
    })
}