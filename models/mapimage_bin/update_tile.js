/**
 *
 * mapimage_tile: update_tile
 * update a single tile's height data
 *
 * @param tile      Object <mapimage_tile> - tile metadata from the mapimage_tile collection
 * @param callback function
 * @param image_data  int[][] - data from MARS!
 */

module.exports = function(tile, callback, image_data) {
    console.log(__filename,': updating tile ', tile._id, tile.min_image_i, 'x', tile.min_image_j);
   // console.log('image_data.length: ', image_data.length);
    var height_rows = [];

    for (var i = tile.min_image_i; i < tile.max_image_i; ++i){
        if (i >= image_data.length){
            throw new Error('attempting to read row ' + i + ', past image length ' + image_data.length);
        }
        var row = image_data[i];
       // console.log('row: ', row.length, '; ', tile.min_image_j, 'x', tile.max_image_j);
        height_rows.push(row.slice(tile.min_image_j, tile.max_image_j));
    }

    tile.heights = height_rows;
    this.put(tile, callback);

}