var ejs = require('../../../../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');

module.exports = function (callback, member) {

    function _on_file(err, file) {
        var out = ejs.render(file.toString(), {member: member});
        callback(null, out);
    }

    fs.readFile(__dirname + '/member_ticket.html', _on_file);

}