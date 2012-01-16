var ejs = require('./../../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');

module.exports = function (callback, action, task, parents) {

    function _on_file(err, file) {
        var out = ejs.render(file.toString(), {action:action, task:task, parents: parents});
        callback(null, out);
    }

    fs.readFile(__dirname + '/task_form.html', _on_file);

}