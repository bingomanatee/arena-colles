var fs = require('fs');
var path = require('path');
var x_pat = /_x_([\d]+)\.bin$/;
var util = require('util');
var _ = require('underscore');
var rainage = require('./support/rainage');
var normal = require('./support/normal');
var draw_canvas = require('./support/draw_canvas');
var Stat = require('support/stat');
var drippage = require('./support/drippage');
var concavity = require('./support/concavity');
var cf = require('./support/cell_format');
var cell_format = cf.cell_format;
var median_mtn_ness = require('./support/median_mtn_ness');
var cc = cf.column_block;
var highpass = require('./support/highpass');
var terrain_smooth = require('./support/terrain_smooth');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var mola_import = require('mola3/import');
var Terrain = require('mola3/grid/Terrain');
var Canvas = require('canvas');
/**
 * Note - mtn is actually a rating of "Valleyness.
 * @param config
 * @param callback
 */
module.exports = function (config, callback) {
    var cl;
    var bl;
    var cl2;
    var bl2;

    var avg_slopes = [];

    var data_file_root = path.join(__dirname, './../../resources/mapimages_lg');
    fs.readdir(data_file_root, function (err, files) {
        files.forEach(function (name) {
            if (!x_pat.test(name)) {
                return;
            }
            console.log('@@@@@@@@@@@@ analyzing %s/ %s', data_file_root, name)
            find_mtns(util.format("%s/%s", data_file_root, name), x_pat.exec(name)[1]);
        });
    });

    function find_mtns(fpath, scale) {
        mola_import(fpath, 128 * parseInt(scale) + 1, function (err, grid) {
            var original_terrain = new Terrain(grid.data);
            original_terrain.corner_length = Math.sqrt(2 * original_terrain.length * original_terrain.length);

            /* ***************** ANALYZE ************ */

            cl = (1.4 * original_terrain.corner_length);
            bl = (1.0 * original_terrain.length);
            cl2 = (original_terrain.corner_length * (2.8));
            bl2 = (original_terrain.length * 2.0);

            var min;
            var max;
            var oo = original_terrain.get(0, 0);
            min = max = oo.height;

            original_terrain.each_cell(function (c) {
                min = Math.min(min, c.height);
                max = Math.max(max, c.height);
            });
            var range = max - min;

            original_terrain.each_cell(normal);

            /* *************** HEIGHT ***************** */

            var canvas = new Canvas(grid.cols, grid.rows);
            var ctx = canvas.getContext('2d');
            var index = 0;
            var id = ctx.getImageData(0, 0, grid.cols, grid.rows);

            original_terrain.each_cell(function (cell) {
                var height = (cell.height - min) / range;
                var hnum = Math.floor(height * 255);
                id.data[index] = id.data[index + 1] = id.data[index + 2] = hnum;
                id.data[index + 3] = 255;
                index += 4;
            })

            ctx.putImageData(id, 0, 0);

            draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.heights.png');

            /* *************** NORMAL ***************** */

            canvas = new Canvas(grid.cols, grid.rows);
            ctx = canvas.getContext('2d');

            var id = ctx.getImageData(0, 0, grid.cols, grid.rows);
            index = 0;
            original_terrain.each_cell(function (cell) {
                id.data[index] = cell.normal.r;
                id.data[index + 1] = cell.normal.g;
                id.data[index + 2] = cell.normal.b;
                id.data[index + 3] = 255;
                index += 4;
            });
            ctx.putImageData(id, 0, 0);

            draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.normal.png');

            /* ************** MTN_NESS ************** */

            function cb() {

                //  highpass(terrain, 6, 'hp1');

                // highpass(terrain, 12, 'hp2');

                highpass(original_terrain, 9, 'hp3');

                original_terrain.each_cell(function (cell) {

                    var vallyness = Math.round(cell.valleyness);
                    var h3 = Math.max(0, Math.round(cell.hp3 + 80));
                    var mtn_ness = Math.max(vallyness, h3);
                    mtn_ness = Math.floor(Math.min(255, mtn_ness));
                    cell.mtn_ness = mtn_ness;
                });

                original_terrain.each_cell(median_mtn_ness);

                /* ********* CONCAVITY *********************** */

                original_terrain.each_cell(concavity);
                original_terrain.each_cell(_cc_rough);

                canvas = new Canvas(grid.cols, grid.rows);
                ctx = canvas.getContext('2d');
                id = ctx.getImageData(0, 0, grid.cols, grid.rows);
                index = 0;

                original_terrain.each_cell(function (cell) {
                    var concav = 128 + Math.round(cell.concavity);
                    id.data[index] = id.data[index + 1] = id.data[index + 2] = concav;
                    id.data[index + 3] = 255;
                    index += 4;
                });
                ctx.putImageData(id, 0, 0);

                draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.concavity.png');

                canvas = new Canvas(grid.cols, grid.rows);
                ctx = canvas.getContext('2d');
                id = ctx.getImageData(0, 0, grid.cols, grid.rows);
                index = 0;

                original_terrain.each_cell(function (cell) {
                    var concav = Math.round(cell.concavity_roughness * 5);
                    id.data[index] = id.data[index + 1] = id.data[index + 2] = concav;
                    id.data[index + 3] = 255;
                    index += 4;
                });
                ctx.putImageData(id, 0, 0);

                draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.concavity_roughness.png');

                /** Map out mountain regions to bitmap *************** */

                    //  terrain.each_cell(rain_amount);
                var groups = [];

                // terrain.each_cell(clump);
                // terrain.each_cell(flip);

                canvas = new Canvas(grid.cols, grid.rows);
                ctx = canvas.getContext('2d');

                id = ctx.getImageData(0, 0, grid.cols, grid.rows);
                index = 0;
                original_terrain.each_cell(function (cell) {
                    //    var h1 = Math.round(cell.hp1 + 128);
                    //   var h2 = Math.round(cell.hp2 + 128);
                    var h3 = Math.max(0, Math.round(cell.hp3 + 80));
                    //   if (!(index % 50)) console.log('cell %s valleyness = %s', cell_format(cell), cell.valleyness);
                    //  id.data[index] = id.data[index + 1] = id.data[index + 2] = vallyness;
                    id.data[index] = h3;
                    id.data[index + 1] = h3;
                    id.data[index + 2] = h3;
                    id.data[index + 3] = 255;
                    index += 4;
                });
                ctx.putImageData(id, 0, 0);

                draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.slope.png');

                /** valleyness *************** */

                    //  terrain.each_cell(rain_amount);
                var groups = [];

                // terrain.each_cell(clump);
                // terrain.each_cell(flip);

                canvas = new Canvas(grid.cols, grid.rows);
                ctx = canvas.getContext('2d');

                id = ctx.getImageData(0, 0, grid.cols, grid.rows);
                index = 0;
                original_terrain.each_cell(function (cell) {
                    var vallyness = Math.round(cell.valleyness);
                    id.data[index] = vallyness;
                    id.data[index + 1] = vallyness;
                    id.data[index + 2] = vallyness;
                    id.data[index + 3] = 255;
                    index += 4;
                });
                ctx.putImageData(id, 0, 0);

                draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.vallyness.png');

                /* ************** create mountain mask ********** */

                var size = (original_terrain.rows - 1) * (original_terrain.cols - 1);
                var b = new Buffer(size);
                var bo = 0;
                for (var c = 0; c < original_terrain.cols - 1; ++c) {
                    for (var r = 0; r < original_terrain.rows - 1; ++r) {
                        var cell = original_terrain.get(r, c);
                        if (!(bo % 1000)) {
                            //  console.log('cell: %s, mtn_ness: %s', cell_format(cell), mtn_ness);
                        }
                        var mtn_ness = Math.floor(Math.min(255, cell.mtn_ness_med));
                        b.writeUInt8(mtn_ness, bo);
                        ++bo;
                    }
                }

                var inc = 0;
                var stream = fs.createWriteStream(fpath.replace('.bin', '.mtn.bin'));
                stream.on('close', function () {
                    console.log('writing smooth data: ');
                    /* *************** WRITE SMOOTH DATA ************** */
                  //  return original_terrain.write_to(fpath.replace('.bin', '.smooth.bin'), callback);

                    var smooth_terrain = terrain_smooth(original_terrain, 4, 0.5);
                    original_terrain.each_cell(function (cell) {
                        var rough_height = cell.height;
                        var smooth_cell = smooth_terrain.get(cell.row, cell.col);
                        var smooth_height = smooth_cell.height;
                     //   var mtn_ness = cell.mtn_ness_med / 255.0);
                       // if (inc++ % 200 == 0)  console.log("rough_height: %s, smooth height: %s, mtn_ness: %s", rough_height, smooth_height, mtn_ness);
                       if (cell.mtn_ness_med < 128)  smooth_cell.height = rough_height;// parseInt((smooth_height * mtn_ness) + (rough_height * (1 - mtn_ness)));
                    });

                    smooth_terrain.write_to(fpath.replace('.bin', '.smooth.bin'), callback);
                });
                stream.write(b);
                stream.end();

            }

            drippage(original_terrain, cb);
        });
    }

}

function s_string(slope) {
    return slope.toFixed(6);
}
/*
 function cc(n) {
 return _.pad(n, 3, ' ', 'left');
 } */


function clump(cell) {

    var like_me = 0;
    var unlike_me = 0;

    cell.neighborhood(function (n) {
        if (n.mtn == cell.mtn) {
            like_me++;
        } else {
            unlike_me++;
        }
    }, 4);
    cell.flip = like_me > unlike_me;

}

function _make_group(cell, group) {
    group.push(cell);
    cell.group = group;
    _.filter(cell.get_neighbors(),
        function (n) {
            return n.mtn == cell.mtn;
        }).forEach(function (n) {
            _make_group(n, group);
        })
}

function flip(cell) {
    if (cell.flip) {
        cell.mtn = (cell.mtn) ? 0 : 1;
    }
}

function _cc_rough(cell) {
    var cons = [];

    cell.neighborhood(function (c) {
        cons.push(c.concavity);
    }, 6);

    var stat = new Stat(cons);
    cell.concavity_roughness = stat.std_dev();

}