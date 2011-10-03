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
                 map:  THREE.ImageUtils.loadTexture('/img/globe/mars_color.png'),
                 normal:  THREE.ImageUtils.loadTexture('/img/globe/normal_x_16.png')
                 }
                 )]; */

                var shader = THREE.ShaderUtils.lib[ "normal" ];
                var ambient = 0x050505, diffuse = 0x555555, specular = 0xaa6600, shininess = 10, scale = 23;

                // normal map shader

                var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

                uniforms[ "enableAO" ].value = false;
                uniforms[ "enableDiffuse" ].value = true;
                uniforms[ "enableSpecular" ].value = false;

                	uniforms[ "tNormal" ].texture = THREE.ImageUtils.loadTexture( "/examples/textures/normal/ninja/normal.jpg" );
                //	uniforms[ "tAO" ].texture = THREE.ImageUtils.loadTexture( "/examples/textures/normal/ninja/ao.jpg" );

                uniforms[ "tDisplacement" ].texture = THREE.ImageUtils.loadTexture("/examples/textures/normal/ninja/displacement.jpg");
                uniforms[ "uDisplacementBias" ].value = - 0.428408 * scale;
                uniforms[ "uDisplacementScale" ].value = 2.436143 * scale;

                uniforms[ "uDiffuseColor" ].value.setHex(diffuse);
                uniforms[ "uSpecularColor" ].value.setHex(specular);
                uniforms[ "uAmbientColor" ].value.setHex(ambient);

                uniforms[ "uShininess" ].value = shininess;
//
                var parameters = {  fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true };
                var material1 = new THREE.MeshShaderMaterial(parameters);
                this._mat = material1

            }
            return this._mat;
        },

        geometry: function() {
            if (!this._geo) {
                this._geo = new THREE.SphereGeometry(this.rad, this.segs_width, this.segs_height);
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
            MARS_ANI.scene.addObject(this.mesh());
            MARS_ANI.log(['Map_Tile', 'create'], '...done creating Map Tile');
        }
    }

    setTimeout(function() {
        delete MARS_ANI.Mars_Globe_exe;
    }, 10)

};

MARS_ANI.Mars_Globe_exe();