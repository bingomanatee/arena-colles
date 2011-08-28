_create_animator = function() {
    MARS_ANI.Animator = function() {
    }

    MARS_ANI.Animator.prototype = {
        
        animate: function() {
            this.update();
            requestAnimationFrame(this._handler());
            MARS_ANI.renderer.render();
        },

        _handler: function() {
            var self = this;
            return function() {
                self.animate();
            }
        },

        update: function(){
            
        }
    }

}

_create_animator();