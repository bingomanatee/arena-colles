var mm = require(MVC_MODELS);
var fs_utils = require('util/fs');
var Canvas = require('canvas');
var MOLA = require('mola');
var scale = require('mola/scale');

module.exports = function(context) {
    var params = context.params();

    var self = this;

    mm.model('sector_models', function(err, s_model) {

        var params = context.request.params;

        var sector_web_root = '/img/maps/sectors/' + params.id + '/' + params.x + '/' + params.y + '/' + params.w;
        var sector_img_root = MVC_PUBLIC + sector_web_root;
        fs_utils.ensure_dir(sector_img_root);

        var web_file = '/' + params.h + '.png';
        var out_path = sector_img_root + web_file;

        s_model.get(params.id, function(err, sector) {

            s_model.region(sector, params.x, params, y, params.w, params.h, function(err, heights) {

                var mola = new MOLA('', params.w, params.h, scale());
                mola.data = heights;
                mola.draw(out_path, function() {
                        context.flash('image made', 'info', '/maps/' + sector.map);
                   // context.redirect(sector_web_root + web_file + '?redirect=1');
                   // which should be a file at this point
                });

            })

        });

    });

}