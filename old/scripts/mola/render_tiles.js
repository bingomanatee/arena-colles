var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');
var pm = require('path');
var Gate = require('util/gate');
var MOLA = require('mola');

var height_layer_1 = {
    path: function(mola, i, j) {
        return MVC_PUBLIC + '/img/maps/tiles/' + mola.file_root + '/' + i + '_' + j + '/h/1.png';
    },
    mode: 'height',
    offset: 0,
    scale: 1
};

var height_layer_4 = {
    path: function(mola, i, j) {
        return MVC_PUBLIC + '/img/maps/tiles/' + mola.file_root + '/' + i + '_' + j + '/h/4.png';
    },
    mode: 'height',
    offset: -200,
    scale: 4
};
var height_layer_16 = {
    path: function(mola, i, j) {
        return MVC_PUBLIC + '/img/maps/tiles/' + mola.file_root + '/' + i + '_' + j + '/h/16.png';
    },
    mode: 'height',
    offset: -1000,
    scale: 16
};

var sea_floor = {
    path: function(mola, i, j) {
        return MVC_PUBLIC + '/img/maps/tiles/' + mola.file_root + '/' + i + '_' + j + '/h/sea_2.png';
    },
    mode: 'height',
    offset: -512,
    scale: 2
};

var color_layer = {
    path: function(mola, i, j) {
        return MVC_PUBLIC + '/img/maps/tiles/' + mola.file_root + '/' + i + '_' + j + '/color.png';
    },
    mode: 'color'
};

var chop_layers = [height_layer_1, height_layer_16, sea_floor];


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
    
    manifest.manifest = _.select(manifest.manifest, function(file){
    //    console.log('file ', file.notes);
        console.log('name: ', file.notes.name);
        var p = /MEDIAN_TOPOGRAPHY/.test(file.notes.name);
        console.log('PASS: ', p);
        return p;
    });

    var rendering = false;

    function _render_file(file) {
        console.log('####### EXAMINING ######## ', file);

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
            west: west,
            chop_layers: chop_layers,
            file_root: file.root,
            pixels_per_row: 512,
            pixels_per_col: 512
        };

        mola = new MOLA(file.image_file, props);

        mola.chop();

    }

    function _check_file_render() {
        if (mola && mola.render_status){
            return;
        }
        delete mola;
        
        if (manifest.manifest.length) {
            console.log(' ============= NEW FILE RENDER ============ ');
            _render_file(manifest.manifest.pop(), function() {
                rendering = false;
                //  clearInterval(rf_handle) // do one only for now
            });
        } else {
            clearInterval(rf_handle);
            console.log(' ============ DONE ALL FILES =========== ');
        }
    }

    var rf_handle = setInterval(_check_file_render, 5000);

}

var mola = null;