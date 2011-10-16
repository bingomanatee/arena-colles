module.exports = function(context) {
    var self = this;
    var rp = context.req_params(true);
    var lat = rp.lat;
    var lon = rp.lon;

    console.log('showing map tile lat:', lat, 'lon:', lon);

    this.model.get_tile(lat, lon, function(err, tile) {
            console.log('returned', err, tile ? tile._id : tile);
            if (err) {
                console.log('err find maptile', err);
                context.flash('Error finding tile lat: ' + lat + ', lon: ' + lon, 'error', '/');
            } else if (tile) {
                console.log('tile found ', tile, '; format: ', rp.format);

                switch (rp.format) {
                    case 'img':
                        context.response.write(tile.packed_data.buffer);
                        context.response.end();
                        break;

                    case 'json':
                        delete tile.packed_data;
                        context.response.write(JSON.stringify(tile, null, 2));
                        context.response.end();
                        break;
                    default:
                        context.render({tile: tile});
                }
            } else {
                context.flash('cannot find lat' + lat + ', lon' + lon, 'error', '/');
            }
        }

    );
}