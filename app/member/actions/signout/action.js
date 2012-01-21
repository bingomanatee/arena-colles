

module.exports = {

    execute: function(req_state, callback){

        req_state.set_session('memberid', '');
        req_state.put_flash('Thanks for visiting! You are now signed out', 'info', '/');

    },

    route: '/signout'

}