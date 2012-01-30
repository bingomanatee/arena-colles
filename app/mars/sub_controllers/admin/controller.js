module.exports = {
    params:{
        layout_id:'ac_admin',
        render:{
            header:'Admin: Mars',

            breadcrumb:[
                {link:'/',
                    title:'Home'},
                {
                    link:'/admin',
                    title:'Admin'
                }
            ]
        }
    },

    auth:function (req_state, if_auth) {
        function _on_member(err, member) {
            if (member) {
                // console.log('auth member: %s', util.inspect(member));
                if (req_state.framework.resources.authorize('site.admin', member)) {
                    return if_auth(req_state);
                }
            }
            req_state.put_flash('You are not authorized to view this page', 'error', '/');
        }

        req_state.framework.resources.active_member(req_state, _on_member);
    }
}