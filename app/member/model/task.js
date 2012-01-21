var mongoose = require('./../../../node_modules/mongoose');
var mongoose_model = require('./../../../node_modules/nuby-express/lib/mongoose_model');
var task_schema = require('./task_schema');

var _model;

module.exports = function () {
    if (!_model) {
        var Task = new mongoose.Schema(task_schema);
        mongoose.model('Task', Task);
        var m = mongoose.model('Task');
        _model = mongoose_model.create(m, {

            tree:function (parent) {
                if (!parent) {
                    parent = '';
                }
            },

            parents:function (task, callback) {
                var self = this;

                if (task) {
                    //@TODO: more thorough parent checking
                    self.model.where({property:false}).notEqualTo('parent', task._id).sort('key', 1).run(callback);
                } else {
                    self.model.where({property:false}).sort('key', 1).run(callback);
                }
            },

            path:function (task, callback) {
                //@TODO: prevent circularity
                var path_list = [];

                this._path(task, callback, path_list);
            },

            _path:function (task, cb, path_list) {

                var self = this;

                function _on_get_task(err, task_obj) {
                    path_list.unshift(task_obj);
                    if (task_obj.parent) {
                        self._path(task_obj.parent, cb, path_list);
                    } else {
                        cb(null, path_list);
                    }
                }

                this.get(task._id).populate('parent').run(_on_get_task);

            },

            root_actions:function (cb) {
                this.model.find({type:'action', parent:null}).sort('name', 1).run(cb);
            },

            subactions:function (cb) {

                var ks_regex = /^[^.]+/;
                function _on_actions(err, actions) {
                    var out = {};

                    actions.forEach(function (action) {
                        if (!action.parent) {
                            out[action.key] = [];
                        }
                    });
                    actions.forEach(function (action) {
                        if (action.parent) {
                            var key_start = ks_regex.exec(action.path)[0];
                            out[key_start].push(action.path);
                        }
                    });

                    cb(null, out);
                }

                this.model.find({type:'action'}).sort('path', 1).run(_on_actions);
            },

            subjects:function (cb) {
                this.model.where('type', 'subject').sort('path', 1).run(cb);
            },

            post_save:function (doc, cb) {
                console.log('saving path');
                function _on_path(err, path_list) {
                    var keys = [];
                    path_list.forEach(function (task) {
                        keys.push(task.key);
                    })

                    doc.path = keys.join('.');
                    console.log('path == %s', doc.path);

                    doc.save(cb);
                }

                this.path(doc, _on_path);
            }

        });
    }

    return _model;
}