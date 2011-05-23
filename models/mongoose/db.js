var mongoose = require('mongoose');

module.exports = {
    _db: null,
    init: function(){
        if (!module.exports._db){
            var path = 'mongodb://' + SERVER_NAME + '/' + DB_NAME;
            console.log('connecting to MONGO via ' + path);
           module.exports._db = mongoose.connect(path);
        }
        return module.exports._db;        
    }
    
}