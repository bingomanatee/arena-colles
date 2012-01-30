function make_terrain() {

    var data = generateHeight(128, 128);
    var geometry = new THREE.PlaneGeometry(7500, 7500, 128, 128);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {

        geometry.vertices[ i ].position.z = data[ i ] * 10;

    }

    var texture = new THREE.Texture(generateTexture(data, worldWidth, worldDepth), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;

    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map:texture }));
    mesh.rotation.x = -90 * Math.PI / 180;
    return mesh;
}