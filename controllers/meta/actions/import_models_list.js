var models_module = require(MVC_MODELS);
var fs = require('fs');
var path_module = require('path');
var jsoninpath = require('util/jsoninpath');

module.exports = function(context) {

    var params = context.req_params(false).models;
    console.log(__filename, ': params: ', params);
    if (params.filter){
        var path = MVC_MODELS + '/_export/' + params.model;
       jsoninpath(path, function(err, data){
            context.render('meta/import_models_list.html', {model: params.model, data: data});
       });
    };
    
}