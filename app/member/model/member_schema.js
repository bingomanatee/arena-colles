module.exports = {

    email:{type:String, index:{unique:true}, required:true},
    name:{type:String, required:true},
    password:{type:String, required:true},

    created:{type:Date, 'default':Date.now, required:true},
    birthday:Date,

    roles:[String],
    status:{type:Number, 'default':0}
}