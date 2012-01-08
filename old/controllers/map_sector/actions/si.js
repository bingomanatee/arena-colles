var mm = require(MVC_MODELS);
var fs_utils = require('util/fs');
var Canvas = require('canvas');
var MOLA = require('mola');
var scale = require('mola/scale');

module.exports = function(context) {

    var self = this;

    var params = context.request.params;
    console.log('reading region : ', params);

    var sector_web_root = '/img/maps/sectors/' + params.id + '/' + params.x + '/' + params.y + '/' + params.w + '/' + params.h;
    var sector_img_root = MVC_PUBLIC + sector_web_root;
    console.log('ensuring dirs: ', sector_img_root);
    fs_utils.ensure_dir(sector_img_root);

    var web_file = '/graph.png';
    var out_path = sector_img_root + web_file;
    var redir = '/map_sectors/' + params.id + '?x=' + params.x + '&y=' + params.y;
    function _on_data(err, hh){
            if (err){
                console.log('NOT writing data: ', err);
                context.flash('bad row count', 'error', redir);
            } else {
            console.log('writing to ', out_path, 'heights = ', hh.length);
            var mola = new MOLA('', params.w/2, params.h, scale());
            mola.data = hh;
            mola.draw(out_path, function() {
                context.flash('image made', 'info', redir);
                // context.redirect(sector_web_root + web_file + '?redirect=1');
                // which should be a file at this point
            });
        
            }
    }

    this.model.get(params.id, function(err, sector) {
        self.model.region(sector, params.x, params.y, params.w, params.h, _on_data);
    });
}