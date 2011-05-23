var mongoose = require('mongoose');

module.exports = {
    _schema: null,

    _schema_def: {
         _id: String
       , name: String
       , weight: Number
       , quantity: {type: Number, default: 1}
       , part_number: String
    },
    
    schema: function(){
        if (!module.exports._schema){
            module.exports._schema = new mongoose.Schema(module.exports._schema_def);
        }
        
        return module.exports._schema;
    },
    
    _model: null,
    
    model: function(new_instance){
        if (!module.exports._model){
            var schema = module.exports.schema();
         //   note- 
            mongoose.model('RobotParts', schema);
            module.exports._model = mongoose.model('RobotParts');
        }
        
        return new_instance ?
           new module.exports._model() :
           module.exports._model;
    }
}