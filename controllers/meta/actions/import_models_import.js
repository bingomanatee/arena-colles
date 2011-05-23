var models_module = require(MVC_MODELS);
var fs = require('fs');

module.exports = function(context) {
    var self = this;
    var params = context.req_params().model;
    
    function _found_model(err, model){
        var path = MVC_MODELS + '/_export/' + params.model;
        
        function _read_files(err, files){
            if (files){
                files.forEach(function(file){
                    
                    function _data_saved(err, result){
                        console.log(__filename, ': saved ', result, ' in ' , params.name);
                    }
                    
                    function _load_file(err, data){
                        if (typeof(data) != 'string') data = data.toString();
                        
                        data = JSON.stringify(data);
                        if (data){
                            console.log(__filename, 'importing ', data, ' into ', prams.name);
                            model.put(data, _data_saved);
                        }
                    }
                    
                    fs.readFile(path + '/' + file, _load_file);    
                });
                
                context.flash('imported ' + files.count() + ' into ' + params.name, 'info', '/admin');
            } // note - files might not be saved by the time te result hits.
        }
        
        if (err || !model){
            console.log(__filename, 'cannot find ', params.name, err);
            context.flash('Cannot find ' + params.name, 'error', '/admin');
        } else {
            fs.readdir(path, _read_files);
        }
    }
    
    models_module.model(params.name, _found_model);
}
