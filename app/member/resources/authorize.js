var _ = require('./../../../node_modules/underscore');

function _authorize(req_state, tasks, callback, member, framework){
    if (!(tasks && tasks.length)){
        return callback(null, true);
    }

    function _task_match(task, member_cans){

        for(var i = 0; i < member_cans.length; ++i){
            var can = member_cans[i].replace(/\.?\*$/, '');
            if (can.length && (can == task.substr(0, can.length))) {
                return true;
            }

        }
        return false;
    }

    function _on_member(err, member){
        if (!member){
            return callback(null, false);
        }

        if (!_.isArray(tasks)){
            tasks = [tasks];
        }
        /**
         * Multiple tasks are regarded as "AND" clauses - each one must be true.
         *
         */
        for(var i = 0; i < tasks.length; ++i){
            if (!_task_match(tasks[i], member.cans)){
                return callback(null, false);
            }
        }

        callback(null, true);
    }

    if (member){
        _on_member(null, member);
    } else {
        framework.resources.active_member(req_state, _on_member);
    }
}

module.exports = function(framework){

    return function (req_state, tasks, callback, member){
        _authorize(req_state, tasks, callback, member, framework);
    }

}