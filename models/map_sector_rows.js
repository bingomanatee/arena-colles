var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_sector_rows',

    mixins: {
        
        on_load: function(self, callback) {

            self.index([
                ["sector", 1],
                ["row", 1]
            ], false, function() {
                callback(null, self);
            });

        } // end onLoad
    }
}