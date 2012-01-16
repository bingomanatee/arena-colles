var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Note that parent can have one of three values:
 * '' -- empty, meaning it is a root task
 * '*' -- "property", meaning any task can have this as a sub modifier
 * 'string' -- any string, which must be the ID of an existing task
 *
 * can is the default permission state for anyone with out specific permissions.
 */

module.exports = {
    key:{type: String, required: true},
    path: {type: String},
    property: {type: Boolean, 'default': false},
    title: {type: String, required: true},
    notes: String,
    parent:{type:Schema.ObjectId, ref: 'Task'},
    created_by:{type:Schema.ObjectId, ref:'Member'},
    created:{type:Date, 'default':Date.now, required:true},
    can:{type:Boolean, 'default':false},
    deleted: {type: Boolean, 'default': false}
}
