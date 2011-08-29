function _init() {
    console.log('init: initial objects');
    MARS_ANI.container = $('#threeD');
    MARS_ANI.camera = new THREE.Camera(60, MARS_ANI.container.innerWidth / MARS_ANI.container.innerHeight, 1, 1000000);
    MARS_ANI.scene = new THREE.Scene();
    MARS_ANI.renderer = new THREE.WebGLRenderer();
    MARS_ANI.sun = new THREE.DirectionalLight(0xffffff);

    console.log('init: adjusting objects');
    // _.extend(MARS_ANI.camera.position, {x: 0, y:0, z: -10});
    MARS_ANI.camera.position.x = 0;
    MARS_ANI.camera.position.y = 0;
    MARS_ANI.camera.position.z = -10;

    MARS_ANI.camera.useTarget = false;

    _.extend(MARS_ANI.sun.position, {x: -1, y: 1, z: -1});
    MARS_ANI.sun.position.normalize();

    console.log('init: creating cubes');

    /*  MARS_ANI.createCube(1, {x:0, y: 0, z: 0});
     MARS_ANI.createCube(1, {x:2, y: 0, z: 0});
     MARS_ANI.createCube(1, {x:0, y: 2, z: 0});
     MARS_ANI.createCube(1, {x:0, y: 0, z: 2}); */


    var material = [
        new THREE.MeshLambertMaterial({ color: 0xFF0000 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity:1 })
    ];

    var object = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100, 4, 4, 4), material);
    MARS_ANI.scene.addObject(object);

    console.log('init: arranging objects');
    MARS_ANI.scene.addLight(MARS_ANI.sun);
    MARS_ANI.renderer.setSize(MARS_ANI.container.innerWidth, MARS_ANI.container.innerHeight);
    MARS_ANI.container.innerHTML = "";
    MARS_ANI.container.append(MARS_ANI.renderer.domElement);

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;

    console.log('init: new Animator');
    MARS_ANI.animator = new MARS_ANI.Animator();

    console.log('init: animate');

    setTimeout(animate, 10);

}