var ACL = require('mvc/acl');

module.exports = function(context) {
    var self = this;

    var acl = new ACL(context);
    acl.can('members_admin', function(err, can) {
        if (true || can) {
            _admin(context);
        } else {
            context.flash('You are not authorized to administrate members', 'error');
            context.response.redirect('home');
        }
    });
}


function _admin(context) {
    context.controller.model.all(function(err, members) {
        context.render('member/admin/index.html', {
            members: members
        });
    });
}