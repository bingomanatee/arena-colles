module.exports = {
    collection: 'mapimage_tile',

    mixins: {
        on_load: function(self, callback) {
            var index = {image: 1};
            console.log('indexing by ', index);
                self.index({image: 1}, false, function() {
                self.index({lat: 1, lon: 1}, false, function() {
                    callback(null, self);
                });
            });
        },
        get_tile: require('./mapimage_tiles/get_tile'),
        image_to_tiles: require('./mapimage_tiles/image_to_tiles'),
        ao_map: require('./mapimage_tiles/ao_map'),
        color_map: require('./mapimage_tiles/color_map'),
        update_tile: require('./mapimage_tiles/update_tile')
    }
}