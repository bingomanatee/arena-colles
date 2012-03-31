(function (w) {

    var PerlinSet = easely('PerlinSet', Bitmap, 'Bitmap');
    var p = PerlinSet.prototype;
    _.extend(p, {

        _post_initialize:function (h, w, octaves, opBase) {
            this.image = document.createElement('canvas');
            this.image.width = w;
            this.image.height = h;
            this.octaves = octaves;
            this.opBase = opBase ? opBase : 2;

            this._make();

        },

        _make: function(){

            var stage = new Stage(this.image);
            var inc = 1;
            var xy = 0;
            console.log('ocataves from ', this.octaves, 'to 0');
            for (var octave = this.octaves; octave >= 0; --octave) {
                var scale = Math.pow(2, octave);
                var s = scale * 2;
                var op =  Math.pow(this.opBase, octave) / Math.pow(this.opBase, this.octaves) ;
                console.log('ADDING LAYER: opacity ', op, 'scale',
                    scale, 'octaves', octave, 'blur: ', s);
                var p2 = new PerlinLayer(this.image.height, this.image.width, scale, s, s);
                p2.alpha = op;
                inc *= 2;
                stage.addChild(p2);
            }
            stage.update();
        }

    });

    w.PerlinSet = PerlinSet;

})(window)