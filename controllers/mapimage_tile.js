
var context_module = require('mvc/controller/context');

module.exports = {

    show: require('./mapimage_tile/show'),

    gen_tiles: require('./mapimage_tile/gen_tiles'),

    ao_map: require('./mapimage_tile/ao_map'),

    color_map: require('./mapimage_tile/color_map'),

    update_heights: require('./mapimage_tile/update_heights'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/mapimage_tiles/:map_id/gen_tiles', 'gen_tiles');
            context.get(app, '/img/mapimage_tiles/:id/ao_map.png', 'ao_map');
            context.get(app, '/img/mapimage_tiles/:id/color_map.png', 'color_map');
            context.get(app, '/mapimage_tiles/:id/update_heights', 'update_heights');
        });
    }

}

/*