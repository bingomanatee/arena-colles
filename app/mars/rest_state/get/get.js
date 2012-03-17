var fs = require('fs');
var path = require('path');
var util = require('util');
var Gate = require('support/gate');

var _filename_regex = /lat_(.*)_lon_(.*)_x_4.bin/;

module.exports = {

    route:'/mars/state.json',

    method:'get',

    execute:function (req_state, cb) {
        var self = this;
        var root = req_state.framework.app_root + '/resources/mapimages_lg';

        function _on_dir(err, files) {
            if (err) {
                cb(err);
            } else {
                var out = _init_out();
                var gate = new Gate(function () {
                    cb(null, out);
                });

                files.forEach(function (filename) {
                        var m = _filename_regex.exec(filename);
                        if (m) {
                            function _on_stat(err, s) {
                                var lat = parseInt(m[1]);
                                var lon = parseInt(m[2]);
                                out[lat + 88][lon] = {lat: lat, lon: lon, stat: s};
                                gate.task_done();
                            }

                            gate.task_start();
                            fs.stat(root + '/' + filename, _on_stat);
                        }
                    }
                ); // end files.forEach

                gate.start();
            }
        }

        fs.readdir(root, _on_dir);

    }


}

function _init_out() {
    var out = [];

    _.range(-88, 88).forEach(function (lat) {
        out[lat + 88] = [];
        _.range(359).forEach(function (lon) {
            out[lat + 88].push(false);
        })
    });

    return out;
}