var util = require('util');
var mm = require(MVC_MODELS);

module.exports = function(context) {
    var rp = context.req_params(true);
    var self = this;
    var id = rp.id;
   // console.log('request: ', util.inspect(context), ', rp: ', rp);
    var params = context.params();
    var result = this.model.get(id, function(err, map) {
        if (err) {
            console.log(err, util.inspect(this.model, true, 1));
            context.flash('Error in finding find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        } else if (map) {
            params.map = params.item = map;

            mm.model('mapimage', function(err, mi_model) {
                var q = {map: mi_model._as_oid(map._id)};
          //      console.log('image query: ', util.inspect(q, true, 4), typeof q.map);
                mi_model.find(q)
                  //  .sort({"manifest.maximum_latitude": 1, "manifest.easternmost_longitude": 1})
                    .toArray(
                    function(err, images) {
                        console.log(__filename, ' images to array err: ', err, ', images: ', images);
                    params.image_grid = mi_model.image_grid(images);
                    params.images = images;
                        context.render(params);
                }); // end all
            }); // end map_tiles model
        } else {
            console.log(util.inspect(this.model, true, 1));
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        };
    });
    console.log(__filename, 'get returns now? ', result);
};
