var mola_import = require('mola3/import');
var Terrain = require('mola3/grid/Terrain');
var _ = require('underscore');

module.exports = function (height_path, scale, cb) {

    function _on_grid(err, grid) {
        var ter = new Terrain(grid.data);
        ter.length /= scale;

        var turns = 300;
        var this_turn = 0;
        ter.each_cell(_rain_chance);
        var rain_amt = 0;
        var min_height = 1000000;
        var max_height = -1000000;


        ter.each_cell(function(cell){
           if (cell.height > max_height){
               max_height = cell.height;
           } else if (cell.height < min_height){
               min_height = cell.height;
           }
        });

        var height_range = max_height - min_height;

        while (turns > this_turn) {
            if (!this_turn % 10){
                console.log('eroding: %s', this_turn);
            }
            // adjust rain during winter from 0... 0.5;
            var season_rain_amt = rain_amt + Math.min(this_turn, turns - this_turn) / (2 * turns);

            /* **************** RAIN ********************** */

            function _add_rain(cell) {

                if (cell.height > 0) {
                    if (season_rain_amt < cell.rain_chance) {
                        cell.water += 0.1;
                        if (cell.rain_chance - season_rain_amt > 0.2) {
                            cell.water += 0.1;
                        }
                    }
                }

            }

            /* **************** EROSION ****************** */

            function _erosion(cell){
                if (cell.water){
                    var mud_ratio = (cell.mud /cell.water);
                    if (mud_ratio > 10){
                        // dry the mud
                        if (cell.mud > 0){
                            cell.mud -= 1;
                            cell.erosion += 1;
                        }
                    } else {
                        cell.mud += cell.water /4;
                        cell.erosion -= cell.water/4;
                    }
                }
            }

            /* **************** LOOP ********************* */

            ter.each_cell(_add_rain);

          //  ter.each_cell(_erosion);
            ++this_turn;
        }

        function _paint_erosion(cell){
            var out = [];
            out[0] = _clamp(128 + cell.mud, 0, 255);
            out[1] = _clamp(cell.water, 0, 255);
            out[2] = _clamp((255 * (cell.height - min_height)/height_range), 0, 255);
            out[3] = cell.height >= 0 ? 255 : 0;

            return out;
        }

        ter.paint(height_path + '.a.png', _paint_erosion);
    }

    mola_import(height_path, 128 * parseInt(scale) + 1, _on_grid);
}

function _rain_chance(cell) {
    cell.water = 0;
    cell.mud = 0;
    cell.erosion = 0;

    if (cell.height <= 0) {
        cell.rain_chance = 0;
    } else {
        cell.rain_chance = 0.05 + (cell.height / 5000);
        // rains a lot near the shores.
        cell.rain_chance = Math.max(cell.rain_chance, (500 - cell.height) / 1000);
        cell.rain_chance = Math.min(1.0, cell.rain_chance);
    }
}

function _clamp(n, min, max){
    return Math.max(min, Math.min(max, Math.floor(n)));
}