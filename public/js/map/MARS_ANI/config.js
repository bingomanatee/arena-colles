function _init_camera(w, h) {
    MARS_ANI.camera = new THREE.Camera(45, w / h, 1, 100000);
    MARS_ANI.camera.position.x = 0;
    MARS_ANI.camera.position.y = 100;
    MARS_ANI.camera.position.z = -600;
    MARS_ANI.camera.m   
}

function _init_light() {
    MARS_ANI.scene.addLight(new THREE.AmbientLight(0x404040));

    light = new THREE.DirectionalLight(0xffffff, 2.0);
    light.position.z = 1;
    MARS_ANI.scene.addLight(light);
}

function _init_objects(){
    MARS_ANI.planet = new MARS_ANI.Planet({radius: 400, deg_inc: 10});

    MARS_ANI.planet.create();
}

function _init_renderer(w, h) {
    MARS_ANI.renderer = new THREE.WebGLRenderer();
    MARS_ANI.renderer.setSize(w, h);
}