var mm = require(MVC_MODELS);
var fs = require('fs');

module.exports = function(context) {
    var params = context.req_params(true);
    var tid = params.tile_id;

    console.log('getting tile icon ' + tid);

    mm.model('map_tiles', function(err, mt_model) {
        mt_model.icon_data(tid, function(err, icon_data) {
            console.log(__filename, ': icon_data = ', icon_data);
            var out = '';
            var writestream = fs.createWriteStream(MVC_PUBLIC + '/img/tile_icon/' + tid + '.png');
            icon_data.on('data', function(d) {
                 writestream.write(d);
                context.response.write(d);
            });
            
            icon_data.on('end', function() {
                writestream.end();
                context.response.end();
            });
        });
    });
}