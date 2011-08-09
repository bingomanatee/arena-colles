var mm = require(MVC_MODELS);

module.exports = function(context) {
    var id = context.req_params(true).id;
    mm.model('mapimage', function(err, mi_model) {
        images = [];
        function _on_done() {
            console.log('done');

            var ig = mi_model.image_grid(images);

            var icount_offset = 0;

            ig.forEach(function(image_row){
                var jcount_offset = 0;
                console.log('row is array: ', _.isArray(image_row), image_row.length);
                image_row.forEach(function(i, ii){
                 //   console.log(i);
                    i.j_offset = jcount_offset;
                    i.i_offset = icount_offset;
                    jcount_offset += parseInt(i.manifest.line_samples);

                    console.log('updating image ', i._id, jcount_offset);
                    mi_model.put(i, function(){});
                    if (ii == 0) {
                        icount_offset += parseInt(i.manifest.file_records);
                    }
                });
            })

            context.flash('Images Processed', 'info', '/maps/' + id);
        }

        function _on_image(image) {
            console.log('parsing image: ', image._id);
            mi_model.parse_image(image);
            images.push(image);
        }

        mi_model.find({map: mi_model._as_oid(id)}).forEach(_on_image, _on_done);
    });
}
