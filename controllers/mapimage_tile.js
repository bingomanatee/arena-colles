
var context_module = require('mvc/controller/context');

module.exports = {
    index: require('mvc/actions/index'),
    find:  require('./mapimage_tile/find'),

    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/mapimage_tiles/:lat/:lon/find.:format?', 'find');
        });
    }

}