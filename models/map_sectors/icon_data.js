var Tileset = require('mola/tileset');
var Mola = require('mola');

module.exports = function(id, callback) {
    console.log(__filename, ': ID = ', id);

    var self = this;

    function _on_get(err, sector) {
        function _on_tile(err, tile) {
            var tileset = new Tileset(tile);
            var ratio = 512 / 16;

            var subset = [];
            console.log('making sector icon ', sector._id , ' with tile ', tile._id);
            
            var rr = 0;
            var sector_rows = tileset.get_sector_rows(sector.i);
            var sector_cols = tileset.get_sector_cols(sector.j);
            
            console.log(sector_rows, ' x  ', sector_cols);

            for (var i = 0; i < sector_rows; i += ratio) {
                if (i >= sector.heights.length) {
                    break;
                } else {
                    ++rr;
                    var cc = 0;
                    for (var j = 0; j < sector_cols; j += ratio) {
                        //  console.log('adding ', i, ',', j);
                        subset.push(sector.heights[i * sector_cols + j]);
                        ++cc;
                    }
                }
            }

            console.log('icon data: ', subset.length, ' heights: ', subset.slice(0, 10).join(', '), 'rr: ', rr, ', cc:', cc);
            var mola = new Mola('', {
                rows: rr,
                cols: cc
            });
            mola.data = subset;
            var canvas = mola.as_canvas();

            var stream = canvas.createPNGStream();

            callback(null, stream);
        }

        //  console.log(__filename, ': sector - ', tile);
        self.tile(sector, _on_tile);
    }

    this.get(id, _on_get);

}