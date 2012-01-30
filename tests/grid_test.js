var util = require('util');
var path = require('path');
var fs = require('fs');
var Grid = require('./../node_modules/mola3/grid');
var loader;
var framework;

var source_grid;

module.exports = {
    setup:function (test) {

        var data = [
            [1, 2, 3, 4],
            [2, 4, 6, 8],
            [3, 6, 9, 12]
        ];
        source_grid = new Grid(data);
        test.done();
    },

    test_loader:function (test) {
        test.equals(source_grid.get_value(1, 2), 6, 'testing ')
        test.equals(source_grid.rows, 3, 'testing rows of original gid');
        test.equals(source_grid.cols, 4, 'testing cols of original grid');
        var slice  = source_grid.slice(1, 1, 3, 3);
        test.done();
    }
}