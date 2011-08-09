module.exports = {
    collection: 'mapimage',

    mixins: {

        parse_image : function(image, callback) {
            image.west = parseInt(image.manifest.westernmost_longitude);
            image.east = parseInt(image.manifest.easternmost_longitude);
            image.south = parseInt(image.manifest.minimum_latitude);
            image.north = parseInt(image.manifest.maximum_latitude);
            image.rows = parseInt(image.manifest.line_samples);
            image.cols = parseInt(image.manifest.file_records);
            this.put(image, callback ? callback : function(){});
        },

        image_grid: function(images) {
            var grid = [];
            var souths = [];
            var wests = [];
            images.forEach(function(image) {
                var south = parseInt(image.manifest.minimum_latitude);
                var west = parseInt(image.manifest.westernmost_longitude);
                souths.push(south);
                wests.push(west);
            });
            wests = _.sortBy(_.uniq(wests), function(a) {
                return a
            });
            souths = _.sortBy(_.uniq(souths), function(a) {
                return a
            });
            console.log('souths: ', souths, ': wests: ', wests);

            souths.forEach(function(south) {
                var south_row = [];
                wests.forEach(function(west, w) {
                    images.forEach(function(image) {
                        if (parseInt(image.manifest.westernmost_longitude) == west
                            && parseInt(image.manifest.minimum_latitude) == south
                            ) {
                            south_row[w] = image;
                        }
                    })

                });
                grid.push(south_row);
            });
            return grid;
        },

        make_image_data: require('./mapimages/make_image_data')
    }
}