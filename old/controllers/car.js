
var context_module = require('mvc/controller/context');

/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('./car/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),
    
    forms: {
        add: {
            configs: {
                action: '/cars/0',
                method: 'post'
            },
            fields : [
                {name: 'car[name]', 'label': 'Vehicle'},
                {name: 'car[type]', 'label': 'Type', 'type': 'select',
                options: [
                    {value: 'buggy', label: 'Buggy'},
                    {value: 'cycle', label: 'Cycle'},
                    {value: 'truck', label: 'Truck'},
                    {value: 'walker', label: 'Walker'}
                ]
                },
                {name: 'car[speed][up50]', label: "Speed (up 50&deg;)"},
                {name: 'car[speed][up40]', label: "Speed (up 40&deg;)"},
                {name: 'car[speed][up30]', label: "Speed (up 30&deg;)"},
                {name: 'car[speed][up20]', label: "Speed (up 20&deg;)"},
                {name: 'car[speed][up10]', label: "Speed (up 10&deg;)"},
                {name: 'car[speed][flat]', label: "Speed (flat)"},
                {name: 'car[speed][down10]', label: "Speed (down 10&deg;)"},
                {name: 'car[speed][down20]', label: "Speed (down 20&deg;)"},
                {name: 'car[speed][down30]', label: "Speed (down 30&deg;)"},
                {name: 'car[speed][down40]', label: "Speed (down 40&deg;)"},
                {name: 'car[speed][down50]', label: "Speed (down 50&deg;)"}
            ]
        },
        edit: {
            configs: {
                action: '/cars/0/update',
                method: 'post'
            },
            fields : [
                {name: 'car[_id]', type: 'hidden'},
                {name: 'car[name]', 'label': 'Vehicle'},
                {name: 'car[type]', 'label': 'Type', 'type': 'select',
                options: [
                    {value: 'buggy', label: 'Buggy'},
                    {value: 'cycle', label: 'Cycle'},
                    {value: 'truck', label: 'Truck'},
                    {value: 'walker', label: 'Walker'}
                ]
                },
                {name: 'car[speed][up50]', label: "Speed (up 50&deg;)"},
                {name: 'car[speed][up40]', label: "Speed (up 40&deg;)"},
                {name: 'car[speed][up30]', label: "Speed (up 30&deg;)"},
                {name: 'car[speed][up20]', label: "Speed (up 20&deg;)"},
                {name: 'car[speed][up10]', label: "Speed (up 10&deg;)"},
                {name: 'car[speed][flat]', label: "Speed (flat)"},
                {name: 'car[speed][down10]', label: "Speed (down 10&deg;)"},
                {name: 'car[speed][down20]', label: "Speed (down 20&deg;)"},
                {name: 'car[speed][down30]', label: "Speed (down 30&deg;)"},
                {name: 'car[speed][down40]', label: "Speed (down 40&deg;)"},
                {name: 'car[speed][down50]', label: "Speed (down 50&deg;)"}
            ]
        }
    },
    
    route: function(app) {
        context_module(function(err, Context) {
            var context_config = {
                controller: module.exports
            };
            var context = new Context(context_config);

        });
    }
    
};

  keys = [];
  for (var value = -50; value <= 50; value += 10){
  if (value > 0){
    keys.push( {label:  'up' + value, value: value});
  } else if (value < 0){
    keys.push( {label: 'down' + (-1 * value), value: value});
  } else {
    keys.push( {label: 'flat', value: 0});
  }
  }