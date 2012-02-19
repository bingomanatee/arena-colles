var fs = require('fs');
var path = require('path');
var x_pat = /_x_([\d]+)\.bin$/;
var util = require('util');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var mola_import = require('mola3/import');
var Terrain = require('mola3/grid/Terrain');
var Canvas = require('canvas');

module.exports = function (config, callback) {
    var cl;
    var bl;
    var cl2;
    var bl2;

    var avg_slopes = [];

    var data_file_root = path.join(__dirname, './../../resources/mapimages');
    fs.readdir(data_file_root, function (err, files) {
        files.forEach(function (name) {
            if (x_pat.test(name)) {
                find_mtns(util.format("%s/%s", data_file_root, name), x_pat.exec(name)[1]);
            }
        });
    });

    function find_mtns(fpath, scale) {
        mola_import(fpath, 128 * parseInt(scale) + 1, function (err, grid) {
            var terrain = new Terrain(grid.data);
            terrain.corner_length = Math.sqrt(2 * terrain.length * terrain.length);

            cl = (1.4 * terrain.corner_length);
            bl = (1.0 * terrain.length);
            cl2 = (terrain.corner_length * (2.8));
            bl2 = (terrain.length * 2.0);

            function _normal(cell) {
                var v = 0;

                if (cell.t) {
                    if (cell.b) {
                        v = cell.b.height - cell.t.height;
                        v /= terrain.length * 2;
                    } else {
                        v = cell.height - cell.t.height;
                        v /= terrain.length;
                    }
                } else if (cell.b) {
                    v = cell.b.height - cell.height;
                    v /= terrain.length;
                }

                var h = 0;

                if (cell.l) {
                    if (cell.r) {
                        h = cell.r.height - cell.l.height;
                        h /= terrain.length * 2;
                    } else {
                        h = cell.height - cell.r.height;
                        h /= terrain.length;
                    }
                } else if (cell.r) {
                    h = cell.r.height - cell.height;
                    h /= terrain.length;
                }

                cell.normal = {r: 255 + Math.round(-128 * v), g: 255 + Math.round(-128 * h), b:255}
            }

            function _mtn_ness(cell) {
                var count = 0;
                var heights = 0;

                function _extend_slope(base, n, dir) {
                    // scanning in the same direction as a neighbor, one point away.
                    ++count;
                    if (dir.length == 2) {
                        slopes += ( n.height - base.height ) / cl2;
                    } else {
                        slopes += (n.height - base.height) / bl2;
                    }
                }

                cell.each_neighbor(function (base, n, dir) {
                    ++count;
                    heights += n.height;
                });

                var avg_height = heights / count;
                cell.concavity = avg_height - cell.height;

                console.log('%s  avg_height: %s,  heights: %s / count: %s, concavity: %s',
                    cell_format(cell), s_string(avg_height), heights, count, s_string(cell.concavity));


            }

            // console.log("cl: %s, b: %s, cl2: %s, bl2: %s", cl, bl, cl2, bl2);

            var min;
            var max;
            var oo = terrain.get(0, 0);
            min = max = oo.height;

            terrain.each_cell(function (c) {
                min = Math.min(min, c.height);
                max = Math.max(max, c.height);
            });
            var range = max - min;

            terrain.each_cell(_normal);

            /* *************** NORMAL ***************** */

            var canvas = new Canvas(grid.cols, grid.rows);
            var ctx = canvas.getContext('2d');
            var index = 0;
            var id = ctx.getImageData(0, 0, grid.cols, grid.rows);

            terrain.each_cell(function (cell) {
                var height = (cell.height - min) / range;
                var hnum = Math.floor(height * 255);
                id.data[index] = id.data[index + 1] = id.data[index + 2] = hnum;
                id.data[index + 3] = 255;
                index += 4;
            })

            ctx.putImageData(id, 0, 0);

            draw_canvas(canvas, fpath.replace('mapimages', 'heightmaps') + '.heights.png');

            /* ************** MTN_NESS ************** */

            terrain.each_cell(_mtn_ness);

            canvas = new Canvas(grid.cols, grid.rows);
            ctx = canvas.getContext('2d');

            id = ctx.getImageData(0, 0, grid.cols, grid.rows);
            index = 0;
            terrain.each_cell(function (cell) {
                var concav = 128 + cell.concavity * 10;
                // console.log('cell %s, %s slope = %s', cell.col, cell.row, slope);
                id.data[index] = id.data[index + 1] = id.data[index + 2] = Math.round(concav);
                id.data[index + 3] = 255;
                index += 4;
            });
            ctx.putImageData(id, 0, 0);

            draw_canvas(canvas, fpath.replace('mapimages', 'heightmaps') + '.slope.png');

            canvas = new Canvas(grid.cols, grid.rows);
            ctx = canvas.getContext('2d');

            var id = ctx.getImageData(0, 0, grid.cols, grid.rows);
            index = 0;
            terrain.each_cell(function (cell) {
                id.data[index] = cell.normal.r;
                id.data[index + 1] = cell.normal.g;
                id.data[index + 2] = cell.normal.b;
                id.data[index + 3] = 255;
                index += 4;
            });
            ctx.putImageData(id, 0, 0);

            draw_canvas(canvas, fpath.replace('mapimages', 'heightmaps') + '.normal.png');

            callback();
        });
    }
}

function draw_canvas(canvas, c_path) {

    var stream = canvas.createPNGStream();
    var out = fs.createWriteStream(c_path);

    stream.on('data', function (c) {
        out.write(c);
    });

    stream.on('end', function () {
        out.close();
    })

}

function s_string(slope) {
    return slope.toFixed(6);
}

function cc(n) {
    return _.pad(n, 3, ' ', 'left');
}

function cell_format(cell) {
    return util.format('(c %s, r %s): h %s', cc(cell.col), cc(cell.row), _.pad(cell.height, 6, ' ', 'left'));
}