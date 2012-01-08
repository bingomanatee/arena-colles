var Grid = require('walker/grid');
var Walk = require('walker/random/walk');

var grid = new Grid(4, 4);
grid.init();

function on_grid_test(i, j){
    
    console.log(i, ',', j, ' ON GRID: ', grid.on_map(i, j));
    console.log('{', i, ',', j, '} ON GRID: ', grid.on_map({i: i, j: j}));
}

module.exports = {
    run: function (){
        on_grid_test(-1, -1);
        on_grid_test(0, 0);
        on_grid_test(2, 2);
        on_grid_test(4, 4);
        on_grid_test(10, 10);
        
        var walk = new Walk(grid);
        walk.go(0, 0);
        
        console.log('walker starting: ', walk.__toString());
        
        var walk2 = walk.s();
        
        console.log('walk after 1 s: ', walk.__toString());
        
        console.log('walk2: ', walk2.__toString());
        
        var walk3 = walk2.n();
        console.log('walk3', walk3.__toString());
        console.log('walk2 overlap: ', walk2.overlap());
        console.log('walk3 overlap: ', walk3.overlap());
        
        var walk2_w = walk2.w();
        
        console.log('walk2_w: ', walk2_w ? walk2_w.__toString(): false);
        
        var walk2_e = walk2.e();
        
        console.log('walk2_e: ', walk2_e ? walk2_e.__toString(): false);
    }
}