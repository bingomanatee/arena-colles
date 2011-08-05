var models_module = require(MVC_MODELS);
var context_module = require('mvc/controller/context');

module.exports = {
    collection: 'maps',

    mixins: {
        
        tiles: require('./maps/tiles'),
        tile:  require('./maps/tile'),
        
        point_count: require('./map_coords/point_count'),
        
        gen_coords: require('./maps/gen_coords'),
        gen_sectors: require('./maps/gen_sectors'),
        rc: require('./maps/rc'),
        
        zoom_in_bleed: require('./maps/zoom_in_bleed'),
        
        zoom_in: require('./maps/zoom_in')
    }
}
