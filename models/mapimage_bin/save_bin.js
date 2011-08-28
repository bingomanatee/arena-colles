var bson = require('mongodb').BSONPure;
var DBRef = bson.DBRef;
var fs = require('fs');
var fsu = require('util/fs');

module.exports = function(image, r, c, scale, heights, callback) {
    var self = this;
    var buffer = new Buffer(scale * scale * 2);

    var dir = image.bin_path + '/' + r + '/' + c;
    var filename = dir + '/' + scale + '.bin';

    fsu.ensure_dir(dir);
    var stream = fs.createWriteStream(filename);
    stream.on('close', function() {
        var ir = new DBRef('mapimage', image._id);

        var data = {
            r: r,
            c: c,
            image: image._id,
            image_ref: ir,
            bin_dir: dir,
            bin_path: [
                { scale: scale,
                    filename: filename}
            ]
        };


        console.log('saving file', filename);
        self.annotate(bin, callback);
    });
    stream.write(heights);
    stream.end();
}