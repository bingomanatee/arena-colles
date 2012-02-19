var fs = require('fs');
var path = require('path');
var util = require('util');

module.exports = {

    route: '/mars/data/:lat/:lon/smoothed.bin',


    load_req_params:'input',

    method: 'get',

    execute: function(req_state, cb){
        var self = this;
        req_state.get_param('input', function(input){

            var filepath = util.format('%s/resources/mapimages/lg/lat_%s_lon_%s_x_4.smooth.bin',
            self.framework.app_root, input.lat, input.lon);
            var stream = fs.createReadStream(filepath);
            req_state.res.pipe(stream);
            stream.end();
        }, function(){
            req_state.flash('cannot find input', 'error', 'home');
        })

    }


}