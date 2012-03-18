function init() {

    var canvas = document.getElementById("mars_state_canvas");

    //check to see if we are running in a browser with touch support
    stage = new Stage(canvas);

    var c = new Container();

    for (var lat = -90; lat < 90; ++lat) {
        for (var lon = 0; lon < 360; ++lon) {
            var g = new Graphics();
            if (lat < -88 || lat >= 88) {
                g.beginFill(Graphics.getRGB(200, 200, 200));
            } else {
                g.beginFill(Graphics.getRGB(0, 0, 0));
            }
            var top = (90 + lat) * 2;
            var left = (lon) * 2;
            g.drawRect(left, top, 2, 2);
            g.endFill();

            var s = new Shape(g);
            c.addChild(s);
        }
    }
    stage.addChild(c);
    stage.update();

    var j;
    var i;
    var interval;

    function _on_json(data) {
        j = data;
        i = 0;
        interval = setInterval(_write_line, 500);
    }

    function _write_line() {
        if (!j.length) {
            clearInterval(interval);
        } else {
            var data = j.shift();
            if (j.length){
                data = data.concat(j.shift);
            }
            if (j.length){
                data = data.concat(j.shift);
            }
            if (j.length){
                data = data.concat(j.shift);
            }
            if (j.length){
                data = data.concat(j.shift);
            }
            if (j.length){
                data = data.concat(j.shift);
            }

            data.forEach(function (row) {

                var g = new Graphics();
                var lat = row.lat;
                var lon = row.lon;

                if (lat < -88 || lat >= 88) {
                    g.beginFill(Graphics.getRGB(200, 200, 200));
                } else if (row.stat) {
                    g.beginFill(Graphics.getRGB(0,255,  0));
                } else {
                    g.beginFill(Graphics.getRGB( 255, 0,0));
                }
                var top = (90 + lat) * 2;
                var left = (lon) * 2;
                g.drawRect(left, top, 2, 2);
                g.endFill();

                var s = new Shape(g);
                stage.addChild(s);
            });
            stage.update();
        }
    }

    $.getJSON('/mars/state.json', _on_json);

}

var stage;
$(init);