global.MVC_ROOT = new String(__dirname).replace(/\/test.*/, '');

var load = require('./../node_modules/launch');
load.init();
/**
 * Beginning of example
 */

var db = require(MVC_ROOT + '/models/db').init();
var mongoose_module = require('mongoose');
var robots_module = require('./../models/robots');
var robots_model = robots_module.model();

var q = new mongoose_module.Query();
q.where('parts.weight').gt(1000);
q.asc('name') // sorts robots by name, ascending
robots_model.find(q, function(err, robots) {
    for (var r in robots) {
        var robot = robots[r];
        console.log('robot: ' + robot.name);
        
        robot.parts.forEach(function (part) {
            console.log('part ' + part.name + ' weighs ' + part.weight);
        });
    }
});