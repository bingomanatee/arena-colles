var mm = require(MVC_MODELS);
var gate = require('util/gate');

module.exports = function(image, callback) {
    mm.model('mapimage_tile', function(err, mit_model) {
        _make_image_data(image, mit_model, callback);
    });

}

function _make_image_data(image, mit_model, callback) {
    mit_model.remove({image: image._id}, function() {
        _make_image_data_scale(image, mit_model, 128, function() {
            _make_image_data_scale(image, mit_model, 64, function() {
                _make_image_data_scale(image, mit_model, 32, callback);
            });
        });
    });
}

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
 */
function _make_image_data_scale(image, mit_model, scale, callback) {

    // load all slots into a work queue
    var data_sets = [];
    _generate_data_sets(data_sets, image, scale);
    var writing_data_set = false;

    /**
     * write the data after
     * it has been transferred from the image file.
     * When the callback comes back from Mongo the scale_loop
     * runs again.
     *
     * @param data
     */
    function _post_process_data(data) {
        mit_model.put(data, function(err, new_data) {
            console.log('... done writing data, ', new_data._id, 'j: ', data.min_abs_i, ',', data.min_abs_j);
            writing_data_set = false;
        });
    }

    /**
     * pops one data off the data set at a time and
     * wait for it to be saved
     */
    function _scale_loop() {
        var data = false;

        if (writing_data_set) {
            return;
        }
        writing_data_set = true;

        if (data_sets.length) {
            data = data_sets.pop();
            _process_heights(data, image, scale, _post_process_data);
        } else {
            clearInterval(scaleInterval);
            callback();
        }
    }

    var scaleInterval = setInterval(_scale_loop, 250);
}

/*

 break an image into tiles

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