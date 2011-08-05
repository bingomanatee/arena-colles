var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_sectors',

    mixins: {

        render: require('./map_sectors/render'),

        parse_rows: require('./map_sectors/parse_rows'),

        data_path: require('./map_sectors/data_path'),

        region: require('./map_sectors/region'),

        tile: require('./map_sectors/tile'),

        on_load: function(model, callback) {
            model.config.coll.ensureIndex({
                image_file: 1,
                i: 1,
                j: 1
            });
            callback(null, model);
        },

        'icon_data': require(__dirname + '/map_sectors/icon_data')
    }
}