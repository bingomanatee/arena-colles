var _ = require("underscore");

module.exports = {
    collection: 'mapimage',

    mixins: {
        parse_image:        require('./mapimages/parse_image'),

        image_grid:         require('./mapimages/image_grid'),

        make_image_data:    require('./mapimages/make_image_data'),

        for_map:            require('./mapimages/for_map'),

        gen_tiles:          require('./mapimages/gen_tiles'),

        import_image_data:  require('./mapimages/import_image_data'),

        color_map:          require('./mapimages/color_map'),

        image_path:         function(image, zoom) {
            if (!zoom) {
                zoom = 1;
            }
            id = _.isString(image) ? image : image._id;
            return  MVC_PUBLIC + '/img/mapimage/' + id + '_color_x_' + zoom + '.png';
        },

        normal_path:         function(image, zoom) {
            if (!zoom) {
                zoom = 1;
            }
            id = _.isString(image) ? image : image._id;
            return  MVC_PUBLIC + '/img/mapimage/' + id + '_normal_x_' + zoom + '.png';
        },

        color_map_segment:  require('./mapimages/color_map_segment'),

        normal_map:          require('./mapimages/normal_map'),

        normal_map_segment:  require('./mapimages/normal_map_segment'),

        update_tiles:       require('./mapimages/update_tiles'),

        update_bin:         require('./mapimages/update_bin')
    }
}