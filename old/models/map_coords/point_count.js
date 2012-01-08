var models_module = require(MVC_MODELS);

module.exports = function (map_id, callback) {
    map_id = this._as_oid(map_id); // warning - really should use the maps model _to_id method. 
    var mr = {
        mapreduce: "map_coords",
        query: {
            map: map_id
        },
        out: 
            "point_counts"
        ,
        map: function() {
            emit({
                map: this.map,
                zoom: this.zoom
            }, 1);
        }.toString(),
        reduce: function(k, v) {
            var out = 0;
            v.forEach(function(i) {
                out += parseInt(i);
            });
            return out;
        }.toString(),
        
        finalize: function(key, value){
            value = {map: key.map, zoom: key.zoom, count: value};
            return value;
        }.toString()
    }
    
    function _get_point_counts(err, result){
        
        function _with_point_counts(err, counts){
            var out = {};
            counts.forEach(function(c){
               out[c.value.zoom] = c.value.count; 
            });
            callback(null, out);
        }
        
        function _get_point_counts(err, pc_model){
            pc_model.find({"value.map": map_id}, _with_point_counts);
        }
        
        models_module.model('point_counts', _get_point_counts);
    }

    console.log(__filename, ': counting points for map ', map_id, mr);
    
    this.config.db.command(mr, _get_point_counts);
}