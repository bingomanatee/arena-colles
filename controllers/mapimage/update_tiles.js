var fs = require('fs');
var pm = require('path');

/**
 *
 * mapimage action: update_tiles
 * 
 * action: reloads
 * @param context
 */
module.exports = function(context) {
     var time = new Date();
    var self = this;
    var rc = context.req_params(true);
    var id = rc.id;
    
    self.model.update_tiles(id, function() {
        context.flash('Done updating heights for image ' + image._id + ' in ' + end_time + ' secs' , 'info', '/mapimage_tiles/' + id);
    });
};