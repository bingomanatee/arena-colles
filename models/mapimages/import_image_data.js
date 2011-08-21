var fs = require('fs');
var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');
var bin = require('util/binary');
var import = require('mola2/import');

module.exports = function (image, callback) {
    if (!image) {
        throw new Error(__filename + ' no image');
    }
    console.log('importing data from image ', image);

    import(image, callback);
}
