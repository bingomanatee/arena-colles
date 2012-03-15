var cf = require('./cell_format');
var cell_format = cf.cell_format;
var cc = cf.column_block;

var evap = 0.8;
var rolls = 30;

module.exports = function (terrain, cb) {

    var r = 0;
    var revalley = 5;
    var loop = 0;

    terrain.each_cell(function (cell) {
        cell.valleyness = 0.0;
        cell.drops = 1.0;
        cell.next_drops = 0.0;
    });

    terrain.each_cell(_prep_slope);

    function _drippage() {
        console.log("drippage %s", r);
        if (++r < rolls) {
            terrain.each_cell(_move_drops);
            terrain.each_cell(_roll_down);
            terrain.each_cell(function (cell) {
                cell.drops += 1.0 + cell.valleyness/3;
                cell.valleyness *= 0.66;
            });
            if (!(r % revalley)){
                terrain.each_cell(_prep_slope);
            }
            process.nextTick(_drippage);
        } else {
            terrain.each_cell(function (cell) {
                cell.valleyness += cell.drops;
            });
            cb();
        }
    }

    _drippage();
}

function _prep_slope(cell) {
    var cheight = cell.height + cell.valleyness;
    cell.ds = [];
    cell.ds_dist = [];
    var total_drops = 0.0;
    cell.each_neighbor(function (c, n) {
        var nheight = n.height + n.valleyness;
        if (nheight < cheight) {
            var d = (cheight - nheight);
            total_drops += d;
            cell.ds.push({drop: d, cell: n});
        }
    });

    if (total_drops > 0) {
        var a = 0.0;
        cell.ds.forEach(function (ds, i) {
            var chance = ds.drop / total_drops;
            for (var p = 0.05; p < chance; p += 0.05){
               cell.ds_dist.push(i);
            }
            ds.chance = chance + a;
            a += chance;
        })
    }
}

function _move_drops(cell) {
    if (cell.drops) {
        if (cell.ds.length) {
            if (cell.ds.length == 1){
                cell.ds[0].next_drops = cell.drops;
            } else {
                var ri = Math.floor(Math.random() * cell.ds_dist.length);
                var di = cell.ds_dist[ri];
                var ds = cell.ds[di];

                if (ds){
                    ds.cell.next_drops += cell.drops;
                }
            }
        }
        cell.drops = 0;
    }
}

function _roll_down(cell) {
    cell.valleyness += cell.next_drops;
    cell.drops = evap * cell.next_drops;
    cell.next_drops = 0;
}
