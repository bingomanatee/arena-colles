module.exports = {
    configs: {
        action: '/members/0/update',
        method: 'POST'
    },
    fields: [{
        name: "member[_id]",
        type: "hidden"
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
        properties: {rows: 4, cols: 20}
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
        label: "Country",
        type: "select",
        options: ['USA', 'Canada', 'Other']
    }, {
        name: "member[roles][]",
        label: "Roles",
        type: "checkbox",
        callback: function(field, callback){
            require(MVC_MODELS).model('role', function(err, role_model){
                role_model.options(function(err, options){
                    field.options = options;
                    callback();
                });
            })
        }
    }]
}