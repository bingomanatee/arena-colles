module.exports = {
    configs: {
        action: '/members/0',
        method: 'POST'
    },
    fields: [{
        name: "member[_id]",
        label: "Alias",
        type: "text"
    }, {
        name: "member[password]",
        label: "Password",
        type: "password"
    }, {
        name: "member[real_name]",
        label: "Real Name",
        type: "text"
    }, {
        name: "member[email]",
        label: "Email Address",
        type: "text"
    }, {
        name: "member[home_address]",
        label: "Home Address",
        type: "textarea",
        rows: 3,
        properties: {
            rows: 4
        }
    }, {
        name: "member[home_city]",
        label: "Home City",
        type: "text"
    }, {
        name: "member[home_state]",
        label: "Home State",
        type: "text"
    }, {
        name: "member[home_country]",
        label: "Home Country",
        type: "select",
        options: ['USA', 'Canada', 'Other']
    }, {
        name: "member[roles][]",
        label: "Roles",
        type: "checkbox",
        callback: function(field, callback) {
             // console.log(__filename, ': starting callback for roles');
            function _role_model(err, role_model) {
                 // console.log(__filename, ': _role_model found model; ');
                role_model.options(function(err, options) {
                     // console.log(__filename, '_role_model found options: ', options, ' callback: ', callback);
                    field.options = options;
                    callback();
                });
            }
            require(MVC_MODELS).model('roles', _role_model);
        }
    }]
}