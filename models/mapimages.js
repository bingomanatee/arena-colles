module.exports = {
    collection: 'mapimage',

    mixins: {
        parse_image:     require('./mapimages/parse_image'),

        image_grid:      require('./mapimages/image_grid'),

        make_image_data: require('./mapimages/make_image_data'),

        for_map:            function(id, callback){
            id = this._as_oid(id);
            var cursor = this.find({map: id, "manifest.name": "MEDIAN_TOPOGRAPHY"});
            cursor.toArray(callback);
        }
    }
}