module.exports = function(image, callback) {
    image.west = parseInt(image.manifest.westernmost_longitude);
    image.east = parseInt(image.manifest.easternmost_longitude);
    image.south = parseInt(image.manifest.minimum_latitude);
    image.north = parseInt(image.manifest.maximum_latitude);
    image.rows = parseInt(image.manifest.lines);
    image.cols = parseInt(image.manifest.line_samples);
    this.put(image, callback ? callback : function() {
    });
}