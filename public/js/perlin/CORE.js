var PERLIN_CORE = {
    stage:null,
    update:false,
    colors:{
        black:Graphics.getRGB(0, 0, 0),
        button_back:Graphics.getRGB(230, 240, 240)
    }
}

function tick() {

    if (PERLIN_CORE.update) {
        PERLIN_CORE.update = false;
        PERLIN_CORE.stage.update();
        console.log('updating stage');
    }
}
$(function (w) {
    var canvas0 = document.getElementById('perlin');
    PERLIN_CORE.stage = new Stage(canvas0);
    PERLIN_CORE.perlin_set = new PerlinSet(400, 400, 6, 2.25);
    PERLIN_CORE.stage.addChild(PERLIN_CORE.perlin_set);

    _octave_button();
    _op_base_button();
    _analysis_button();

    PERLIN_CORE.update = true;
    Ticker.addListener(window);

    function _analyze() {

        if (PERLIN_CORE.sd_layer) {
            PERLIN_CORE.stage.removeChild(PERLIN_CORE.sd_layer);
        }

        PERLIN_CORE.sd_layer = new TerrainHeight(PERLIN_CORE.perlin_set.image);
        PERLIN_CORE.stage.addChild(PERLIN_CORE.sd_layer);
        PERLIN_CORE.update = true;
    }

    function _op_base_button() {
        var button = new Container();
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 70, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        var label = new Text('Opacity', "10pt Arial", PERLIN_CORE.colors.black);
        label.y = 14;
        label.x = 5;
        button.addChild(label);
        button.x = 5;
        button.y = 30;

        (function (target) {
            target.onPress = function (evt) {
                // bump the target in front of it's siblings:

                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    PERLIN_CORE.perlin_set.set_op_base((target.x - 5) / 50);
                    //target.y = ev.stageY+offset.y;
                    // indicate that the stage should be updated on the next tick:
                    PERLIN_CORE.update = true;
                }
            }
            target.onMouseOver = function () {
                PERLIN_CORE.update = true;
            }
            target.onMouseOut = function () {
                PERLIN_CORE.update = true;
            }
        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _octave_button() {
        var button = new Container();
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 70, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        var label = new Text('Octaves', "10pt Arial", PERLIN_CORE.colors.black);
        label.y = 14;
        label.x = 5;
        button.addChild(label);
        button.x = 5;
        button.y = 10;

        (function (target) {
            target.onPress = function (evt) {
                // bump the target in front of it's siblings:

                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    PERLIN_CORE.perlin_set.set_octaves((target.x - 5) / 25);
                    //target.y = ev.stageY+offset.y;
                    // indicate that the stage should be updated on the next tick:
                    PERLIN_CORE.update = true;
                }
            }
            target.onMouseOver = function () {
                PERLIN_CORE.update = true;
            }
            target.onMouseOut = function () {
                PERLIN_CORE.update = true;
            }
        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _analysis_button() {
        var button = new Container();
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 70, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        var label = new Text('Analyze', "10pt Arial", PERLIN_CORE.colors.black);
        label.y = 14;
        label.x = 5;
        button.addChild(label);
        button.x = 200;
        button.y = 380;

        (function (target) {
            target.onClick = function (evt) {
                _analyze();
            }

        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

});
