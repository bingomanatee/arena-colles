var Canvas = require('canvas');
require('mola/accessors').load();
var MOLA = require('mola');

module.exports = function(context) {
    this.model.get(context.req_params(true).id, function(err, sector) {
        var data = sector.heights;
        delete sector.heights;
        
        console.log(__filename, ': sector = ', sector);
        
        sector.data = data;

        var mola = new MOLA('', {rows: 512, cols: 512, data: data});
        var c = mola.as_heightmap(0, 2048);
        
       // console.log('context: ', context, '; context request: ', context.request);
        
        c.createPNGStream().pipe(context.response);
    })
}