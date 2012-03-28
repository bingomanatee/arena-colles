var path = require('path');
var noise = require('./support/noise2');
var util = require('util');

var perlin_folder = path.resolve(__dirname + '/../../resources/perlins');

function _outfile(o, f, p) {
    return util.format('%s/perlin_o_%s_f_%s_p_%s.png', perlin_folder, o, f, p);
}

module.exports = function (config, cb) {

    for (var p = 1.25; p <= 2; p += 0.25) {
        for (var o = 2; o <  5; ++o) {
            for (var f = 0.125; f < 2; f += 0.125) {
                console.log('rendering o %s, f %s, p %s', o, f, p);

                noise(300, o, f, p, _outfile, function () {
                    console.log('... rendered o %s, f %s, p %s', o, f, p);
                });
            }
        }
    }
}