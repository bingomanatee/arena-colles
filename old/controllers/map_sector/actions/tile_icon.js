var mm = require(MVC_MODELS);
var fs = require('fs');

module.exports = function(context) {
    var params = context.req_params(true);
    var tid = params.id;

    console.log('getting sector icon ' + tid);

    this.model.icon_data(tid, function(err, icon_data) {
        console.log(__filename, ': icon_data = ', icon_data);
        var out = '';
        var writestream = fs.createWriteStream(MVC_PUBLIC + '/img/section_icon/' + tid + '.png');
        
        icon_data.on('data', function(d) {
            writestream.write(d);
            context.response.write(d);
        });

        icon_data.on('end', function() {
            writestream.end();
            context.response.end();
        });
    });
}