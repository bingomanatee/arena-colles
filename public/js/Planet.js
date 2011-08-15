var degrees_to_radians = Math.PI / 180;

function Planet_Wedge(planet, segment, l) {
    this.planet = planet;
    this.segment = segment;
    this.lon = l;
    this.lat = segment.lat;
}

Planet_Wedge.prototype = {
    material:  [
        new THREE.MeshPhongMaterial({ color: 0.8 * 0xffffff, opacity: 1 }) //,
       // new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, wireframe: true })
    ],

    cube_g: false,

    render: function() {
        // console.log('rendering wedge ', this.lat, this.lon);

        var cube_origin_lat = new THREE.Object3D();
        cube_origin_lat.rotation.z = this.lat * degrees_to_radians;

        if (!this.cube_g) {
            var size_big = this.planet.radius * Math.cos(degrees_to_radians * this.planet.deg_inc / 2) / 10;
            var size_small = size_big / 10;
            this.cube_g = new THREE.PlaneGeometry(size_big, size_big, 1, 1, material);
        }
        var cube_mesh = new THREE.Mesh(this.cube_g, this.material);
        cube_mesh.rotation.y = 90 * degrees_to_radians;
        cube_mesh.scale.z = Math.cos(this.lat * degrees_to_radians);

        cube_mesh.position.x = this.planet.radius;
        cube_mesh.position.z = 0;
        cube_mesh.position.y = 0;

        cube_origin_lat.addChild(cube_mesh);
        //  cube_origin_lat.scale.z  = Math.max(0.1,  Math.cos(Math.min(90, this.lat + this.planet.deg_inc/2) * degrees_to_radians));

        var cube_origin_lon = new THREE.Object3D();
        cube_origin_lon.rotation.y = this.lon * degrees_to_radians;
        cube_origin_lon.addChild(cube_origin_lat);

        //  console.log('position: ', cube.position)

        //cube.rotation.z = this.lat * degrees_to_radians;
        //cube.rotation.y = this.lon * degrees_to_radians;
        this.cube = cube_mesh;

        //   console.log('created planet wedge: ', cube);
        this.planet.center.addChild(cube_origin_lon);
    }

}

function Planet_Segment(planet, lat) {
    this.planet = planet;
    this.lat = lat;
    this.deg_inc = planet.deg_inc;

    this.wedges = [];
}

Planet_Segment.prototype = {
    make_wedges: function() {
        this.wedges = [];
        var odd = true;
        for (var l = 360; l >= 0; l -= this.deg_inc) {
            //     console.log('make wedge ', l);
            odd = !odd;
            //   if (odd) {
            var wedge = new Planet_Wedge(this.planet, this, l);
            this.wedges.push(wedge);
            //  }
        }
    },

    render: function() {
        //     console.log('rendering segment');
        this.wedges.forEach(function(wedge) {
            //   console.log('rendering wedge ', wedge.lon, ',', wedge.lat);
            wedge.render();
        })
    }
}

function Planet(radius, deg_inc, cx, cy, cz) {
    if (!deg_inc) {
        deg_inc = 10;
    }
    if (!cx) cx = 0;
    if (!cy) cy = 0;
    if (!cz) cz = 0;
    this.center = {x: cx, y: cy, z: cz};
    this.deg_inc = deg_inc;
    this.radius = radius;
}

Planet.prototype = {
    segments: [],

    make_segments: function() {
        for (var angle = 90; angle >= -90; angle -= this.deg_inc) {
            var segment = new Planet_Segment(this, angle);
            segment.make_wedges();
            this.segments.push(segment);
        }
    },

    render: function (scene) {

        //  console.log('planet.render');

        var self = this;

        material = [
            //    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('/examples/textures/UV.jpg') }),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.1 })
        ];

        var c = new THREE.SphereGeometry(this.radius / 4, 8, 8);
        var cube = new THREE.Mesh(c, material);

        cube.position.x = this.center.x;
        cube.position.y = this.center.y;
        cube.position.z = this.center.z;

        scene.addObject(cube);
        this.center = cube;

        this.make_segments();
        this.segments.forEach(function(segment, s) {
            //     console.log('rendering segment ', s);
            segment.render();
        });

        return this.center;
    }
}