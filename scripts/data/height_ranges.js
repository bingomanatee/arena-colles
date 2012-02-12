var import_data = require('mola3/import');
var fs = require('fs');
var path = require('path');
var Pipe = require('support/pipe');

module.exports = function (config, callback) {

    var mapimages = path.join(__dirname, './../../resources/mapimages');

    function _scan_data(file, static, act_done, pipe_done) {
        if (!file) {
            return pipe_done();
        }

        if (/lat_.*_lon_.*\.bin/.test(file)) {
            var p = mapimages + '/' + file;

            function _on_data(err, grid) {
                console.log('file: %s, max: %s, min: %s', file, grid.max(), grid.min());
                act_done();
            }

            import_data(p, 129, _on_data);
        } else {
            return act_done();
        }
    }

    function _on_mi(err, files) {
        var pipe = new Pipe(callback, _scan_data, files);
        pipe.start();
    }

    fs.readdir(mapimages, _on_mi);

}