var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_sectors',

    mixins: {
        
        render: require('./map_sectors/render'),
        
        parse_rows: require('./map_sectors/parse_rows'),
        
        data_path: require('./map_sectors/data_path'),
        
        region: require('./map_sectors/region'),
        
    }
}