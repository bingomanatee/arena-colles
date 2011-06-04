var models_module = require(MVC_MODELS);

function _stub() {};
var Gate = require('util/gate');

module.exports = function(map, callback) {
    var self = this;

    // scale the map data to -180 .. 180
    lon0 = map.long / 2;
    lat0 = map.lat / 2;

    lon_scale = 360 / map.long;
    lat_scale = 180 / map.lat;

    console.log('lon0: ', lon0, ', lat0: ', lat0, ', lon_scale: ', lon_scale, ', lat_scale: ', lat_scale);
    var exp_points = map.long * map.lat;
    var pt_count = 0;

    function _gen_coords(err, mc_model) {
        if (err) {
            console.log(__filename, ' error with mc_model: ', err);
            throw err;
        }

        function _post_delete(err, result) {
            // don't care about result
            var rows = map.height_data.split("\n");
            var gate = new Gate(function() {
                console.log(pt_count, ' of ', exp_points, ' created');

                if (callback) callback(null, map)
            });
            var last_row_count = 0;
            rows.forEach(function(row, lon) {
                if (lon < map.long) {
                    console.log(__filename, ': indexing LONG : ', lon, '( of ', map.lon, '), ', row.length, ' cols(', map.long, ' expected) ', ' row: ', row.substr(0, 20));
                    console.log(__filename, ': point count exptected: ', lon * map.lat, ', actual: ', pt_count);
                    var cols = row.split(',');
                    last_row_count = pt_count;

                    cols.forEach(function(height, lat) {
                        if(lat < map.lat) {
                            adj_lat = (lat_scale * (lat - lat0));
                            adj_lon = (lon_scale * (lon - lon0));

                            map_pt = {
                                map: map._id,
                                height: height,
                                zoom: 1,
                                parent: false,
                                position: [adj_lon, adj_lat]
                            };

                            if (!((lon % 10) + (lat % 5))) {
                                console.log((lon * lat) * 100 / (map.long * map.lat), '% done');
                                console.log('indexing height: ', height, ', lat: ', lat, ' of ', map.lat,
                                            ', lon: ', lon, ' of ', map.long);
                              //  console.log('creating point: ', map_pt);
                            }
                            gate.task_start();
                            pt_count++;
                            mc_model.put(map_pt, function() {
                                gate.task_done()
                            });
                        } else {
                            console.log('skipping ; lat ', lat, ' > ', map.lat);
                        }
                    });
                    
                } else {
                    console.log('skipping: lat ', lon , ' > ', map.long);
                }
            });
            gate.start();
        }

        // elimiate any previous data
        mc_model.find_and_delete({
            map: map._id
        }, _post_delete);

    }

    models_module.model('map_coords', _gen_coords);
}