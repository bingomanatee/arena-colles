var au = require('util/array');
var Tilemap = require('mola2/tilemap');
var Canvas = require('canvas');
module.exports = function(id, callback){
    var self = this;

    this.get(id, function(err, tile ){
        if (!tile) throw new Error('cannot find id ' + id);
        if (err) console.log('err: ', err);
      //  console.log(tile);
        var h = tile.heights;
        tile.heights = false;
     //   tile.image_data.manifest = false;
        console.log('tile: ', JSON.stringify(tile, null, 4));
        tile.heights = h;
        
        var scale_x = 4;
        var so = scale_x / 2;
        var canvas = new Canvas(scale_x * tile.scale, scale_x * tile.scale);
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = false;
        ctx.fillRect(0, 0, canvas.width, canvas.heigth);

        var tilemap = new Tilemap(tile);

        tilemap.load_normals();

        au.d2(tile.scale, tile.scale, function(i, j){
            var normal = tilemap.normals[i][j];
            x = normal[0];
            y = normal[1];
            var base_shade = (512 / 4 ) / (Math.sqrt((x * x) + (y * y)));
            console.log('base shade: ', base_shade);
            ctx.beginPath();
            ctx.arc(j * scale_x + so, i * scale_x + so, scale_x / 1.5, 0, 2 * Math.PI);
            ctx.closePath();

            ctx.fillStyle = ('rgba(' + [0, 0, 0, base_shade].join(',') + ')');
            ctx.fill();
        });

        callback(null, canvas);
    });
}