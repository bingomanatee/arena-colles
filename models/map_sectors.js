var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_sectors',

    mixins: {
        
        render: require('./map_sectors/render'),
        
        on_load: function(self, callback) {

            self.index([
                ["lon_i", 1],
                ["lat_i", 1]
            ], false, function() {
                callback(null, self);
            });

        } // end onLoad
    }
}