var binary = require('util/binary');

module.exports =

function read_data(img_data, ROWS, COLS) {
    var max = null;
    var min = null;

    var sample_increment = parseInt(ROWS * COLS / 1000);
    var samples = [];
    //  console.log('image data: ', img_data);
    var heights = [];
    var place = 0;
    var sample_count = 0;

    var buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var dec_buckets = [];

    for (var row = 0; row < ROWS; ++row) {
        var row_data = [];
        for (var column = 0; column < COLS; column += 2) {
            var height = binary.int16(place, 'little', img_data);
            place += 2;

            if (!(++sample_count % sample_increment)) {
                samples.push(height);
            }

            ++buckets[Math.round(Math.log(height) * 2)];
            row_data.push(parseInt(height));

            var db = Math.round(height / 1000);
            if (!dec_buckets[db]) {
                dec_buckets[db] = 1;
            } else {
                ++dec_buckets[db];
            }
            if ((!row) && (!column)) {
                max = min = height;
            } else if (height > max) {
                max = height;
            } else if (height < min) {
                min = height
            };

        }
        heights.push(row_data);

        if (!(row % 1000)) {
            console.log('row ', row, ' (', row_data.length, ' cols): ', row_data.slice(0, 20).join(', '));
        }
    }

    return {
        heights: heights,
        max: max,
        min: min,
        dec_buckets: dec_buckets,
        buckets: buckets,
        samples: samples
    };
}