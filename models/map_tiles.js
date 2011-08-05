var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_tiles',
    
    mixins: {
        'icon_data': require(__dirname + '/map_tiles/icon_data')
    }
}