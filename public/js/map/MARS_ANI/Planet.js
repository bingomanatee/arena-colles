function _make_planet() {
    MARS_ANI.Planet = function (config) {
        this.center = {x: 0, y: 0, z: 0};
        this.deg_inc = 5;
        this.radius = 100;
        this.center = false;
        _.extend(this, config);
    }

    MARS_ANI.Planet.prototype = {
        segments: [],

        make_segments: function() {
            for (var angle = 90; angle >= -90; angle -= this.deg_inc) {
                var segment = new Planet_Segment(this, angle);
                segment.make_wedges();
                this.segments.push(segment);
            }
        },

        _center: null,

        circ: function() {
            return 2 * this.radius * Math.PI;
        },

        _make_meshes: function(deg_inc, ranges) {
            var tile_size = this.circ() * deg_inc / 360;
            var abs_lon, abs_lat, lat, lon, p;
            var rr = 0;

            for (var tile_lat = -90; tile_lat < 90; tile_lat += deg_inc) {
                for (var tile_lon = -180; tile_lon < 180; tile_lon += deg_inc) {
                    // console.log('making tile from', tile_lat, 'x', tile_lon, 'to', tile_lat + deg_inc, 'x', tile_lon + deg_inc);
                    var points = 32;
                    var lod = new THREE.LOD();
                    var inc = 1;
                    rr = (rr == 1) ? 0.5 : 1;
                    for (var ri = 0; ri < ranges.length; ++ri) {
                        var ran = ranges[ri];
                        var points = ran.points;
                        var range = ran.range;
                        var blue = ran.blue;
                        var red = ran.red * rr;
                        var green = ran.green;

                        var geometry = new THREE.PlaneGeometry(tile_size, tile_size, points - 1, points - 1);

                        abs_lat = tile_lat + deg_inc / 2;
                        abs_lon = tile_lon + deg_inc / 2;

                        var mesh_center = this._lat_lon_to_pt(abs_lat, abs_lon);
                        _.extend(lod.position, mesh_center);

                        for (var yp = 0; yp < points; ++yp)
                            for (var xp = 0; xp < points; ++xp) {
                                var offset = yp * points + xp;
                                if (offset < geometry.vertices.length) {
                                    p = geometry.vertices[offset].position;

                                    lat = (yp / (points - 1)) * deg_inc;
                                    lon = (xp / (points - 1)) * deg_inc * -1;

                                    abs_lon = tile_lon + lon;
                                    abs_lat = lat + tile_lat;

                                    _.extend(p, this._lat_lon_to_pt(abs_lat, abs_lon));
                                    p.x -= mesh_center.x;
                                    p.y -= mesh_center.y;
                                    p.z -= mesh_center.z;
                                }
                            }


                        var c = new THREE.Color();
                      //  c.setRGB((tile_lat + 90) / 180, (tile_lon + 180) / 360, blue);
                         c.setRGB(red, green, blue);

                        var material = [
                            new THREE.MeshLambertMaterial({ color: c.hex }),
                            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, opacity: 1.0 })
                        ];

                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.updateMatrix();
                        mesh.matrixAutoUpdate = false;

                        console.log('adding ', points, ' point mesh, visible at ', range,
                            '; lod pos:', lod.position);
                        lod.add(mesh, range);
                    }

                    lod.updateMatrix();
                    lod.matrixAutoUpdate = false;

                   // this._center.addChild(lod);
                    MARS_ANI.scene.addObject(lod);
                }
            }
        },

        create: function (scene) {
            var self = this;

            this._center = new THREE.Trident();
            _.extend(this._center.position, this._center);

            var ranges = [
                {points: 16, range: 20,  red: 1, green: 0, blue: 0},
                {points: 8,  range: 200, red: 0.5, green: 1, blue: 0},
                {points: 4,  range: 600, red: 0.25, green: 0, blue: 1}
            ];

            this._make_meshes(this.deg_inc, ranges);

            MARS_ANI.scene.addObject(this._center);
        },

        _lat_lon_to_pt: function(lat, lon, is_rad) {
            if (!is_rad) {
                lat *= MARS_ANI.degrees_to_radians;
                lon *= MARS_ANI.degrees_to_radians;
            }

            var rad_2 = this._rad_2(lat, true);
            var x = Math.sin(lon) * rad_2;
            var y = Math.sin(lat) * this.radius;
            var z = Math.cos(lon) * rad_2;

            return {x: x, y: y, z: z};
        },

        _rad_2: function(lon, is_rad) {
            if (!is_rad) {
                lon *= MARS_ANI.degrees_to_radians;
            }
            return this.radius * Math.cos(lon);
        }
    }


}


function pp(v) {
    var v = parseInt(10 * v) + '       ';
    return v.substr(0, 6);
}

_make_planet();