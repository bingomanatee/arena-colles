
var context_module = require('mvc/controller/context');

/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

    collection: 'mapimage',

    index: require('mvc/actions/index'),

    show: require('./mapimage/show'),

    update_tiles: require('./mapimage/update_tiles'),

    color_map: require('./mapimage/color_map'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/mapimages/:id/update_tiles', 'update_tiles');
            context.get(app, '/img/mapimage/:id/color_map.png', 'color_map');

        });
    }

};