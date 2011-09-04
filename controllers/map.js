
var context_module = require('mvc/controller/context');

/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('./map/actions/show'),

    add: require('./map/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('./map/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),

    parse_images: require('./map/actions/parse_images'),
    
    forms: {
        reference_color: require('./map/forms/reference_color')
    },

    animate: require('./map/actions/animate'),

    globe: require('./map/actions/globe'),

    segments: require('./map/actions/segments'),
    
   // tile_icon: require('./map/actions/tile_icon'),
    
    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/maps/:id/parse_images', 'parse_images');

            context.get(app, '/maps/:id/animate', 'animate');
            
            context.get(app, '/maps/:id/globe', 'globe');

            context.get(app, '/map_segments/:divs/:zoom', 'segments');
        });
    }
    
};