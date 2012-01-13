var _ = require('./../../../../node_modules/nuby-express/node_modules/underscore');
var parent_controller_def = require('./../../controller');

module.exports = _.clone(parent_controller_def);

_.extend(module.exports, {
    name: 'member_admin'
});

_.extend(module.exports.params, {
        layout_id:'ac_admin'
});