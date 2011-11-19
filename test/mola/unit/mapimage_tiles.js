var mi = require(MVC_MODELS);
var util = require('util');
var fs = require('fs');
var Test_Suite = require('unit/Test/Suite');
var mu = require('util/math');
var data2Dslice = require('mola2/data/data2Dslice');
var unpack2Dbuffer = require('mola2/data/unpack2Dbuffer');

function see(n) {
    return util.inspect(n);
}
var suite = {
    name: "Mapimage_Tiles",

    tests: {

        angle_range_ns: function(n) {
            var self = this;
            console.log('first six:', util.inspect(data2Dslice(self.options.tile_0_180_data, 0, 0, 6, 6)));
        }

    }
}

module.exports = new Test_Suite(suite, { before_all_with_callback: function(cb) {
    var self = this;
    mi.model('mapimage_tiles', function(err, mi) {
        self.options.mit_model = mi;
        mi.get_tile(0, 180, function(err, tile){
            console.log('found tile: ', tile._id);
            self.options.tile_0_180 = tile;
            self.options.tile_0_180_data = unpack2Dbuffer(tile.packed_data.buffer, tile.cols);
            console.log('first 10 bytes: ', util.inspect(tile.packed_data.buffer.slice(0, 10)));
            for (var i = 0; i < 10; ++i){
                console.log(tile.packed_data.buffer[i]);
            }
            cb();
        });

    });
}, debug: 2});