_create_animator = function() {
    MARS_ANI.Animator = function() {
    }

    MARS_ANI.dist = 2000;

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
            console.log('updating');

            var timer = new Date().getTime() * 0.0001;
            /*

             MARS_ANI.camera.position.x = Math.cos(timer) * MARS_ANI.dist;
             MARS_ANI.camera.position.z = Math.sin(timer) * MARS_ANI.dist;
             MARS_ANI.camera.target.position.x = Math.cos(timer) * MARS_ANI.dist/2;
             MARS_ANI.camera.target.position.z = Math.sin(timer) * MARS_ANI.dist/2;
             */
            MARS_ANI.planet._center.rotation.y = timer;

            if (MARS_ANI.dist > MARS_ANI.planet.radius + 20) {

                MARS_ANI.dist *= 0.995;
                MARS_ANI.camera.target.x += 1;
            }

            MARS_ANI.camera.position.z = -1 * MARS_ANI.dist;

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