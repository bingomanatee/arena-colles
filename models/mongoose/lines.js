var mongoose = require('mongoose');
var db = require('./db');
var duration_model = require('./duration');
var ObjectId = mongoose.Schema.ObjectId;

/**
 * NOTE: _id == the "resource ID" of the rest resource. Can be local or absolute. 
 */
var db = require('./db');
db.init();

module.exports = {
    _schema: null,
    
    _schema_def: {
         story_id:    ObjectId
       , order:       Number
       , actor_number: String
       , line:        String
       , validated:   Boolean
       , sprite:      String
       , wait:        {type: Boolean, "default": true}
       , pre_state:   {}
       , post_state:  {}
       , move:        {type: Boolean, "default": false}
       , move_x:      Number
       , move_y:      Number
       , move_time:   Number
       , emotion:     {type: String, enum: ['normal', 'happy', 'laughing',
                                            'sad', 'angry', 'afraid'],
                        "default": "normal"}
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
            mongoose.model('Lines', schema);
            module.exports._model = mongoose.model('Lines');
        }
        
        return new_instance ?
           new module.exports._model() :
           module.exports._model;
    }
    
}