var mongoose = require('../../../node_modules/mongoose');
var mongoose_model = require('../../../node_modules/nuby-express/lib/mongoose_model');
var mapimage_schema = require('./schema/mapimage_schema.js');

var _model;

module.exports = function () {
    if (!_model) {
        var mapimage = new mongoose.Schema(mapimage_schema);
        var m = mongoose.model('mapimage', mapimage);
        _model = mongoose_model.create(m);
    }

    return _model;
}