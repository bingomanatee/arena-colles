MARS_ANI._config_exe = function() {
    //  MARS_ANI.log_flags.push('*');
    //  MARS_ANI.unlog_flags.push('clear');

    MARS_ANI.log_flags.push('camera');
    MARS_ANI.log(['config', 'util'], 'MARS_ANI._config_exe');

    MARS_ANI._init_objects = function() {

        MARS_ANI.scene.addChild(new THREE.Trident());
        MARS_ANI.log(['init', 'Mars', 'start'], 'creating globe');

        MARS_ANI.mars = new MARS_ANI.Mars_Globe();
        MARS_ANI.mars.create();
        MARS_ANI.scene.addChild(MARS_ANI.mars.mesh());
        MARS_ANI.log(['init', 'objects', 'clear'], 'done with _init_objects');

        //    _unit_test_compose();
    }

    MARS_ANI._init_lights = function() {
        MARS_ANI.sun = new THREE.DirectionalLight(MARS_ANI.res.colors.white, 1, 1.2 * MARS_ANI.mars_radius * 1000, true);
        MARS_ANI.moon = new THREE.DirectionalLight(MARS_ANI.res.colors.cyan, 1, 1.2 * MARS_ANI.mars_radius * 1000, true);
        console.log('cyan = ', MARS_ANI.res.colors.cyan, MARS_ANI.res.colors);

        MARS_ANI.scene.addLight(MARS_ANI.sun);
        MARS_ANI.scene.addLight(MARS_ANI.moon);
        MARS_ANI.uni = new THREE.Object3D();

        var geometry = new THREE.SphereGeometry(MARS_ANI.mars_radius * 150, 16, 8);
        MARS_ANI.sun_obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(
            { color: MARS_ANI.res.colors.yellow, lightmap: MARS_ANI.res.colors.yellow }));
        MARS_ANI.sun_obj.position.x = 1.5 * MARS_ANI.mars_radius * 1000;
        MARS_ANI.sun_obj.overdraw = true;

        var geometry = new THREE.SphereGeometry(MARS_ANI.mars_radius * 100, 16, 8);
        MARS_ANI.moon_obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(
            { color: MARS_ANI.res.colors.cyan, lightmap: MARS_ANI.res.colors.white }));
        MARS_ANI.moon_obj.position.x = -1.2 * MARS_ANI.mars_radius * 1000;
        MARS_ANI.moon_obj.overdraw = true;

        MARS_ANI.uni.addChild(MARS_ANI.sun_obj);
        MARS_ANI.uni.addChild(MARS_ANI.moon_obj);
        MARS_ANI.scene.addChild(MARS_ANI.uni);


        setInterval(function() {
            _pos_write('sun', MARS_ANI.sun);
            _pos_write('moon', MARS_ANI.moon);
        }, 300);
    }

    MARS_ANI._init_camera = function() {
        var camera = MARS_ANI.camera = new MARS_ANI.OrbitCamera({
                fov: 30,
                aspect: MARS_ANI.scene_width / MARS_ANI.scene_height,
                near: 100,
                far: MARS_ANI.mars_radius * 10000
            },
            MARS_ANI.mars,
            MARS_ANI.scene
        );
    }

    MARS_ANI.animator.queue.add_task('stats', function() {
        MARS_ANI.stats.update();
    });

    function _pos_write(prefix, obj) {
        var xyz = ['x', 'y', 'z'];
        xyz.forEach(function (v) {
            var p = parseInt(100 * obj.position[v]);
            var cname = '#' + prefix + '_' + v;
            // console.log(cname, '=', p);
            $(cname).html(p);
        });
    }

    MARS_ANI.animator.queue.add_task('rotation', function() {
        // var geo = MARS_ANI.mars.mesh();
        // console.log('rotating', geo);
        /* @TODO: sync rotation with absolute time */
        MARS_ANI.uni.rotation.y += 0.001;

        MARS_ANI.sun.position = MARS_ANI.absolute_position(MARS_ANI.sun_obj);
        MARS_ANI.sun.position.normalize();
        MARS_ANI.moon.position = MARS_ANI.absolute_position(MARS_ANI.moon_obj);
        MARS_ANI.moon.position.normalize();
    });


    MARS_ANI.animator.queue.add_task('camera_movement', function() {
        MARS_ANI.camera.move();
    })

    MARS_ANI.log(['config', 'clear'], 'MARS_ANI._config_exe done');

    setTimeout(function() {
        delete MARS_ANI._config_exe;
        MARS_ANI.log(['clear', 'config'], '_config_exe cleared')
    }, 10);

    function _unit_test_compose() {
        var o1 = new THREE.Object3D();
        o1.position.x = 10;
        o1.position.y = 10;
        MARS_ANI.scene.addChild(o1);

        console.log('--------position of 01----------');
        console.log(MARS_ANI.absolute_position(o1, true));

        var o2 = new THREE.Object3D();
        o2.position.y = -10;
        o2.position.z = 50;

        o1.addChild(o2);

        console.log('---------position of 02-----------');
        console.log(MARS_ANI.absolute_position(o2, true));

        var o3 = new THREE.Object3D();
        o3.rotation.z = Math.PI / 2;

        MARS_ANI.scene.addChild(o3);

        var o4 = new THREE.Object3D();
        o4.position.x = 100;
        o3.addChild(o4);

        console.log('---------position of 04-----------');
        console.log(MARS_ANI.absolute_position(o4, true));
    }
}

try {
    MARS_ANI._config_exe();
} catch (err) {
    MARS_ANI.log_err('error in initializing objects', err)
}

