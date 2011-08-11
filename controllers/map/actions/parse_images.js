var mm = require(MVC_MODELS);

/**
 *  creates image records from manifest
 * @param context
 */
module.exports = function(context) {
    var id = context.req_params(true).id;
    mm.model('mapimage', function(err, mi_model) {
        function _on_done(err, images) {
            console.log('done - ', images.length, ' images');

            var ig = mi_model.image_grid(images);

            var icount_offset = 0;

            ig.forEach(function(image_row){
                var jcount_offset = 0;
               // console.log('row is array: ', _.isArray(image_row), image_row.length);
                image_row.forEach(function(i, ii){
                    console.log(__filename, ': image ', i);
                    i.j_offset = jcount_offset;
                    i.i_offset = icount_offset;
                    jcount_offset += parseInt(i.manifest.line_samples);
                    mi_model.parse_image(i);
                    console.log('updating image ', i._id, jcount_offset);
                    mi_model.put(i, function(){});
                    if (ii == 0) {
                        icount_offset += parseInt(i.manifest.file_records);
                    }
                });
            })

            context.flash('Images Processed', 'info', '/maps/' + id);
        }

        mi_model.for_map(id, _on_done);
    });
}
