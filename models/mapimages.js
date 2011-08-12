module.exports = {
    collection: 'mapimage',

    mixins: {
        parse_image:        require('./mapimages/parse_image'),

        image_grid:         require('./mapimages/image_grid'),

        make_image_data:    require('./mapimages/make_image_data'),

        for_map:            require('./mapimages/for_map'),

        gen_tiles:          require('./mapimages/gen_tiles'),

        update_tiles:       require('./mapimages/update_tiles')
    }
}