module.exports = function(bin, callback, nosave) {

    var self = this;

    this.deref(bin.image_ref, function(err, img) {
        bin.north = img.north - bin.r;
        bin.south = bin.north - 1;
        bin.west = img.west + bin.c;
        bin.east = bin.west + 1;
        bin.map = img.map;
        if (nosave) {
           return bin;
        } else {
            self.put(bin, callback);
        }
    });

}