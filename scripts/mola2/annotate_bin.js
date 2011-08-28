var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');

module.exports.run = function() {
    console.log('annotating bins');
    mm.model('mapimage_bin', function(err, model) {
        console.log('getting records');
        var statics = {cursor: model.all()};
        var mc = 0;

        function _annotate(n, statics, after, done) {
            statics.cursor.next(function(err, bin) {
                if (err) throw err;
                if (bin) {
                    console.log('annotating ', bin._id, ': image ', bin.image, ',', bin.r,', ', bin.c);
                    model.annotate(bin, after);
                } else {
                    done();
                }
            })
        }

        var pipe = new Pipe(function() {
            console.log(' ==== done ===  ');
        }, _annotate, false, statics);
        pipe.start();
    });

}