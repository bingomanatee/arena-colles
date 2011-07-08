var mm = require(MVC_MODELS);

module.exports.run = function(){
    console.log('getting model foo');
    mm.model('foo', function(err, fm){
         console.log('retrieved foo');
        var d1 = {a: 100, b: 200};
        console.log('put ', d1);
        fm.put(d1, function(err, result){
            console.log('no id put result: ', result);
        })
        
        var d2 = {a: 100, b: 200, _id: 3};
        console.log('put ', d2);
        fm.put(d2, function(err, result){
            console.log('id put, result: ', result);
        })
        
    });    
}

//   gen_model: function(model_name, callback, config, noCache) 