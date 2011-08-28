module.exports = {
    collection: 'mapimage_bin',

    mixins: {
        on_load: function(self, callback) {
            var index = {image: 1};
            console.log('indexing by ', index);
            self.index(index, false, function() {
                self.index({image: 1, r: 1, c: 1}, false, function() {
                    callback(null, self);
                });
            });
        },
        
        save_bin: require('./mapimage_bin/save_bin'),
        ao_map: require('./mapimage_bin/ao_map'),
        color_map: require('./mapimage_bin/color_map'),
        update_tile: require('./mapimage_bin/update_tile'),
        annotate: require('./mapimage_bin/annotate')
    }

}