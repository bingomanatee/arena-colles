var MOLA = require('mola');
var Pipe = require('util/pipe');

module.exports.run = function() {
    var tile_data_plugin = require('mola/tile_data')
    tile_data_plugin.load(function() {

        var args = process.argv.slice(3);
        var map_id = args[1];
        var manifest = require('mola/manifest')(args[0]);

        function action(pipe, file, std_callback) {
     //   console.log(__filename, ': _save_tile_data( PIPE, FILE: ', file, ',  CALLBACK:   ', std_callback, ')');
        
            if (!file) {
                return pipe.finish();
            }
            var props = _mola_props(map_id, file);

       //     console.log('&&&&&&&&& MANIFEST FILE &&&&&&&&&&&&&& ', "\n", file);
       //     console.log('&&&&&&&&& MANIFEST PROPS &&&&&&&&&&&&&& ', "\n", props);
            mola = new MOLA(file.image_file, props);

            mola.save_tile_data(function(){ delete mola; std_callback()});
        }

        var pipe = new Pipe(function(){ console.log('DONE WITH TILE DATA'); }, action, manifest.manifest, 500);
        pipe.start();

    }); // end load
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