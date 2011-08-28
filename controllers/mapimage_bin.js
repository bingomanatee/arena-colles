
var context_module = require('mvc/controller/context');

module.exports = {

    show: require('./mapimage_bin/show'),

    gen_bin: require('./mapimage_bin/gen_bin'),

    ao_map: require('./mapimage_bin/ao_map'),

    color_map: require('./mapimage_bin/color_map'),

    update_heights: require('./mapimage_bin/update_heights'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/mapimage_bin/:map_id/gen_bin', 'gen_bin');
            context.get(app, '/img/mapimage_bin/:id/ao_map.png', 'ao_map');
            context.get(app, '/img/mapimage_bin/:id/color_map.png', 'color_map');
            context.get(app, '/mapimage_bin/:id/update_heights', 'update_heights');
        });
    }

}