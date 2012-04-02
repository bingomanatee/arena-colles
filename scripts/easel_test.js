var Canvas = require('canvas');
var easel = require('easel');
var fs = require('fs');
var draw_canvas = require('support/draw_canvas');

module.exports = function (config, cb) {

    var canvas = new Canvas(400, 400);

    var stage = new easel.Stage(canvas);

    var g = new easel.Graphics();
    g.beginFill(easel.Graphics.getRGB(200, 210, 180));
    g.beginStroke(easel.Graphics.getRGB(0, 0, 0, 0.4));
    g.rect(0, 0, 120, 20);
    g.endStroke();
    g.endFill();

    var c = new easel.Container();
    c.addChild(new easel.Shape(g));

    stage.addChild(c);
    stage.update();

    draw_canvas(canvas, __dirname + '/easel_test.png',  cb);

    cb();

}