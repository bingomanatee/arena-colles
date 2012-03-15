var Stat = require('support/stat');


module.exports = function (terrain, range, median) {

    var stat = new Stat();

    var smooth_terrain = terrain.clone();

    function _smooth(cell) {
        var neighbor_heights = []
        cell.neighborhood(function (n) {
            neighbor_heights.push(n.height);
        }, range);
        stat.set_data(neighbor_heights);
        smooth_terrain.get(cell.row, cell.col).height = stat.med_ratio(median);
    }

    terrain.each_cell(_smooth);

    return smooth_terrain;
}