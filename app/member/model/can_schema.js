var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    member:Schema.ObjectId,
    task:{type:Schema.ObjectId, ref:'Task'},
    created_by:{type:Schema.ObjectId, ref:'Member'},
    created:{type:Date, 'default':Date.now},
    can:{type:Boolean, 'default':true}
}