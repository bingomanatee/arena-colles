module.exports = function(context) {
    var member = context.request.body.member;
    var self = this;

    self.model.authenticate(member, function(err, authenticated) {
        if (authenticated) {
            console.log('authentication: ', authenticated);
            self.model.get_with_grants(member._id, function(err, member) {
                context.request.session.member = member;
                context.flash('You are now logged in', 'info', 'home');
            })
        } else {
            context.flash('Your credentials cannot be validated', 'error', '/members');
        }
    });
}