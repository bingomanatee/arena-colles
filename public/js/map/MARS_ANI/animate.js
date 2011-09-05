MARS_ANI._ani_exe = function() {
    MARS_ANI.log(['animate'], 'preparing animation');
    var Animator = function(ani) {
        this.ani = ani;
        this.queue = new MARS_ANI.Ani_Queue(this);
    }

    Animator.prototype = {

        animate: function() {
            var self = this;
            this.update();
            requestAnimationFrame(function() {
                if (!(self.ani_count++ % self.ani_interval)) {
                    MARS_ANI.log(['animate_frame'], 'animating frame ', self.ani_count);
                }
                self.animate();
            });
            this.ani.renderer.render();
        },

        ani_interval: 1000,

        ani_count: 0,

        update: function() {
            this.queue.run();
            //   console.log('updating');
        }
    }

    MARS_ANI.animator = new Animator(MARS_ANI);

    MARS_ANI.log(['animate', 'clear'], 'done with MARS_ANI.ani');
   // delete  MARS_ANI._ani_exe;
}

MARS_ANI._ani_exe()
