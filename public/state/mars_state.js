function init() {

    var canvas = document.getElementById("mars_state_canvas");
    var ctx = canvas.getContext('2d');
    var j;
    var i;
    var interval;
    var sm_canvas;
    var sm_canvas_ctx;
    var sm_canvas_id;
    var row = 0;

    function _on_json(data) {
        j = data;
        i = 0;

        sm_canvas = document.getElementById('mars_state_canvas_sm');
        sm_canvas_ctx = sm_canvas.getContext('2d');
        sm_canvas_id = sm_canvas_ctx.getImageData(0, 0, 360, 180);
        for (var i = 0; i < (360 * 180); ++i) {
            sm_canvas_id.data[i * 4] = 0;
        }

        interval = setInterval(_write_line, 50);
    }

    function _write_line() {
        if (row >= j.length) {
            clearInterval(interval);
        } else {
            var row_data = j[row];
            var lat = row + 2;
            var color;
            row_data.forEach(function (state, lon) {
                switch (state) {
                    case 1:
                        color = [100, 255, 50, 255];
                        break;

                    case 2:
                        color = [100, 120, 255, 255];
                        break;

                    default:
                        color = [200, 0, 25, 255];
                }

                var offset = 4 * ((360 * (lat)) + lon);
                for (var i = 0; i < 4; ++i) {
                    sm_canvas_id.data[offset + i] = color[i];
                }
            });
            ++row;
            /*
             var mt = 90;
             var mxt = -90;
             var data = j.shift();
             if (j.length) {
             data = data.concat(j.shift);
             }
             if (j.length) {
             data = data.concat(j.shift);
             }
             if (j.length) {
             data = data.concat(j.shift);
             }
             if (j.length) {
             data = data.concat(j.shift);
             }
             if (j.length) {
             data = data.concat(j.shift);
             }

             data.forEach(function (row) {

             var g;
             var lat = row.lat;
             var lon = row.lon;
             var color;

             if (mt > lat) mt = lat;
             if (mxt < lat) mxt = lat;

             if (lat < -88 || lat >= 88) {
             color = [0, 0, 0, 255]
             } else if (row.stat) {
             color = [100, 255, 50, 255]
             } else {
             color = [200, 0, 25, 255]
             }

             var offset = 4 * ((360 * (lat + 90)) + lon);
             for (var i = 0; i < 4; ++i) {
             sm_canvas_id.data[offset + i] = color[i];
             }
             }); */

            sm_canvas_ctx.putImageData(sm_canvas_id, 0, 0);

            ctx.drawImage(sm_canvas,
                0, 0, 360, 180,
                0, 0, 720, 360);
        }
    }

    $.getJSON('/mars/state/2.json', _on_json);

}

var stage;
$(init);