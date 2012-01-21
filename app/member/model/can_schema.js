var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * this is a users' abiliyt to perform a task.
 * Note if property is absent you can do ANYTHING with the task subject.
 */

module.exports = {
    member:Schema.ObjectId,
    task:{type:Schema.ObjectId, ref:'Task'},
    property:{type:Schema.ObjectId, ref:'Task'},
    created_by:{type:Schema.ObjectId, ref:'Member'},
    created:{type:Date, 'default':Date.now},
    can:{type:Boolean, 'default':true}
}