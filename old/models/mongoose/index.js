

module.exports = {
    
    findAll: function(){
        var out = {};
        
        out.users   = require('./users');
        out.sprites = require('./sprites');
        out.actors  = require('./actors');
        out.stories  = require('./stories');
        
        return out;
    },
    
    get: function(model){
        return require('./' + model);
    }
}