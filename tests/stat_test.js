var util = require('util');
var path = require('path');
var fs = require('fs');
var Stat = require('support/stat');
var erosion2;

var data = [1, 2, 3, 4, 5, 5, 5, 5];
var stat;
var sum_data = 0;
data.forEach(function(v){
    sum_data += v;
})
var avg_data = sum_data / (1.0 * data.length);

module.exports = {

    setup:function (test) {
        stat = new Stat(data);
        test.done();
    },


    average:function (test) {
        test.equals(stat.avg(), avg_data, 'stat average');
        test.done();
    },

    median: function(test){
        test.equals(stat.med_ratio(0.25), 5, 'stat median');
        test.done();
    }

}