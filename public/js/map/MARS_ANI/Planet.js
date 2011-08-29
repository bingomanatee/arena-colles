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

        _make_meshes: function(deg_inc, range, hide_range) {
            var tile_size = this.circ() * deg_inc / 360;
            var points = 5;
            var abs_lon, abs_lat, lat, lon, p;

            for (var tile_lat = -90; tile_lat < 90; tile_lat += deg_inc) {
                for (var tile_lon = -180; tile_lon < 180; tile_lon += deg_inc) {
                    var geometry = new THREE.PlaneGeometry(tile_size, tile_size, points - 1, points - 1);

                    abs_lat = tile_lat + deg_inc / 2;
                    abs_lon = tile_lon + deg_inc / 2;

                    var mesh_center = this._lat_lon_to_pt(abs_lat, abs_lon);
                    var group = new THREE.Object3D();
                    _.extend(group.position, mesh_center);

                    var group2 = new THREE.Object3D();
                    _.extend(group2.position, mesh_center);

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
                    c.setRGB((tile_lat + 90) / 180, (tile_lon + 180) / 360, 1);

                    var material = [
                        new THREE.MeshLambertMaterial({ color: c.hex }),
                        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, opacity: 1.0 })
                    ];

                    var mesh = new THREE.Mesh(geometry, material);
                    group.addChild(mesh);
                    mesh.updateMatrix();
                    mesh.matrixAutoUpdate = false;

                    var lod = new THREE.LOD();
                    if (hide_range) {

                        var pg = new THREE.PlaneGeometry(1, 1);
                        var near_mesh = new THREE.Mesh(pg);
                        lod.add(near_mesh, 0);
                    } else {
                        hide_range = 0;
                    }
                    lod.add(mesh, hide_range);
                    var sphere = new THREE.SphereGeometry(10, 8, 4);
//                    var sm = new THREE.Mesh(sphere);
//                    sm.updateMatrix();
//						sm.matrixAutoUpdate = false;
//
//                    lod.add(sm, range);
                    var pg = new THREE.PlaneGeometry(1, 1);
                   var sm = new THREE.Mesh(pg);
                    lod.add(sm, range);
                    _.extend(lod.position, mesh_center);

                    lod.updateMatrix();
                    lod.matrixAutoUpdate = false;
                    this._center.addChild(lod);
                }
            }
        },

        create: function (scene) {
            var self = this;

            this._center = new THREE.Trident();
            _.extend(this._center.position, this._center);


               this._make_meshes(this.deg_inc * 2,  1000, 445);

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