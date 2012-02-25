module.exports = function (cell) {
    var v = 0;

    if (cell.neighbors.t) {
        if (cell.neighbors.b) {
            v = cell.neighbors.b.height - cell.neighbors.t.height;
            v /= cell.terrain.length * 2;
        } else {
            v = cell.height - cell.neighbors.t.height;
            v /= cell.terrain.length;
        }
    } else if (cell.neighbors.b) {
        v = cell.neighbors.b.height - cell.height;
        v /= cell.terrain.length;
    }

    var h = 0;

    if (cell.neighbors.l) {
        if (cell.neighbors.r) {
            h = cell.neighbors.r.height - cell.neighbors.l.height;
            h /= cell.terrain.length * 2;
        } else {
            h = cell.height - cell.neighbors.l.height;
            h /= cell.terrain.length;
        }
    } else if (cell.neighbors.r) {
        h = cell.neighbors.r.height - cell.height;
        h /= cell.terrain.length;
    }

    //   console.log('%s: h : %s, v: %s', cell_format(cell), h, v);

    cell.normal = {r:128 + Math.round(-1280 * v), g:128 + Math.round(-1280 * h), b:255}
}