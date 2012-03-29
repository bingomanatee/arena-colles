$(function () {

    var canvas = document.getElementById('perlin');
    var ctx = canvas.getContext('2d');
    var stage = new Stage(canvas);

    var bm_canvas = document.getElementById('noise');
    var bctx = bm_canvas.getContext('2d');
    var imageData = bctx.getImageData(0, 0, 100, 100);
    var pixels = imageData.data;
    var c = Math.floor(Math.random() * 255);

    for (var i = 0; i < pixels.length; ++i) {
        if (!((i + 1) % 4)) {
            c = Math.floor(Math.random() * 255);
            pixels[i] = 255;
        } else {
            pixels[i] = 100;

        }
    }
    ctx.putImageData(imageData, 0, 0);

    var bbf = new BoxBlurFilter(4, 4, 0.5);

    var b = new Perlin(bm_canvas);
    b.filters = [bbf];
    b.scaleX = 8;
    b.scaleY = 8;
    stage.addChild(b);
    var b = new Perlin(bm_canvas);
    b.filters = [bbf];
    b.scaleX = 16;
    b.scaleY = 16;
    b.alpha = 0.6;
    stage.addChild(b);

    var c2 = new Container();
    c2.filters = [bbf];
    var b = new Perlin(bm_canvas);
    b.filters = [bbf];
    b.alpha = 0.4;
    b.scaleX = 4;
    b.scaleY = 4;
    stage.addChild(b);

    var c3 = new Container();
    c3.filters = [bbf];
    for (var x = 0; x < 400; x += 200)
        for (var y = 0; y < 400; y += 200) {

            var b = new Perlin(bm_canvas);
            b.filters = [bbf];
            b.x = x;
            b.y = y;
            b.alpha = 0.2;
            b.scaleX = 2;
            b.scaleY = 2;
            stage.addChild(b);
        }

    var c4 = new Container();
    c4.filters = [bbf];
    for (var x = 0; x < 400; x += 100)
        for (var y = 0; y < 400; y += 100) {

            var b = new Perlin(bm_canvas);
            b.filters = [bbf];
            b.x = x;
            b.y = y;
            b.alpha = 0.1;
            stage.addChild(b);
        }

    stage.update();
    bbf.applyFilter(ctx, 0, 0, 400, 400);
});