var util = require('util');
var fs = require('fs');

module.exports = {

    route: '/mars/data/:lat/:lon/:scale',

    execute: function(req_state, callback){
        var self = this;
        console.log('headers: ', util.inspect(req_state.req.headers));

        function _on_input(err, input) {
            console.log('getting map data lat %s, lon %s scale %s', input.lat, input.lon, input.scale);
            var root = self.framework.app_root;

            var resource_path = util.format('%s/resources/mapimages_lg/lat_%s_lon_%s_x_%s.bin', root, input.lat, input.lon, input.scale);

            var write_stream = fs.createWriteStream(resource_path);
            write_stream.on('close', callback);

            req_state.req.on('data', function(buffer){
                write_stream.write(buffer);
            });

            req_state.req.on('end', function(){
                write_stream.end();
            });

        }

        req_state.get_param('input', _on_input, function () {
            callback('cannot get input');
        });
    }


}