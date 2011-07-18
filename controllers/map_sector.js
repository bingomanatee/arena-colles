var context_module = require('mvc/controller/context');

module.exports = {

    show: require('./map_sector/actions/show'),

    sector_image: require('./map_sector/actions/image'),
    
    sector_height: require('./map_sector/actions/heightmap'),
    
    ij: require('./map_sector/actions/ij'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/map_sectors/image/:id.png', 'sector_image');
            
            context.get(app, '/map_sectors/height/:id.png', 'sector_height');
            
            context.get(app, '/map_sectors/ij/:i/:j/:map_id', 'ij');
        });
    }
}