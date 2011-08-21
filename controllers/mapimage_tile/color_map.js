var mm = require(MVC_MODELS);
var fsu = require('util/fs');
var fs = require('fs');

module.exports = function(context) {
    var req_params = context.req_params(true);
    var id = req_params.id;
    console.log('making color map for tile ', id);
    var self = this;

    this.model.color_map(id, function(err, canvas){
       var stream = canvas.createPNGStream();
        stream.pipe(context.response);
        var dir = MVC_PUBLIC + '/img/maptile/' + id;
        fsu.ensure_dir(dir);
        var istream = fs.createWriteStream(dir +'/color_map.png');
        stream.pipe(istream);
        istream.end();
    })
    
}