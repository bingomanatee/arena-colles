function _active_member(req_state, callback, force_reload) {

    function _on_active_member_not_in_params() {

        function _on_member_found(err, member) {
            req_state.set_param('active_member', member);
            callback(null, member);
        }

        var memberid = req_state.get_session('memberid', false);

        if (memberid) {
            req_state.framework.models.member.get(memberid, _on_member_found);
        } else {
            _on_member_found(null, false);
        }
    }

    if (force_reload) {
        _on_active_member_not_in_params();
    } else {
        req_state.get_param('active_member', function (err, member) {
            callback(null, member);
        }, _on_active_member_not_in_params)
    }
}

module.exports = function (controller, callback) {
    console.log('callback: authorize for %s ', callback.toString());
    callback(null, _active_member);
}