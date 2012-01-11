var util = require('util');
var _ = require('./../../../../node_modules/underscore');

/** **************************
 * Join Action
 */
module.exports = {

    params:{
        render:{header:'Please join our membership'}
    },

    load_req_params:true,

    MAX_TRIES:10,

    auth:function (req_state) {
        if (req_state.method == 'get') {
            return this.if_auth(req_state);
        }
        var tries = parseInt(req_state.get_session('join_tries', 0));
        if (tries > this.MAX_TRIES) {
            req_state.put_flash('Sorry, you have too many login fails. Please close and reopen your browser.',
                'error', 'home');
        } else {
            var memberid = parseInt(req_state.get_session('memberid', 0));
            if (memberid > 0) {
                req_state.put_flash('You are already logged in. Please <a href="/signout">sign out</a> if you want to join as another member.',
                    'info', 'home');
            } else {
                this.if_auth(req_state);
            }
        }
    },


    execute:function (req_state, callback) {
        //console.log('JOIN ********** req: %s', util.inspect(req_state.req));
        // console.log('JOIN ********** req_state params: %s', util.inspect(req_state.params));

        console.log('method: %s', req_state.method);

        if (req_state.method == 'post') {

            req_state.get_param('member', function (err, member_data) {

                var req_re = /Validator "required" failed for path .*/

                function _filter_error(error) {
                    if (req_re.test(error)) {
                        return 'required';
                    }
                    return error;
                }

                function _validation_errors(member, err) {
                    for (var field in err.errors) {
                        member[field + '_error'] = _filter_error(err.errors[field].message);
                    }
                }

                function _on_member_post(err, member) {
                    if (err) {
                        console.log('err = ' + util.inspect(err));
                        console.log('member: %s', util.inspect(member));
                        req_state.put_flash('Sorry you can\'t join us: ' + err.message, 'error');
                        _validation_errors(member_data, err);
                        req_state.framework.menu(req_state, function (err, menu) {
                            callback(null, {member:member_data, menu:menu});
                        });
                    } else {
                        req_state.put_flash(util.format('Thanks for joining us %s!', member.name), 'info', 'home');
                    }
                }


                var orig_bd = member_data.birthday;
                var bd = new Date(orig_bd.year, orig_bd.month, orig_bd.day);
                if (
                        (member_data.password[0] != member_data.password[1]) ||
                        (member_data.password[0].length < 8)
                    ) {
                    var err = new Error('Validation Failed');
                    err.errors = {password:{message:'your password must be at least 8 characters and must be entered twice.'}};
                    return _on_member_post(err, member_data);
                } else {
                    member_data.password = member_data.password[0];
                }
                req_state.controller.model.put(_.extend(_.clone(member_data), {birthday:bd, created: new Date()}), _on_member_post);
            }, function () {
                req_state.put_flash('Cannot find member', 'error', 'home');
            })
        } else {
            this.framework.menu(req_state, function (err, menu) {
                function _on_member_get(err, member) {
                    console.log('join member = %s', util.inspect(member));
                    callback(err, {menu:menu, member:member});
                }

                req_state.get_param('member', _on_member_get, {name:'', email:'', password:'', birthday:{day:1, month:1, year:1900}});
            })
        }
    },

    route:'/join',

    method:['get', 'post']

}