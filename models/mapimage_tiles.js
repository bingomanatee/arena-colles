module.exports = {
    collection: 'mapimage_tile',

    mixins: {
        on_load: function(self, callback) {
            var index = {image: 1};
            console.log('indexing by ', index);
            self.index(index, false, function() {
                self.index({image: 1, tile_i: 1, tile_j: 1, scale: 1}, false, function() {
                    callback(null, self);
                });
            });
        },
        image_to_tiles: require('./mapimage_tiles/image_to_tiles'),
        ao_map: require('./mapimage_tiles/ao_map'),
        color_map: require('./mapimage_tiles/color_map'),
        update_tile: require('./mapimage_tiles/update_tile')
    }
}