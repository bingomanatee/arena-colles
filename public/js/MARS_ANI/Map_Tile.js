MARS_ANI._Map_Tile_exe = function() {
    /**
     * A wrapper around a PlaneGeometery geo.
     *
     * note the verticies are in an array of rows and columns;
     * i.e., in a 3 row x 6 column plane, the first six verticies are
     * the top row of the plane.
     *
     * the ws and hs properties below are the number of width segments
     * and height segments in the plane. There are one fewer segments than
     * the number of rows and columns of points, respectively.
     *
     * @param config: object
     */

    function _negn(n) {
        if (n < 0) {
            return Math.abs(n) + 'n';
        }
        return n;
    }

    MARS_ANI.Map_Tile = function(config) {
        _.defaults(config, this._defaults);

        this.north = parseInt(config.north);
        this.south = parseInt(config.south);
        this.west = parseInt(config.west);
        this.east = parseInt(config.east);

        this.x = parseFloat(config.x);
        this.y = parseFloat(config.y);
        this.z = parseFloat(config.z);
        this.top = parseFloat(config.top);
        this.left = parseFloat(config.left);
        this.bottom = parseFloat(config.bottom);
        this.right = parseFloat(config.right);

        this._mat = config.mat;

        this._width = parseFloat(config.width);
        this._height = parseFloat(config.height);

        this._width_segs = parseFloat(config.width_segs);
        this._height_segs = parseFloat(config.height_segs);

        this.zoom = parseInt(config.zoom);
        this.res = parseInt(config.res);
        this.deg_size = parseInt(config.deg_size);
        this.pt_filter = config.pt_filter;

        this._geo = false;
        this._mesh = false;

        var props = [this.north, this.south, this.east, this.west, this.zoom];
        MARS_ANI.log(['Map_Tile', 'create'], props);
        //  MARS_ANI.res.tex.uv_semi, })
        this._mat = [
            new THREE.MeshLambertMaterial({
             normal: THREE.ImageUtils.loadTexture('/img/mapimage_segments/' + props.join('/') + '/normal_map.png'),
                map: THREE.ImageUtils.loadTexture('/img/mapimage_segments/' + props.join('/') + '/color_map.png')}),

             new THREE.MeshBasicMaterial({
                color: MARS_ANI.res.colors.red,
                wireframe: true,
                opacity: 0.5
            })];
        this._center = false;

        this._adjust();
        this._test();
    }


    MARS_ANI.Map_Tile.prototype = {

        _form_pts: function() {
            var self = this;
            this._geo.vertices.forEach(function(v, i) {
                if (self.pt_filter) {
                    self.pt_filter(self, v, i);
                }
            })
        },

        _defaults: {
            zoom: 64,
            deg_size: 100,
            points_per_deg: 0.125,
            min_points: 3,
            res: 0,
            north: 30,
            south: 0,
            east: 0,
            west: 30,
            mat: MARS_ANI.res.mat.uv_wire,
            pt_filter: false,
            center_x: 0,
            center_y: 0
        },

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
            return this._width;
        },

        deg_height: function() {
            return (this.north - this.south);
        },

        height: function() {
            return this._height;
        },

        _get_material: function() {
            MARS_ANI.log(['mat', 'Map_Tile'], 'material:', this._mat);
            return this._mat;
        },

        width_segs: function() {
            return this._width_segs;
        },


        height_segs: function() {
            return this._height_segs;
        },

        _get_geo: function(rewrite) {
            MARS_ANI.log(['Map_Tile', '_get_geo'], 'get_ge starting');
            if (rewrite || (!this._geo)) {
                var ws = this.width_segs() - 1;
                var hs = this.height_segs() - 1;
                MARS_ANI.log(['Map_Tile', 'get_geo', 'measure'], 'ws', ws, 'hs', hs);
                this._geo = new THREE.PlaneGeometry(this.width(), this.height(), ws, hs);
                this._geo.doubleSided = true;
                this._form_pts();
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
                this.make_text();
            }
            this._mesh.rotation.y = Math.PI;
            return this._mesh;
        },

        _add_trident: function() {
            this._center = new THREE.Trident();
            _.extend(this._center.position, {
                x: this.x,
                y: this.y + 20,
                z: this.z
            });
            MARS_ANI.log(['Map_Tile', '_add_trident'], 'adding trident');
            this._get_mesh().add(this._center);
            MARS_ANI.log(['Map_Tile', '_add_trident'], '... done adding trident');
            return this._center;
        },

        create: function() {
            MARS_ANI.log(['Map_Tile', 'create'], 'creating Map_Tile');
            var mesh = this._get_mesh();
            mesh.__tile = this;
            this._add_trident();
            MARS_ANI.scene.addObject(mesh);
            MARS_ANI.log(['Map_Tile', 'create'], '...done creating Map Tile');

            return mesh;
        },

        _add_text: function(text, y) {
MARS_ANI.log(['Map_Tile', 'text', 'start'], 'starting text');
            var fontMap = {
                "helvetiker": 0,
                "optimer": 1,
                "gentilis": 2,
                "droid sans": 3,
                "droid serif": 4

            };

            MARS_ANI.log(['Map_Tile', 'text'], '1');

            var weightMap = {
                "normal": 0,
                "bold": 1
            }

            MARS_ANI.log(['Map_Tile', 'text'], '2');

            var reverseFontMap = {};
            var reverseWeightMap = {};

            MARS_ANI.log(['Map_Tile', 'text'], '3');

            for (var i in fontMap) reverseFontMap[fontMap[i]] = i;
            for (var i in weightMap) reverseWeightMap[weightMap[i]] = i;

            var params = {
                size: 18,
                height: 101,
                curveSegments: 2,

                font: 'helvetiker',
                weight: 'normal',
                style: 'normal',

                bevelThickness: 0,
                bevelSize: 0,
                bevelEnabled: false,

                amount: 2,
                bend: false

            };
            params.amount = 2;
            params.amount2 = 2;

            MARS_ANI.log(['Map_Tile', 'text'], 'making geometry', text, 'with params', params);
            var textGeo = new THREE.TextGeometry(text, params);

            MARS_ANI.log(['Map_Tile', 'text'], 'geo done');

            var textMaterial = new THREE.MeshPhongMaterial({
                color: MARS_ANI.res.colors.red,
                wireframe: false
            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * (textGeo.boundingBox.x[1] - textGeo.boundingBox.x[0]);

            var textMesh1 = new THREE.Mesh(textGeo, textMaterial);

            textMesh1.position.x = this.x;
            textMesh1.position.y = y;
            textMesh1.position.z = this.z;

            textMesh1.rotation.x = 0;
         //   textMesh1.rotation.y = Math.PI;

            this._mesh.add(textMesh1);
        },

        make_text: function(parent) {

            var text = 'x ' + this.x + ', y ' + this.y + ', z' + this.z;
            this._add_text(text,   this.y + 10);


            var text = this.west + 'w ' + this.north + 'n';
            this._add_text(text, this.y + 30);

            var text = 'top' + this.top + ', bottom ' + this.bottom;
            this._add_text(text, this.y + 50);

            var text =  ', left ' + this.left + ', right ' + this.right;
            this._add_text(text, this.y + 70);

            MARS_ANI.log(['Map_Tile', 'text', 'done'], 'done with text');
        }
    }

    MARS_ANI.log(['Map_Tile'], 'MARS_ANI._Map_Tile_exe created');
    setTimeout(function() {
        delete MARS_ANI._Map_Tile_exe;
        MARS_ANI.log(['Map_Tile', 'exe_clear'], 'MARS_ANI._Map_Tile_exe cleared')
    }, 1);
}

MARS_ANI._Map_Tile_exe();