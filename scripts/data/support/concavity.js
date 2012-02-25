
module.exports = _concavity = function (cell, recurse) {
    var hcount = 0;
    var hcavity = 0;
    var vcount = 0;
    var vcavity = 0;
    var rcount = 0;
    var rcavity = 0;

    if (cell.neighbors.t && cell.neighbors.b) {
        var slope_top = (cell.height - cell.neighbors.t.height);
        var slope_bottom = (cell.neighbors.b.height - cell.height);
        vcavity += (slope_bottom - slope_top);
        vcount += 1;

        if (!recurse) {
            rcavity += _concavity(cell.neighbors.t, true);
            ++rcount;
            rcavity += _concavity(cell.neighbors.b, true);
            ++rcount;
        }
    }

    if (cell.neighbors.l && cell.neighbors.r) {
        var slope_left = (cell.height - cell.neighbors.l.height);
        var slope_right = (cell.neighbors.r.height - cell.height);
        hcavity += (slope_right - slope_left);
        hcount += 1;

        if (!recurse) {
            rcavity += _concavity(cell.neighbors.l, true);
            ++rcount;
            rcavity += _concavity(cell.neighbors.r, true);
            ++rcount;
        }
    }

    var vslope = 0;
    var hslope = 0;

    var concavity = rcount ? rcavity / rcount : 0;

    if (hcount > 0) {
        var hslope = hcavity / hcount;

        if (vcount > 0) {
            var vslope = vcavity / vcount;
            if (Math.abs(vslope) > Math.abs(hslope)) {
                concavity += vslope;
            } else {
                concavity += hslope;
            }
        } else {
            concavity += hslope;
        }
    } else {

        if (vcount > 0) {
            var vslope = vcavity / vcount;
            concavity += vslope;
        } else {
            concavity += 0;
        }
    }
    if (!recurse) {
        cell.concavity = concavity;
    }
    return concavity;
}
