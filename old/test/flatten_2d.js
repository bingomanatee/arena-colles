var au = require('util/array');

module.exports.run = function(){
    var t1 = [
        [1, 2, 3],
        [4, 5, 6]
    ];
    
    console.log ('flattened ', t1, ' = ', au.flatten_2d_array(t1));

    var t2 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
        ];
    
    console.log ('flattened ', t2, ' = ', au.flatten_2d_array(t2));
    
    var t2 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
        ];
    
    console.log ('flattened ', t2, ' = ', au.flatten_2d_array(t2));
}