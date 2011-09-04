var mm = require(MVC_MODELS);
var fsu = require('util/fs');
var fs = require('fs');

module.exports = function(context) {
    var req_params = context.req_params(true);
    console.log('req-params', req_params);

    ['north','south','east','west'].forEach(function(p) {
        var value = req_params[p];
        if (/n/.test(value)) {
            value = parseInt(value.replace('n', ''));
            req_params[p] = -1 * value;
        } else {
            req_params[p] = parseInt(value);
        }
    });

    if (req_params['west'] < 0) {
        req_params.east += 360;
        req_params.west += 360;
    }



    var id = req_params.id;
    console.log('making color map for tile ', id);
    var self = this;
    self.model.color_map_segment(req_params, function(err, canvas) {
        console.log('streaming PNG data from ', canvas);

        var stream = canvas.createPNGStream();
        stream.pipe(context.response);

        var dir = MVC_PUBLIC + '/img/mapimage_segments/'
            + [req_params.north, req_params.soth,
            req_params.east, req_params.west, req_params.zoom].join('/');
        fsu.ensure_dir(dir);
        var stream = canvas.createPNGStream();
        var istream = fs.createWriteStream(dir + '/color_map.png');
        stream.pipe(istream);
        stream.on('end', function() {
            var stream = canvas.createPNGStream();
            stream.pipe(context.response);
        });
    })


}