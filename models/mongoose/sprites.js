var mongoose = require('mongoose');
var db = require('./db');
var sprite_state = require(__dirname + '/sprite/states');

/**
 * NOTE: _id == the "path" or "resource ID" of the rest resource. Can be local or absolute. 
 */
var db = require('./db');
db.init();

module.exports = {
    _schema: null,
    
    _schema_def: {
         _id:         String
       , name:        String
       , path:        String
       , offset_x:    Number
       , offset_y:    Number
       , validated:  {type: Boolean, "default": false}
       , type:       {type: String, enum: ['person','body', 'hair','prop','scenery', 'actor']}
       , states:     [sprite_state.schema()]
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
         //   console.log('schema for users');
         //   console.log(schema);
            mongoose.model('Sprites', schema);
            module.exports._model = mongoose.model('Sprites');
        }
        
        return new_instance ?
           new module.exports._model() :
           module.exports._model;
    },
    
    authenticate: function(id, password, callback){
        var m = module.exports.model();
        m.findOne({_id: id, password: password}, callback); // not checking password yet
    }
    
}