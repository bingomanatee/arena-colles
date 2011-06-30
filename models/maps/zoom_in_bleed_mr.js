function _reduce(key, values) {
    var out = {
        height: [],
        lat: [],
        lon: [],
        zoom: null
    };

    values.forEach(function(value) {
        out.height = out.height.concat(value.height);
        out.lat = out.lat.concat(value.lat);
        out.lon = out.lon.concat(value.lon);
        out.zoom = value.zoom;
    });

    return out;
};

function _map() {

    var out = {
        height: [this.height],
        lon: [this.position[0]],
        lat: [this.position[1]],
        zoom: this.zoom
    };

    [-1, 0, 1].forEach(function(i) {
        [-1, 0, 1].forEach(function(j) {
            if (i || j) {
                var key = {
                    i: i + this.i,
                    j: j + this.j
                };
                emit(key, out);
            }
        });
    });
};

module.exports = function(id, zoom) {
    query = {
        map: id,
        zoom: zoom
    };

    function finalize(key, value) {
        function avg(prop) {
            if (!prop.length) return null;
            value = 0;
            prop.forEach(function(v) {
                value += v;
            });
            return value / prop.length;
        }

        value.height = avg(value.height);
        value.position = [avg(value.lat), avg(value.lon)];
        delete(value.lat);
        delete(value.lon);

        return value;
    }

    return {
        mapreduce: 'map_coords',
        query: query,
        map: _map.toString(),
        reduce: _reduce.toString(),
        finalize: finalize.toString(),
        out: 'gen_coords_zoom_in'
    }

}