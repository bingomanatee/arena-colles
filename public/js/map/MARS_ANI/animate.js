_create_animator = function() {
    MARS_ANI.Animator = function() {
    }

    MARS_ANI.Animator.prototype = {

        animate: function() {
       //     console.log('animating...');
            var self = this;
            this.update();
            requestAnimationFrame(function() {
                self.animate();
            });
            MARS_ANI.renderer.render(MARS_ANI.scene, MARS_ANI.camera);
        },

        update: function() {
            MARS_ANI.stats.update();

				var timer = new Date().getTime() * 0.001;

				MARS_ANI.camera.position.x = Math.cos( timer ) * 800;
				MARS_ANI.camera.position.z = Math.sin( timer ) * 800;

			/*	for ( var i = 0, l = MARS_ANI.objects.length; i < l; i++ ) {

					var object = MARS_ANI.objects[ i ];

					object.rotation.x += 0.01;
					object.rotation.y += 0.005;

				} */
        }
    }

}

_create_animator();

MARS_ANI.animator = new MARS_ANI.Animator();