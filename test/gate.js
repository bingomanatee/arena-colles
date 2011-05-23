var gate = require('util/gate');

module.exports = {
    
    run: function(){
        console.log(__filename + '::init(): starting test');
        var g = new gate(function(){ console.log('done'); });
        
        g.task_start();
        g.start();
        g.task_done();
    }
}