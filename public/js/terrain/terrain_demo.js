if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;

var camera, controls, scene, renderer;

var mesh, texture;

var worldWidth = 256, worldDepth = 256,
    worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

function terrain_demo() {
    init();
    animate();
}

function init() {

    container = document.getElementById('container');

    scene = new THREE.Scene();

     //   camera = new THREE.PerspectiveCamera(60, 1000 / 800, 1, 20000);
            camera = new THREE.PerspectiveCamera(60, 1000 / 800, 1, 20000);
    scene.add(camera);

    controls = new THREE.FirstPersonControls(camera, container);
    controls.movementSpeed = 100;
    controls.lookSpeed = 0.01;

    data = generateHeight(worldWidth, worldDepth);

    camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] + 1000;
    camera.position.z = -2000;

    var geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {

        geometry.vertices[ i ].position.z = data[ i ] * 10;

    }

    texture = new THREE.Texture(generateTexture(data, worldWidth, worldDepth),
        new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;

    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map:texture }));
    mesh.rotation.x = -90 * Math.PI / 180;
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1000, 800);

    container.innerHTML = "";

    container.appendChild(renderer.domElement);

    /*  stats = new Stats();
     stats.domElement.style.position = 'absolute';
     stats.domElement.style.top = '0px';
     container.appendChild(stats.domElement);*/

}

function generateHeight(width, height) {

    var size = width * height, data = new Float32Array(size),
        perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

    for (var i = 0; i < size; i++) {

        data[ i ] = 0

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

    context.putImageData(image, 0, 0);

    // Scaled 4x

    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
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

//

function animate() {

    requestAnimationFrame(animate);

    render();
    //   stats.update();

}

function render() {

    controls.update(clock.getDelta());
    renderer.render(scene, camera);

}