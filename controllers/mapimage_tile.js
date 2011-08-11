
var context_module = require('mvc/controller/context');

module.exports = {

    show: require('./mapimage_tile/show'),

    gen_tiles: require('./mapimage_tile/gen_tiles'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/mapimage_tiles/:map_id/gen_tiles', 'gen_tiles');
        });
    }

}