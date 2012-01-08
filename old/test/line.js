global.MVC_ROOT = new String(__dirname).replace(/\/test.*/, '');

var load = require('./../node_modules/launch');
load.init();
var lines = require('./../models/lines');
var query = {story_id: '4d837535120793fc18000001'}; // this is an ID from the current database.

lines.model().find(query, ['order'], function(err, lines){
    lines.forEach(function(line){
         // console.log('line order' + line._id + ' = ' + line.order);
    });
});