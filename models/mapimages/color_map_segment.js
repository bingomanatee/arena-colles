var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var import = require('mola2/import');
var fs = require('fs');
var color_map_image = require('mola2/color_map_image');
var mu = require('util/math');

/**
 * generate a color map of a large mapimage tile.
 *
 * @param image
 * @param callback
 */

module.exports = function(config, callback) {
    var self = this;

    var query = {
        north: {'$lte': config.north},
        south: {'$gte': config.south},
        east: {'$gte': config.east},
        west: {'$lte': config.west}
    };



    var cursor = this.find(query);

    var width = (config.east - config.west) * config.pixels_per_degree;
    var height = (config.north - config.south) * config.pixels_per_degree;

    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');

    function _on_image(err, image){
        if (image){
            self.(ctx, config, image);
        } else {
            callback(canvas);
        }
    }

    process.nextTick(_on_image);

}

function _image_to_canvas(ctx, config, image){
    var north = Math.max(image.north, config.north);
    var south = Math.min(image.south, config.south);
    var east = Math.min(image.east, config.east);
    var west = Math.max(image.west, config.west);

    for (var row = _lat_point(south, image);
         row <= _lat_point(north, image);
         ++row){
        for (var col = _lon_point(west, image);
            col <= _lon_point(west, image);
            ++col){

        }
    }
}

function _lat_point(lat, image){
    return mu.rescale(lat, image.south, image.north, 0, image.rows);
}