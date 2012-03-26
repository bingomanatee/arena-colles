var fs = require('fs');
var path = require('path');
var util = require('util');
var Gate = require('support/gate');

var _filename_regex = /lat_(.*)_lon_(.*)_x_4.bin/;
var _filename2_regex = /lat_(.*)_lon_(.*)_x_4.bin.d1.png/;

module.exports = {

    route:'/mars/state/:short.json',

    method:'get',

    load_req_params:'input',


    execute:function (req_state, cb) {
        function _on_input(err, input) {
            var out = _init_out(input.short);

            var self = this;
            if (input.short == 2) {
                var root = req_state.framework.app_root + '/resources/heightmaps';

                function _on_dir(err, files) {
                    if (err) {
                        cb(err);
                    } else {
                        console.log('getting state: short = %s,%s', util.inspect(err), util.inspect(input));
                        var gate = new Gate(function () {
                            cb(null, out);
                        });

                        files.forEach(function (filename) {

                                var m = _filename2_regex.exec(filename);
                                if (m) {
                                    var lat = parseInt(m[1]);
                                    var lon = parseInt(m[2]);

                                    out[lat + 88][lon] = 1;
                                }
                            }
                        ); // end files.forEach

                        gate.start();
                    }
                }

                var root = req_state.framework.app_root + '/resources/mapimages_lg';

                function _on_dir(err, files) {
                    if (err) {
                        cb(err);
                    } else {
                        console.log('getting state: short = %s,%s', util.inspect(err), util.inspect(input));
                        var gate = new Gate(function () {
                            cb(null, out);
                        });

                        files.forEach(function (filename) {

                                var m = _filename_regex.exec(filename);
                                if (m) {
                                    var lat = parseInt(m[1]);
                                    var lon = parseInt(m[2]);

                                    if (input.short) {
                                        out[lat + 88][lon] += 1
                                    } else {
                                        function _on_stat(err, s) {
                                            if (s) {
                                                out[lat + 88][lon].stat = s;
                                            }
                                            gate.task_done();
                                        }

                                        gate.task_start();
                                        fs.stat(root + '/' + filename, _on_stat);
                                    }
                                }
                            }
                        ); // end files.forEach

                        gate.start();
                    }
                }


                fs.readdir(root, _on_dir);

            }

            var self = this;
            req_state.get_param('input', _on_input);
        }


    }

function _init_out(s) {
    var out = [];

    _.range(-88, 88).forEach(function (lat) {
        out[lat + 88] = [];
        _.range(359).forEach(function (lon) {
            out[lat + 88].push(s ? 0 : {lat:lat, lon:lon, stat:false});
        })
    });

    return out;
}