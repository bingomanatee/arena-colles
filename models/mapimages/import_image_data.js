var fs = require('fs');
var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');
var bin = require('util/binary');
var unpack2Dfile = require('mola2/data/unpack2Dfile');

module.exports = function (image, callback) {
    if (!image) {
        throw new Error(__filename + ' no image');
    }
    console.log('importing data from image ', image._id, image.image_file);

    unpack2Dfile(image.image_file, image.cols, callback);
}
