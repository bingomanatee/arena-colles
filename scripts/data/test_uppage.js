var uppage = require(__dirname + '/support/uppage');
var path = require('path');

module.exports = function(props, cb){
    uppage(path.resolve(__dirname + '/../../' + props.from), 1, path.resolve(__dirname + '/../../' + props.to), cb);
}