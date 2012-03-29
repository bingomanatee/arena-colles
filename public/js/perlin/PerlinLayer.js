(function (w) {

    var PerlinLayer = easely('Perlin', Bitmap, 'Bitmap');
    var p = Perlin.prototype;
    _.extend(p, {

        _post_initialize:function (h, w, source_canvas, op, scale) {
            this.filters = [new BoxBlurFilter(2, 2, 8)];
            this.image = document.createElement('canvas');
            this.image.width = w;
            this.image.height = h;

            var stage = new Stage(this.image);

            var sx = perlin.image.width * scale;
            var sy = perlin.image.height * scale;

            for (var x = 0; x < w; x += sx)
            for (var y = 0; y < h; y += sy){

                var p = new Perlin(source_canvas);
                p.alpha = op;
                p.scaleX = p.scaleY = scale;

                p.x = x;
                p.y = y;

                stage.addChild(p);

            }
        }

    });

    w.PerlinLayer = PerlinLayer;

})(window)