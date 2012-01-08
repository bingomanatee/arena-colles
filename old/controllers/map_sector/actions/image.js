var Canvas = require('canvas');
require('mola/accessors').load();
var MOLA = require('mola');
var fs_util = require('util/fs');
var fs = require('fs');

module.exports = function(context) {
    this.model.get(context.req_params(true).id, function(err, sector) {
        var data = sector.heights;
        delete sector.heights;
        
        console.log(__filename, ': sector = ', sector);
        
        sector.data = data;

        var mola = new MOLA('', {rows: 512, cols: 512, data: data});
        var c = mola.as_canvas();
        
       // console.log('context: ', context, '; context request: ', context.request);
        
        c.createPNGStream().pipe(context.response);
        var dir = MVC_PUBLIC + '/img/map_sector/' + sector._id;
        fs_util.ensure_dir(dir);
        var fst = fs.createWriteStream(dir + '/color.png');
        c.createPNGStream().pipe(fst);
    })
}