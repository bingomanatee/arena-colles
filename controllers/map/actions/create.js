var fs = require('fs');
var models_module = require(MVC_MODELS);
module.exports = function(context) {
    context.request.form.complete(function(err, fields, files) {
         // console.log(__filename + '::create:: request fields');
         // console.log(fields);
         // console.log('files');
         // console.log(files); /** @TODO: revise */
        if (err) {
            next(err);
        } else {
            
            var map = _map_fields(fields);
            
            var tmp_path = files.image.path;
             // console.log('\nuploaded %s to %s', tmp_path, files.image.path);
            var template_path = _map_filepath(files.image.filename, map);
            var full_path = MVC_PUBLIC + map.path;
            var buffer = fs.readFileSync(tmp_path);
            fs.writeFileSync(full_path, buffer);

             // console.log(__filename + ':: saving ' + map._id);
            map.save(function(err, data) {
                if (err) {
                    throw err;
                }
                response.render('map/create.html', {
                    map: map
                });

            });

        }
    });
}
            
var fre = /\[(.*)\]/

function _map_fields(fields){
    var map = {};
    for (var prop in fields) {
        var prop_value = fields[prop];
        if (fre.test(prop)) {
            var match = fre.exec(prop);
            if (match) {
                prop = match[1];
            }
        }
        map[prop] = prop_value;
    }
    
    return map;
}