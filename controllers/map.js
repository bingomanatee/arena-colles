
var context_module = require('mvc/controller/context');

/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('./map/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('./map/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),

 //   gen_coords: require('./map/actions/gen_coords'),

    gen_sectors: require('./map/actions/gen_sectors'),
    
    zoom_back: require('./map/actions/zoom_back'),
    
    zoom_in: require('./map/actions/zoom_in'),
    
    tile: require('./map/actions/tile'),
    
    analyze: require('./map/actions/analyze'),
    
    forms: {
    },
    
    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

         //   context.get(app, '/maps/:id/gen_coords', 'gen_coords');
            
            context.get(app, '/maps/:id/gen_sectors', 'gen_sectors');

            context.get(app, '/maps/:id/zoom_back', 'zoom_back');
            
            context.get(app, '/maps/:id/zoom_in', 'zoom_in');
            
            context.get(app, '/maps/:id/tile/:lon/:lat', 'tile');
            
            context.get(app, '/maps/:id/analyze', 'analyze');

        });
    }
    
};