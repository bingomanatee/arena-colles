var mm = require(MVC_MODELS);
var Tileset = require('mola/tileset');

module.exports.run = function() {
    mm.model('map_sectors', function(err, ms_model) {

        function _next_sector(c) {
            c.next(function(err, sector) {
                if (sector) {
                    console.log('sector ', sector._id, sector.i, sector.j);
                    ms_model.tile(sector, function(err, tile) {
                        var tileset = new Tileset(tile, 512, 512);
                  //     console.log("\ntile: N ", tileset.north(), ', S ', tileset.south(), ', E', tileset.east(), ', W ', tileset.west());
                   //     console.log('angle range: ', tileset.lat_range(), 'x', tileset.long_range(), ' degrees'), console.log('cols', tileset.get_cols(), ', rows: ', tileset.get_rows(), ', tile range: ', tileset.rows_per_sector, 'x', tileset.cols_per_sector);

                        var ts = tileset;

                        var north = ts.i_to_degree(sector.i);
                        var south = ts.i_to_degree(1 + sector.i);
                        var east = ts.j_to_degree(sector.j + 1);
                        var west = ts.j_to_degree(sector.j);

                        var s = {
                            "$set": {
                                north: north,
                                west: west,
                                east: east,
                                south: south
                            }
                        };
                  //      console.log('updating sector ', sector._id, ': ', s);

                        ms_model.config.coll.update({
                            _id: sector._id
                        }, s, function(err, result) {
                          //  console.log('result of ', s, ': ', result, err);
                        });
                        _next_sector(c);

                    });
                }
            })
        }

        var c = ms_model.all({
            heights: 0
        }).sort(['image_file', 1, 'i', 1, 'j', 1]);

        _next_sector(c);
    })
}