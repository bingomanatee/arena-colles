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

    var data_file_root = path.join(__dirname, './../../resources/mapimages_lg');
    fs.readdir(data_file_root, function (err, files) {
        files.forEach(function (name) {
            console.log('analyzing %s/ %s', data_file_root, name)
            find_mtns(util.format("%s/%s", data_file_root, name), x_pat.exec(name)[1]);
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

                if (cell.neighbors.t) {
                    if (cell.neighbors.b) {
                        v = cell.neighbors.b.height - cell.neighbors.t.height;
                        v /= terrain.length * 2;
                    } else {
                        v = cell.height - cell.neighbors.t.height;
                        v /= terrain.length;
                    }
                } else if (cell.neighbors.b) {
                    v = cell.neighbors.b.height - cell.height;
                    v /= terrain.length;
                }

                var h = 0;

                if (cell.neighbors.l) {
                    if (cell.neighbors.r) {
                        h = cell.neighbors.r.height - cell.neighbors.l.height;
                        h /= terrain.length * 2;
                    } else {
                        h = cell.height - cell.neighbors.l.height;
                        h /= terrain.length;
                    }
                } else if (cell.neighbors.r) {
                    h = cell.neighbors.r.height - cell.height;
                    h /= terrain.length;
                }

                //   console.log('%s: h : %s, v: %s', cell_format(cell), h, v);

                cell.normal = {r:128 + Math.round(-1280 * v), g:128 + Math.round(-1280 * h), b:255}
            }

            /*
             function _mtn_ness(cell) {
             var hcount = 0;
             var hcavity = 0;
             var vcount = 0;
             var vcavity = 0;

             if (cell.neighbors.t && cell.neighbors.b) {
             var slope_top = (cell.height - cell.neighbors.t.height);
             var slope_bottom = (cell.neighbors.b.height - cell.height);
             vcavity += 2 * (slope_bottom - slope_top);
             vcount += 2;

             var t = cell.neighbors.t;

             if (t.neighbors.t) {
             slope_top = cell.height - t.height;
             slope_bottom = t.height - t.neighbors.t.height;
             vcavity += slope_bottom - slope_top;
             ++vcount;
             }

             var b = cell.neighbors.b;

             if (b.neighbors.b) {
             slope_top = b.height - cell.height;
             slope_bottom = b.neighbors.b.height - b.height;
             vcavity += slope_bottom - slope_top;
             ++vcount;
             }
             }

             if (cell.neighbors.l && cell.neighbors.r) {
             var slope_left = (cell.height - cell.neighbors.l.height);
             var slope_right = (cell.neighbors.r.height - cell.height);
             hcavity += 2 * (slope_right - slope_left);
             hcount += 2;

             var l = cell.neighbors.l;

             if (l.neighbors.l) {
             slope_right = cell.height - l.height;
             slope_left = l.height - l.neighbors.l.height;
             hcavity += slope_right - slope_left;
             ++hcount;
             }

             var r = cell.neighbors.r;

             if (r.neighbors.r) {
             slope_left = r.height - cell.height;
             slope_right = r.neighbors.r.height - r.height;
             hcavity += slope_right - slope_left;
             ++hcount;
             }
             }

             var vslope = 0;
             var hslope = 0;

             if (hcount > 0) {
             var hslope = hcavity / hcount;

             if (vcount > 0) {
             var vslope = vcavity / vcount;
             if (Math.abs(vslope) > Math.abs(hslope)){
             cell.concavity = vslope;
             } else {
             cell.concavity = hslope;
             }
             } else {
             cell.concavity = hslope;
             }
             } else {

             if (vcount > 0) {
             var vslope = vcavity / vcount;
             cell.concavity = vslope;
             } else {
             cell.concavity = 0;
             }
             }

             // console.log('%s, hslope: %s, vslope: %s', cell_format(cell), hslope, vslope);

             //  console.log('%s  avg_height: %s,  heights: %s / count: %s, concavity: %s', cell_format(cell), s_string(avg_height), heights, count, s_string(cell.concavity));


             }
             */
            // console.log("cl: %s, b: %s, cl2: %s, bl2: %s", cl, bl, cl2, bl2);

            function rainage() {
                var max = 25;
                var min_rain = 1;

                for (var i = 0; i <= max; ++i) {
                    var d = new Date();
                    var max_depth = 4 + i;
                    var rain_amount = (2 * i) + 2;

                    function _roll(cell, amount, depth) {

                        if (!cell.hasOwnProperty('rain')) {
                            cell.rain = 0;
                            cell.rains = 0;
                        }
                        if ((amount < min_rain) || (depth > max_depth)) {
                            cell.rain += amount;
                            return;
                        }

                        var drop_slopes = 0;
                        var drops = [];
                        cell.each_neighbor(function (c, n) {
                            if (Math.random() < 0.3) return;
                            if (n.height < c.height) {
                                var drop = c.height - n.height;
                                drop_slopes += drop;
                                drops.push({cell:n, drop:drop});
                            }
                        });

                        if (drops.length) {
                            drops = _.sortBy(drops, function (dd) {
                                return dd.drop;
                            });
                            drops = drops.slice(0, 2);

                            drop_slopes = 0;

                            drops.forEach(function (drop) {
                                drop_slopes += drop.drop;
                            })

                            drops.forEach(function (drop) {
                                _roll(drop.cell, drop.drop / drop_slopes, depth + 1);
                            });

                        } else {
                            cell.rain += amount;
                        }

                    }

                    function _mtn_ness(cell) {
                        _roll(cell, rain_amount, 0);
                    }

                    function _adjust(cell) {
                        cell.height += cell.rain - rain_amount;
                        cell.rains = Math.max(cell.rains, cell.rain);
                        cell.rain = 0;
                    }

                    terrain.each_cell(_mtn_ness);

                    terrain.each_cell(_adjust);


                    console.log('mtn: cycle %s, time: %s', i, ((new Date().getTime() - d.getTime()) / 100).toFixed(3));
                }

            }

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

            /* *************** HEIGHT ***************** */

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

            draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.heights.png');

            /* *************** NORMAL ***************** */

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

            draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.normal.png');

            /* ************** MTN_NESS ************** */

            rainage();

            canvas = new Canvas(grid.cols, grid.rows);
            ctx = canvas.getContext('2d');
            var cutoff = 45;

            function rain_amount(cell) {
                var rains = cell.rains > cutoff ? 1 : 0;
                var drys = rains ? 0 : 1;
                cell.each_neighbor(function (c, n) {
                    if (n.rains > cutoff) {
                        ++rains;
                    } else {
                        ++drys;
                    }
                });

                if (rains > drys) {
                    cell.mtn = true;
                } else {
                    cell.mtn = false;
                }
            }

            terrain.each_cell(rain_amount);

            function _make_group(cell, group){
                group.push(cell);
                cell.group = group;
                _.filter(cell.get_neighbors(), function (n){
                    return n.mtn == cell.mtn;
                }).forEach(function(n){
                        _make_group(n, group);
                    })
            }

            var last_group_number = 0;
            var groups = [];

            function clump(cell) {

                var like_me = 0;
                var unlike_me = 0;

                cell.neighborhood(function(n){
                    if (n.mtn == cell.mtn){
                        like_me++;
                    } else {
                        unlike_me++;
                    }
                }, 4);
                cell.flip = (like_me/unlike_me < 0.3);

            }

            function flip(cell){
                if (cell.flip){
                    cell.mtn = (cell.mtn) ? 0 : 1;
                }
            }

            terrain.each_cell(clump);
            terrain.each_cell(flip);

            id = ctx.getImageData(0, 0, grid.cols, grid.rows);
            index = 0;
            terrain.each_cell(function (cell) {
                var concav = cell.mtn ? 255 : 0;
                // console.log('cell %s, %s slope = %s', cell.col, cell.row, slope);
                id.data[index] = id.data[index + 1] = id.data[index + 2] = concav;
                id.data[index + 3] = 255;
                index += 4;
            });
            ctx.putImageData(id, 0, 0);

            draw_canvas(canvas, fpath.replace('mapimages_lg', 'heightmaps') + '.slope.png');

            var base_terrain = new Terrain(grid.data);

            var smooth_terrain = new Terrain(grid.data);

            smooth_terrain.each_cell(function(cell){
               if( terrain.get(cell.row, cell.col).mtn) {
                   var heights = cell.height * 2;
                   var count = 2;
                   base_terrain.get(cell.row, cell.col).each_neighbor(function(n){
                        ++count;
                       heights += n.height;
                   });

                   cell.height = heights/count;
               }
            });

            smooth_terrain.write_to(fpath.replace('.bin', '.smooth.bin'));

            var b = new Buffer(terrain.rows * terrain.cols);
            var bo = 0;
            terrain.each_cell(function(c){
              if (c.mtn){
                  b[bo] = (c.mtn) ? 1 : 0;
                  ++bo;
              }
            });

            var stream = fs.createWriteStream(fpath.replace('.bin', '.mtn.bin'));
            stream.write(b);
            stream.end();
            callback();

        });
    }
}

function draw_canvas(canvas, c_path) {
    console.log('drawing canvas to %s', c_path);

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
