var mola_import = require('mola3/import');
var Terrain = require('mola3/grid/Terrain');
var _ = require('underscore');

var FLOW_PERCENT = 0.25;
var RAIN_AMOUNT = 5.0;
var HEAVY_RAIN_AMOUNT = 1;
var MUD_FLOW_PERCENT = 0.25;
var MUD_DRY_AMOUNT = 0.1;
var EVAP_AMOUNT = 0.125;
var SEASON_FLUX = 0.666;
var SEASON_EVAP_FLUX = 3.0;
var Stat = require('support/stat');
var TURNS = 150;
var SMOOTH_ITER = 15;

module.exports = function (height_path, scale, cb) {

    function _on_grid(err, grid) {
        var start_time = new Date();
        var ter = new Terrain(grid.data);
        ter.length /= scale;

        var this_turn = 0;
        ter.each_cell(_rain_chance);
        var rain_amt = 0;
        var min_height = 1000000;
        var max_height = -1000000;


        ter.each_cell(function (cell) {
            cell.water = 0;
            cell.flow = 0;
            cell.mud = 0;
            cell.mud_flow = 0;

            if (cell.height > max_height) {
                max_height = cell.height;
            } else if (cell.height < min_height) {
                min_height = cell.height;
            }
        });

        console.log('from %s to %s', min_height, max_height);

        var height_range = max_height - min_height;

        while (TURNS > this_turn) {
            var sa = this_turn * Math.PI * 2 / TURNS;

            var s_adj = Math.sin(sa) * SEASON_FLUX;

            if (!(this_turn % 10)) {
                console.log('eroding: %s', this_turn);
            }

            /* **************** RAIN ********************** */

            function _add_rain(cell) {

                if (cell.height > 0) {
                    var water = s_adj + 0.1 + Math.random() - Math.random() + (cell.height / 10000);
                    if (water > 0) {
                        cell.water += water * RAIN_AMOUNT;
                    }
                }

                if (isNaN(cell.water)) {
                    cell.water = 0;
                }

                cell.water_height = _water_height(cell);
            }

            /* **************** FLOWS ******************** */

            function _flow(cell) {
                var flows = [];
                var total_drop = 0;

                function _do_flow(c, n) {

                    var drop = cell.water_height - n.water_height;

                    if (drop > 0) {
                        total_drop += drop;
                        flows.push({
                            drop:drop,
                            neighbor:n,
                            mud_flow:0
                        })
                    }

                }

                if (!this.turn % 2) {
                    cell.each_neighbor(_do_flow);
                } else {
                    cell.direct_neighbors(_do_flow);
                }


                if ((flows.length < 1) || (total_drop <= 0) || (cell.water <= 0)) {
                    return;
                }

                flows.forEach(function (flow) {
                    flow.percent = flow.drop / (1.0 * total_drop);
                })

                var flow_ratio = 1.0;
                if (total_drop > cell.water) {
                    flow_ratio = cell.water / total_drop;
                }

                if (isNaN(flow_ratio)) {
                    console.log('flow ratio is NaN %s / %s', cell.water, total_drop);
                }

                total_drop *= flow_ratio;

                var mud_flow = (total_drop / cell.water) * cell.mud;
                if (isNaN(mud_flow)) {
                    console.log('mud_flow is NaN %s / %s * %s', total_drop, cell.water, cell.mud);
                }

                flows.forEach(function (flow) {
                    var flow_amount = flow.percent * total_drop * FLOW_PERCENT;
                    flow.neighbor.flow += flow_amount;
                    cell.flow -= flow_amount;

                    if (isNaN(cell.flow)) {
                        console.log('flow 2 is NaN');
                    }

                    var mud_flow_amount = flow.percent * mud_flow * MUD_FLOW_PERCENT;
                    flow.neighbor.mud_flow += mud_flow_amount;
                    cell.mud_flow -= mud_flow_amount;
                })
            }

            // evaporate less in winter, more in summer
            var evap = (( Math.cos(sa) / SEASON_EVAP_FLUX) + 1) * EVAP_AMOUNT;

            function _settle_flow(cell) {
                cell.water += cell.flow - evap;
                cell.flow = 0;
                cell.mud += cell.mud_flow;
                cell.mud_flow = 0;
                if (cell.water < 0 || cell.height < 0) {
                    cell.water = 0;
                }
                if (cell.height < 0 || cell.mud < 0) {
                    cell.mud = 0;
                }

                if (cell.mud * 3 > cell.water) {
                    var dry_mud = Math.max(cell.mud, MUD_DRY_AMOUNT);
                    cell.mud -= dry_mud;
                    cell.erosion += dry_mud;
                }
            }

            /* **************** LOOP ********************* */

            ter.each_cell(_add_rain);
            ter.each_cell(_mud);
            ter.each_cell(_flow);
            ter.each_cell(_settle_flow);


            if (this_turn && (!(this_turn & SMOOTH_ITER))) {
                ter.each_cell(_smooth);
                ter.each_cell(_smooth_2);
            }
            ++this_turn;
        }

        function _hme(cell) {
            var out = [
                _clamp(((255 * (_dry_height(cell) - min_height)) / height_range), 0, 255),
                _clamp(cell.mud, 0, 255),
                _clamp(128 + cell.erosion, 0, 255),
                255
            ];

            return out;
        }

        function _changes(cell) {
            var slice = cell.slice(2);
            var heights = _.map(slice, _water_height);
            var stat = new Stat(heights);
            return [
                _clamp(128 + cell.mud + cell.erosion, 0, 255),
                _clamp(stat.std_dev(), 0, 255),
                _clamp(cell.water, 0, 255),
                255
            ];
        }

        var t = (new Date().getTime() - start_time.getTime()) / 1000;

        var write_path = height_path.replace('mapimages_lg', 'heightmaps');
        console.log('time: %s seconds, %s secs/day', t, t / TURNS);
        ter.paint(write_path + '.d1.png', _hme);
        ter.paint(write_path + '.d2.png', _changes);

        cb();
    }

    mola_import(height_path, 128 * parseInt(scale) + 1, _on_grid);
}

function _water_height(cell) {
    return cell.water + cell.height + cell.mud + cell.erosion;
}

function _dry_height(cell) {
    return cell.height + cell.mud + cell.erosion;
}

function _rain_chance(cell) {
    cell.water = 0;
    cell.mud = 0;
    cell.erosion = 0;
    cell.flow = 0;

    if (cell.height <= 0) {
        cell.rain_chance = 0;
    } else {
        cell.rain_chance = 0.05 + (cell.height / 5000);
        // rains a lot near the shores.
        cell.rain_chance = Math.max(cell.rain_chance, (500 - cell.height) / 1000);
        cell.rain_chance = Math.min(1.0, cell.rain_chance);
    }
}

function _clamp(n, min, max) {
    return Math.max(min, Math.min(max, Math.floor(n)));
}

/* **************** EROSION ****************** */

function _mud(cell) {
    if ((cell.height > 0) && (cell.water > 0)) {
        if (cell.mud * 4 < cell.water) {
            var new_mud = cell.water / 4.0;
            cell.mud += new_mud;
            cell.erosion -= new_mud;
        }
    }

}

/* ***************** SMOOTH ****************** */

function _smooth(cell) {
    var ns = cell.get_direct_neighbors();
    var erosions = _.map(ns, _c_rosion);
    erosions.push(cell.erosion);
    erosions.push(cell.erosion);

    var total_erosion = _.reduce(erosions, _reduce_sum, 0);
    cell.s_erosion = total_erosion / erosions.length;


    var waters = _.map(ns, _sea_water);
    waters.push(cell.water);
    waters.push(cell.water);

    var total_water = _.reduce(erosions, _reduce_sum, 0);
    cell.s_water = total_water / waters.length;
}

function _smooth_2(cell) {
    cell.water = cell.s_water;
    cell.erosion = cell.s_erosion;
}

function _reduce_sum(m, n) {
    return m + n;
}

function _sea_water(c) {
    return c.water;
}

function _c_rosion(c) {
    return c.erosion;
}