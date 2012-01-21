var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {

    email:{type:String, index:{unique:true}, required:true},
    name:{type:String, required:true},
    password:{type:String, required:true},

    created:{type:Date, 'default':Date.now, required:true},
    birthday:Date,
    notes:String,

    roles:[String],
    cans:[String],
    cants:[String],
    status:{type:Number, 'default':0}

}