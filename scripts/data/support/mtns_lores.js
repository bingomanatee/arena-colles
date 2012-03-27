var mola_import = require('mola3/import');
var Wstat = require('support/wstat');
var Terrain = require('mola3/grid/Terrain');
var _ = require('underscore');
var util = require('util');
var Stat = require('support/stat');

var DI = 40;

module.exports = function (height_path, scale, write_path, cb) {

    function find_ups(err, grid) {
        var start_time = new Date();
        var ter = new Terrain(grid.data);
        ter.length /= scale;

        var min_height = 1000000;
        var max_height = -1000000;
        var sum = 0;
        var count = 0;

        /*    var h = [];

         ter.each_cell(function (cell) {
         h.push(cell.height);
         });

         var stat = new Stat(h);
         console.log('OVERALL AVG: %s, std_dev: %s', stat.avg(), stat.std_dev()
         )

         var height_range = max_height - min_height;
         var sd = stat.std_dev();
         var smin = stat.avg() - (1.5 * sd);
         var smax = stat.avg() + (1.5 * sd);
         var srange = 3 * sd; */

        console.log('min: %s, max: %s, range: %s', min_height, max_height, height_range);

        var t = (new Date().getTime() - start_time.getTime()) / 1000;

        ter.each_cell(function (cell) {
            min_height = Math.min(min_height, cell.height);
            max_height = Math.max(max_height, cell.height);
            ++count;
            sum += cell.height;

            var debug = false;
            if (!((cell.col % DI) || (cell.row % DI))) {
                console.log('cell: r: %s, c: %s', cell.row, cell.col);
                debug = true;
            }

            cell.angle = 0;

            cell.each_neighbor(function (c, n) {
                n.each_neighbor(function (c, n2) {

                    var rise = cell.height - n2.height;
                    if (rise > 15) {
                        ++cell.angle;
                    } else if (rise < -15) {
                        --cell.angle;
                    }
                })
            });

            if (debug) {
                console.log('angle: %s', cell.angle);
            }
        });

        var avg = sum / count;

        var buffer = new Buffer(ter.cols * ter.rows);

        function _angle_to_color(cell) {
            var pos_angle = cell.angle;
            var c = (cell.angle + 4) * (255 / 8);

            c = _clamp(c, 0, 255);

            var o = ter.cols * cell.row;
            o += cell.col;
            buffer.writeUInt8(c, o, true);
            cell.c = c;
        }

        ter.each_cell(_angle_to_color);

        function _angle_to_png(cell){
            var g = cell.height - avg;
            g = _clamp(128 + g/10, 0, 255);
            return [ g, g, cell.c, 255 ];
        }

        ter.paint(write_path + '.png', _angle_to_png);

        fs.writeFile(write_path, buffer, cb);
    }

    mola_import(height_path, 129, find_ups);
}


function _clamp(n, min, max) {
    return Math.max(min, Math.min(max, Math.floor(n)));
}

function _dist(c1, c2, ter) {
    var dc = c1.col - c2.col;
    var dr = c1.row - c2.col;
    if (dr == 0 && dc == 0) {
        return 0;
    }

    dc *= ter.length;
    dr *= ter.length;
    return Math.sqrt(dc * dc + dr * dr);
}