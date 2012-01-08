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
        }.toString(),

        reduce: function(key, values) {
            //    print('--- reduce ---');
            var count = 0;

            var ret = {
                height: 0,
                position: [0, 0],
                map: null
            };
            for (var i = 0; i < values.length; ++i) {
                var v = values[i];
                //    print('... reducing ');
              //  printjson(v);
                ret.map = v.map;
                ++count;
                ret.height += v.height;
                ret.position[0] += v.position[0];
                ret.position[1] += v.position[1];
            }
            if (count) {
                ret.height /= count;
                ret.position[0] /= count;
                ret.position[1] /= count;
            }
         //   print('...  computing');
            //  printjson(ret);
            return ret;
        }.toString(),
/*
        finalize: function(key, value) {
            print(" ===================== finalizing ")
            printjson(key)
            printjson( value);
            value.height = 0;
            value.heights.forEach(function(h) {
                value.height += h;
            });
            value.height /= value.count;
            value.zoom = 1;
            delete(value.heights);
            var lat = 0;
            var lon = 0;
            value.positions.forEach(function(p) {
                if (p && (typeof(p) == 'object') && p.hasOwnProperty('length') && p.length > 1){
                lon += p[0];
                lat += p[1];
                } else {
                    print('Cannot lon/lat')
                    printjson(p);
                }
            });
            lat /= value.count;
            lon /= value.count;
            value.position = [lon, lat];
            delete(value.positions);
            print('................ to value ')
            printjson(value);
            return value;
        }.toString(), */
        verbose: true,
        query: {
            "map": map_id,
            zoom: 2
        }
    };
}