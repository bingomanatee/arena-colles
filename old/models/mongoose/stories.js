var mongoose = require('mongoose');
var db = require('./db');
var ObjectId =  mongoose.Schema.ObjectId;
console.log('ObjectId: ');
console.log(ObjectId);

/**
 * NOTE: _id == the "resource ID" of the rest resource. Can be local or absolute. 
 */
var db = require('./db');
db.init();
var lines_module = require('./lines');

module.exports = {
    _schema: null,
    
    _schema_def: {
         _id:         ObjectId
       , title:       String
       , user:        String
       , validated:  {type: Boolean, default: false}
       , poster:      String // sprite ID of the poster
       , lines:       [lines_module.schema()]
    },
    
    schema: function(){
        if (!module.exports._schema){
            module.exports._schema = new mongoose.Schema(module.exports._schema_def);
        }
        
        return module.exports._schema;
    },
    
    _model: null,
    
    /**
     * note - a lot of "find" type functions of model are
     *        static functions of the model object.
     *        If you want to create a new record, save it, etc.
     *        call model(true) and treat the result as an activeRecord.
     */
    model: function(new_instance){
        if (!module.exports._model){
            var schema = module.exports.schema();
         //    // console.log('schema for users');
         //    // console.log(schema);
            mongoose.model('Stories', schema);
            module.exports._model = mongoose.model('Stories');
        }
        
        return new_instance ?
           new module.exports._model() :
           module.exports._model;
    }
    
}