var member_model = require('./../../models/member');
var task_model = require('./../../models/task');

module.exports = {

        params:{
            layout_id:'ac_admin'
        },

    model:member_model(),

    task_model:task_model(),

    load_req_params:true,

    auth:function (req_state, if_auth) {
        console.log('member/admin auth');
        function _on_member(err, member) {
            if (member) {
                if (req_state.framework.resources.authorize('site.admin', member)
                    || req_state.framework.resources.authorize('member.admin', member)) {
                    return if_auth(req_state);
                }
            }
            req_state.put_flash('You are not authorized to view this page', 'error', '/');
        }

        req_state.framework.resources.active_member(req_state, _on_member);
    }

}