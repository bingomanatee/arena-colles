var Tileset = require('mola/tileset');

module.exports = function(context) {
    var self = this;
    var params = context.params();
    var rp = context.req_params(true);
    console.log(__filename, ': getting sector ', rp.id);
    
    this.model.get(rp.id, function(err, sector) {
        console.log('retrieved ', rp.id);
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + rp.id, 'error', '/' + params.plural);
            //  context.next(err);
        } else if (sector) {
            if (rp.format == 'json') {
                    console.log('writing JSON ', rp.id);
                    context.response.write(JSON.stringify(sector));
                    context.response.end();
                    console.log('end of JSON write ', rp.id);
                } else {
                self.model.tile(sector, function(err, tile) {
                    params.sector = params.item = sector;
                    params.tile = tile;
                    params.tileset = new Tileset(tile);
                    context.render(params);
                })
            }
        } else {
            context.flash('Cannot find ' + self.name + ' ' + context.request.params.id, 'error', '/' + params.plural);
        };
    })
}