(function (w) {

    var NoiseFilter = easely('NoiseFilter', Bitmap, 'Bitmap');

    var p = NoiseFilter.prototype = new Filter();

    p.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
        targetCtx = targetCtx || ctx;
        if (targetX == null) {
            targetX = x;
        }
        if (targetY == null) {
            targetY = y;
        }

        try {
            var imageData = ctx.getImageData(x, y, width, height);
        } catch (e) {
            //if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
            return false;
        }

        var pixels = imageData.data;
        var c = Math.random();
        for (var i = 0; i < pixels.length; ++i) {
            if (!(i + 1) % 4) {
                c = Math.random();
            } else {
                pixels[i] = c;
            }
        }
    }

    var Perlin = easely('Perlin', Bitmap, 'Bitmap');
    var p = Perlin.prototype;
    _.extend(p, {

        _post_initialize:function () {
            this.filters = [new NoiseFilter()];
        }

    });

    w.Perlin = Perlin;

})(window)