MARS_ANI._config_exe = function() {
    //  MARS_ANI.log_flags.push('*');
    //  MARS_ANI.unlog_flags.push('clear');

    MARS_ANI.log(['config'], 'MARS_ANI._config_exe');

    MARS_ANI._init_objects = function() {

        MARS_ANI.scene.addChild(new THREE.Trident());
        MARS_ANI.log(['init', 'Mars', 'start'], 'creating globe');

        var pointLight = new THREE.PointLight(0xffff55);
        pointLight.position.z = -1 * MARS_ANI.mars_radius * 4000;
        pointLight.position.y = -1 * MARS_ANI.mars_radius * 2000;
        pointLight.position.x = -1 * MARS_ANI.mars_radius * 2000;
        MARS_ANI.scene.addLight(pointLight);

        MARS_ANI.mars = new MARS_ANI.Mars_Globe();
        MARS_ANI.mars.create();
        MARS_ANI.log(['init', 'objects', 'clear'], 'done with _init_objects');
    }

    MARS_ANI._init_camera = function() {
        var camera = MARS_ANI.camera = new THREE.Camera(30,
            MARS_ANI.scene_width / MARS_ANI.scene_height,
            100, MARS_ANI.mars_radius * 4000
        );
        var p = camera.position;
        p.x = 0;
        p.y = 0;
        p.z = -3 * MARS_ANI.mars_radius * 1000;
    }

    MARS_ANI.animator.queue.add_task('stats', function() {
        MARS_ANI.stats.update();
    })

    MARS_ANI.log(['config', 'clear'], 'MARS_ANI._config_exe done');

    setTimeout(function() {
        delete MARS_ANI._config_exe;
        MARS_ANI.log(['clear', 'config'], '_config_exe cleared')
    }, 10);
};

try {
    MARS_ANI._config_exe();
} catch (err) {
    MARS_ANI.log_err('error in initializing objects', err)
}