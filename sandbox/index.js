var mongoose = require('./../node_modules/mongoose');
mongoose.connect('mongodb://localhost/ac2');
var util = require('util');

var schema = {
    key:{type:String, required:true},
    path:{type:String},
    title:{type:String, required:true},
    notes:String,
    parent:{type:String, 'default':''},
    // created_by:{type:Schema.ObjectId, ref:'Member'},
    created:{type:Date, 'default':Date.now, required:true},
    can:{type:Boolean, 'default':false}
}

var TaskSchema = new mongoose.Schema(schema, {safe: true});
mongoose.model('Task', TaskSchema);

var Task = mongoose.model('Task');

var t = new Task();

t.key = 'member';
t.path = 'member';
t.title = 'Member';
t.created = new Date();
t.can = true;

console.log('t._id: %s', util.inspect(t._id));

t.save(function (err) {
    console.log('error: %s', util.inspect(err));
    console.log('t._id post save: %s', util.inspect(t._id));
});
