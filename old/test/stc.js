var models_module = require(MVC_MODELS);


module.exports.run = function(){
    
    models_module.model('map_sectors', function(err, ms_model){
       
        var sector = {
            _id: 'bar',
            map: 'foo',
            height: [
                [0, 0, 5, 10],
                [0, 2, 4, 6],
                [5, 5, 5, 5],
                [3, 2, 1, 0]
            ]
        };
        
        ms_model.render(sector, function(){console.log('sector rendered')});
        
    });
    
}