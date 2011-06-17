var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_coords',

    mixins: {        
        zoom_back: require('./map_coords/zoom_back')
    }
}