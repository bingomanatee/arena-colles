

module.exports = function(terrain, range, label){
    console.log("highpass: range = %s %s", range, label);

    terrain.each_cell(function(cell){
        var h = 0;
        var c = 0;

        cell.neighborhood(function(n){
            h += n.height;
            ++c;
        }, range);
        cell[label] = ((h / c) - cell.height);
    })
}