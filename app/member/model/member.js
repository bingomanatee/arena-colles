var mongoose = require('./../../../node_modules/mongoose');
var mongoose_model = require('./../../../node_modules/nuby-express/lib/mongoose_model');
var member_schema = require('./member_schema');

var _model;

module.exports = function () {
    if (!_model) {
        var Member = new mongoose.Schema(member_schema);
        var m = mongoose.model('Member', Member);
        _model = mongoose_model.create(m);
    }

    return _model;
}