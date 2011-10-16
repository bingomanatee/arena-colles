var mm = require(MVC_MODELS);
var gate = require('util/gate');
var data2Dslice = require('mola2/data/data2Dslice');
var pack2Darray = require('mola2/data/pack2Darray');
var mon = require('mongolian');
var util = require('util');
var Gate = require('util/gate');
var assert = require('assert');

var inc = 128 * 10;

module.exports = function(image, callback) {
    var self = this;
    var gate = new Gate(callback);

    function _on_import(err, data) {
        if (err) {
            console.log('err: ', err);
            throw err;
        }
        console.log(__filename, ':_on_import: ', data.length, 'rows');

        var lat = image.north;
        for (var row = 0; row < image.rows; row += 128) {
            var lon = image.west;
            for (var col = 0; col < image.cols; col += 128) {

                var sub_data = data2Dslice(data, row, col, 129, 129);
                var pa = pack2Darray(sub_data.data);

                assert.ok(lat >= -90, 'lat >= -90: ' + lat);
                assert.ok(lat <= 90, 'lat <=90: ' + lat);
                assert.ok(lon >= 0, 'lon >= 0: ' + lon);
                assert.ok(lon <= 360, 'lon <=360: ' + lon);

                var tile = {
                    _id: {
                        lat: lat,
                        lon: lon,
                        image: image._id
                    },

                    lat: lat,
                    lon: lon,
                    image: image._id,
                    cols: sub_data.cols,
                    rows: sub_data.rows,
                    packed_data: new mon.Binary(pa)
                }

                if ((!(row % inc)) && (!(col % inc))) {
                    console.log('writing row', row, 'col:', col, 'lat:', lat, 'lon:', lon, 'data rows', 'tile rows: ', tile.rows, 'tile cols:', tile.cols);
                }

                self.put(tile, gate.task_done_callback(true));

                ++ lon;
            }
            -- lat;
        }
        console.log('done cutting image into tiles');
        gate.start();

    }

    function _on_remove() {

        mm.model('mapimages', function(err, mi_model) {
            mi_model.import_image_data(image, _on_import);
        })
    }

    this.remove({image: image._id}, _on_remove);

}

