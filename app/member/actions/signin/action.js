var util = require('util');

module.exports = {

    load_req_params:'member',

    params:{
        render:{header:'Please sign in'}
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
        console.log("signin action");
        switch (req_state.method) {
            case 'post':
                console.log('signin post');
                this.execute_post(req_state, callback);
                break;

            case 'get':
                console.log('signin get');
                var jui_ticket = require(req_state.framework.app_root + '/views/jui_ticket');
                console.log('jui_ticket: %s', jui_ticket.toString());
                callback(null, {jui_ticket:jui_ticket});

        }
    },

    execute_post:function (req_state, callback) {

        function _on_members(err, members_w_password, member) {
            console.log('signin _on_members');
            var found = false;
            var mbr;
            console.log('members with password: %s', util.inspect(members_w_password));
            for (var i = 0; i < members_w_password.length; ++i) {
                mbr = members_w_password[i];
                if ((mbr.email == member.name) || (mbr.name == member.name)) {
                    req_state.set_session('memberid', mbr._id.toString());
                    req_state.put_flash('Welcome Back!', 'info', '/account');
                    return;
                }
            }


            req_state.put_flash('Sorry, we cannot find your identity', 'error', '/signin');

        }

        function _on_member_params(err, member) {
            console.log('checking for members with password: %s', member.password);
            req_state.controller.model.find({'password':member.password},
                function (err, members) {
                    console.log('find members');
                    _on_members(err, members, member);
                })
        }

        req_state.get_param(['form', 'member'], _on_member_params);
    },

    route:'/signin',

    method:['get', 'post']

}