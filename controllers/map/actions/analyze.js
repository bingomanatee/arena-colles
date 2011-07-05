var Canvas = require('canvas');
var fs = require('fs');
var path_module = require('path');
var colors = require('util/colors');
var forms = require('mvc/forms');
var rc_analysis_module = require('./analyze_rc');

module.exports = function(context) {
    var id = context.request.params.id;
    id = this.model._as_oid(id);

    var self = this;

    function _with_map(err, map) {
        if (err) {
            throw (err);
        }

        console.log('reading map ', map);

        var map_path = MVC_PUBLIC + map.path;

        if (path_module.existsSync(map_path)) {

            function _with_form(err, form) {
                form.configs.action = form.configs.action.replace('0', id);
                self.model.rc(id, function(rc_paths) {
                    console.log(__filename, ': rendering');
                    context.render('map/analyze.html', {
                        map: map,
                        ref_form: form
                    });
                });
            }

            forms(_with_form, self, 'reference_color');

        } else {
            console.log(__filename, ': no map ', map_path);
            throw new Error('cannot get file ' + map_path);
        }
    }

    console.log('looking for map', id);

    this.model.get(id, _with_map);

}

function _image(map_path) {
    var map_image = fs.readFileSync(map_path);
    var img = new Canvas.Image();
    img.src = map_image;
    return img;
}

function _image_data(img) {
    var canvas = new Canvas(img.width, img.height);
    ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, img.width, img.height);

    return ctx.getImageData(0, 0, img.width, img.height).data;
}

function _add_data(ar, value) {
    if (ar[value]) {
        ++ar[value];
    } else {
        ar[value] = 1;
    }
}

function _write_canvas(canvas, path, callback) {
    var out = fs.createWriteStream(path);
    var stream = canvas.createPNGStream();

    stream.on('data', function(chunk) {
        console.log(__filename, '_write_canvas(): writing block');
        out.write(chunk);
    });
    stream.on('end', function() {
        console.log(__filename, '_write_canvas(): ended', callback);
        callback();
    });
}