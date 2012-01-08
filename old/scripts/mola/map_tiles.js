var MOLA = require('mola');
var Pipe = require('util/pipe');
var mm = require(MVC_MODELS);

module.exports.run = function() {

    var args = process.argv.slice(3);
    var map_id = args[1];
    mm.model('map_tiles', function(err, tiles_model) {

        var manifest = require('mola/manifest')(args[0]);

        manifest.manifest.forEach(function(file) {
            var tile = _mola_props(map_id, file);
            tiles_model.put(tile);
        });

    });

}

function _mola_props(map_id, file) {
    if (!file.notes) {
        throw new Error(__filename + ' - file has no notes');
    }
    var north = parseFloat(file.notes.maximum_latitude);
    var south = parseFloat(file.notes.minimum_latitude);
    var west = parseFloat(file.notes.westernmost_longitude);
    var east = parseFloat(file.notes.easternmost_longitude);

    var props = {
        rows: parseInt(file.notes.file_records),
        cols: parseInt(file.notes.record_bytes / 2),
        data_file: file,
        north: north,
        south: south,
        east: east,
        west: west,
        file_root: file.root,
        pixels_per_row: 512,
        pixels_per_col: 512,
        map_id: map_id
    };

    return props;
}