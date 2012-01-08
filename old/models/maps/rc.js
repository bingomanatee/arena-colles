var Canvas = require('canvas');
var cfi = require('util/canvas/from_image');
var cti = require('util/canvas/to_image');
var ihs = require('util/canvas/image_h');
var mm = require(MVC_MODELS);
var color = require('util/colors');
var fs_utils = require('util/fs');
var Gate = require('util/gate');
var path_module = require('path');

/**
 * This method stamps a series of greyscale images that
 * represent the similarity of a map color to a "reference color" (rc) that
 * represents a given height.
 *
 * This method is optimized for the MOLA map of mars where purple is dark and
 * the hues continue counter clockwise. 
 */

module.exports = function(id, callback) {
    var self = this;
    var huemaps = [];
    console.log(__filename, ': ------------ ');

    self.get(id, function(err, map) {
        console.log(__filename, ': retrieved ', map);
        var img = MVC_PUBLIC + map.path;

        if (map.hasOwnProperty('rc') && map.rc.length) {
            console.log(__filename, ': analyzing rcs: ', map.rc);

            var web_root = '/img/map/rc/' + id;
            var hmp_root = MVC_PUBLIC + web_root;
            fs_utils.ensure_dir(hmp_root);

            var gate = new Gate(function() {
                callback(huemaps);
            });

            var canvas = cfi(img);
            var hsv_data = ihs(canvas);
            map.rc.forEach(function(rc_rgb, rc_index) {

                var file_path = '/' + rc_index + '.png';
                var huemap_path = hmp_root + file_path;
                console.log(__filename, 'analyzing rgb ', rc_rgb, ': dimensions - ', canvas.width, ',', canvas.height);

                var canvas2 = new Canvas(canvas.width, canvas.height);
                var ctx = canvas2.getContext('2d');

                var huemap_id = ctx.createImageData(canvas.width, canvas.height);

                var rc_hue = color.rgb_to_h(rc_rgb.r, rc_rgb.g, rc_rgb.b);

                hsv_data.forEach(function(hh, i) {
                    hh = _hue_diff(hh, rc_hue) * 255 / 180;
                    hh = 255 - _clamp(hh, 0, 255, true);
                    var base = (i * 4)
                    huemap_id.data[base] = hh;
                    huemap_id.data[base + 1] = hh;
                    huemap_id.data[base + 2] = hh;
                    huemap_id.data[base + 3] = 255;
                });


                ctx.putImageData(huemap_id, 0, 0);

                console.log('saving file ', huemap_path);
                cti(canvas2, huemap_path, gate.task_done_callback(true));

                huemaps.push(web_root + file_path);

            })

            gate.start();
        } else {
            console.log(__filename, ': skipping analysis');
            callback([]);
        }

    })

}

function _hue_diff(h1, h2) {
    h1 = (h1 + 360) % 360;
    h2 = (h2 + 360) % 360;
    var diff = Math.abs(h1 - h2);
    if (diff > 180) diff = 360 - diff;
    return diff;
}

function _clamp(v, mx, mn, as_int) {
    if (v < mx) {
        v = mx;
    } else if (v > mn) {
        v = mn;
    }
    return as_int ? parseInt(v) : v;

}