MARS_ANI.Mars_Globe_exe = function () {

    MARS_ANI.Mars_Globe = function(w, h, r) {
        this.segs_width = w ? w : 180;
        this.segs_height = h ? h : 90;
        this.rad = r ? r : MARS_ANI.mars_radius * 1000;
    }

    MARS_ANI.Mars_Globe.prototype = {

        material: function() {
            if (!this._mat) {

                var c = new THREE.Color();
                c.r = 1;
                c.g = 0;
                c.b = 0;

                /*   this._mat = [new THREE.MeshShaderMaterial({
                 map:  THREE.ImageUtils.loadTexture('./mars_globe_files/globe/mars_color.png'),
                 normal:  THREE.ImageUtils.loadTexture(./mars_globe_files/globe/normal_x_16.png')
                 }
                 )]; */

                var ambient = 0x050505, diffuse = 0x555555, specular = 0xaa6600, shininess = 10, scale = 23;

                // normal map shader

                var shader = THREE.ShaderUtils.lib[ "normal" ];
                var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

                uniforms[ "enableAO" ].value = false;
                uniforms[ "enableDiffuse" ].value = true;
                uniforms[ "enableSpecular" ].value = false;
                console.log(uniforms);
                // uniforms[ "enableDisplacement" ].value = false;

                uniforms[ "tNormal" ].texture = THREE.ImageUtils.loadTexture('/img/globe/normal_x_32.png'); //"/examples/textures/normal/ninja/normal.jpg");
                uniforms[ "tNormal" ].value = 10; //"/examples/textures/normal/ninja/normal.jpg");
                uniforms[ "tAO" ].texture = THREE.ImageUtils.loadTexture("/img/globe/shininess.jpg");

               uniforms[ "tDisplacement" ].texture = THREE.ImageUtils.loadTexture("/img/globe/height_x_32.png");
                uniforms[ "tDiffuse" ].texture = THREE.ImageUtils.loadTexture("/img/globe/color_x_32.png");
                // uniforms[ "tSpecular" ].texture = THREE.ImageUtils.loadTexture("shininess.jpg");
                //   uniforms['tSpecular'].value = 10;
                uniforms[ "uDisplacementBias" ].value = 0.0;
                uniforms[ "uDisplacementScale" ].value = 255 * 500;

                uniforms[ "uDiffuseColor" ].value.setHex(diffuse);
                uniforms[ "uSpecularColor" ].value.setHex(specular);
                uniforms[ "uAmbientColor" ].value.setHex(ambient);

                uniforms[ "uShininess" ].value = shininess;

                var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true };
                var material1 = new THREE.ShaderMaterial(parameters);
                var material2 = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('/img/globe/carto_grid.png')
                 //  opacity: THREE.ImageUtils.loadTexture('mars_globe_files/carto_grid_op.png')
                });
                this._mat = material1; //[material1, material2];

            }
            return this._mat;
        },

        geometry: function() {
            if (!this._geo) {
                this._geo = new THREE.SphereGeometry(this.rad, this.segs_width, this.segs_height);
                this._geo.computeTangents();
            }
            return this._geo;
        },

        mesh: function() {
            if (!this._mesh) {
                this._mesh = new THREE.Mesh(this.geometry(), this.material());
            }
            return this._mesh;
        },

        create: function() {
            MARS_ANI.log(['Mars', 'create'], 'creating Mars');
       //     MARS_ANI.scene.addObject(this.mesh());
            MARS_ANI.log(['Map_Tile', 'create'], '...done creating Map Tile');
        }
    }

    setTimeout(function() {
        delete MARS_ANI.Mars_Globe_exe;
    }, 10)

};

MARS_ANI.Mars_Globe_exe();