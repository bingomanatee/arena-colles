var Canvas = require('canvas');
require('mola/accessors').load();
require('mola/as_terrainmap').load();
var MOLA = require('mola');
var Tileset = require('mola/tileset');

var fs_util = require('util/fs');
var fs = require('fs');

module.exports = function(context) {
    var rp = context.req_params(true);
    var self = this;
    this.model.get(rp.id, function(err, sector) {
        var data = sector.heights;
        delete sector.heights;
        self.model.tile(sector, function(err, tile) {
            var ts = new Tileset(tile);
            console.log(__filename, ': sector = ', sector._id);
           // console.log('... tile = ', ts);
            
            var config = {
                tileset: ts,
                sector: sector
            };
            
            console.log(__filename, 'config: ', config);
            sector.data = data;
            
            var rows = ts.get_sector_rows(sector.i);
            console.log('rows: ', rows);
            
            var cols = ts.get_sector_cols(sector.j);
            console.log('cols: ', cols);
            
            config.cols = cols;
            config.rows = rows;
            config.data = data;
            
            var mola = new MOLA('', config);

            if (rp.format == 'json') {
                context.response.send(JSON.stringify(mola.as_slopemap_json(), null, 3));
                /**
                * @TODO: not exporting json for this yet
                */
            } else {
                var c = mola.as_terrainmap(6);

                // console.log('context: ', context, '; context request: ', context.request);
                c.createPNGStream().pipe(context.response);
                
                var dir = MVC_PUBLIC + '/img/map_sector/' + sector._id;
                fs_util.ensure_dir(dir);
                var fst = fs.createWriteStream(dir + '/terrain.png');
                c.createPNGStream().pipe(fst);
                
            }
        });
    });

}