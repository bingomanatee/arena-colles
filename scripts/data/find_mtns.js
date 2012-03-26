var fs = require('fs');
var path = require('path');
var x_pat = /_x_([\d]+)\.bin$/;
var util = require('util');
var _ = require('underscore');
var drip = require('./support/drip');
var Pipe = require('support/pipe');

_.str = require('underscore.string');
_.mixin(_.str.exports());

/**
 * Note - mtn is actually a rating of "Valleyness.
 * @param config
 * @param callback
 */
module.exports = function (config, callback) {

    var data_file_root = path.join(__dirname, './../../resources/mapimages_lg');
    fs.readdir(data_file_root, function (err, files) {
        files = _.filter(files, function(name){
            return name && x_pat.test(name);
        });

        files = _.shuffle(files);

        console.log('%s files', files.length);

        function _find_mtns(name, params, on_act_done, on_pipe_done) {

            if (!name) {
                console.log('no name! DDDOONE!');
                return on_pipe_done();
            }

            var file_path = util.format("%s/%s", data_file_root, name);

            console.log('@@@@@@@@@@@@ analyzing %s', file_path);

            var write_path = file_path + '.d1.png';
            write_path = write_path.replace('mapimages_lg', 'heightmaps');

            path.exists(write_path, function (exists) {

                if (exists) {
                    console.log("..... ALREADY DID MOUNTAIN %s", write_path);
                    on_act_done();
                } else {
                    console.log('first time: %s', write_path);
                    drip(file_path, 4, on_act_done);
                }

            })

        }

        var p = new Pipe(callback, _find_mtns, files);

        p.start();
    });

}
