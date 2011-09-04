var util = require('util');

module.exports = function(context) {
    console.log(__filename);
    var rp = context.req_params(true);
    console.log('params: ', util.inspect(rp));
    var id = rp.id;
    console.log('id = ', id);
    var url = new Buffer(id, 'base64').toString();
    console.log('url = ', url);

    if (/\.js$/.test(url)) {
        context.redirect('/errors/' + rp.id + '/show_js');
    } else {
        context.render(context.request);
    }
}