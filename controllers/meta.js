var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var json_utils = require('util/json');
var models_module = require(MVC_MODELS);
var context_module = require('mvc/controller/context');
var _base_actions = ['index', 'show', 'add', 'create', 'edit', 'update', 'destroy'];

module.exports = {
    forms: {
        add: {
            fields: [{
                name: 'meta_controller[name]',
                label: 'Name'
            }, {
                name: 'meta_controller[description]',
                label: 'Description',
                type: 'textarea'
            }, {
                name: 'meta_controller[actions]',
                label: 'Actions',
                type: 'checkbox',
                options: ['index', 'show', 'add', 'edit', 'delete'],
                value: ['index', 'show', 'add', 'edit', 'delete']
            }],
            configs: {
                method: 'POST',
                action: '/meta/0',
                templates: {
                    form: MVC_CONTROLLERS + '/meta/templates/forms/add.html'
                }
            }
        }
    },

    index: require('./meta/actions/index'),

    add: require('mvc/actions/add'),
    
    create: require('./meta/actions/create'),

    show: function(context) {
        var name = context.request.params.id;

        fs.readFile(MVC_CONTROLLERS + '/' + name + '.js', function(err, file_text) {
            context.render('meta/show.html', {
                cont: file_text,
                name: name
            });
        });
    },
    
    import_models: require('./meta/actions/import_models'),
    
    import_models_list: require('./meta/actions/import_models_list'),
    
    import_models_import: require('./meta/actions/import_models_import'),
    
    export_models: require('./meta/actions/export_models'),
    
    export_models_save: require('./meta/actions/export_models_save'),
    
    route: function(app){
        var context_config = {
            controller: module.exports
        };
        
        context_module(function(err, Context){
            var context = new Context(context_config);
            
            context.get(app, '/meta/0/import_models', 'import_models', 'meta/import_models.html');
            context.post(app, '/meta/0/import_models_list', 'import_models_list', 'meta/import_models_list.html');
            context.post(app, '/meta/0/import_models_import', 'import_models_import', 'meta/import_models_import.html');
            
            context.get(app, '/meta/0/export_models', 'export_models', 'meta/export_models.html');
            context.post(app, '/meta/0/export_models', 'export_models_save', 'meta/export_models_save.html');
        })
    },
    
}