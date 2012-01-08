    var Mongolian = require('mongolian');
    
    module.exports.run = function() {
    
        var server = new Mongolian();
        var db = server.db('ac');
        var foo = db.collection('foo');
    
       // console.log('f == ', foo);
        var d = {
            a: 1,
            b: 6
        };
    
        foo.insert(d);
    
        foo.findOne({
            b: 6
        }, function(err, f) {
            console.log('found ', f);
    
            f.c = 3;
    
            foo.save(f,  function(err, f2) {
                console.log('saved: ', err, f2);
                
                foo.findOne({
                    b: 6
                }, function(err, f) {
                    console.log('found again ', f);
                })
            });
        })
    
    }