module.exports = function(image, callback) {
    image.west = parseInt(image.manifest.westernmost_longitude);
    image.east = parseInt(image.manifest.easternmost_longitude);
    image.south = parseInt(image.manifest.minimum_latitude);
    image.north = parseInt(image.manifest.maximum_latitude);
    image.rows = parseInt(image.manifest.lines);
    image.cols = parseInt(image.manifest.line_samples);
    image.bin_path = _bin_path(image);

    console.log('updating image data');
    this.put(image, callback ? callback : function() {
    });
}

function _bin_path(image){
    return image.image_file + '.bin';

}