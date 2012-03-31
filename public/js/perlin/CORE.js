$(function () {
/*
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
    bctx.putImageData(imageData, 0, 0);


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
        } */
/*
    var canvas1 = document.getElementById('perlin1');
    var stage1 = new Stage(canvas1);
    var p1 = new PerlinLayer(400, 400, 1, 8, 12, 12);
    stage1.addChild(p1);
    stage1.update();

    var canvas2 = document.getElementById('perlin2');
    var stage2 = new Stage(canvas2);
    var p2 = new PerlinLayer(400, 400, 1/(Math.pow(2, 2)), 4, 6, 6);
    stage2.addChild(p2);
    stage2.update();

    var canvas3 = document.getElementById('perlin3');
    var stage3 = new Stage(canvas3);
    var p3 = new PerlinLayer(400, 400, 1/(Math.pow(2, 3)), 2, 2, 2);
    stage3.addChild(p3);
    stage3.update();

    var canvas4 = document.getElementById('perlin4');
    var stage4 = new Stage(canvas4);
    var p4 = new PerlinLayer(400, 400, 1/(Math.pow(2, 4)), 1, 1,1);
    stage4.addChild(p4);
    stage4.update();

    var canvas5 = document.getElementById('perlin5');
    var stage5 = new Stage(canvas5);
    var p5 = new PerlinLayer(400, 400, 1/(Math.pow(2, 5)), 0.5, 0, 0);
    stage5.addChild(p5);
    stage5.update();


    var canvas6 = document.getElementById('perlin6');
    var stage6 = new Stage(canvas6);
    var ctx = canvas6.getContext('2d');
    stage6.addChild(p1);
    stage6.addChild(p2);
    stage6.addChild(p3);
    stage6.addChild(p4);
    stage6.addChild(p5);
    stage6.update();
  //  var nf = new NormalFilter(2);
 //   nf.applyFilter(ctx, 0, 0, 200, 400);
//    var bf = new BoxBlurFilter(1,1, 4);
 //   bf.applyFilter(ctx, 0, 200, 400, 200); */

    var canvas0 = document.getElementById('perlin0');
    var stage0 = new Stage(canvas0);
    var p0 = new PerlinSet(400, 400, 6, 2.25);
    stage0.addChild(p0);
    stage0.update();
});