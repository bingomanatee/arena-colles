var Tileset = require('mola/tileset');

module.exports = function(context) {
    var self = this;
    var params = context.params();
    this.model.get(context.request.params.id, function(err, sector) {
        if (err) {
            context.next(err);
        } else if (sector) {
            self.model.tile(sector, function(err, tile){
            params.sector = params.item = sector;
            params.tile = tile;
            params.tileset = new Tileset(tile);
            context.render(params);
            })
        } else {
            context.flash('Cannot find ' + self.name + ' ' + context.request.params.id, 'error', '/' + params.plural);
        };
    })
}