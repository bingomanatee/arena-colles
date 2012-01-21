var util = require('util');

module.exports = {
    load_req_params:'input',

    execute:function (req_state, callback) {

        function _on_input(err, input) {

            function _on_member(err, member) {
               var cans = [];

                for (var subject in input.task){
                    var actions = input.task[subject];
                    actions.forEach(function(action){
                        if (action == '*'){
                            cans.push(subject);
                        } else {
                            cans.push(subject + '.' + action);
                        }
                    });
                }
                member.cans = cans;

                function _on_save(){
                    req_state.put_flash('Member permissions updated', 'info', '/admin/member/' + member._id.toString());
                }

                member.save(_on_save);
            }

            var member_id = input.member._id;

            req_state.controller.model.get(member_id, _on_member);
        }

        req_state.get_param('input', _on_input);
    },

    route: '/admin/member/:id/tasks',

    method: 'post'
}