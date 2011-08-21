var mm = require(MVC_MODELS);
var util = require('util');

/**
 * mapimage.show
 *    shows a large chunk of data
 *    and the tiles that make it up.
 * @param context
 */
module.exports = function(context) {
    var self = this;
    var params = context.params();
    var rp = context.req_params(true);
    var id = rp.id;

    console.log('showing map image ', id);

    this.model.get(id, function(err, image) {
        if (err) {
            console.log('err find mapimage', err);
            context.flash('Error finding ' + self.name + ' ' + id, 'error', '/mapimages');
        } else if (image) {

            if (rp.format == 'png') {
                self.model.color_map(image, function(err, canvas) {

                    var stream = canvas.createPNGStream();
                    stream.pipe(context.response);
                });
            } else {
                params.mapimage = params.item = image;
                console.log('received image ', image._id);

                function _ij(tile) {
                    return image.cols * tile.min_image_i + tile.min_image_j;
                }

                function _with_tiles(err, tiles) {

                    console.log('rendering tile ', util.inspect(tiles[0]) );
                    tiles = _.sortBy(tiles, _ij);
                    console.log('tiles sorted');
                    params.tiles = tiles;
                    console.log('rendering...');
                    context.render(params);
                }

                mm.model('mapimage_tile', function(err, mit_model) {
                    var q = {image: image._id};
                    console.log('looking for ', q);
                    mit_model.find(q, {heights: 0}).toArray(_with_tiles);
                });

            }

        } else {
            console.log('cannot find mapimage');
            context.flash('Cannot find my mapimage ' + id, 'error', '/mapimages');
        }
    })
}
