var mi = require(MVC_MODELS);
var util = require('util');
var fs = require('fs');
var Test_Suite = require('unit/Test/Suite');
var mu = require('util/math');

function see(n) {
    return util.inspect(n);
}
var suite = {
    name: "Data",

    tests: {
        image_count: function(n) {
            this.is(16, this.options.mapimages.length);
        },

        angle_range_ns: function(n) {
            var self = this;


            this.options.mapimages.forEach(function(image) {
                var lat = image.north;
                for (var row = 0; row < image.rows; row += 128) {
                    var lon = image.east;
                    for (var col = 0; col < image.cols; col += 128) {
                        self.ok(lat <= image.north, 'lat ' + lat + ' <= image.north ' + image.north + 'row: ' + row + ', col: ' + col);
                        self.ok(lat >= image.south, 'lat ' + lat + ' >= image.south ' + image.south + 'row: ' + row + ', col: ' + col);
                        // console.log('image: ', image._id, 'n', image.north, 's', image.south,  'col:', col, 'lon', lon, 'row', row, 'lat', lat);
                        ++ lon;
                    }
                    -- lat;
                }
            })
        },


        angle_range_ew: function(n) {
            var self = this;

            this.options.mapimages.forEach(function(image) {
                var lat = image.north;
                for (var row = 0; row < image.rows; row += 128) {
                    var lon = image.west;
                    for (var col = 0; col < image.cols; col += 128) {
                        //console.log('image: ', image._id, 'e', image.east, 'w', image.west, 'col:', col, 'lon', lon, 'row', row, 'lat', lat);
                        self.ok(lon >= image.west, 'lon ' + lon + ' >= image.east ' + image.east + 'row: ' + row + ', col: ' + col);
                        self.ok(lon <= image.east, 'lon ' + lon + ' <= image.west ' + image.west + 'row: ' + row + ', col: ' + col);
                        ++ lon;
                    }
                    -- lat;
                }
            })
        }

    }
}

module.exports = new Test_Suite(suite, { before_all_with_callback: function(cb) {
    var self = this;
    mi.model('mapimages', function(err, mi) {
        self.options.mampimage_model = mi;

        mi.topog(function(err, mapimages) {
            if (err) throw err;
            self.options.mapimages = mapimages;
            cb();
        });
    });
}, debug: 2});