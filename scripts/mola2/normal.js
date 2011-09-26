var mm = require(MVC_MODELS);

module.exports.run = function() {
    mm.model('mapimage', function(err, mapimage_model) {

        var cursor = mapimage_model.find({"manifest.name" : "MEDIAN_TOPOGRAPHY"}).skip(6);

        function _on_next(err, mapimage){
            if (!mapimage){
                return console.log('!!!!!!!!!! ALL DONE !!!!!!!!!!');
            }
            console.log('reading image ', mapimage._id);
           if (mapimage){
               mapimage_model.normal_map(mapimage, function(){
                   console.log('######## DONE WITH IMAGE NORMAL ###########');
                   return cursor.next(_on_next);
               });
           }
        }

        cursor.next(_on_next);
        
    });
}