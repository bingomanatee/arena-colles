var util = require('util');

/**
 *  Creates a NEW task.
 * note - all results of this action are redirects
 */
module.exports = {

    load_req_params:true,

    execute:function (req_state, callback) {
        console.log('NEW TASK');

        var task_model = req_state.controller.task_model;

        function _on_put_task(err, put_task) {
            if (err) {
                return req_state.put_flash('Cannot create task: ' + task_model.validation_errors(err), 'error', '/admin/members/tasks');
            } else {
                req_state.put_flash(
                    util.format('Created task &quot;%s&quot; (%s)', put_task._id.toString(), put_task.key),
                    'info', '/admin/members/task/' + put_task._id.toString());
            }

        }

        function _on_task(err, task) {
            if (err) {
                return req_state.put_flash(err.message, 'error', '/admin/members/tasks');
            }
            delete task._id;
            console.log('task: %s', util.inspect(task));
            task.created = new Date();

            if (!task.parent) {
                task.parent = null;
            }

            task_model.put(task, _on_put_task);
        }

        function _no_task() {
            req_state.put_flash('Canot find task in request', 'error', '/admin/members/tasks');
        }

        req_state.get_param('task', _on_task, _no_task);
    },

    method:['post', 'put'],

    route:'/admin/members/task'
}