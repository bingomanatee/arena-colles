var MARS_ANI = {
    degrees_to_radians: Math.PI / 180,

    radians_to_degrees: 180 / Math.PI,

    container_name: 'ThreeD',

    mars_radius: 3396.2,

    uv_map: function() {
        if (!this._uv_map) {
            this._uv_map = THREE.ImageUtils.loadTexture('/img/textures/UV.jpg');
        }
        return this._uv_map;
    },

    _init_scene : function () {
        MARS_ANI.container = $(MARS_ANI.container_name);
        MARS_ANI.scene_width = MARS_ANI.container.width();
        MARS_ANI.scene_height = MARS_ANI.container.height();
        MARS_ANI.scene = new THREE.Scene();
        MARS_ANI.container.append(MARS_ANI.renderer.get_renderer().domElement);
        MARS_ANI.log(['init', 'scene'],'scene created');
    },

    _init_camera : function() {
        MARS_ANI.camera = new THREE.Camera(45, MARS_ANI.scene_width / MARS_ANI.scene_height, 1, 100000);
        MARS_ANI.camera.position.x = 0;
        MARS_ANI.camera.position.y = 100;
        MARS_ANI.camera.position.z = -600;
    },

    _init_renderer : function() {
        function _Renderer(ani) {
            this.ani = ani;
        }

        _Renderer.prototype =
        {
            _renderer: false,

            get_renderer: function(recreate, width, height) {
                if (recreate || !(this._renderer)) {

                    if (!width) {
                        width = this.ani.scene_width;
                    }

                    if (!height) {
                        height = this.ani.scene_height;
                    }

                    this.width = width;
                    this.height = height;

                    this._renderer = new THREE.WebGLRenderer();
                    this._renderer.setSize(width, height);
                }

                return this._renderer;
            },

            render : function() {
            //    console.log('rendering ...');
                var renderer = this.get_renderer()
                var scene = this.ani.scene, camera = this.ani.camera;
                if (!scene) {
                    throw new Error('renderer: no scene');
                }
                if (!camera) {
                    throw new Error('renderer: no camera');
                }
                renderer.render(scene, camera);
              //  console.log('... done rendering');
            }
        }

        MARS_ANI.renderer = new _Renderer(MARS_ANI);

    },

    _init_lights : function() {
        MARS_ANI.scene.addLight(new THREE.AmbientLight(0x404040));

        light = new THREE.DirectionalLight(0xffffff, 2.0);
        light.position.z = -1;
        light.position.x = -0.5;
        light.position.normalize();

        MARS_ANI.scene.addLight(light);
        MARS_ANI.log(['lights', 'clear'],'init lights done');
    },

    _init_objects : function() {
        throw new Error('No custom objects handler defined');
    },

    _init_stats : function() {
        MARS_ANI.stats = new Stats();
        MARS_ANI.stats.domElement.style.position = 'absolute';
        MARS_ANI.stats.domElement.style.top = '0px';
        MARS_ANI.container.append(MARS_ANI.stats.domElement);
    }
};