var param_module = require('mvc/params');
var model_module = require(MVC_MODELS);
var Random_Walker = require('walker/random');

module.exports = function(context) {
    var self = this;
    var params = param_module(this.name);
    
    model_module.model('randomwalks', function(err, m){
        if (err || !m ) {
            console.log(__filename, ': error getting model');
            throw err;
        }
        m.drop(function(){
            var rw = new Random_Walker(m);
            params.randomwalker = rw;
            console.log('... random made');
            if (!context.request.params.hasOwnProperty('steps')) throw new Error('no steps in params');
            var steps = context.request.params.steps;
            console.log(' .. . . . . . WALKING ', steps, ' times');
            rw.start(steps, function(){
                console.log('.. .  . WRITING WALK DONE!');
                context.render(self._views.random, params);
            });
            console.log(' . .  . . .  . . DONE WALKING');
          
        })
    })
}