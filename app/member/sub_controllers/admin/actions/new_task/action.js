var util = require('util');

/**
 * note - all results of this action are redirects
 */
module.exports = {
    execute:function (req_state, callback) {
        function _on_put_task(err, put_task) {

            console.log('put task: %s, err: %s', util.inspect(put_task), util.inspect(err));

            if (err) {
                console.log('err = ' + util.inspect(err));
                return req_state.put_flash('Cannot create task: ' + _validation_errors(err), 'error', '/admin/members/tasks');
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

            console.log('task: %s', util.inspect(task));
            task.created = new Date();

            if (task.property) {
                task.parent = '*';
            }
            delete task.property;

            req_state.controller.task_model.put(task, _on_put_task);
        }

        function _no_task() {
            req_state.put_flash('Canot find task', 'error', '/admin/members/tasks');
        }

        req_state.get_param('task', _on_task, _no_task);
    },

    method: 'post',

    route: '/admin/members/tasks'
}