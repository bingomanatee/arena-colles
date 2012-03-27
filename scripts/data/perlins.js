var path = require('path');
var noise = require('./support/noise');
var util = require('util');

var perlin_folder = path.resolve(__dirname + '/../../resources/perlins');

function _outfile(o, f, p) {
    return util.format('%s/perlin_o_%s_f_%s_p_%s.png', perlin_folder, o, f, p);
}

module.exports = function (config, cb) {

    for (var p = 0.25; p <= 1; p += 0.25) {
        for (var o = 1; o <  3; ++o) {
            for (var f = 0.5; f < 1.5; f += 0.25) {
                noise(100, o, f, p, _outfile, function () {
                    console.log('rendered o %s, f %s, p %s', o, f, p);
                });
            }
        }
    }

}