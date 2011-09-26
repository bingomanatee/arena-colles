var mm = require(MVC_MODELS);

module.exports.run = function() {
    mm.model('mapimage', function(err, mapimage_model) {

        var cursor = mapimage_model.find({"manifest.name" : "MEDIAN_TOPOGRAPHY"});

        function _on_next(err, mapimage){
            var time = new Date();
            if (!mapimage){
                return console.log('!!!!!!!!!! ALL DONE !!!!!!!!!!');
            }
            console.log('reading image ', mapimage._id);
           if (mapimage){
               mapimage_model.color_map(mapimage, function(){

                   console.log('######## DONE WITH IMAGE COLOR ###########');
                   var end_time = new Date();
                   console.log('elapsed time: ', (end_time.getTime() - time.getTime()) / 1000);
                   process.nextTick(function(){
                       cursor.next(_on_next);
                   });
               });
           }
        }

        cursor.next(_on_next);
        
    });
}