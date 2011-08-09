var fs = require('fs');
var mm = require(MVC_MODELS);

function _map_filepath(image_filename, map) {
    return'/img/maps/' + image_filename;
}

module.exports = function(context) {
    var self = this;
   // console.log(__filename, ': request: ', context.request);

    context.request.form.complete(function(err, fields, files) {
        console.log(__filename + '::create:: request fields');
        console.log(fields);
        console.log('files');
        console.log(files);

        if (err) {
            next(err);
        } else {

            var map = _map_fields(fields);
            console.log('Map fields: ', map);

            var tmp_path = files["map[manifest]"].path;
            console.log(__filename, ': uploaded to ', tmp_path);

            var manifest = JSON.parse(fs.readFileSync(tmp_path));
            var pp = /(.+)<(.*)>/;
            manifest.manifest.forEach(function(image){
               for (var p in image.notes){
                   var value = image.notes[p];
                   console.log('p: ', p, ', value: ', value);
                   if (pp.test(value)){
                       var match = pp.exec(value);
                       console.log('found pair ', match);
                       var vv = {unit: match[2].toLowerCase(), value: parseFloat(match[1])};
                       image.notes[p] = vv;
                   }
               }
            });

            self.model.put(map, function(e, new_map){
                mm.model('mapimage', function(err, mi_model){
                    manifest.manifest.forEach(function(image){
                        var image_record = {
                            map: new_map._id,
                            image_file: image.image_file,
                            manifest: image.notes
                        }
                        mi_model.put(image_record);
                    });
                context.flash('Map Created', 'info', '/maps/' + new_map._id);
                });
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