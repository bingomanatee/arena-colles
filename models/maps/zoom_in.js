var Gate = require('util/gate');
var models_module = require(MVC_MODELS);

/**
 * adds another subdlevel to a map's point data
 */

module.exports = function(id, zoom, callback) {
    var self = this;
    models_module.model('map_sectors', function(err, mc_model) {
        if (err) {
            console.log(__filename, ': error getting model', err);
            throw err;
        } else {
            console.log(__filename, ': model = ', mc_model);
        }

        id = self._as_oid(id);

        gate = new Gate(callback);

        var query = {
            zoom: 1,
            map: id
        }; /* @TODO: store zoom level in map */

        mc_model.find(query, function(err, cursor) {
            cursor.each(function(err, sector) {
                if (sector) {
                    delete sector._id;
                    sector.zoom = 2;
                    
                    for (var d = 0; d < 4; ++d){
                        _double_sector_data(sector);
                    }
                    
                    gate.task_start();
                    mc_model.put(sector, function() {
                        gate.task_done();
                    })
                } else {
                    gate.start();
                }
            });

        }, {
            cursor: true
        });
    });
}

function _c_to_l(i, j, size) {
    return (i * size) + j;
}

function _l_to_c(l, size) {
    var j = l % size;
    var i = parseInt((l - j) / size);
    return {
        i: i,
        j: j
    };
}

function _flatten_heights(heights) {
    min = Math.min.call(heights);
    max = Math.max.call(heights);
    var rough = Math.max(2, math.max - math.min);
    var rough_height = (Math.random() * rough) - (rough / 2);
    
    var height = 0;
    heights.forEach(function(h) {
        height += h;
    });
    
    height = Math.round((height / heights.length) + rough_height);
    return height;
}

function _double_sector_data(sector) {
        var old_sector_size = sector.height.length;
        var new_sector_size = sector.height.length * 2;
        var new_data = [];
        for (var c = 0; c < new_sector_size * new_sector_size; ++c) {
            new_data.push([]);
        }

        for (var i = 0; i < old_sector_size; ++i) for (var j = 0; j < old_sector_size; ++j) {
            var new_i = i * 2;
            var new_j = j * 2;

            [
                [-1, -1],
                [-1, 0],
                [-1, 1],
                [0, -1, 0, 1],
                [1, -1],
                [1, 0],
                [1, 1]
            ].forEach(

            function(offset) {
                var new_i_o = new_i + offset[0];
                var new_j_o = new_j + offset[1];

                if ((new_i_o > 0) && (new_i_0 < new_sector_size) && (new_j_0 > 0) && (new_j_0 < new_sector_size)) {
                    new_data[_c_to_l(new_i_o, new_j_o)].push(sector.height)
                }
            });
        }

        new_data = _.map(new_data, _flatten_heights)

        // return data to the sector height array.

        sector.height = [];
        for (var j = 0; j < new_sector_size; ++j){
            sector.height.push(new_data.slice(j * new_sectors_size, new_sector_size));
        }

    }
