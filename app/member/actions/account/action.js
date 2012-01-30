var member_ticket = require('./../../views/tickets/member_ticket');


module.exports = {

    params:{
        render:{header:'Your Account'}
    },

    execute:function (req_state, callback) {

        function _on_member(err, member) {
            if (!member) {
                return req_state.put_flash('Cannot find your record; please log in', 'error', '/');
            }

            function _on_member_ticket(err, ticket) {
                var jui_ticket_path = req_state.framework.app_root + '/views/jui_ticket';
                callback(null, {ticket:ticket, jui_ticket: require(jui_ticket_path)});
            }

            member_ticket(_on_member_ticket, member);
        }

        req_state.framework.resources.active_member(req_state, _on_member);
    },

    route:'/account'

}