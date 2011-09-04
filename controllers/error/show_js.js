var ejs = require('ejs');
var util = require('util');
var fs = require('fs');

module.exports = function(context) {
    console.log(__filename);
    var rp = context.req_params(true);
    console.log('params: ', util.inspect(rp));
    var id = rp.id;
    console.log('id = ', id);
    var url = new Buffer(id, 'base64').toString();
    console.log('url = ', url);

    var _template = fs.readFileSync(MVC_VIEWS + '/error/show.js', 'utf8');
    console.log('template: ', _template);
     var txt = ejs.render(_template, {locals:{url: url}});

    context.response.write(txt);
    context.response.end();
    
}
