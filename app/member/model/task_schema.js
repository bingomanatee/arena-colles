var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * The task collection is a mix of task subjects and propertys.
 * A task subject is a "Noun" - in general
 * a model or tangible subject of actions.
 *
 * Properties(or more properly "Acts") are things you can do to task subjects.
 *
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
    type: {type: String, enum: ['subject', 'action']},
    title: {type: String, required: true},
    notes: String,
    parent:{type:Schema.ObjectId, ref: 'Task'},
    created_by:{type:Schema.ObjectId, ref:'Member'},
    created:{type:Date, 'default':Date.now, required:true},
    can:{type:Boolean, 'default':false},
    deleted: {type: Boolean, 'default': false}
}
