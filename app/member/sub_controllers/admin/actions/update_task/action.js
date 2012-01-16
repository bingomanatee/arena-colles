var util = require('util');

/**
 * note - all results of this action are redirects
 */
module.exports = {

    load_req_params:true,

    execute:function (req_state, callback) {
        console.log('updating task');

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

            console.log('task: %s', util.inspect(task));
            if (err) {
                return req_state.put_flash('error getting task: ' + err.message, 'error', '/admin/members/tasks');
            }

            function _out_err(err) {
                var out = err.message + '; ';

                for (var p in err) {
                    out += p + ': ' + util.inspect(err[p]);
                }

                return out;
            }

            function _on_saved(err, saved_task_obj) {
                if (err) {
                    return req_state.put_flash('error on update _on_saved: ' + _out_err(err), 'error', '/admin/members/tasks');
                }
                req_state.put_flash('Task ' + task.key + ' updated', 'info', '/admin/members/task/' + task._id);
            }

            function _on_get_task(err, task_obj) {
                if (err) {
                    return req_state.put_flash('error getting task: ' + err.message, 'error', '/admin/members/tasks');
                }

                task_obj.key = task.key;
                task_obj.title = task.title;
                task_obj.notes = task.notes;
                task_obj.property = task.property == '1' ? true : false;

                function _on_got_parent(err, parent) {
                    console.log('found parent %s', util.inspect(parent));
                    task_obj.parent = parent;
                    task_obj.save(_on_saved);
                }

                if (task.parent) {
                    console.log('applying parent %s', task.parent.toString());
                    // task_obj.parent = task.parent;
                    req_state.controller.task_model.get(task.parent, _on_got_parent);
                } else {
                    console.log('applying empty parent');
                    task_obj.parent = '';
                    task_obj.save(_on_saved);

                }
            }

            req_state.controller.task_model.get(task._id, _on_get_task);
        }

        function _no_task() {
            req_state.put_flash('Canot find task', 'error', '/admin/members/tasks');
        }

        req_state.get_param('task', _on_task, _no_task);
    },

    method:'post',

    route:'/admin/members/task/:id'
}