MARS_ANI._Planet_Tiler_create = function() {
    function Planet_Tiler(config) {
        this.tiles = [];

        _.defaults(config, this._defaults);

        this.deg_per_tile = parseInt(config.deg_per_tile);
        this.size_per_tile = parseFloat(config.size_per_tile);
        this.zoom = parseInt(config.zoom);
        this.points_per_tile = parseFloat(config.points_per_tile);
        this.tile_range = parseInt(config.tile_range);
    }

    Planet_Tiler.prototype = {
        _defaults: {
            deg_per_tile: 10,
            size_per_tile: 100,
            points_per_tile: 4,
            zoom: 32,
            radius: 10000,
            tile_range: 1
        },

        create_tile: function(west, south) {
            MARS_ANI.log(['planet_tiler', 'create'], 'west', west, 'south', south);
            var self = this;
            var east = west + this.deg_per_tile;
            var north = south + this.deg_per_tile;
            var deg_to_size = this.size_per_tile/this.deg_per_tile;
            var cx = deg_to_size * (east + west) / 2
            var cy = deg_to_size * (north + south) / -2
            var half_size = this.size_per_tile/2;
            //console.log('half size: ', half_size);

            var config = {
                north: north,
                east: east,
                west: west,
                south: south,
                width: this.size_per_tile,
                height: this.size_per_tile,
                width_segs: this.points_per_tile,
                height_segs: this.points_per_tile,
                x: cx,
                y: -100,
                z: cy,
                top: cy + half_size,
                bottom: cy - half_size,
                left: cx - half_size,
                right: cx + half_size
            }

            MARS_ANI.log(['planet_tiler', 'create'], 'Planet Tiler config', config);
            /**
             * note - since the planes are flat, the catrographic y (lat) value
             * is the xyz z value.
             * 
             * @param tile
             * @param v
             * @param i
             */
            function _pt_filter(tile, v, i){
                var height_segs  = tile.height_segs();
                var width_segs = tile.width_segs();
               // i = height_segs * width_segs - (1 + i);
                var tile_x = width_segs - (i % width_segs);
                var tile_y = Math.floor(i / width_segs);
                
                var x_progress = tile_x / (width_segs - 1) ;
                var y_progress = tile_y / (height_segs - 1);

                var x_offset = ( tile.left - tile.right) * x_progress + tile.right;
                var z_offset = (tile.top - tile.bottom) * y_progress + tile.bottom;

                v.position.y = -100;
                v.position.x = x_offset;
                v.position.z = z_offset;
                
                MARS_ANI.log(['planet_tiler', 'pt'], 'x', tile.x, 'y', tile.y,
                    'xo', x_offset, 'zo', z_offset,
                    'i', i, '(', v.position.x, v.position.y, v.position.z, ')' );

            }

            config.pt_filter = _pt_filter;
            var out = {x: cx,
            y: cy,
            tile: new MARS_ANI.Map_Tile(config)};
            out.tile.create();

            return out;
        },

        init: function() {
            for (var long = 0; long < 360; long += this.deg_per_tile) {
                for (var lat = -90; lat < 90; lat += this.deg_per_tile) {
                    this.tiles.push(this.create_tile(long, lat));
                }
            }
        }

    }

    MARS_ANI.Planet_Tiler = Planet_Tiler;
}

MARS_ANI._Planet_Tiler_create();