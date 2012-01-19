var ejs = require('./../../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');

var _months = [];

'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',').forEach(function(name, i){
    _months.push({value: i, label: name});
})

module.exports = function (callback, action, member) {

    function _on_file(err, file) {
        var out = ejs.render(file.toString(), {member: member, action: action, months: _months});
        callback(null, out);
    }

    fs.readFile(__dirname + '/member_form.html', _on_file);

}