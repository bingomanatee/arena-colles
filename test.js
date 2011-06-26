var launch = require('launch');

launch.init({}, function() {
    var path = __dirname + '/test/' + process.argv[2];

    console.log('loading test ' + path);

    var test = require(path);

    if (test.hasOwnProperty('run')) {
        test.run();
    } else {
        // console.log('your test, ' + path + ', does not have a run method.');
    }
});