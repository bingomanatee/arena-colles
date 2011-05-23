var forms_module = require('mvc/forms');
var member_controller = require(MVC_CONTROLLERS + '/member');

module.exports = {
    
    index: function(context) {
        function _login_form_handler(err, login_form) {
                console.log('_login_form_handler returned ', err, ', ', login_form);
            if (err){
                console.log(__filename, '_login_form_handler error: ', err);
                throw err;
            }
            function _join_form_handler(err, join_form) {
                console.log('_join_form_handler returned ', err, ', ', join_form);
            if (err){
                console.log(__filename, '_join_form_handler error: ', err);
                throw err;
            }
                var params = {
                    login_form: login_form,
                    join_form: join_form,
                    events: []
                };
                console.log(__filename, ': rendering index with params ', params);
                context.render(params);
            }
            
            forms_module(_join_form_handler, member_controller, 'add');
        }
        forms_module(_login_form_handler, member_controller, 'login');
    },
}