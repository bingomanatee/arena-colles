var ejs = require('./../../../../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');
var task_model = require('./../../../model/task');

var _task_model = task_model();

module.exports = function (callback, member, action) {

    function _on_file(err, file) {

        function _on_root_props(err, root_props) {

            function _on_non_props (err, non_props){

                            var out = ejs.render(file.toString(), {member:member, action:action, root_props:root_props, non_props: non_props});
                            callback(null, out);
            }

            _task_model.non_props(_on_non_props);

        }

        _task_model.root_props(_on_root_props);
    }

    fs.readFile(__dirname + '/member_tasks.html', _on_file);

}