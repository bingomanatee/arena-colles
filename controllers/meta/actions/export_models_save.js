var models_module = require(MVC_MODELS);
var fs = require('fs');
var path_module = require('path');

module.exports = function(context) {

    var params = context.req_params(false);
    console.log(__filename, ': params: ', params);
    var models = params.models.models;

    models.forEach(function(model) {
        try {

            function _export_model_data(err, records) {
                if (!records) {
                    return;
                }
                var model_dir = MVC_MODELS + '/_export/' + model;
                
                function _exists_handler(exists) {
                    if (!exists) {
                        console.log(__filename, ': making dir ', model_dir);
                        fs.mkdirSync(model_dir, 0775);
                    }
                    records.forEach(function(record) {
                        var file_path = model_dir + '/' + record._id + '.json';
                        console.log(__filename, ': write ', file_path);
                        fs.writeFile(file_path, JSON.stringify(record));
                    });

                }
                
                console.log(__filename, ':checking for existence of ', model_dir);
                path_module.exists(model_dir, _exists_handler);
            };

            models_module.model(model, function(err, model_class) {
                if (model_class) {
                    model_class.all(_export_model_data);
                }
            });
        } catch (err) {

        }
    });

    context.flash('Saving models ' + models.join(', '), 'info', 'home');
}