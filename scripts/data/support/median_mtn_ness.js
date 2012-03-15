var Stat = require('support/stat');

module.exports = function(cell){
    var ms = [];

    cell.neighborhood(function(n){
        ms.push(n.mtn_ness);
    }, 5);

    var s = new Stat(ms);

    cell.mtn_ness_med = s.med_ratio(0.5);

}