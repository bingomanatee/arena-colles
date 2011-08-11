module.exports = function (images){
    // The returned set of images
    var grid = [];

    // registries for the axes of the grid
    var souths = [];
    var wests = [];

    images.forEach(function(image){
        var south = parseInt(image.manifest.minimum_latitude);
        var west = parseInt(image.manifest.westernmost_longitude);
        souths.push(south);
        wests.push(west);
    });

    // clean up the axes
    wests = _.sortBy(_.uniq(wests), function(a){return a});
    souths = _.sortBy(_.uniq(souths), function(a){return a});

    console.log('souths: ', souths, ': wests: ', wests);

    // go through the axes and put the images in their proper place on the grid
    souths.forEach(function(south){
      var south_row = [];
        wests.forEach(function(west, w){
            images.forEach(function(image){
                if (parseInt(image.manifest.westernmost_longitude) == west
                    && parseInt(image.manifest.minimum_latitude) == south
                    ){
                    south_row[w] = image;
                }
            })

        });
        grid.push(south_row);
    });
    return grid;
}