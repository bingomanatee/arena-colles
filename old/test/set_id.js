var Mongolian = require('mongolian');

module.exports.run = function() {

    var server = new Mongolian();
    var db = server.db('ac');
    var foo = db.collection('foo');

    var d2 = {z: 1, y: 2};
    
    foo.save(d2, function(e, r){
        console.log('saved ', d2, ' as ', r);
    })

    foo.findOne({
        z: 1
    }, function(err, result) {
        console.log('found ', result);
    });
    

    var data = {
        _id: 1,
        name: "admin"
    };

    foo.save(data, function(e, r){
        console.log('saved ', data, ' as ', r);
    });
    
    foo.findOne({name: 'admin'}, function(err, r){
        
        console.log('found ', r);
    })
    
}