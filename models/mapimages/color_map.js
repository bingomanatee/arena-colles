var au = require('util/array');
var mu = require('util/math');
var Canvas = require('canvas');
var import = require('mola2/import');
var fs = require('fs');
var color_map_image = require('mola2/color_map_image');
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

        var cols = (east - west) * image.scale;
        var rows = (north - south) * image.scale;

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
        console.log('east...west: ', config.west - config.east, 'x128=', (config.east - config.west) * 128);
        console.log('North...south: ', config.north - config.south, 'x128=', (config.north - config.south) * 128);
    }
    else {
        var cols = image.cols;
        var rows = image.rows;
        var left_cti = 0;
        var right_cti = 0;
        var top_cti = 0;
        var bottom_cti = 0;
        var zoom = 1;
    }

    if ((cols < 1) || (rows < 1)) {
        return false;
    }

    zoom = parseInt(zoom);

    if (!image) throw new Error('cannot find image ');
    console.log('----- image----', image._id, image.image_file);
    console.log('config', util.inspect(config));
    var stub = {id: 'image coords', north: image.north, east: image.east,
        west: image.west, south: image.south};
    console.log('image data: ', util.inspect(stub));
    
    console.log('image: rows ', degm(image.rows), 'x', degm(image.cols), ' cols');
    console.log('top: ', degm(top_cti), 'bottom', degm(bottom_cti));
    console.log('left', degm(left_cti), 'right', degm(right_cti));
    console.log('zoom', zoom);


    //  ctx.fillMode = 'rgba(128, 255, 255, 1)';
    //  ctx.fillRect(0, 0, canvas.width, canvas.height);


    import(image, function(err, image_data) {
    console.log('original size: ', degm(image_data.length),'rows x', degm(image_data[0].length), 'cols')

        if (bottom_cti < 0) {
            console.log('bottom_cti = ', degm(bottom_cti), '; cropping bottom from ', degm(image_data.length),  '...');
            image_data = image_data.slice(0, image_data.length + bottom_cti);
            console.log('... to ', degm(image_data.length));
        }

        if (top_cti > 0) {
            console.log('top_cti = ', degm(top_cti), '; cropping top from ', degm(image_data.length), '...');
            image_data = image_data.slice(top_cti);
            console.log('... to ', degm(image_data.length));
        }

        /**
         * step 1 - crop
         */
        image_data.forEach(function(row, i) {

            if (right_cti > 0) {
                if (i == 0) {
                    console.log('right_cti = ', degm(right_cti), '; cropping row from ', degm(row.length),  ' ...');
                }
                row = row.slice(0, row.length - right_cti);
                if (i == 0) {
                    console.log('...to', degm(row.length));
                }
            }

            if (left_cti < 0) {
                if (i == 0) {
                    console.log('left_cti = ', degm(left_cti), '; cropping row from ', degm(row.length), '...');
                }
                row = row.slice(-1 * left_cti);
                if (i == 0) {
                    console.log('...to', degm(row.length));
                }
            }

            image_data[i] = row;
        })

        console.log('post crop size: ', image_data.length, 'rows x ', image_data[0].length, 'cols');

        /**
         * step 2 - zoom
         */


        if (zoom > 1) {
            var new_image_data = [];
            for (var i = 0; i < image_data.length; i += zoom) {
                var row = [];
                for (var j = 0; j < image_data[0].length; j += zoom) {
                    row.push(image_data[i][j]);
                }
                new_image_data.push(row);
            }
            image_data = new_image_data;
        }


        var first_row = 0;
        var last_row = image_data.length;
        var first_col = 0;
        var last_col = image_data[0].length;

        var canvas = new Canvas(last_col, last_row);

        var ctx = canvas.getContext('2d');

        for (var row_block = first_row; row_block < last_row; row_block += 128) {

            console.log('row set ', row_block);
            var last_subsample = Math.min(128, image_data.length - row_block);
            var ctx_image = ctx.createImageData(last_col, last_subsample);
            var base = 0;

            for (var i = 0; i < last_subsample; i += 1) {
                for (var j = first_col; j < last_col; j += 1) {
                    var row_index = i + row_block;
                    var h = image_data[row_index][j]; // @%TODO: zoom sampling

                    color_map_image(h, base, ctx_image);
                    base += 4;
                }
            }
            ctx.putImageData(ctx_image, 0, row_block);
        }
        console.log('calculated color map for ', image._id);
        canvas.createPNGStream().pipe(fs.createWriteStream(MVC_PUBLIC + '/img/mapimage/' + image._id + '.png'));
        callback(null, canvas);

    });
}

function degm(n){
    return n + '(' + n/128 + ' deg)';
}