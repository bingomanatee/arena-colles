
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
                    params.image_grid = _image_grid(images);
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

function _image_grid(images){
    var grid = [];
    var souths = [];
    var wests = [];
    images.forEach(function(image){
        var south = parseInt(image.manifest.minimum_latitude);
        var west = parseInt(image.manifest.westernmost_longitude);
        souths.push(south);
        wests.push(west);
    });
    wests = _.sortBy(_.uniq(wests), function(a){return a});
    souths = _.sortBy(_.uniq(souths), function(a){return a});
    console.log('souths: ', souths, ': wests: ', wests);
    
    souths.forEach(function(south){
      var south_row = [];
        wests.forEach(function(west, w){
            images.forEach(function(image){
                if (parseInt(image.manifest.westernmost_longitude) == west
                    && parseInt(image.manifest.minimum_latitude) == south
                    ){
                    south_row[w] = image;
                }
            })

        });
        grid.push(south_row);
    });
    return grid;
}