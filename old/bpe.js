
var points = [{i: 2, j: 4}, {i: 6, j: 0}];

var data = '';
var segment = false;

function bin_point(p){
    return ((8 * p.i) + p.j);;
}

points.forEach(function(p){
    var ij = bin_point(p);
    if (segment) {
        segment = segment | ij;
    }
    else {
        segment = ij;
    }
})

console.log(segment);

console.log('has 3, 3 ', segment & bin_point({i: 3, j: 3}));
            
console.log('has 6, 8 ', segment & bin_point({i: 6, j: 8}));