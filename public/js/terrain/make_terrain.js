function make_terrain(worldWidth, worldDepth) {
    worldWidth += 2;
    worldDepth += 2;

    var mars_rad = 3396; // km
    var mars_diameter = Math.PI * 3396;
    var meters_per_degree = mars_diameter * 1000 / 360;

    var data = generateHeight(worldWidth, worldDepth);
    var geometry = new THREE.PlaneGeometry(meters_per_degree, meters_per_degree, worldWidth - 1, worldDepth - 1);

    for (var i = worldWidth, l = geometry.vertices.length - worldWidth; i < l; i++) {
        if ((i % worldWidth) && ((i % worldWidth) < worldWidth - 1)) {

            geometry.vertices[ i ].position.z = data[ i ] * 10;

        }
    }

    //  var texture =  THREE.ImageUtils.loadTexture( "/img/textures/UV2.png", THREE.UVMapping );

    var texture = new THREE.Texture(generateTexture(data, worldWidth, worldDepth),
        new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;

    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map:texture }));
    mesh.rotation.x = -70 * Math.PI / 180;
    return mesh;

}

var mesh;

function generateHeight(width, height) {

    var size = width * height, data = new Float32Array(size),
        perlin = new ImprovedNoise(), quality = 4, z = Math.random() * 100;

    for (var i = 0; i < size; i++) {

        data[ i ] = 200;

    }

    for (var j = 0; j < 4; j++) {

        for (var i = 0; i < size; i++) {

            var x = i % width, y = ~~( i / width );
            data[ i ] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);


        }

        quality *= 5;

    }

    return data;

}

function generateTexture(data, width, height) {

    var canvas, canvasScaled, context, image, imageData,
        level, diff, vector3, sun, shade;

    vector3 = new THREE.Vector3(0, 0, 0);

    sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();

        shade = vector3.dot(sun);
        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    }

    context.fillRect(0, 0, width, 2);

    context.fillRect(0, 0, 2, height);


    context.putImageData(image, 0, 0);

    // Scaled 4x

    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 8;
    canvasScaled.height = height * 8;

    context = canvasScaled.getContext('2d');
    context.scale(8, 8);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {

        var v = ~~( Math.random() * 5 );

        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;

    }

    context.putImageData(image, 0, 0);

    return canvasScaled;

}