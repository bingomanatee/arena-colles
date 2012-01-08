var fs = require('fs');
var models_module = require(MVC_MODELS);

function _map_filepath(image_filename, map) {
    return'/img/maps/' + image_filename;
}

module.exports = function(context) {
    var self = this;
    console.log(__filename, ': request: ', context.request);
    
    context.request.form.complete(function(err, fields, files) {
        console.log(__filename + '::create:: request fields');
        console.log(fields);
        console.log('files');
        console.log(files);

        if (err) {
            next(err);
        } else {

            var map = _map_fields(fields);

            var tmp_path = files.image.path;
            console.log(__filename, ': uploaded to ', tmp_path);
            var template_path = _map_filepath(files.image.name, map);
            console.log(__filename, ': file now at ', template_path);
            map.path = template_path;
            var buffer = fs.readFileSync(tmp_path);
            fs.writeFileSync( MVC_PUBLIC + template_path, buffer);

            // console.log(__filename + ':: saving ' + map._id);
            self.model.put(map, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(__filename, ': data recieved ', data);
                if (data.length){
                    data = data[0];
                }
                context.flash('Created New Map', 'info', '/maps/' + data._id);

            });

        }
    });
}

var fre = /\[(.*)\]/

function _map_fields(fields) {
    var map = {};
    for (var prop in fields) {
        var prop_value = fields[prop];
        if (fre.test(prop)) {
            var match = fre.exec(prop);
            if (match) {
                prop = match[1];
            }
            map[prop] = prop_value;
        }
    }

    return map;
}