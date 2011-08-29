if (! Detector.webgl) Detector.addGetWebGLMessage();


function init() {
    MARS_ANI.container = $("#threeD");
    var w = MARS_ANI.container.width();
    var h = MARS_ANI.container.height();
    // console.log('size: ', w, h);

    MARS_ANI.scene = new THREE.Scene();

    _init_camera(w, h);
    _init_light();
    _init_objects();
    _init_renderer(w, h);

    MARS_ANI.container.append(MARS_ANI.renderer.domElement);

    MARS_ANI.stats = new Stats();
    MARS_ANI.stats.domElement.style.position = 'absolute';
    MARS_ANI.stats.domElement.style.top = '0px';
    MARS_ANI.container.append(MARS_ANI.stats.domElement);

}
/*
//

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}

function render() {

    var timer = new Date().getTime() * 0.0001;

    MARS_ANI.camera.position.x = Math.cos(timer) * 800;
    MARS_ANI.camera.position.z = Math.sin(timer) * 800;

    for (var i = 0, l = objects.length; i < l; i++) {

        var object = objects[ i ];

        object.rotation.x += 0.01;
        object.rotation.y += 0.005;

    }

    MARS_ANI.renderer.render(MARS_ANI.scene, MARS_ANI.camera);

}*/
