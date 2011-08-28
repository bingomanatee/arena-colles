var fs = require('fs');
var util = require('util');
var neobuffer = require('neobuffer');

module.exports.run = function() {

    var buffer = new neobuffer.Buffer(16 * 2);
    console.log(util.inspect(buffer));
    var index = 0;
    start = -8;
    for (var i = 0; i < 4; ++i) {
        for (var j = 0; j < 4; ++j) {
            buffer.writeInt16(start++, index, 'big');
            index += 2;
        }
    }

    var old_buffer = new Buffer(buffer.length);
    buffer.copy(old_buffer);
    var stream = fs.createWriteStream('buf.img');
    stream.write(old_buffer);
    stream.end();

    stream.on('close', function() {
        var in_buffer = fs.readFileSync('buf.img');
        var in_buffer_neo = new neobuffer.Buffer(in_buffer.length);
        in_buffer.copy(in_buffer_neo);
        console.log('reading from buf.img');
        var index = 0;
        for (var i = 0; i < 4; ++i) {
            var row = [];
            for (var j = 0; j < 4; ++j) {
                row.push(in_buffer_neo.readInt16(index, 'big'));
                index += 2;
            }

            console.log.apply(console, row);
        }
    })

}