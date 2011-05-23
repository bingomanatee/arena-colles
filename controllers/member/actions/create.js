var inflect = require('inflect');

module.exports = function(context) {
    var self = this;
    var member = context.request.body.member;
    if (!member){
        console.log(__filename, ": no member in body ", context.request.body);
        throw new Error(__filename, ': no member in body');
    }
    
    console.log(__filename, ' ---------- creating new member ', member);

    function _after_write_handler(err, new_member) {
        if (err) {
            console.log(__filename, ': error saving new member', err);
            context.flash('You cannot register', 'err', 'home');
        } else {
            console.log(__filename, ': ^^^^^^^^^^^^^^^^ saving new member', new_member);
            var url = '/members/' + new_member._id;
            context.flash('You have registered as ' + new_member._id, 'info', url);
        }
    }

    function _unique_handler(err, result) {
        if (result) {
            context.flash('There is already a member with that information in our membership list', 'error', 'home');
        } else {
            self.model.put(member, _after_write_handler);
        }
    }

    self.model.get(member._id, _unique_handler);

}