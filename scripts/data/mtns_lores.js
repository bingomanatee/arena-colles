var fs = require('fs');
var path = require('path');
var x_pat = /lat_.*_lon_.*\.bin$/;
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
    var percent = 0;
    var l = 0;
    var c = 0;
    var t = new Date();
    fs.readdir(data_file_root, function (err, files) {

        console.log("found %s files in %s", files.length, data_file_root);
        l = files.length;

        function _read_mtns(name, params, on_act_done, on_pipe_done) {
            ++c;
            var pint = Math.floor(c * 1000/l);
            if (pint > percent){
                var new_t = new Date();
                var percent_time = new_t.getTime() - t.getTime();
                var minutes_per_percent =  percent_time / 60000;
                var mins_left = (1000 - pint) * minutes_per_percent;
                console.log('%s percent done; %s minutes left', pint, mins_left);
                t = new_t;
                percent = pint;
            }
            if (!name) {
                return on_pipe_done();
            }

            if (!x_pat.test(name)) {
                return on_act_done();
            }

           // console.log('@@@@@@@@@@@@ mtn_lores %s/ %s', data_file_root, name);
            var file_path = util.format("%s/%s", data_file_root, name);
            var write_path = util.format("%s/%s.mtns", map_root, name);

            path.exists(write_path, function (exists) {

                if (exists) {
             //       console.log("..... ALREADY DID mtns %s as %s", file_path, write_path);
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

        var p = new Pipe(callback, _read_mtns, files);
        p.start();
    }) // end readdir;
}

