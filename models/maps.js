var models_module = require(MVC_MODELS);
var context_module = require('mvc/controller/context');

module.exports = {
    collection: 'maps',

    mixins: {
        
        tiles: require('./maps/tiles'),
        
        point_count: require('./map_coords/point_count'),
        
        gen_coords: require('./maps/gen_coords')
    }
}
