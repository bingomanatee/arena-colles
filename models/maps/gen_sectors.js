var models_module = require(MVC_MODELS);

function _stub() {};
var Gate = require('util/gate');
var Stat = require('stat');

module.exports = function(map, callback) {
    var self = this;

    function _gen_sectors(err, sector_model) {
        if (err) {
            console.log(__filename, ' error with sector_model: ', err);
            throw err;
        }

        console.log(__filename, ': sector model - ', sector_model);

        /**
         *note - map data is stored as rows == longitude, columns = latitude
         * that is, map raw data is stored in 10000 rows of 500 columns each.
         *  so map raw data row position corresponds with longitude,
         *  and map raw data column position corresponds with latitude.
         *  when we store the data we flip this order. 
         */

        function _post_delete(err, result) {
            console.log('we have deleted');
            // don't care about result
            var rows = _.map(map.height_data.split("\n"), function(row) {
                return row.split(',');
            });
            
            var stat = new Stat(_.flatten(rows));
            var min_color = stat.avg() - stat.std_dev();
            var max_color = stat.avg() + stat.std_dev();
            
            var lat_ticks = rows.length;
            lat_ticks -= lat_ticks % 10;
            var lat_sectors = Math.floor(lat_ticks / 10);

            var lon_ticks = rows[0].length;
            lon_ticks -= lon_ticks % 10;
            var lon_sectors = Math.floor(lon_ticks / 10);

            lon0 = lon_ticks / 2;
            lat0 = lat_ticks / 2;

            lon_scale = 360 / lon_ticks;
            lat_scale = 180 / lat_ticks;

            console.log(__filename, ': lat ticks: ', lat_ticks, '; lon ticks: ', lon_ticks)
            console.log(__filename, ': lat_sectors: ', lat_sectors,'; lon_sectors: ', lon_sectors);

            var gate = new Gate(function() {
                if (callback) callback(null, map)
            });

            function i_to_lon(i) {
                return lon_scale * (i - lon0);
            }

            function i_to_lat(j) {
                return lat_scale * (j - lat0);
            }

            var sectors = [];
            for (var lat_index = 0; lat_index < lat_sectors; ++lat_index) {
                var lat_offset = 10 * lat_index;
                var lat_sector_rows = [];
                for (var lon_index = 0; lon_index < lon_sectors; ++lon_index) {
                    console.log(__filename, ': writing sector  lat_index ', lat_index, ': lon_index ', lon_index);
                    var lon_offset = 10 * lon_index;
                    var sector = {
                        map: map._id,
                        lat_i: lat_index,
                        lon_i: lon_index,
                        height: [
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            []
                        ],
                        zoom: 1,

                        lat_n: 0,
                        lat_s: 0,
                        lon_e: 0,
                        lon_w: 0
                    };

                    sector.lat_n = i_to_lat(10 * lat_index);
                    sector.lat_s = i_to_lat(10 + (10 * lat_index));
                    sector.lon_e = i_to_lon(10 * lon_index);
                    sector.lon_w = i_to_lon((10 * lon_index) + 10);

                    for (var lon = 0; lon < 10; ++lon) {
                        var data_lon = (lon_index * 10) + lon;
                        for (var lat = 0; lat < 10; ++lat) {
                            var data_lat = (lat_index * 10) + lat;

                            sector.height[lon][lat] = rows[lon_offset + lon][lat_offset + lat];
                        }
                    }

                    lat_sector_rows.push(sector);
                }

                sectors.push(lat_sector_rows);
            }


            sectors.forEach(function(sector_row) {
                sector_row.forEach(function(sector) {
                    gate.task_start();
                    sector_model.put(sector, function(err, new_sector) {
                        
                        gate.task_done();
                        if (new_sector.hasOwnProperty('length')){
                            new_sector = new_sector[0];
                        }
                        
                        sector_model.render(sector, gate.task_done_callback(true), min_color, max_color)
                    });
                });
            });

            gate.start();
        }

        // elimiate any previous data

        if (sector_model) {
            sector_model.find_and_delete({
                map: map._id
            }, _post_delete);
        } else {
            console.log(__filename, ': WHERE ARE YOU?', sector_model);
        }

    }

    models_module.model('map_sectors', _gen_sectors);
}