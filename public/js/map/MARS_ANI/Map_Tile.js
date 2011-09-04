MARS_ANI._Map_Tile_exe = function() {

    MARS_ANI.Map_Tile = function(config) {
        _.defaults(config, this._defaults);

        this.north = parseInt(config.north);
        this.south = parseInt(config.south);
        this.west = parseInt(config.west);
        this.east = parseInt(config.east);

        this._mat = config.mat;

        this.points_per_deg = parseFloat(config.points_per_deg);
        this.min_points = Math.max(2, parseInt(config.min_points));

        this.zoom = parseInt(config.zoom);
        this.res = parseInt(config.res);
        this.deg_size = parseInt(config.deg_size);

        this._geo = false;
        this._mesh = false;
        this._material = false;
        this._center = false;

        this._adjust();
        this._test();
    }


    MARS_ANI.Map_Tile.prototype = {

        _defaults: {zoom: 64, deg_size: 100, points_per_deg: 0.125, min_points: 3,
            res: 0, north: 30, south: 0, east: 0, west: 30,
        mat: MARS_ANI.res.mat.uv_wire},

        _cycle: function(v, c) {
            if (c < 0) {
                throw new Error('cycle to negative: ' + c)
            }

            while (v < 0) {
                v += c;
            }
            while (v > c) {
                v -= c;
            }

            return v
        },

        _adjust: function() {
            this.west = this._cycle(this.west, 360);
            this.east = this._cycle(this.east, 360);
        },

        _range_test: function(v, min, max, name) {
            if (v < min) {
                throw new Error(name + ' ' + v + ' < ' + min);
            }
            if (v > max) {
                throw new Error(name + ' ' + v + ' > ' + max);
            }
        },

        _test: function() {
            this._range_test(this.north, -90, 90, 'north');

            if (this.south >= this.north) {
                MARS_ANI.log_err('bad lat range', this);
                throw new Error('bad lat range');
            }

            if (this.west >= this.east) {
                MARS_ANI.log_err('bad lon range', this);
                throw new Error('bad lon range');
            }
        },

        deg_width: function() {
            return (this.east - this.west);
        },

        width: function() {
            return this.deg_width() * this.deg_size;
        },

        deg_height: function() {
            return (this.north - this.south);
        },

        height: function() {
            return this.deg_height() * this.deg_size;
        },

        _get_material: function() {
            MARS_ANI.log(['mat'], 'material:', this._mat);
            return  this._mat;
        },

        width_segs: function() {
            if (this.res > 2) {
                return res;
            }
            var measure = this.deg_width() * this.points_per_deg;
            MARS_ANI.log(['Map_Tile', 'measure'], 'minPpoints', 'deg_width: ', this.deg_width(),
                 'ppd', this.points_per_deg, 'min_points', this.min_points, 'measure', measure);
            return Math.max(this.min_points, Math.ceil(measure ));

        },


        height_segs: function() {
            if (this.res > 0) {
                return res;
            }

            var measure = this.deg_height() * this.points_per_deg;
            MARS_ANI.log(['Map_Tile', 'measure'], 'minPpoints', 'deg_h: ', this.deg_height(),
                 'ppd', this.points_per_deg, 'min_points', this.min_points, 'measure', measure);
            return Math.max(this.min_points, Math.ceil(measure ));

        },

        _get_geo: function(rewrite) {
            MARS_ANI.log(['Map_Tile', '_get_geo'], 'get_ge starting');
            if (rewrite || (!this._geo)) {
                var ws = this.width_segs() - 1;
                var hs = this.height_segs() - 1;
                MARS_ANI.log(['Map_Tile', 'get_geo', 'measure'], 'ws', ws, 'hs', hs);
                this._geo = new THREE.PlaneGeometry(this.width(), this.height(),
                    ws, hs);
                this._geo.doubleSided = true;
                this._geo.vertices.forEach(function (v) {
                    v.position.z = 1000;
                });
            }
            MARS_ANI.log(['Map_Tile', '_get_geo'], '... get_geo done');
            return this._geo
        },

        _get_mesh: function(rewrite) {
            if (rewrite || !this._mesh) {
                var geo = this._get_geo();
                var mat = this._get_material();
                MARS_ANI.log(['Map_Tile', '_get_mesh'], 'creating mesh');
                this._mesh = new THREE.Mesh(geo, mat);
                this._mesh.doubleSided = true;
                MARS_ANI.log(['Map_Tile', '_get_mesh'], '...done creating mesh');
            }
            return this._mesh;
        },

        _add_trident: function() {
            this._center = new THREE.Trident();
            MARS_ANI.log(['Map_Tile', '_add_trident'], 'adding trident');
            this._get_mesh().addChild(this._center);
            MARS_ANI.log(['Map_Tile', '_add_trident'], '... done adding trident');
            return this._center;
        },

        create: function () {
            MARS_ANI.log(['Map_Tile', 'create'], 'creating Map_Tile');
            var mesh = this._get_mesh();
            mesh.__tile = this;
            this._add_trident();
            MARS_ANI.scene.addObject(mesh);
            MARS_ANI.log(['Map_Tile', 'create'], '...done creating Map Tile');

            return mesh;
        }

    }

    MARS_ANI.log(['Map_Tile'], 'MARS_ANI._Map_Tile_exe created');
    setTimeout(function() {
        delete MARS_ANI._Map_Tile_exe;
        MARS_ANI.log(['Map_Tile', 'exe_clear'], 'MARS_ANI._Map_Tile_exe cleared')
    }, 1);
}

MARS_ANI._Map_Tile_exe();