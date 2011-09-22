MARS_ANI._config_exe = function() {
    MARS_ANI.log_flags.push('*');
    MARS_ANI.unlog_flags.push('clear');

    MARS_ANI.log(['config'], 'MARS_ANI._config_exe');

    MARS_ANI._init_objects = function() {
        MARS_ANI.log(['init', 'objects'], 'creating Map Tile');
        MARS_ANI.tiler = new MARS_ANI.Planet_Tiler({size_per_tile: 1000, tile_range: 4, deg_per_tile: 20});
        MARS_ANI.tiler.init();

        MARS_ANI.scene.addChild(new THREE.Trident());
        MARS_ANI.log(['init', 'objects', 'clear'], 'done with _init_objects');
    }

    MARS_ANI._init_camera = function() {
        var camera = MARS_ANI.camera = new THREE.FirstPersonCamera({
            constrainVertical: true,
            fov: 60, aspect: MARS_ANI.scene_width / MARS_ANI.scene_height,
            near: 1, far: 2000,
            movementSpeed: 500, lookSpeed: 0.1, noFly: false, lookVertical: false

        });
        var p = camera.position;
        p.x = 0;
        p.y = 50;
        p.z = -1200;
        // camera.rotation.x = MARS_ANI.degrees_to_radians * 15;
        camera.lat = MARS_ANI.degrees_to_radians * 90;
    }

    MARS_ANI.animator.queue.add_task('stats', function() {
        MARS_ANI.stats.update();
    })

    MARS_ANI.log(['config', 'clear'], 'MARS_ANI._config_exe done');

    setTimeout(function() {
        delete MARS_ANI._config_exe;
        MARS_ANI.log(['clear', 'config'], '_config_exe cleared')
    }, 1);
};

try {
    MARS_ANI._config_exe();
} catch (err) {
    MARS_ANI.log_err('error in initializing objects', err)
}