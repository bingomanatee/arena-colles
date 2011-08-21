var mm = require(MVC_MODELS);
var gate = require('util/gate');

module.exports = function(image, callback) {
    var self = this;
    mm.model('mapimage_tile', function(err, mit_model) {
        mit_model.remove({image: image._id}, function() {
            _make_image_data_scale(image, mit_model, 128, callback);
        });
    });

}

/*
 function() {
 _make_image_data_scale(image, mit_model, 64, function() {
 _make_image_data_scale(image, mit_model, 32, callback);
 });
 });
 */

/**
 * make the preliminary data metrics
 * @param data_sets
 * @param image
 */

function _generate_data_sets(data_sets, image, scale) {
    for (var i = 0; i < image.rows; i += scale)
        for (var j = 0; j < image.cols; j += scale) {
            var data = {
                image: image._id,
                image_data: image,
                min_image_i: i,
                min_image_j: j,
                max_image_i: i + scale,
                max_image_j: j + scale,
                min_abs_i:   i + image.i_offset,
                min_abs_j:   j + image.j_offset,
                max_abs_i:   i + scale + image.i_offset,
                max_abs_j:   j + scale + image.j_offset,
                scale: scale
            };
            data_sets.push(data);
        }
}

/*
 note - the max_image_j
 and max_image_i
 may extend past the image rows/cols

 Here is where the data finally gets inserted.
 */
function _make_image_data_scale(image, mit_model, scale, callback) {
    var tc = (image.rows * image.cols) / (128 * 128);
    var total_inserts = 16 * tc;
    // load all slots into a work queue
    var data_sets = [];
    _generate_data_sets(data_sets, image, scale);
    //  var writing_data_set = false;
    mit_model.config.coll.insert(data_sets, callback);
    var count = mit_model.count(function(err, c) {
        console.log('inserted ', data_sets.length, ' records into mapimage_tile: expected ', tc);
        console.log(', % done: ', parseInt((100 * c) / total_inserts));
    })
}

/*

 DEPRECATED

 load zeros into heights

 at this point the code simulates data loading by simply
 loading zeros into the data set.
 note - will get one more row/col than scale value
 that is, if scale is 4, will create a 5 x 5 grid.
 This is because the last row of one grid
 has to be the first row of the next grid, and likewise
 for columns,
 in order for the grids to blend seamlessly into each other.
 */

function _process_heights(data, image, scale, callback) {
    data.heights = [];
    console.log('_process_heights: processing data ', data.min_image_i, ', ', data.min_image_j, ' of map ', data.map);

    for (var i = data.min_image_i; i <= data.max_image_i; ++i) {
        var height_row = [];
        for (var j = data.min_image_j; j <= data.max_image_j; ++j) {
            height_row.push(0);
        }
        data.heights.push(height_row);
    }

    callback(data);
}