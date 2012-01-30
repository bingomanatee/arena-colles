var mongoose = require('../../../node_modules/mongoose');
var mongoose_model = require('../../../node_modules/nuby-express/lib/support/mongoose_model');
var mapimage_schema = require('./schema/mapimage_schema.js');

var _model;

/**
 * deprecated - source data, had numbers as string.
 */
module.exports = function () {
    if (!_model) {
        var schema = new mongoose.Schema(mapimage_schema, {collection: 'mapimage'});
        var mapimage_model = mongoose.model('Mapimage', schema);
        _model = mongoose_model.create(mapimage_model);
    }

    return _model;
}