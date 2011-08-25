var mm = require(MVC_MODELS);

module.exports.run = function() {
    mm.model('mapimage_tile', function(err, mit_model) {
        var tile_list = {};
        var cursor = mit_model.find({}, {heights: 0});
        var done = false;

        function _process_tile() {
            cursor.next(function(err, tile) {
                if (err) {
                    throw err;
                }
                if (!tile) {
                    done = true;
                    console.log('------- done ------');
                    return;
                }


                if ((!tile.hasOwnProperty('tile_i')) || (!tile.hasOwnProperty('tile_j')) ||
                    _.isNull(tile.tile_i) || _.isNull(tile.tile_j)) {
                    console.log('deleting null tile ', tile._id);
                    mit_model.delete(tile._id);
                } else {
                    var image_id = tile.image.toString();
                    if (tile_list.hasOwnProperty(image_id)) {
                        var unique = true;
                        tile_list[image_id].forEach(function(old_tile){
                           if (unique && (old_tile.tile_i == tile.tile_i)
                           && (old_tile.tile_j == tile.tile_j)){
                               console.log('*********** MATCH FOUND**********', tile._id);
                               unique = false;
                           }
                        });
                        if (!unique){
                            mit_model.delete(tile._id);
                        }
                    } else {
                        console.log('first tile for image', image_id);
                        tile_list[image_id] = [tile]
                    }
                }

             //   console.log('tile', tile._id, 'r', tile.tile_i, 'c', tile.tile_j);
                process.nextTick(_process_tile);
            });
        }

        console.log('starting read');
        process.nextTick(_process_tile);
    });
}