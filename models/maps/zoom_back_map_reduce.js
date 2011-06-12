module.exports = function(map_id, output) {
    if (!output) {
        output = "map_zoom";
    }

    return {
        mapreduce: "map_coords",
        out: output,
        map: function() {
            var index = {
                i: parseInt(Math.floor(parseInt(this.i) / 2)),
                j: parseInt(Math.floor(parseInt(this.j) / 2))
            };
            var value = {
                height: parseInt(this.height),
                position: this.position,
                map: this.map
            };
            emit(index, value);
        },

        reduce: function(key, values) {
            var ret = {
                heights: [],
                count: 0,
                positions: [],
                map: null
            };
            for (var i = 0; i < values.length; ++i) {
                var v = values[i];
                ret.map = v.map;
                ++ret.count;
                ret.heights.push(v.height);
                ret.positions.push(v.position);
            }
            return ret;
        },

        finalize: function(key, value) {
            value.height = 0;
            value.heights.forEach(function(h) {
                value.height += h;
            });
            value.height /= value.count;
            delete(value.heights);
            var lat = 0;
            var lon = 0;
            value.positions.forEach(function(p) {
                lon += p[0];
                lat += p[1];
            });
            lat /= value.count;
            lon /= value.count;
            value.position = [lon, lat];
            delete(value.positions);
            return value;
        },

        query: {
            "map": map_id,
            zoom: 2
        }
    };
}