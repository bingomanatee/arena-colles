(function (w) {


    var TerrainHeight = easely('TerrainHeight', Bitmap, 'Bitmap');
    var p = TerrainHeight.prototype;
    _.extend(p, {

        _post_initialize:function (canvas) {
            this.image = document.createElement('canvas');
            this.image.width = canvas.width;
            this.image.height = canvas.height;
            this.make(canvas);
        },

        make:function (canvas) {
            var min_sd = 100000;
            var max_sd = 0;

            var terrain = new CanvasTerrain(canvas);
            terrain.each_cell(function (cell) {
                var data = [cell.height];
                var nd = [];

                cell.each_neighbor(function (center, cell) {
                    nd.push(cell.toString());
                    data.push(cell.height);
                })

                var stat = new Stat(data);

                var sd = stat.std_dev();
                min_sd = Math.min(sd, min_sd);
                max_sd = Math.max(sd, max_sd);

                cell.sd = sd; 
                
                if ((cell.col < 10) && (cell.row < 10)){
                    var cid = '#n_r_' + cell.row + '_c_' + cell.col;
                    var c_ele = $(cid);
                    if (!c_ele){
                        throw new Error('cannot find cell ' + cid);
                    }
                    c_ele.html(nd.join('<br />') +
                        '<br /><b>sd: </b> ' + cell.sd);
                }
            });


            var range = max_sd - min_sd;

            var ctx = this.image.getContext('2d');
            var id = ctx.getImageData(0, 0, this.image.width, this.image.height);
            var row_offset = this.image.width * 4;

            terrain.each_cell(function (cell) {
                cell.sd_range = (cell.sd - min_sd) / range;
                var cell_offset = (cell.col * 4) + (row_offset * cell.row);
                var op =  _channel(cell.sd_range * 255);
                id.data[cell_offset] = 255;
                id.data[cell_offset + 1] = 0;
                id.data[cell_offset + 2] = 0;
                id.data[cell_offset + 3] = op;
               if (cell.row < 10 && cell.col < 10){
                   
                   var cid = '#op_r_' + cell.row + '_c_' + cell.col;
                   var c_ele = $(cid); 
                   c_ele.html('<br /><b>OP:</b>' + op);
               }
            });

            ctx.putImageData(id, 0, 0);

        }

    });

    function _channel(v){
        return Math.max(0, Math.min(255, Math.round(v)));
    }

    w.TerrainHeight = TerrainHeight;

})(window)