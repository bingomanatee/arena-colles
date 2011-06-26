
var context_module = require('mvc/controller/context');

/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

   index: require('./walker/actions/index'),

   // show: require('./walker/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),
    
   // find: require('./walker/actions/find'),
    
   // coverage: require('./walker/actions/coverage'),
    
    forms: {
      //  walkto: require('./walker/forms/walkto')
        },
    
    randomwalk: require('./walker/actions/random'),
    
    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

            context.get(app, '/randomwalk/:steps', 'randomwalk', 'walker/random.html');
         //   context.post(app, '/walkers/0/find', 'find', 'walker/find.html');
         //   context.get(app, '/walkers/0/coverage', 'coverage', 'walker/coverage.html');
        });
    }
    
}