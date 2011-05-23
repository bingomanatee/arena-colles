var inflect = require('inflect');
var string_utils = require('util/string');
var forms_module = require('mvc/forms');

/**
 * GRANT CONTROLLER
 * - sets permissions
 */

module.exports = {

    index: function(context) {
        console.log(__filename, '::index: ');
        
        function _form_callback(err, form) {
            console.log(__filename, '::form: ', form);

            function _all_callback(err, results) {
                console.log(__filename, '::data: ', results);
                context.render({
                    grants: results,
                    form: form
                });
            }

            module.exports.model.all(_all_callback);
        };
        
        forms_module(_form_callback, module.exports, 'add');
    },

    add: require('./grant/actions/add'),
    
    create: require('mvc/actions/create'),
    
    edit: require('./grant/actions/edit'),

    show: function(context) {
        var self = this;
        
        function _get_handler(err, item) {
            if (err) {
                next(err);
            } else if (item) {
                params = context.params();
                params[self.name] = params.item = item;
                context.render(self._views.show, params);
            } else {
                if (!context.request.hasOwnProperty('body')){
                    context.request.body = {};
                }
                context.response.redirect('/grants/' + context.request.params.id + '/add');
            }
        }
        
        self.model.get(context.request.params.id, _get_handler);
    },

    forms: {
        default: {
            fields: [{
                name: 'grant[_id]',
                label: 'Action'
            },{
                name: 'grant[roles]',
                type: 'checkbox',
                label: 'Allowed Roles',
                callback: function(field, callback){
                    require(MVC_MODELS).model('roles', function(err, role_model){
                        role_model.options(function(err, options){
                            field.options = options;
                            callback();
                        });
                    });
                }
            }],
            configs: {
                action: '/grants/0',
                context: 'grant',
                method: 'POST'
            }
        }
    }
}