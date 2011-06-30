var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var json_utils = require('util/json');
var models_module = require(MVC_MODELS);
var context_module = require('mvc/controller/context');
var _base_actions = ['index', 'show', 'add', 'create', 'edit', 'update', 'destroy'];

var _grants_model = false;

module.exports = function(context) {
    context_module(function(err, Context) {
         // console.log(__filename, ': got context ', err, Context);

        var filenames = [];
        fs.readdir(MVC_CONTROLLERS, function(err, controller_files) {
            controller_files = _filter_cf(controller_files);

            function _get_actions() {
                var actions = Context.registered_actions();
                actions = _.filter(actions, function(n) {
                    return _base_actions.indexOf(n) == -1;
                });
                actions = _.uniq(actions);
                actions = _.sortBy(actions, function(a) {
                    return a
                });
                return actions;
            }

            var actions = _get_actions();

            function _grants_gotten(err, grants) {
                indexed_grants = {};
                grants.forEach(function(g) {
                    indexed_grants[g._id] = g
                });

                context.render({
                    controllers: Context.all_registered_actions(),
                    actions: _base_actions.concat(actions),
                    grants: indexed_grants
                });
            }

            if (_grants_model) {
                _grants_model.all(_grants_gotten);
            } else {
                models_module.model('grants', function(err, gm) {
                    _grants_model = gm;
                    gm.all(_grants_gotten);
                })
            }
        });

    })
}

function _filter_cf(controller_files) {
    controller_files = _.filter(controller_files, function(f) {
        /\.js$/.test(f);
    });
    controller_files = _.map(controller_files, function(f) {
        return f.replace(/\.js$/, '')
    });
    return controller_files;
}