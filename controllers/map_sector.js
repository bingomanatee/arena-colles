var context_module = require('mvc/controller/context');

module.exports = {

    show: require('./map_sector/actions/show'),

    sector_image: require('./map_sector/actions/image'),
    
    sector_height: require('./map_sector/actions/heightmap'),
    
    sector_slopemap: require('./map_sector/actions/slopemap'),
    
    sector_terrainmap: require('./map_sector/actions/terrainmap'),
    
    ij: require('./map_sector/actions/ij'),
    
    tile_icon: require('./map_sector/actions/tile_icon'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/img/map_sector/:id/color.png', 'sector_image');
            
            context.get(app, '/img/map_sector/:id/height.png', 'sector_height');
            
            context.get(app, '/img/map_sector/:id/slope.png', 'sector_slopemap');
            
            context.get(app, '/img/map_sector/:id/terrain.png', 'sector_terrainmap');
            
            context.get(app, '/map_sectors/ij/:i/:j/:map_id', 'ij');
            
            context.get(app, '/img/map_sectors/:id/icon.png', 'tile_icon');
        });
    }
}