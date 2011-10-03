MARS_ANI._ani_exe = function() {
    MARS_ANI.log(['animate'], 'preparing animation');
    var Animator = function(ani) {
        this.ani = ani;

        this.queue = new MARS_ANI.Ani_Queue(this);
    }

    Animator.prototype = {

        animate: function() {
            var self = this;
            if (!this.ani_count) {
                this.ani_count = 0;
                this.ani_interval = 1000;
            }
            this.update();
            requestAnimationFrame(function() {
                if (!(self.ani_count++ % self.ani_interval)) {
                    MARS_ANI.log(['animate'], 'animating f ', self.ani_count);
                }
                self.animate();
            });
            this.ani.renderer.render();
        },

        ani_interval: 100,

        ani_count: 0,

        update: function() {
            if (!this.u_count) {
                this.u_count = 0;
                this.u_interval = 1000;
            }
            if (!(this.u_count++ % this.u_interval)) {
                MARS_ANI.log(['animate', 'update'], 'updating f ', this.ani_count);
            }
            this.queue.run();
        }
    }

    MARS_ANI.animator = new Animator(MARS_ANI);

    MARS_ANI.log(['animate', 'clear'], 'done with MARS_ANI.ani');
    // delete  MARS_ANI._ani_exe;
}

MARS_ANI._ani_exe()
