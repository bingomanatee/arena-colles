var Deformer = require('deformer');
var models_module = require(MVC_MODELS);

module.exports = {
    configs: {
        action: '/roles/0',
        method: 'POST'
    },

    fields: [{
        name: "role[_id]",
        label: "Name"
    }, {
        name: "role[label]",
        label: "Label"
    }, {
        name: "role[description]",
        label: "Description",
        type: "textarea"
    }, {
        name: "role[parent]",
        label: "Parent",
        type: "select",
        options: [],
        callback: function(field, callback) {
            console.log(__filename, ' ----- getting role model');
            models_module.model('role', function(err, role_model) {
                if (err || (!role_model)) {
                    console.log(__filename, ': cannot find role model', err);
                    throw err;
                }
                console.log('found role model: ', role_model);
                role_model.options(function(err, options) {
                    console.log(__filename, ': options = ', options);
                    field.options = options;
                    callback();
                }, true);
            });
        }
    }]
}
    