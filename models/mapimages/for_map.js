module.exports = function(id, callback) {
    id = this._as_oid(id);
    var cursor = this.find({map: id, "manifest.name": "MEDIAN_TOPOGRAPHY"});
    cursor.toArray(callback);
}