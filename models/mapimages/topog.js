module.exports = function(callback) {
    var cursor = this.find({"manifest.name": "MEDIAN_TOPOGRAPHY"});
    cursor.toArray(callback);
}