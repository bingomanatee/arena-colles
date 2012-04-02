var Canvas = require('canvas');
var easel = require('easel');

module.exports = function (config, cb) {

    var canvas = new Canvas(400, 400);

    var stage = new easel.Stage(canvas);

    var g = new easel.Graphics();
    g.beginFill(PERLIN_CORE.colors.button_back);
    g.beginStroke(PERLIN_CORE.colors.black);
    g.rect(0, 0, 120, 20);
    g.endStroke();
    g.endFill();

    var Container = new easel.Container();
    c.addChild(new Shape(g));

    stage.addChild(c);

    cb();

}