global.MVC_ROOT = new String(__dirname).replace(/\/test.*/, '');

var load = require('./../node_modules/launch');
load.init();
/**
 * Beginning of example
 */

var robots_module = require('./../models/robots');
var robots_model = robots_module.model();

var micronaut = robots_module.model(true); // getting an activeRecord;
// == new mongoose.model('Robots');
micronaut.name = 'Lord Luma';
micronaut.parts = [{
    part_number: 526232,
    name: 'tiny_lance',
    weight: 3
}];

micronaut.save(function(err, micronaut_saved) {
    if (err) {
        throw err;
    }
    var bender = robots_module.model(true); // getting an activeRecord;
    // == new mongoose.model('Robots');
    bender.name = 'Bender';
    bender.parts = [{
        part_number: 111,
        name: 'Bending Arms',
        weight: 500
    }, {
        part_number: 15252,
        name: 'Hideaway Body',
        weight: 1500
    }];

    bender.save(function(err, bender_saved) {
        if (err) {
            throw err;
        }

        var r2d2 = robots_module.model(true); // getting an activeRecord;
        // == new mongoose.model('Robots');
        r2d2.name = 'R2D2';
        r2d2.parts = [{
            part_number: 111,
            name: 'Legs',
            quantity: 2,
            weight: 800
        }, {
            part_number: 15252,
            name: 'Torso',
            weight: 1500
        }];
        r2d2.save(function(err, r2d2_saved) {
            if (err) {
                throw err;
            }

            robots_module.model().find({}, function(err, robots) {
                robots.forEach(function(robot) {
                    console.log('robot ' + robot._id + ': ' + robot.name);
                })
            })
        })
    })
})