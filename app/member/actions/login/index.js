module.exports = {

    load_req_params:'member',

    params: {
        render: {header: 'Please sign in'}
    },

    MAX_TRIES:5,

    auth:function (req_state) {
        if (req_state.method == 'get') {
            return this.if_auth(req_state);
        }
        var tries = parseInt(req_state.get_session('login_tries', 0));
        if (tries > this.MAX_TRIES) {
            req_state.set_flash('Sorry, you have too many login fails. Please close and reopen your browser.',
                'error', 'home');
        } else {
            var memberid = parseInt(req_state.get_session('memberid'));
            if (memberid > 0) {
                req_state.set_flash('You are already logged in. Please <a href="/signout">sign out</a> if you want to log in as another member.',
                    'info', 'home');
            } else {
                this.if_auth(req_state);
            }
        }
    },



    execute:function (req_state, callback) {

        function _on_members(err, members_w_password, member) {
            var found = false;
            var mbr;
            for (var i = 0; i < members_w_password.length; ++i) {
                mbr = members_w_password[i];
                if ((mbr.email == member.name) || (mbr.name == member.name)) {
                    req_state.set_session('memberid', mbr._id.toString());
                    req_state.set_flash('Welcome Back!', 'info', '/account');
                    return;
                }
            }

            req_state.set_flash('Sorry, we cannot find your identity', error);
            callback(null, {member:member});

        }

        if (req_state.method == 'post') {
            req_state.get_param('member', function (err, member) {
                req_state.controller.model.find({'password':member.password},
                    function (err, members) {
                        _on_members(err, members, member);
                    }, function () {
                        req_state.set_flash('where is the member?', 'error', 'back');
                    })
            })
        }
    },

    route:'/signin',

    method:['get', 'post']

}