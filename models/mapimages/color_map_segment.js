var au = require('util/array');
var Canvas = require('canvas');
var import = require('mola2/import');
var fs = require('fs');
var Pipe = require('util/pipe');
var util = require('util');
/**
 * generate a color map of a large mapimage tile.
 *
 * @param image
 * @param callback
 */

module.exports = function(config, callback) {
    var self = this;

    ['west', 'north', 'south', 'east', 'zoom'].forEach(function(k) {
        if (config.hasOwnProperty(k)) {
            config[k] = parseInt(config[k]);
        }
    });

    var query = {
        '$nor' : [
            {  east: {'$lte': config.west }},
            {  west: {'$gte': config.east}},
            {  south: {'$gte': config.north }},
            {  north: {'$lte': config.south}}
        ],
        scale: {'$gt': 0}
    };

   // console.log('image query: ', util.inspect(query, false, 4));

    //@TODO: scale for latitude
    //@TODO: incorporate existing reduced maps
    var cursor = this.find(query);

    var width = (config.east - config.west) * 128 / config.zoom;
    var height = (config.north - config.south) * 128 / config.zoom;

    // console.log('making target image that is ', width, 'x', height);

    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');


    function _on_done() {
        // console.log('done with canvases');
        callback(null, canvas);
    }

    var icount = 0;

    function _get_image(null_array, statics, next_cb, done_cb) {
        // console.log('getting image');
        cursor.next(function(err, image) {
            if (image) {
                ++icount;
                function _image_to_canvas(err, tile_canvas) {
                    if (!tile_canvas) { // off target?
                        console.log('!!!!!!!!! no canvas');
                        return next_cb();
                    }
                    var n_offset = -1 * (image.north - statics.config.north);
                    var w_offset = (image.west - statics.config.west);
                    var north = Math.max(0, n_offset);
                    var west = Math.max(0, w_offset);
                    var scale = image.scale / statics.config.zoom;
                    var x = west * scale;
                    var y = north * scale;
                    console.log('writing ', tile_canvas.width, 'x', tile_canvas, 'image to', x, y);
                    statics.ctx.drawImage(tile_canvas, x, y);
                    next_cb();

                }

                statics.self.color_map(image, _image_to_canvas, statics.config);
            }
            else {
                console.log('done with all images; count = ', icount);
                done_cb();
            }

        })
    }

    var pipe = new Pipe(_on_done, _get_image, false,
        {cursor: cursor, ctx: ctx, self: self, config: config, canvas: canvas});

    pipe.start();


}
