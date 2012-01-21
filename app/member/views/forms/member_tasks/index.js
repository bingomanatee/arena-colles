var ejs = require('./../../../../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');
var task_model = require('../../../models/task');
var util = require('util');

var _task_model = task_model();

module.exports = function (callback, member, action) {

    function _on_file(err, file) {

        function _on_root_actions(err, actions) {

            function _on_subactions(err, subactions) {
                console.log('subactions: %s', util.inspect(subactions));

                function _on_subjects(err, subjects) {

                    var out = ejs.render(file.toString(), {member:member, subactions: subactions, action:action, actions:actions, subjects:subjects});
                    callback(null, out);
                }

                _task_model.subjects(_on_subjects);
            }

            _task_model.subactions(_on_subactions);
        }

        _task_model.root_actions(_on_root_actions);
    }

    fs.readFile(__dirname + '/member_tasks.html', _on_file);

    console.log('form member: %s', util.inspect(member));

}