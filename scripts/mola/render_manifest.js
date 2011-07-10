var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');
var pm = require('path');
var Gate = require('util/gate');
var MOLA = require('mola');

module.exports.run = function() {
    var args = process.argv.slice(3);
    var path = args[0];
    if (!/^\//.test(path)) {
        path = MVC_ROOT + '/' + path;
    }
    if (!/manifest\.json$/.test(path)) {
        if (!/\/$/.test(path)) {
            path += '/';
        }

        path += 'manifest.json';
    }

    console.log('manifest: ', path);

    if (!pm.existsSync(path)) {
        throw new Error('No manifest at ' + path);
    }

    var manifest = JSON.parse(fs.readFileSync(path));

    var rendering = false;

    function _render_file(file, callback) {
        if (!(file.notes.name == 'MEDIAN_TOPOGRAPHY')) {
            console.log('skipping ', file.file_path, '; not a topo file');
        }

        rendering = true;
        console.log(file.image_file);

        var north = parseFloat(file.notes.maximum_latitude);
        var south = parseFloat(file.notes.minimum_latitude);
        var west = parseFloat(file.notes.westernmost_longitude);
        var east = parseFloat(file.notes.easternmost_longitude);

        var props = {
            rows: parseInt(file.notes.file_records),
            cols: parseInt(file.notes.record_bytes / 2),
            north: north,
            south: south,
            east: east,
            west: west
        };

        var mola = new MOLA(file.image_file, props);

        mola.read(function() {
            mola.draw(file.image_file + '.png', callback);
        }); // end read;
    }

    function _check_file_render() {
        if (rendering) {
            return;
        } else if (manifest.manifest.length) {
            console.log(' ============= NEW FILE RENDER ============ ');
            _render_file(manifest.manifest.pop(), function() {
                rendering = false;
            });
        } else {
            clearInterval(rf_handle);
            console.log(' ============ DONE ALL FILES =========== ');
        }
    }

    var rf_handle = setInterval(_check_file_render, 5000);

}