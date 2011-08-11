
var mm = require(MVC_MODELS);

module.exports = function(context) {
    var rp = context.req_params(true);
    var self = this;
    var id = context.request.params.id;
    var params = context.params();
    var result = this.model.get(id, function(err, map) {
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        } else if (map) {
            params.map = params.item = map;

            mm.model('mapimage', function(err, mi_model) {

                mi_model.find({map: mi_model._as_oid(id)}).toArray(
                    function(err, images) {
                    params.image_grid = mi_model.image_grid(images);
                    params.images = images;
                        context.render(params);
                }); // end all
            }); // end map_tiles model
        } else {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        };
    });
    console.log(__filename, 'get returns now? ', result);
};
