
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

    color_map_segment:   require('./mapimage/color_map_segment'),

    normnal_map_segment: require('./mapimage/normal_map_segment'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/mapimages/:id/update_tiles', 'update_tiles');
            context.get(app, '/img/mapimage/:id/color_map.png', 'color_map');
            context.get(app, '/img/mapimage_segments/:north/:south/:east/:west/:zoom/color_map.png', 'color_map_segment');
            context.get(app, '/img/mapimage_segments/:north/:south/:east/:west/:zoom/normal_map.png', 'normnal_map_segment');

        });
    }

};