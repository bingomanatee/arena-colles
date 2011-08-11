module.exports = {
    collection: 'mapimage_tile',

    mixins: {
        image_to_tiles: require('./mapimage_tiles/image_to_tiles')
    }
}