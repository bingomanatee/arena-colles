var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');
var path_module = require('path');
var Gate = require('util/Gate');

module.exports = function(map_id, callback) {
    var note_path_root = __dirname + '/sector_files/';

    mm.model('map_sectors', function(err, ms_model) {
        map_id = ms_model._as_oid(map_id);

        ms_model.find({
            map: map_id,
            parsed: false
        }, function(err, sectors) {
            if (sectors.length) {
                var sector = sectors.pop();

                gate = new Gate(callback);

                ms_model.parse_rows(sector, gate.task_done_callback(true))

                gate.start();

            } else {
                console.log('parsed ALL sectors!');
                callback();
            }
        }) // end find_and_delete
    }); // and model
}