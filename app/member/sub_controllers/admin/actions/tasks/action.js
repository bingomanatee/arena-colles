var util = require('util');
var path = require('path');
var task_form = require('./../../../../forms/task_form');

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
            header:'Arena Colles Members: Tasks'
        }
    },

    load_req_params:true,

    execute:function (req_state, callback) {
        var self = this;

        //@TODO: better error handling

        function _on_tasks(err, _tasks) {
            var properties = [];
            var tasks = [];
            _tasks.forEach(function(t){ if (t.property){
                properties.push(t);
            } else {
                tasks.push(t);
            }})

            function _on_parents(err, parents) {

                function _on_menu(err, menu) {

                    function _on_task_form(err, form) {
                        callback(null, {tasks:tasks, properties: properties, form:form, menu:menu });
                    }

                    task_form(_on_task_form, '/admin/members/task', false, parents);
                }

                req_state.framework.menu(req_state, _on_menu);
            }

            req_state.controller.task_model.parents(null, _on_parents);
        }

        req_state.controller.task_model.model.find({}).sort('path', 1).run(_on_tasks);
    },

    route:'/admin/members/tasks',

    method:'get'

}


function _validation_errors(err) {
    var list = [];
    for (var field in err.errors) {
        list.push(_filter_error(field + ': ' + err.errors[field].message));
    }
    return list.join(',');
}

function _filter_error(error) {
    var req_re = /Validator "required" failed for path .*/
    if (req_re.test(error)) {
        return 'required';
    }
    return error;
}