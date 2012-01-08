var Canvas = require('canvas');
require('mola/accessors').load();
require('mola/slopes').load();
var MOLA = require('mola');
var Tileset = require('mola/tileset');

module.exports = function(context) {
    var rp = context.req_params(true);
    var self = this;
    this.model.get(rp.id, function(err, sector) {
        var data = sector.heights;
        delete sector.heights;
        self.model.tile(sector, function(err, tile) {
            var ts = new Tileset(tile);
            console.log(__filename, ': sector = ', sector);
            console.log('... tile = ', ts);
            
            sector.data = data;
            var config = {
                rows: ts.get_sector_rows(sector.i),
                cols: ts.get_sector_cols(sector.j)
            };
            
            console.log(__filename, 'config: ', config);
            config.data = data;
            
            var mola = new MOLA('', config);

            if (rp.format == 'json') {
                context.response.send(JSON.stringify(mola.as_slopemap_json(), null, 3));
            } else {
                var c = mola.as_slopemap();

                // console.log('context: ', context, '; context request: ', context.request);
                c.createPNGStream().pipe(context.response);

            }
        });
    });

}