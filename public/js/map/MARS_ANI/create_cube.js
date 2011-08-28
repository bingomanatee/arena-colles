function _create_create_cube() {

    MARS_ANI.createCube = function(s, p) {
        console.log('creating material');
        var material =  MARS_ANI.material('MeshLambertMaterial', 0xFF6600);


        console.log('creating cube');
        cube = new THREE.Mesh(
            new THREE.CubeGeometry(s, s, s), material
        );
        cube.position = p;

        console.log('appending cube');
        MARS_ANI.scene.addObject(cube);
    };
}

_create_create_cube()
