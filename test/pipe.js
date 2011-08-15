var Pipe = require('util/pipe');

module.exports.run = function() {

    function pipe_action(params, static_params, action_done, series_done) {

        setTimeout(function() {
            console.log('waited for ', params, 'mills');
            action_done();
        }, params);

    }

    function cb() {
        ' done with si test '

        function pipe_action_2(pp, staticparams, adone, sdone) {
            if (staticparams.ticks > 0) {
                console.log(staticparams.ticks, ', ticks left');
                -- staticparams.ticks;
                adone();
            } else {
                sdone();
            }
        }

        var pipe = new Pipe(function() {
            console.log('test done')
        }, pipe_action_2, 500, [], {ticks: 100});

        pipe.start();

    }

    var pipe = new Pipe(cb, pipe_action, 50, [100, 1000, 10000, 1000], {});

    pipe.start();


}