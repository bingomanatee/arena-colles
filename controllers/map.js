
var context_module = require('mvc/controller/context');

/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('mvc/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),

    gen_coords: require('./map/actions/gen_coords'),
    
    tile: require('./map/actions/tile'),
    
    forms: {
    },
    
    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/maps/:id/gen_coords', 'gen_coords');
            
            context.get(app, '/map/:id/tile/:long/:lat', 'tile');

        });
    }
    
};