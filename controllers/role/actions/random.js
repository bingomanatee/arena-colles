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
            var rw = new Random_Walker(0, 0, 24, 24, m, function(){
                console.log('.. .  . WRITING WALK DONE!');
                context.render(self._views.random, params);
            });
            params.randomwalker = rw;
            console.log('... random made');
            rw.walk(console.req_params().steps);
            console.log(' . .  . . .  . . DONE WALKING');
          
        })
    })
}