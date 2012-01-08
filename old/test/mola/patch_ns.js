var mm = require(MVC_MODELS);
var Tileset = require('mola/tileset');

module.exports.run = function() {
    mm.model('map_sectors', function(err, ms_model) {

        function _next_sector(c) {
            c.next(function(err, sector) {
                if (sector) {
                  //  console.log('sector ', sector._id, sector.image_file);
                    ms_model.tile(sector, function(err, tile){
                        var tileset = new Tileset(tile, 512, 512);
                        console.log("\ntile: N ", tileset.north(), ', S ', tileset.south(), ', E', tileset.east(), ', W ', tileset.west());
                        console.log('angle range: ', tileset.lat_range(), 'x', tileset.long_range(), ' degrees'),
                        console.log('cols', tileset.get_cols(), ', rows: ', tileset.get_rows(), ', tile range: ', tileset.rows_per_sector, 'x', tileset.cols_per_sector);
                        for (var i = 0; i < Math.floor(tileset.rows_per_sector); ++i){
                            console.log('row(i): ', i, ' degree lat: ', tileset.i_to_degree(i), ' .. ', tileset.i_to_degree(i + 1));
                        }
                            for (var j = 0; j < Math.floor(tileset.cols_per_sector); ++j){
                              console.log('col(j): ', j, ' degree long: ', tileset.j_to_degree(j, true), ' .. ', tileset.j_to_degree(j + 1, true));
                            }
                    });
                    _next_sector(c);
                }
            })
        }

        var c = ms_model.all({
            heights: 0
        });

        _next_sector(c);
    })
}