var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');
var path_module = require('path');
var Gate = require('util/Gate');

module.exports.run = function() {
    var note_path_root = __dirname + '/sector_files/';

    mm.model('map_sectors', function(err, ms_model) {
        var manifest = fs.readFileSync(__dirname + '/manifest.json');
        manifest = JSON.parse(manifest);
        var map_id = ms_model._as_oid(manifest.map);

        function _parse_next() {
            ms_model.find({
                map: map_id,
                parsed: false
            }).limit(1).toArray(function(err, sectors) {
                if (sectors.length) {
                    var sector = sectors.pop();

                    gate = new Gate(_parse_next);

                    ms_model.parse_rows(sector, gate.task_done_callback(true))

                    gate.start();

                } else {
                    console.log('parsed ALL sectors!');
                }
            }) // end parse
        };
        _parse_next();
    }); // and model
}