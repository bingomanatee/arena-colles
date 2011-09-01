var mm = require(MVC_MODELS);
var fsu = require('util/fs');
var fs = require('fs');

module.exports = function(context) {
    var req_params = context.req_params(true);
    console.log('req-params', req_params);
    var id = req_params.id;
    console.log('making color map for tile ', id);
    var self = this;

    this.model.get(id, function(err, image) {
        self.model.color_map_segment(req_params, function(err, canvas) {
            console.log('streaming PNG data from ', canvas);

            var stream = canvas.createPNGStream();
            stream.pipe(context.response);

            /*
             var dir = MVC_PUBLIC + '/img/mapimage/' + id;
             fsu.ensure_dir(dir);
             var stream = canvas.createPNGStream();
             var istream = fs.createWriteStream(dir + '/color_map.png');
             stream.pipe(istream);
             stream.on('end', function() {
             var stream = canvas.createPNGStream();
             stream.pipe(context.response);
             });
             */
        })

    })

}