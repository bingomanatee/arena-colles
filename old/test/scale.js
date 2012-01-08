var colors = require('util/colors');

function _next_measure(i, input) {
    var out = null;

    input.forEach(function(m) {
        if (m.height >= i) {
            if (out) {
                if (out.height > m.height) {
                    out = m;
                }
            } else {
                out = m;
            }
        }
    });
    return out;
}

function _prev_measure(i, input) {
    var out = null;

    input.forEach(function(m) {
        if (m.height <= i) {
            if (out) {
                if (out.height < m.height) {
                    out = m;
                }
            } else {
                out = m;
            }
        }
    });
    return out;
}

function _linear(p1, a, b) {
    return ((p1 * a) + ((1 - p1) * b));
}

function _extrapolate(i, p, n) {
    var range = n.height - p.height;
    var extent = i - p.height;
    var progress = 1 - (extent / range);

    var h = _linear(progress, p.hsv[0], n.hsv[0]);
    var s = _linear(progress, p.hsv[1], n.hsv[1]);
    var v = _linear(progress, p.hsv[2], n.hsv[2]);

    return {
        height: i,
        hsv: [h, s, v],
        rgb: colors.hsv_to_rgb(h, s, v)
    };
}

module.exports = {
    measure: function(height, r, g, b) {
        return {
            height: height,
            rgb: [r, g, b],
            hsv: colors.rgb_to_hsv(r, g, b)
        };
    },

    scale: function(input, max_incs) {
        console.log('input: ', input);

        var max = 0;
        var min = max = input[0].height;

        input.forEach(function(m) {
            if (m.height > max) max = m.height;
            if (m.height < min) min = m.height;
        })

        var increment = Math.max(1, Math.floor((max - min) / max_incs));

        var scale = [input[0]];

        for (var i = increment; i < max; i += increment) {
            var prev_measure = _prev_measure(i, input);
            var next_measure = _next_measure(i, input);

            console.log('height: ', i, '; prev: ', prev_measure, '; next: ', next_measure);
            if (prev_measure.height == next_measure.height){
                v = prev_measure;
            } else if (prev_measure) {
                if (next_measure) {
                    var v = _extrapolate(i, prev_measure, next_measure);
                } else {
                    var v = prev_measure;
                }
            } else {
                var v = next_measure;
            }
            scale.push(_.defaults({
                height: i
            }, v));
        }
        scale.push(input[input.length - 1]);

        return scale;
    },

    run: function() {
        var stops = [];

        stops.push(this.measure(0, 255, 0, 0));
        stops.push(this.measure(13, 100, 100, 0));
        stops.push(this.measure(60, 0, 255, 0));
        var s = this.scale(stops, 20);
        console.log(s);
        var template = __dirname + '/scale.template.html';
        var template_file = fs.readFileSync(template, 'utf8');

        var html = ejs.render(template_file, {
            locals: {
                s: s
            }
        });

        fs.writeFileSync(__dirname + '/scale.html', html);
    }
}