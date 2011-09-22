var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var import = require('mola2/import');
var fs = require('fs');
var normal_map_image = require('mola2/normal_map_image');
var util = require('util');
/**
 * generate a color map of a large mapimage tile.
 *
 * @param image
 * @param callback
 */

module.exports = function(image, callback, config) {
    var self = this;

    if (config) {
        var west = Math.max(config.west, image.west);
        var east = Math.min(config.east, image.east);
        var north = Math.min(config.north, image.north);
        var south = Math.max(config.south, image.south);

        /**
         * keeping in mind that top/bottom goes in a negative direction because north is up
         * and rows go down...
         */
        var left_cti = (image.west - config.west) * image.scale;
        var top_cti = (image.north - config.north) * image.scale;
        var right_cti = (image.east - config.east) * image.scale;
        var bottom_cti = (image.south - config.south) * image.scale;

        var cols = Math.ceil(image.cols - (Math.max(0, left_cti) + Math.max(0, right_cti)));
        var rows = Math.ceil(image.rows - (Math.max(0, top_cti) + Math.max(0, bottom_cti)));

        var zoom = Math.max(1, Math.floor(config.zoom));
    }
    else {
        var west = image.west;
        var east = image.east;
        var north = image.north;
        var south = image.south;
        
        var cols = image.cols;
        var rows = image.rows;
        var left_cti = 0;
        var right_cti = 0;
        var top_cti = 0;
        var bottom_cti = 0;
        var zoom = 1;
    }

    var cols = (east - west) * image.scale;
    var rows = (north - south) * image.scale;

    var left_cti_scaled = (zoom == 1) ? left_cti : left_cti / zoom;
    var right_cti_scaled = (zoom == 1) ? right_cti : right_cti / zoom;
    var bottom_cti_scaled = (zoom == 1) ? bottom_cti : bottom_cti / zoom;
    var top_cti_scaled = (zoom == 1) ? top_cti : top_cti / zoom;

    if ((cols < 1) || (rows < 1)) {
        // console.log('no write space - returning false', cols, rows);
        return callback(null, false);
    }

    zoom = parseInt(zoom);

    if (!image) throw new Error('cannot find image ');
    var stub = {id: 'image coords', north: image.north, east: image.east,
        west: image.west, south: image.south};

    import(image, function(err, image_data) {
        // console.log('original size: ', degm(image_data.length), 'rows x', degm(image_data[0].length), 'cols')

        if (bottom_cti < 0) {
            // console.log('bottom_cti = ', degm(bottom_cti, zoom), '; cropping bottom from ', degm(image_data.length, zoom), '...');
            image_data = image_data.slice(0, image_data.length + bottom_cti_scaled);
            // console.log('... to ', degm(image_data.length));
        }

        if (top_cti > 0) {
            // console.log('top_cti = ', degm(top_cti, zoom), '; cropping top from ', degm(image_data.length), '...');
            image_data = image_data.slice(top_cti_scaled);
            // console.log('... to ', degm(image_data.length));
        }

        /**
         * step 1 - crop
         */
        image_data.forEach(function(row, i) {

            if (right_cti > 0) {
                row = row.slice(0, row.length - right_cti_scaled);
                if (i == 0) {
                    // console.log('...to', degm(row.length, zoom));
                }
            }

            if (left_cti < 0) {
                row = row.slice(-1 * left_cti_scaled);
            }

            image_data[i] = row;
        })


        var first_row = 0;
        var last_row = image_data.length;
        var first_col = 0;
        var last_col = image_data[0].length;

        var canvas = new Canvas(last_col, last_row);

        var ctx = canvas.getContext('2d');

        for (var row_block = first_row; row_block < last_row; row_block += 128) {

            // console.log('row set ', row_block);
            var last_subsample = Math.min(128, image_data.length - row_block);
            var ctx_image = ctx.createImageData(last_col, last_subsample);
            var base = 0;

            for (var i = 0; i < last_subsample; i += 1) {
                for (var j = first_col; j < last_col; j += 1) {
                    var row_index = i + row_block;
                    var h = image_data[row_index][j]; // @%TODO: zoom sampling

                    normal_map_image(h, base, ctx_image);
                    base += 4;
                }
            }
            ctx.putImageData(ctx_image, 0, row_block);
        }
        // console.log('calculated color map for ', image._id);
        canvas.createPNGStream().pipe(fs.createWriteStream(MVC_PUBLIC + '/img/mapimage/' + image._id + '.png'));
        callback(null, canvas);

    }, zoom);
}

function degm(n, zoom) {
    var nd = zoom ? zoom * n : n
    return n + '(' + nd / 128 + ' deg)';
}