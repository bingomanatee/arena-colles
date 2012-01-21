var member_form = require('./../../../../views/forms/member_form');
var member_tasks = require('./../../../../views/forms/member_tasks');
var member_ticket = require('./../../../../views/tickets/member_ticket');
var util = require('util');

module.exports = {

    params:{
        render:{
            breadcrumb:[
                {
                    link:'/',
                    title:'Home'
                },
                {
                    link:'/admin',
                    title:'Admin'
                },
                {
                    link:'/admin/members',
                    title:'Members'
                }
            ],
            header:'Arena Colles Members: Member &quot;%s&quot;'
        }
    },

    load_req_params:true,

    execute:function (req_state, callback) {

        function _on_member(err, member) {
            if (err) {
                return callback(err);
            } else {
                console.log('member: %s', util.inspect(member));
            }
            //@TODO: err mgmt
            req_state.set_param(['render', 'header'], util.format('Arena Colles Members: Member &quot;%s&quot;', member.name));

            function _on_form(err, form) {

                function _on_ticket(err, ticket) {

                    function _on_mt(err, member_tasks) {
                        callback(null, {form:form, member_tasks:member_tasks, ticket:ticket, member:member})
                    }

                    member_tasks(_on_mt, member, '/admin/member/' + member._id.toString() + '/tasks');
                }

                member_ticket(_on_ticket, member);
            }

            member_form(_on_form, '/admin/member/', member);
        }

        req_state.get_param('id', function (err, id) {
            console.log('getting id %s', id);
            req_state.controller.model.get(id, _on_member);
        });
    },

    route:'/admin/member/:id',

    method:'get'

}