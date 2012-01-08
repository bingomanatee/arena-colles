module.exports = function(context) {
    console.log(__filename, ': loading from context ', context);

    var self = this;
    var id = context.request.params.id;
    var lat = parseInt(context.request.params.lat);
    var lon = parseInt(context.request.params.lon);
    var zoom = 1;

    function _after_tiles(err, tiles) {
        var s = JSON.stringify(tiles);
        console.log(__filename, ': tiles = ', s.substring(0, 100), '...');
        //context.flash('Renedered coordinates of map ' + id, 'info', '/maps/' + id);
        if (context.request.params.format == 'json') {
            context.response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            context.response.end(s);
        } else {
            context.render('map/tiles.html', {
                tiles: tiles,
                tile_array: _tile_array(tiles),
                layout: false
            });
        }

    }

    var query = {
        zoom: 1,
        lat: lat,
        long: lon,
        map: id
    };

    console.log(__filename, ': getting query ', query);

    this.model.tiles(query, _after_tiles);

    // this.model.get(id, _get_map);
}

function _tile_array(tiles) {

    var i = [];
    var j = [];

    tiles.forEach(function(t) {
        i.push(t.i);
        j.push(t.j);
    });

    i = _.uniq(i);
    i = _.sortBy(i, function(a) {
        return a
    });

    j = _.uniq(j);
    j = _.sortBy(j, function(a) {
        return a
    });

    var grid = [];

    for (var ii = _.min(i); ii <= _.max(i); ++ii) {
        var j_array = [];
        for (var jj = _.min(j); jj <= _.max(j); ++jj) {
            j_array[jj] = false;
        }
        grid[ii] = j_array;
    }

    tiles.forEach(function(t) {
        grid[t.i][t.j] = t.height;
    });

    return grid;
}