var mm = require(MVC_MODELS);

module.exports = function(images) {
    mm.model('mapimage_tile', function(err, mit_model) {
        images.forEach(_make_image_data, mit_model);
    })

}

function _make_image_data(image, mit_model) {
    _make_image_data_scale(image, mit_model, 128);
    _make_image_data_scale(image, mit_model, 64);
}

function _make_image_data_scale(image, mit_model, scale){
    for (var i = 0; i <= image.rows; i += scale)
    for(var j = 0; j < image.cols; j += scale){
        var data = {image: image._id, i: i, j: j, i_offset: i + image.i_offset, j_offset: j + image.j_offset, scale: scale};
        data.heights_raw =_raw_heights(image, i, j, scale);
        _process_heights(data);
    }
}