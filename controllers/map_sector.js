var context_module = require('mvc/controller/context');

module.exports = {

    show: require('./map_sector/actions/show'),

    sector_image: require('./map_sector/actions/si'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/img/sector_images/:id/:x/:y/:w/:h/graph.png', 'sector_image');
        });
    }
}