$(function(){

    var canvas = document.getElementById('perlin');

    var stage = new Stage(canvas);

    var bm_canvas = document.getElementById('noise');
    bm_canvas.width = bm_canvas.height = 100;
    var ctx = bm_canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0);
    var pixels = imageData.data;
    var c = Math.random();
    for (var i = 0; i < pixels.length; ++i) {
        if (!(i + 1) % 4) {
            c = Math.random();
        } else {
            pixels[i] = c;
        }
    }
    ctx.putImageData(imageData, 0, 0);

    var b = new Perlin(bm_canvas);
    b.cache(0, 0, 100, 100);
    stage.addChild(b);
    stage.update();

});