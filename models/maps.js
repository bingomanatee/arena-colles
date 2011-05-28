var models_module = require(MVC_MODELS);
var context_module = require('mvc/controller/context');

module.exports = {
    collection: 'maps',

    mixins: {
        
        tile: function(query, callback){
            var self = this;
            _.defaults(query, {zoom: 1, lat: 0, long: 0, width: 30, height: 15});
            
            function _gen_tile(err, mc_model){
                if (typeof(query.map) == 'string'){
                    query.map = self._to_id(query.map);
                }
                box = [[query.long - query.width, query_lat - query.height], [query.long + query.width, query.lat + query.height]]
                 mc_model.find({"loc" : {"$within" : {"$box" : box}}}, callback);
            }
            
            models_module.model('map_coords', _gen_tile);
        },
        
        gen_coords: function(map, callback) {
            var self = this;
            lon0 = map.long / 2;
            lat0 = map.lat / 2;
            lon_scale = 360 / map.long;
            lat_scale = 180 / map.lat;
            
            function _gen_coords(err, mc_model) {

                function _post_delete(err, result) {
                    
                    var rows = map.height_data.split("\n");

                    rows.forEach(function(row, lat) {
                        var cols = row.split(',');
                        cols.forEach(function(height, lon) {
                            
                            lat = (lat_scale * (lat - lat0));
                            lon - (lon_scale * (lon - lon0));
                            
                            map_pt = {
                                map: map._id,
                                height: height,
                                zoom: 1,
                                parent: false,
                                position: [lon, lat]
                            };
                            mc_model.put(map_pt, _stub);

                        })
                    });
                    
                    if (callback){
                        callback(null, map);
                    }
                }

                mc_model.find_and_delete({
                    map: map._id
                }, _post_delete);

            }

            models_module.model('map_coords', _gen_coords);
        }
    }
}

function _stub() {}