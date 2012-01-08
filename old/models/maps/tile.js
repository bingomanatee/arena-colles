var mm = require(MVC_MODELS);

module.exports = function(id, callback, with_sectors) {
    mm.model('map_tiles', function(err, mt_model) {
        console.log(__filename, ': getting ', id, ' with callback ', callback);

        function _on_get(err, tile) {
            if (with_sectors || true) {
                tile.sectors = [];
                mm.model('map_sectors', function(err, ms_model){
                    ms_model.find({image_file: tile.data_file.image_file}, {heights: 0, data: 0}).toArray(
                      function(err, sectors){
                        tile.sectors = sectors;
                        callback(null, tile);
                      }  
                    );
                });
            }
        }

        mt_model.get(id, _on_get);
    })
}