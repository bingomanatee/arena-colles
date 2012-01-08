var models_module = require(MVC_MODELS);

/*
*/

function _gen_tile(err, mc_model, query, callback, self) {
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
        },
        "map": query.map,
        "zoom": query.zoom
    };

    console.log(__filename, ': query = ', pq, '; box: ', box);
    if (!mc_model) {
        callback(new Error('No MC MODEL!!!!'));
    } else if (!mc_model.hasOwnProperty('find')) {
        callback(new Error('No MC MODEL -- Find!!!!', mc_model));
    } else {
        mc_model.find(pq, callback);
    }
}

module.exports = function(query, callback) {
    var self = this;
    _.defaults(query, {
        zoom: 1,
        lat: 0,
        long: 0,
        width: 10,
        height: 5
    });

    models_module.model('map_coords', function(err, mc_model) {
        _gen_tile(err, mc_model, query, callback, self);
    });
}