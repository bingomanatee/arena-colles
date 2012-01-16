var _ = require('./../../../../node_modules/nuby-express/node_modules/underscore');
var parent_controller_def = require('./../../controller');
var util = require('util');
var member_clone = _.clone(parent_controller_def);

_.extend(member_clone, {
    name:'member_admin'
});
if (member_clone.hasOwnProperty('params')){
    member_clone.params = _.clone(member_clone.params)
} else {
    member_clone.params = {};
}
_.extend(member_clone.params, { layout_id:'ac_admin'});

delete member_clone.manifest;

module.exports = member_clone;