/**
 *  CONTROLLER MEMBERS
 * Site Membership
 */

var ACL = require('mvc/acl');
var forms_module = require('mvc/forms');
var context_module = require('mvc/controller/context');

module.exports = {

    index: function(context) {
        function _handler(err, login_form) {
            var params = {
                login_form: login_form
            };
            context.render(params);
        }
        var login_form = forms_module(_handler, module.exports, 'login');
    },

    show: require('./member/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    "delete": require('mvc/actions/delete'),

    create: require('./member/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),

    login: require('./member/actions/login'),

    logout: require('./member/actions/logout'),
    
    admin: require('./member/actions/admin'),
    
    admin_edit: require('./member/actions/admin_edit'),
    
    login: require('./member/actions/login'),
    
    logout: require('./member/actions/logout'),

    route: function(app) {
        context_module(function(err, Context){
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);
            
            /* **************************** MEMBER ADMIN *************** */
            
            context.get(app, '/members/0/admin', 'admin', {view: 'member/admin/index.html'} )
            context.get(app, '/members/:id/admin/edit', 'admin_edit', {view: 'member/admin/edit.html'});
            
            /* **************************** LOGIN *************** */
            
            context.post(app, '/members/:id/login', 'login');
            context.get(app, '/join', 'add');
            context.all( app, '/members/:id/logout', 'logout');
                
        });
    },

};