var util = require('util');
var fs = require('fs');

module.exports = {

    route:'/mars/data/:lat/:lon/lg/:scale.bin',

    load_req_params:'input',

    execute:function (req_state, callback) {
        var self = this;
        console.log('======================== post lg bin data =====================');
      //  console.log(util.inspect(req_state));
        function _on_input(err, input) {
            console.log('uploading map data lat %s, lon %s scale %s', input.lat, input.lon, input.scale);
            var root = self.framework.app_root;
            var l = 0;

            var resource_path = util.format('%s/resources/mapimages_lg/lat_%s_lon_%s_x_%s.bin', root, input.lat, input.lon, input.scale);

            var write_stream = fs.createWriteStream(resource_path);
            write_stream.on('close', function(){
                console.log('written %s bytes!!!!', l);
                callback(null, {lat: input.lat, lon: input.lon, scale: input.scale, exists: true});
            });

            req_state.req.on('data', function (buffer) {
                write_stream.write(buffer);
                l += buffer.length;
            });

            req_state.req.on('end', function () {
                write_stream.end();
            });
        }

        req_state.get_param('input', _on_input, function(){
            callback('no input');
        });

    }


}