var Canvas = require('canvas');
var draw_canvas = require('support/draw_canvas');

module.exports = function (size, o, f, p, outfile, cb) {

    var canvas = new Canvas(size, size);
    var ctx = canvas.getContext('2d');
    var id = ctx.getImageData(0, 0, size, size);

    for (var r = 0; r <  size; ++r) for (var c = 0; c < size; ++c) {
        var offset = (r * size) + c;
        offset *= 4;
        var n = PerlinNoise_2D(c * f, r * f, p, o);
        var g = Math.floor(255 * n);
       // console.log('r: %s, c: %s, n: %s, g: %s', r, c, n, g);
        id.data[offset] = id.data[offset + 1] = id.data[offset + 2] = g;
        id.data[offset + 3] = 255;
    }

    ctx.putImageData(id, 0, 0);

    draw_canvas(canvas, outfile(o, f, p), cb);

}

var rands = [];

for (var i = 0; i < 1000; ++i){
    rands.push(Math.random() - Math.random());
}
function Noise(x, y) {
    return rands[((x + 2) * ((y + 3) * 2)) % rands.length]
}

function SmoothedNoise1(x, y) {

    var corners = ( Noise(x - 1, y - 1) + Noise(x + 1, y - 1) + Noise(x - 1, y + 1) + Noise(x + 1, y + 1) ) / 16
    var  sides = ( Noise(x - 1, y) + Noise(x + 1, y) + Noise(x, y - 1) + Noise(x, y + 1) ) / 8
    var center = Noise(x, y) / 4
    return corners + sides + center
}

function InterpolatedNoise_1(x, y) {

    var integer_X = Math.floor(x)
    var fractional_X = x - integer_X

    var integer_Y = Math.floor(y)
    var fractional_Y = y - integer_Y

    var v1 = SmoothedNoise1(integer_X, integer_Y)
    var v2 = SmoothedNoise1(integer_X + 1, integer_Y)
    var v3 = SmoothedNoise1(integer_X, integer_Y + 1)
    var v4 = SmoothedNoise1(integer_X + 1, integer_Y + 1)

    var i1 = Interpolate(v1, v2, fractional_X)
    var i2 = Interpolate(v3, v4, fractional_X)

    return Interpolate(i1, i2, fractional_Y)

}
function Interpolate(a, b, x) {
	var ft = x *Math.PI
	var f = (1 - Math.cos(ft)) * .5

	return  a*(1-f) + b*f
}

function PerlinNoise_2D(x, y, p, o) {

    var total = 0

    for (var i = 0; i < o; ++i) {

        var frequency = Math.pow(2, i)
        var amplitude = Math.pow(p, i)

         total += InterpolatedNoise_1(x * frequency, y * frequency) * amplitude
    }

    return total

}