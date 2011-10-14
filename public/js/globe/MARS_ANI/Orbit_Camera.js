function OrbitCameraExe() {

    MARS_ANI.OrbitCamera = function(parameters, planet) {

        this.planet = planet;
        this.planet_rad = planet.rad;
        THREE.Camera.call(this, parameters.fov, parameters.aspect, parameters.near, parameters.far);
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = - 8 * this.planet_rad;

        this.focus = new THREE.Object3D();
        this.focus.eulerOrder = 'YXZ'
        this.focus.position.copy(planet.mesh().position);
        this.focus.addChild(this);

        this.init_events();
    }


    MARS_ANI.OrbitCamera.prototype = new THREE.Camera();
    MARS_ANI.OrbitCamera.prototype.constructor = MARS_ANI.OrbitCamera;
    MARS_ANI.OrbitCamera.prototype.supr = THREE.Camera.prototype;


    MARS_ANI.OrbitCamera.prototype.mouseStatus = 0;

    MARS_ANI.OrbitCamera.prototype.movementSpeedMultiplier = 1;
    MARS_ANI.OrbitCamera.prototype.moveState = { up: false, down: false, left: false, right: false, forward: false, back: false, pitchUp: false, pitchDown: false, yawLeft: false, yawRight: false, rollLeft: false, rollRight: false };
    MARS_ANI.OrbitCamera.prototype.moveVector = new THREE.Vector3(0, 0, 0);
    MARS_ANI.OrbitCamera.prototype.moveAdjVector = new THREE.Vector3(0, 0, 0);
    MARS_ANI.OrbitCamera.prototype.rotationVector = new THREE.Vector3(0, 0, 0);

    MARS_ANI.OrbitCamera.prototype.init_events = function() {

        this.keyup = function(event) {

            switch (event.keyCode) {

                case 16: /* shift */
                    this.movementSpeedMultiplier = 1;
                    break;

                case 87: /*W*/
                    this.moveState.forward = false;
                    break;
                case 83: /*S*/
                    this.moveState.back = false;
                    break;

                case 65: /*A*/
                    this.moveState.left = false;
                    break;
                case 68: /*D*/
                    this.moveState.right = false;
                    break;

                case 82: /*R*/
                    this.moveState.up = false;
                    break;
                case 70: /*F*/
                    this.moveState.down = false;
                    break;

                case 38: /*up*/
                    this.moveState.pitchUp = false;
                    break;
                case 40: /*down*/
                    this.moveState.pitchDown = false;
                    break;

                case 37: /*left*/
                    this.moveState.yawLeft = false;
                    break;
                case 39: /*right*/
                    this.moveState.yawRight = false;
                    break;

                case 81: /*Q*/
                    this.moveState.rollLeft = false;
                    break;
                case 69: /*E*/
                    this.moveState.rollRight = false;
                    break;

            }

            this.updateMovementVector();
            this.updateRotationVector();

        };


        this.keydown = function(event) {

            if (event.altKey) {
                return;
            }

            switch (event.keyCode) {
                case 32: /* space */
                    for (var p in this.moveState) {
                        this.moveState[p] = false;
                    }
                    var self = this;
                    ['x', 'y', 'z'].forEach(function(v) {
                        self.moveVector[v] = 0;
                    });
                    console.log('braking');
                    break;

                case 16: /* shift */
                    this.movementSpeedMultiplier = .1;
                    break;

                case 87: /*W*/
                    this.moveState.forward = true;
                    break;
                case 83: /*S*/
                    this.moveState.back = true;
                    break;

                case 65: /*A*/
                    this.moveState.left = true;
                    break;
                case 68: /*D*/
                    this.moveState.right = true;
                    break;

                case 82: /*R*/
                    this.moveState.up = true;
                    console.log('m up');
                    break;
                case 70: /*F*/
                    this.moveState.down = true;
                    console.log('m down');
                    break;

                case 38: /*up*/
                    this.moveState.pitchUp = true;
                    break;
                case 40: /*down*/
                    this.moveState.pitchDown = true;
                    break;

                case 37: /*left*/
                    this.moveState.yawLeft = true;
                    break;
                case 39: /*right*/
                    this.moveState.yawRight = true;
                    break;

                case 81: /*Q*/
                    this.moveState.rollLeft = true;
                    break;
                case 69: /*E*/
                    this.moveState.rollRight = true;
                    break;

            }

            this.updateMovementVector();
            this.updateRotationVector();


        }
        //  this.domElement.addEventListener('mousemove', bind(this, this.mousemove), false);
        //  this.domElement.addEventListener('mousedown', bind(this, this.mousedown), false);
        //  this.domElement.addEventListener('mouseup', bind(this, this.mouseup), false);

        window.addEventListener('keydown', bind(this, this.keydown), false);
        window.addEventListener('keyup', bind(this, this.keyup), false);

    }; // end init_events

    MARS_ANI.OrbitCamera.prototype.move_time = 0;
    MARS_ANI.OrbitCamera.prototype.moving = false;
    MARS_ANI.OrbitCamera.prototype.move = function() {
        if (this.moving) {
            MARS_ANI.log(['camera', 'moving', 'rot'], 'moving');
            return;
        }

        this.moving = true;

        /*    if (!this.move_time) {
         this.move_time = new Date().getTime();
         this.last_msg_time = this.move_time;
         } else {*/
        var now = new Date().getTime();
        var span = now - this.move_time;
        this.move_time = now;

        this.updateMovementVector();

        this.moveVector.x += this.moveAdjVector.x * (span / 1000);
        this.moveVector.y += this.moveAdjVector.y * (span / 1000);
        this.moveVector.z += this.moveAdjVector.z * (span * 10000);

        var rot_x = Math.max(Math.PI * -1,
            Math.min(Math.PI,
                this.focus.rotation.x + this.moveVector.x
            )
        );

        var rot_y = _360_wrap(this.focus.rotation.y + this.moveVector.y);

        var move_z = this.position.z + this.moveVector.z;

        /*          if ((now - this.last_msg_time) > 5000) {
         this.last_msg_time = now;
         }*/

        this.focus.rotation.x = rot_x;
        this.focus.rotation.y = rot_y;
        this.position.z = move_z;
        _show_move(this);
        //   }

        this.moving = false;
    }

    function _360_wrap(d){
        while(d < 0){
            d += Math.PI * 2;
        }
        while (d >= Math.PI * 2){
            d -= Math.PI * 2;
        }
        return d;
    }

    MARS_ANI.OrbitCamera.prototype._inertia = false;

    MARS_ANI.OrbitCamera.prototype.updateMovementVector = function() {

        /* ********* UP/DOWN movement ********** */
        var adj = _adjust_value(this.moveState.up, this.moveState.down, this.moveAdjVector.x);
        this.moveAdjVector.x = adj;
        var adj = _adjust_value(this.moveState.left, this.moveState.right, this.moveAdjVector.y);
        this.moveAdjVector.y = adj;
        var adj = _adjust_value(this.moveState.forward, this.moveState.back, this.moveAdjVector.z);
        this.moveAdjVector.z = adj;
        if (adj && (!this._inertia)) {
            this._init_inertia();
        }
    }

    MARS_ANI.OrbitCamera.prototype._init_inertia = function() {
        if (!this._inertia) {
            var camera = this
            this._inertia = setInterval(function() {
                if ((camera.moveAdjVector.x == 0) && camera.moveVector.x) {
                    camera.moveVector.x *= 0.99;
                    if (Math.abs(camera.moveVector.x) < 0.0001) {
                        camera.moveVector.x = 0;
                    }
                }

                if ((camera.moveAdjVector.y == 0) && camera.moveVector.y) {
                    camera.moveVector.y *= 0.99;
                    if (Math.abs(camera.moveVector.y) < 0.0001) {
                        camera.moveVector.y = 0;
                    }
                }

                _show_move(this);
            }, 10);
        }
    }

    MARS_ANI.OrbitCamera.prototype.updateRotationVector = function() {

    }


    /** Utility fucntions *********/

    function _show_move(camera) {
        if (camera && camera.moveAdjVector) {
            $('#x_adj').html(camera.moveAdjVector.x.toFixed(4));
        }
        if (camera && camera.moveVector) {
            $('#x_move').html(camera.moveVector.x.toFixed(4));
        }
        if (camera && camera.focus && camera.focus.rotation) {
            $('#x_value').html(camera.focus.rotation.x.toFixed(4));
        }
        if (camera && camera.moveAdjVector) {
            $('#y_adj').html(camera.moveAdjVector.y.toFixed(4));
        }
        if (camera && camera.moveVector) {
            $('#y_move').html(camera.moveVector.y.toFixed(4));
        }
        if (camera && camera.focus && camera.focus.rotation) {
            $('#y_value').html(camera.focus.rotation.y.toFixed(4));
        }
        
        if (camera && camera.moveAdjVector) {
            $('#z_adj').html(camera.moveAdjVector.z.toFixed(4));
        }
        if (camera && camera.moveVector) {
            $('#z_move').html(camera.moveVector.z.toFixed(4));
        }
        if (camera && camera.focus && camera.focus.rotation) {
            $('#z_value').html(camera.position.z.toFixed(4));
        }
    }

    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

    function _adjust_value(u, d, v) {
        if (u != d) {
            if (u) {
                return 0.001;
            } else {
                return -0.001;
            }
        } else { // no movement - cross keys pressed
            return 0;
        }
    }

}


OrbitCameraExe();