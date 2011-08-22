var config = require('./config');
var launch = require('launch');

launch.init({}, function() {
    var path = __dirname + '/scripts/mola2/update_tiles.js';

    console.log(' ~~~~~~~~~~~~~~~~~ loading SCRIPT:  ' + path);

    var test = require(path);

    if (test.hasOwnProperty('run')) {
        test.run();
        console.log(' ~~~~~~~~~~~~~~~~~ run SCRIPT:  ' + path);
    } else {
        // console.log('your test, ' + path + ', does not have a run method.');
    }
});