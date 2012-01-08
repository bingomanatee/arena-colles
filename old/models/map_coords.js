var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_coords',

    mixins: {
        on_load: function(self, callback) { 

                self.index([["map", 1], ["zoom", 1]], false, function() {
                    callback(null, self);
                });
        },

        point_count: require('./map_coords/point_count'),

        zoom_back: require('./map_coords/zoom_back')
    }
}