var mongoose = require('../../../node_modules/mongoose');
var mongoose_model = require('../../../node_modules/nuby-express/lib/support/mongoose_model');
var mapimages_schema = require('./schema/mapimages_schema.js');
var path = require('path');
var util = require('util');
var _model;
var _ = require('underscore');

var mola_import = require('mola3/import');
var file_pattern = '%s/resources/mapimages/lat_%s_lon_%s.bin';
var root = path.resolve(__dirname, './../../../');

function _coords_range(coords) {
    // console.log('coords_range: %s', util.inspect(coords));
    var range = {min:0, max:0};
    if (_.isArray(coords.data)) {
        coords.data.forEach(function (data, i) {
            var min = Math.min.apply(Math, data);
            if (i == 0) {
                range.min = min;
                range.max = Math.max.apply(Math, data);
            } else {
                if (min < range.min) {
                    range.min = min
                } else {
                    var max = Math.max.apply(Math, data);
                    if (max > range.max) {
                        range.max = max;
                    }
                }
            }
        });
    }

    return range;
}


var config = {

    get_slice_data:function (lat_lon, callback) {
        var slice_path = util.format(file_pattern, root, lat_lon.lat, lat_lon.lon);

        function _on_exists(exists) {
            var out = {lat:lat_lon.lat, lon:lat_lon.lon, path:slice_path, exists:false, data:[], min:0, max:0};
            if (exists) {
                out.exists = true;

                function _on_slice_data(err, coords) {
                    out.data = coords;
                    _.extend(out, _coords_range(coords));
                    callback(null, out);
                }

                mola_import(slice_path, 128, _on_slice_data);
            } else {
                callback(null, out);

            }
        }

        path.exists(slice_path, _on_exists);
    },

    topo_data:function (callback, fields) {
        if (arguments.length < 2) {
            fields = ['image_file',
                'manifest.maximum_latitude',
                'manifest.minimum_latitude',
                'manifest.easternmost_longitude',
                'manifest.westernmost_longitude'];
        }

        this.find({"manifest.name":'MEDIAN_TOPOGRAPHY'}, fields).sort('manifest.name', 1, 'manifest.easternmost_longitude', 1, 'manifest.maximum_latitude', 1).run(callback);

    }

}

module.exports = function () {
    if (!_model) {
        var schema = new mongoose.Schema(mapimages_schema);
        var mapimage_model = mongoose.model('Mapimages', schema);
        _model = mongoose_model.create(mapimage_model, config);
    }

    return _model;
}