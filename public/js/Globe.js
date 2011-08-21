var degrees_to_radians = Math.PI / 180;

function Globe(radius, deg_inc, cx, cy, cz) {
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

Globe.prototype = {
    
    render: function (scene) {

       console.log('globe.render');

        var self = this;

        material = [
            new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('/img/globe/mars_color.png'),
            normal: THREE.ImageUtils.loadTexture('/img/globe/normal_rot.png')}),
            new THREE.MeshBasicMaterial({ color: 0.5 * 0xffffff, wireframe: true, opacity: 0.05 })
        ];

        var c = new THREE.SphereGeometry(this.radius, this.deg_inc* 2, this.deg_inc );
        var cube = new THREE.Mesh(c, material);

        cube.position.x = this.center.x;
        cube.position.y = this.center.y;
        cube.position.z = this.center.z;

        scene.addObject(cube);
        this.center = cube;

        return this.center;
    }
}