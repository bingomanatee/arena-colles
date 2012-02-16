var fs = require('fs');
var path = require('path');
var x_pat = /_x_([\d]+)\.bin$/;
var util = require('util');

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


    function _mtn_ness(cell) {
        var count = 0;
        var slopes = 0;

        function _extend_slope(base, n, dir) {
            ++count;
            if (dir.length == 2) {
                slopes += ( n.height - base.height ) / cl2;
            } else {
                slopes += (n.height - base.height) / bl2;
            }
        }

        cell.each_neighbor(function (base, n, dir) {
            ++count;
            if (dir.length == 2) {
                slopes += ( n.height - base.height ) / cl;
            } else {
                slopes += (n.height - base.height) / bl;
            }

               if (n[dir]) {
             _extend_slope(base, n[dir], dir);
             }
        });

        var avg_slope = slopes / count;
        cell.slope = avg_slope;

       // console.log([cell.height, cell.row, cell.col, avg_slope, count, slopes].join(','));
        avg_slopes.push(avg_slope);


    }

    function find_mtns(fpath, scale) {
        mola_import(fpath, 128 * parseInt(scale), function (err, grid) {
            var terrain = new Terrain(grid.data);
            terrain.corner_length = Math.sqrt(2 * terrain.length * terrain.length);

            cl = (1.4 * terrain.corner_length);
            bl = (1.0 * terrain.length);
            cl2 = (terrain.corner_length * (2.8));
            bl2 = (terrain.length * 2.0);

           // console.log("cl: %s, b: %s, cl2: %s, bl2: %s", cl, bl, cl2, bl2);
            terrain.each_cell(_mtn_ness);

            var canvas = new Canvas(grid.cols, grid.rows);

            var id = [];

            terrain.each_cell(function(cell){
                var slope = (cell.avg_slope -2) /4;
                slope = Math.max(0, Math.min(1, slope));

                imageData.push(slope, slope, slope, 1);

            });

            var ctx = canvas.getContext('2d');

            ctx.putImageData(id, 0, 0);

            var stream = canvas.createPNGStream();

            stream.pipe(fs.createWriteStream(fpath + ".slope.png"));


            /*
            var inc = 1;
            var divisor = 100.0;
            var dif = inc / divisor;

            var MinRange = -2;
            var MaxRange = 2;

            for (var d = MinRange * divisor; d < MaxRange * divisor; d += inc){
                var count = 0;
                var num  = d / divisor;
                if (num == MinRange){

                    avg_slopes.forEach(function(v){
                        if (v < num) ++count;
                    })
                    console.log("<= %s,, %s", num.toPrecision(4), count);
                } else if(MaxRange == num){
                    avg_slopes.forEach(function(v){
                        if (v >= num){
                            ++count;
                        }
                    })
                    console.log(">= %s,, %s", num.toPrecision(4),  count);
                } else {
                    var min = num;
                    var max = num + dif;
                    avg_slopes.forEach(function(v){
                        if ((v >= min) && (v < max)){
                            ++count;
                        }
                    })

                        console.log("%s,%s, %s", min.toPrecision(4), max.toPrecision(4), count);
                }

            }   */
            callback();
        });
    }
}