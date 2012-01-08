module.exports = function(context) {
    if (context.request.session.hasOwnProperty('member')) {
        delete(context.request.session.member);
    }
    context.flash('logged out', 'info', 'home');
}