(function (w) {

    var Perlin = easely('Perlin', Bitmap, 'Bitmap');
    var p = Perlin.prototype;
    _.extend(p, {

        _post_initialize:function (canvas) {
            this.filters = [new NoiseFilter()];
            this.image = canvas;
            var ctx = canvas.getContext("2d");
            var w = canvas.width;
            var h = canvas.height;
            var l = this.filters.length;
            new NoiseFilter().applyFilter(ctx, 0, 0, w, h);
        }

    });

    w.Perlin = Perlin;

})(window)