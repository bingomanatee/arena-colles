var models_module = require(MVC_MODELS);

/*
*/

function _gen_tile(err, mc_model, query, callback) {
    if (err) {
        throw err;
    }

    console.log(__filename, ': tile - mc_model');

    if (typeof(query.map) == 'string') {
        query.map = self._as_oid(query.map);
    }
    box = [
        [query.long - query.width, query.lat - query.height],
        [query.long + query.width, query.lat + query.height]
    ]
    
    var pq = {
        "position": {
            "$within": {
                "$box": box
            }
        }
    };
    
    console.log(__filename, ': query = ', pq, '; box: ', box);
    
    mc_model.find(pq, callback);
}

module.exports = function(query, callback) {
    var self = this;
    _.defaults(query, {
        zoom: 1,
        lat: 0,
        long: 0,
        width: 30,
        height: 15
    });

    models_module.model('map_coords', function(err, mc_model) { _gen_tile(err, mc_model, query, callback); });
}