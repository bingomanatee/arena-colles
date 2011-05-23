var mongo_model = require('mvc/model/mongo');
var path = require('path');
var inflect = require('inflect');

module.exports = {

    _models: {},

    model: function(model_name, config, mixins, callback) {
        if (typeof (mixins) == 'function'){
            callback = mixins;
            mixins = {};
        } else if (typeof(mixins) == 'undefined'){
            mixins = {};
        }
        if (typeof (config) == 'function'){
            callback = config;
            config = {};
        }
        var plural = inflect(model_name);
        
        var self = this;
        if (this._models.hasOwnProperty(model_name)) {
          // console.log(__filename, ' returning cached model for ', model_name);
           callback(null, this._models[model_name]);
        } else if (this._models.hasOwnProperty(plural)){
          // console.log(__filename, ' returning cached model for ', model_name);
            callback(null, this._models[plural]);
        } else {
            var model_file = MVC_MODELS + '/' + plural + '.js';
           // console.log(__filename, ': looking for model file ', model_file);
            
            if (path.existsSync(model_file)) {
               // console.log(__filename, ': loading model for ', model_name);
                
                var model_module = require(MVC_MODELS + '/' + plural);
                
                if (model_module.hasOwnProperty('model') && typeof(module.module.form) == 'function'){
                    function _found_f(err, model_found){
                        if (model_found){
                            self._models[plural] = model_found;
                        }
                        callback(err, model_found);
                    }
                    return module_module.model(_found_f);
                }
                
                mongo_model.init(model_module, function(err, model){
                    if (err) {
                        callback(err);
                    } else {
                        self._models[model_name] = self._models[plural] = model;
                        callback(null, model);
                    }
                })
                // require a user created model
            } else {
              // console.log(__filename, ': making default model for ', model_name);
                // make a default model
                mongo_model.make_model(model_name, config, {}, function(err, model) {
                    self._models[model_name] = self._models[plural] = model;
                    callback(null, model);
                });
            }
        }
    }
}