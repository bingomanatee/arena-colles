var fs = require('fs');
var path = require('path');
var x_pat = /_x_([\d]+)\.bin$/;
var util = require('util');
var _ = require('underscore');
var Pipe = require('support/pipe');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var do_drippage = require('support/drippage2');

/**
 * Note - mtn is actually a rating of "Valleyness.
 * @param config
 * @param callback
 */
module.exports = function (config, callback) {
    var cl;
    var bl;
    var cl2;
    var bl2;

    var avg_slopes = [];

    var data_file_root = path.join(__dirname, './../../resources/mapimages_lg');
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

            console.log('@@@@@@@@@@@@ dripping %s/ %s', data_file_root, name);
            var file_path = util.format("%s/%s", data_file_root, name);
            var write_path = file_path.replace('.bin', '.drippage.bin');

            path.exists(write_path, function (exists) {

                if (exists) {
                    console.log("..... ALREADY DID DRIPPAGE %s", file_path);
                    return on_act_done();
                }

                path.exists(file_path, function (exists) {
                    if (!exists) {
                        console.log("..... cannot find %s", file_path);
                        on_act_done();
                    } else {
                        do_drippage(file_path, x_pat.exec(name)[1], on_act_done);
                    }
                });
            })

        }

        var p = new Pipe(callback, _drippage, files);
    }) // end readdir;
}