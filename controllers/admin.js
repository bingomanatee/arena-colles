var fs = require('fs');
var ACL = require('mvc/acl');
module.exports = {
    index: function(context) {
        context.render('admin/index.html', {});
/*  var acl = new ACL(context);
        acl.can('admin_site', function(err, can) {
            if (can) {
            } else {
                context.flash('You are not allowed to administer the site.', 'error', 'home');
            }
        }); */
    }
}