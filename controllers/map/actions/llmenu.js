var params_module = require('mvc/params');
var model_module = require(MVC_MODELS);
var Math_utils = require('util/math');
var Tileset = require('mola/tileset');

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;
    var params = context.params();
    var result = this.model.get(id, function(err, map) {
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        } else if (map) {
            params.map = params.item = map;

            model_module.model('map_tiles', function(err, mt_model) {

                mt_model.all().toArray(function(err, tiles) {
                    var tiles_indexed = {};
                    tiles.forEach(function(tile) {
                        tile.index = new Tileset(tile);
                        tiles_indexed[tile.data_file.image_file] = tile;
                    });
                        params.tiles = tiles_indexed;
                        context.render(params);

                }); // end all
            }); // end map_tiles model
        } else {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        };
    });
    console.log(__filename, 'get returns now? ', result);
};