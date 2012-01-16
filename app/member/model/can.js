var mongoose = require('./../../../node_modules/mongoose');
var mongoose_model = require('./../../../node_modules/nuby-express/lib/mongoose_model');
var can_schema = require('./can_schema');
var _ = require('./../../../node_modules/underscore');
var member_model = require('./member');
var task_model = require('./task');

var Member = member_model();
var Task = task_model();

var _model;

var _config = {

    /**
     * note - if you want to DENY someone, set the callback
     * return value's can to false and save it.
     *
     * @param member: string of member OID, or a Member document
     * @param task: string of a task OID, path, or a Task document
     * @param callback: function
     * @param is_path:boolean - indicates the task is a path.
     */
    allow:function (member, task, callback, is_path) {
        var self = this;
        if (!member) {
            return callback(new Error('Can.allow called with no member'));
        }

        if (!task) {
            return callback(new Error('Can.allow called with no task'));
        }

        if (_.isString(member)) { // @TODO: also detect ObjectIDs
            return Member.get(member, function (err, member_obj) {
                if (err) {
                    callback(err);
                } else {
                    self.allow(member_obj, task, callback);
                }
            });
        }

        if (_.isString(task)) { //@TODO: also detect ObjectIDs

            if (is_path) {
                Task.find_one({path:task}, function (err, task_obj) {
                    if (err) {
                        callback(err);
                    } else {
                        self.allow(member, task_obj, callback, is_path);
                    }
                });
            } else {
                Task.get(task, function (err, task_obj) {
                    if (err) {
                        callback(err);
                    } else {
                        self.allow(member, task_obj, callback, is_path);
                    }
                });
            }

            return;
        }

        /**
         * at this point, both the member and the tasks
         * are documents, and exist.
         */

        function _on_find(err, can) {
            if (err){
                return callback(err);
            }

            if (can) {
                can.can = true;
                can.save(function (serr) {
                    callback(serr, can);
                });
            } else {
                self.put({member: member._id, task: task._id, can: true}, callback);
            }
        }

        self.find_one({member:member._id, task:task._id}, _on_find);
    }

}

module.exports = function () {
    if (!_model) {
        var Can = new mongoose.Schema(can_schema, {safe:true});
        var m = mongoose.model('Can', Can);
        _model = mongoose_model.create(m, _config);
    }

    return _model;
}