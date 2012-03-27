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

            var gate = new Gate(function () {
                cb(null, out);
            });

            var out = _init_out(input.short);

            var self = this;

            var root = req_state.framework.app_root + '/resources/heightmaps';

            gate.task_start();
            function _on_dir(err, files) {
                if (err) {
                    cb(err);
                } else {
                    console.log('getting state: short = %s,%s', util.inspect(err), util.inspect(input));


                    files.forEach(function (filename) {

                            var m = _filename2_regex.exec(filename);
                            if (m) {
                                var lat = parseInt(m[1]);
                                var lon = parseInt(m[2]);

                                out[lat + 88][lon] += 1;
                            }
                        }
                    ); // end files.forEach

                    gate.task_done();
                }
            }

            fs.readdir(root, _on_dir);

             root = req_state.framework.app_root + '/resources/mapimages_lg';

            gate.task_start();
            function _on_dir2(err, files) {
                if (err) {
                    cb(err);
                } else {
                    console.log('getting state: short = %s,%s', util.inspect(err), util.inspect(input));

                    files.forEach(function (filename) {

                            var m = _filename_regex.exec(filename);
                            if (m) {
                                var lat = parseInt(m[1]);
                                var lon = parseInt(m[2]);

                                out[lat + 88][lon] += 1;
                                /* } else {
                                 function _on_stat(err, s) {
                                 if (s) {
                                 out[lat + 88][lon].stat = s;
                                 }
                                 gate.task_done();
                                 }

                                 fs.stat(root + '/' + filename, _on_stat);
                                 } */
                            }
                        }
                    ); // end files.forEach

                    gate.task_done();

                }

            }


            fs.readdir(root, _on_dir2);
            gate.start();


        }

        var self = this;
        req_state.get_param('input', _on_input);
    }
}

function _init_out(s) {
    var out = [];

    _.range(-88, 88).forEach(function (lat) {
        out[lat + 88] = [];
        _.range(0, 360).forEach(function (lon) {
            out[lat + 88].push(0);
        })
    });

    return out;
}