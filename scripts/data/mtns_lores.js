var fs = require('fs');
var path = require('path');
var x_pat = /lat_.*_lon_.*_\.bin$/;
var util = require('util');
var _ = require('underscore');
var Pipe = require('support/pipe');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var do_mtns = require('./support/mtns_lores');

/**
 * Note - mtn is actually a rating of "Valleyness.
 * @param config
 * @param callback
 */
module.exports = function (config, callback) {

    var data_file_root = path.join(__dirname, './../../resources/mapimages');
    var map_root = path.join(__dirname, './../../resources/mtns');
    fs.readdir(data_file_root, function (err, files) {

        function _drippage(name, params, on_act_done, on_pipe_done) {
            var _oad = on_act_done;

            var start_time = new Date();
            on_act_done = function () {
                var t = new Date();
                console.log('done with _find_mtns: %s in %s seconds', name, (t.getTime() - start_time.getTime()) / 1000);
                _oad();
            }
            if (!name) {
                return on_pipe_done();
            }

            if (!x_pat.test(name)) {
                return on_act_done();
            }

            console.log('@@@@@@@@@@@@ mtn_lores %s/ %s', data_file_root, name);
            var file_path = util.format("%s/%s", data_file_root, name);
            var write_path = util.format("%s/%s.mtns", map_root, name);

            path.exists(write_path, function (exists) {

                if (exists) {
                    console.log("..... ALREADY DID mtns %s as %s", file_path, write_path);
                    return on_act_done();
                }

                path.exists(file_path, function (exists) {
                    if (!exists) {
                        console.log("..... cannot find %s", file_path);
                        on_act_done();
                    } else {
                        do_mtns(file_path, 1, write_path, on_act_done);
                    }
                });
            })

        }

        var p = new Pipe(callback, _drippage, files);
    }) // end readdir;
}

