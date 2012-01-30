var _ = require('./../../../node_modules/underscore');
var util = require('util');

function _task_match(task, member_cans) {
    console.log('_tas_match: %s; cans: %s', task, member_cans.join(','));
    for (var i = 0; i < member_cans.length; ++i) {
        var can = member_cans[i].replace(/\.?\*$/, '');
        if (can.length && (can == task.substr(0, can.length))) {
            console.log('can %s matching task %s', can, task);
            return true;
        }

    }
    return false;
}

function _authorize(tasks, member) {
 //   console.log('_authorize: member: %s', util.inspect(member));
    if (!(tasks) || (!tasks.length)) {
        console.log('no tasks - granting');
        return true;
    } else if (!member){
        console.log('no member passed - barring');
        return false;
    } else if (!member.cans){
        console.log('member has no cans - barring');
        return false;
    } else if (member.cans.length < 1){
        console.log('no member cans count - barring');
        return false;
    }

    if (!_.isArray(tasks)) {
        tasks = [tasks];
    }

    console.log('authorizing %s', tasks.join(','));

    /**
     * Multiple tasks are regarded as "AND" clauses - each one must be true.
     *
     */
    for (var i = 0; i < tasks.length; ++i) {
        if (!_task_match(tasks[i], member.cans)) {
            return false
        }
    }
    return true;
}

module.exports = function (controller, callback) {
    callback(null, _authorize);
}