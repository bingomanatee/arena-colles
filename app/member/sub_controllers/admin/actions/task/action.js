var util = require('util');
var task_form = require('./../../../../views/forms/task_form');

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
                },
                {
                    link:'/admin/members/tasks',
                    title:'Tasks'
                }
            ],
            header:'Arena Colles Members: Tasks'
        }
    },

    execute:function (req_state, callback) {

        var task_model = req_state.controller.task_model;

        function _on_params(err, params) {

            if (!params.id) {
                return req_state.put_flash('No task id found', 'error', '/admin/members/tasks');
            }

            function _on_task(err, task) {

                if (err) {
                    req_state.put_flash(err.message, 'error', '/admin/members/tasks');
                } else if (task) {

                    function _on_path(err, task_path) {

                        function _on_parents(err, parents) {

                            function _on_task_form(err, form) {

                                function _on_menu(err, menu) {
                                    _.extend(params, {task:task, path: task_path, form:form, menu:menu});
                                    callback(null, params);
                                }

                                req_state.framework.menu(req_state, _on_menu);

                            }

                            task_form(_on_task_form, '/admin/members/task/' + task._id.toString(), task, parents);
                        }

                        task_model.parents(task, _on_parents);
                    }

                    task_model.path(task, _on_path);

                } else {
                    req_state.put_flash(new Error('cannot find id %s', params.id));
                }

            }

            task_model.get(params.id).populate('parent').run(_on_task);
        }

        req_state.get_params(['id', 'task_form_view'], _on_params);
    },

    load_req_params:true,

    route:'/admin/members/task/:id',

    method:'get'

}