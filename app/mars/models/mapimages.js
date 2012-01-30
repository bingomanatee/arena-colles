var mongoose = require('../../../node_modules/mongoose');
var mongoose_model = require('../../../node_modules/nuby-express/lib/support/mongoose_model');
var mapimages_schema = require('./schema/mapimages_schema.js');

var _model;

module.exports = function () {
    if (!_model) {
        var schema = new mongoose.Schema(mapimages_schema);
        var mapimage_model = mongoose.model('Mapimages', schema);
        _model = mongoose_model.create(mapimage_model);
    }

    return _model;
}