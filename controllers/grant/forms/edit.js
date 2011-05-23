module.exports = {
    fields: [{
        name: 'grant[_id]',
        label: 'Action'
    }, {
        name: 'grant[roles]',
        type: 'checkbox',
        label: 'Allowed Roles',
        callback: function(field, callback) {
            require(MVC_MODELS).model('roles', function(err, role_model) {
                role_model.options(function(err, options) {
                    field.options = options;
                    callback();
                });
            });
        }
    }],
    configs: {
        action: '/grants/0/update',
        context: 'grant',
        method: 'POST'
    }
}