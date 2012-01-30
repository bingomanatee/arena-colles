MARS_ANI._util_exe = function () {
    console.log('util started');
    MARS_ANI.res = {colors: {}, mat: {}, tex: {}};

    MARS_ANI.res.colors = {};

    function _color(r, g, b) {
        var c = new THREE.Color();
        c.setRGB(r, g, b);
        return c.getHex();
    }

    MARS_ANI.res.colors = {
        red:      _color(1, 1, 0),
        yellow :  _color(1, 1, 0),
        cyan:       _color(0, 1, 1),
        blue :    _color(0, 0, 1),
        green :   _color(0, 1, 0),
        orange :  _color(1, 0.5, 0),
        purple :  _color(0.5, 0, 1),
        magenta : _color(1, 0, 1),
        white :   _color(1, 1, 1),
        gray :    _color(0.5, 0.5, 0.5),
        graylt :    _color(0.75, 0.75, 0.75),
        graydk :    _color(0.25, 0.25, 0.25),
        black :   _color(0, 0, 0)
    }

    MARS_ANI.res.tex = {

        uv_semi:  new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('/img/textures/UV2.png'), opacity: 0.5 })
    };

    MARS_ANI.res.mat = {
        uv_wire: [
            new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('/img/textures/UV2.png') }),
            new THREE.MeshBasicMaterial({ color: MARS_ANI.res.colors.red, wireframe: true, opacity: 0.5 })
        ],
        wire: [
            //    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '/img/textures/UV.jpg' ) }),
            new THREE.MeshBasicMaterial({ color: MARS_ANI.res.colors.red, wireframe: true, opacity: 0.5 })
        ]
    }

    MARS_ANI.log_flags = ['err'];

    MARS_ANI.unlog_flags = [];

    MARS_ANI.log = function(tags, msg) {
        var args = Array.prototype.slice.call(arguments, 1);

        //console.log('tags', tags, 'm: ', args);
        // console.log('log_flags', MARS_ANI.log_flags, 'unlog_flags', MARS_ANI.unlog_flags, 'tags: ', tags, 'yes_tags: ', yes_tags, 'no_tags: ', no_tags);
        if (_.include(MARS_ANI.log_flags, '*')) {
            console.log(args.length ? args : msg);
        } else {

            // console.log('unlog_flags: ', MARS_ANI.unlog_flags);
            var non_array_no_tags = non_array_tags(MARS_ANI.unlog_flags);
            //console.log('non_array_no_tags: ', non_array_no_tags);
            var no_tags = _.intersection(tags, non_array_no_tags);
            if (no_tags.length > 0) {
                //      console.log('found no_tags tag: ', no_tags);
                return;
            }

            if (non_array_no_tags.length != MARS_ANI.unlog_flags.length) {

                var array_no_tags = array_tags(MARS_ANI.unlog_flags);
                // console.log('array_no_tags: ', array_no_tags);

                for (var i = 0; i < array_no_tags.length; ++i) {
                    var naa = array_no_tags[i];
                    if (_.intersection(naa, tags).length == naa.length) {
                        //     console.log('naa found:', naa);
                        return;
                    }
                }
            } else {
                // console.log('no array no tags');
            }

            var non_array_yes_flags = non_array_tags(MARS_ANI.log_flags);
            // console.log('yes flags: ', non_array_yes_flags);
            var yes_tags = _.intersection(tags, non_array_yes_flags);
            if (yes_tags.length) {
                //  console.log('simple yes flag found');
                return console.log(args.length ? args : msg, '#', tags.join(' '));
            }

            if (non_array_yes_flags.length != MARS_ANI.log_flags.length) {

                var array_yes_tags = array_tags(MARS_ANI.log_flags);
                //console.log('array_yes_tags: ', array_yes_tags);

                for (var i = 0; i < array_yes_tags.length; ++i) {
                    var yaa = array_yes_tags[i];
                    if (_.intersection(yaa, tags).length == yaa.length) {
                        //       console.log('yaa found:', yaa);
                        return console.log(args.length ? args : msg, '#', tags.join(' '));
                    }
                }
            } else {
                //   console.log('no array yes tags');
            }

        }

    }

    function non_array_tags(t) {
        return _.reject(t, function(no_tags) {
            return _.isArray(no_tags)
        });
    }

    function array_tags(t) {
        return _.select(t, function(no_tags) {
            return _.isArray(no_tags)
        });
    }

    MARS_ANI.util = {};

    MARS_ANI.util.rad_to_deg = function(r) {
        return r * 180 / Math.PI;
    }

    MARS_ANI.util.lat_lon_from_2_points = function(center, point) {

        //@TODO: check identity

        var dx = point.x - center.x;
        var dy = point.y - center.y;
        var dz = point.z - center.z;

        var rad = center.distanceTo(point);

        var rad_from_pole = Math.acos(dz / rad);

        if (dx) {
            var long_radians = Math.atan(dy / dx);
        } else if (dy > 0) {
            var long_radians = 0;
        } else {
            var long_radians = Math.PI;
        }

        return {
            lat: 90 - MARS_ANI.util.rad_to_deg(rad_from_pole),
            lon: MARS_ANI.util.rad_to_deg(long_radians)
        }

    }

    MARS_ANI.log_err = function(msg) {
        var args = Array.prototype.slice.call(arguments);
        if (_.isArray(args[0])) {
            args[0].push('err')
        } else {
            args.unshift(['err']);
        }
        args.unshift(MARS_ANI);
        MARS_ANI.log.call(args);
    }

    MARS_ANI.log(['util', 'clear'], 'MARS_ANI.util done');

    MARS_ANI.absolute_position = function(mesh, echo) {
        if (echo) {
            console.log('ABSOLUTE POSITION INPUT: ', mesh);
        }

        var v = mesh.matrixWorld.multiplyVector3(mesh.position.clone());

        if (echo) {
            console.log('ULTIMATE VECTOR: ', v);
        }
        return v;
    }


    setTimeout(function() {
        MARS_ANI.log(['util', 'clear'], 'MARS_ANI.util cleared');
        delete  MARS_ANI._util_exe;
    }, 1);
}
    ();

