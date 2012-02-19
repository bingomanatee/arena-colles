var fs = require('fs');
var path = require('path');
var util = require('util');

module.exports = {

    route: '/mars/data/:lat/:lon/lg/:file.bin',


    load_req_params:'input',

    method: 'get',

    execute: function(req_state, cb){
        var self = this;
        req_state.get_param('input', function(err, input){
            console.log("getting smoothed data: %s', ", util.inspect(input));
            var filepath = util.format('%s/resources/mapimages_lg/lat_%s_lon_%s_x_4.%s.bin',
            self.framework.app_root, input.lat, input.lon, input.file);
            req_state.res.sendfile(filepath);
        }, function(){
            req_state.flash('cannot find input', 'error', 'home');
        })

    }


}