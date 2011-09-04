var context_module = require('mvc/controller/context');

/**
 *  ERROR CHARACTER
 * Manages page errors - 404s, etc
 */
module.exports = {

    index: require('./error/index.js'),

    show: require('./error/show'),

    error: require('./error/error'),

    show_js: require('./error/show_js'),

        route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/errors/:id/show_js', 'show_js');

            context.get(app, '/errors/:id/error', 'error');
        });
    }

};