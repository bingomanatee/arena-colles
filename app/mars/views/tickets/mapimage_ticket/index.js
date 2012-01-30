var ejs = require('../../../../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');

module.exports = function (callback, mapimage) {

    function _on_file(err, file) {
        var out = ejs.render(file.toString(), {mapimage: mapimage});
        callback(null, out);
    }

    fs.readFile(__dirname + '/view.html', _on_file);

}