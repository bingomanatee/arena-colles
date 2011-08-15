
function Mars (scene){

        var globe = new THREE.SphereGeometry(Mars.EQ_RADIUS, 18, 36);
        var cube = new THREE.Mesh(c, Mars.material);

        cube.position.x = this.center.x;
        cube.position.y = this.center.y;
        cube.position.z = this.center.z;

        scene.addObject(cube);
}

Mars.POLAR_RADIUS = 3376.2;
Mars.EQ_RADIUS    = 3396.2;

Mars.material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/land_ocean_ice_cloud_2048.jpg' ) } )