var param_module = require('mvc/params');
var model_module = require(MVC_MODELS);

module.exports = function(context) {
    var self = this;
    var params = param_module(this.name);

    model_module.model('randomwalks', function(err, m) {

        m.command(_walk_to(), function() {
            context.flash('Walk_to made', 'info', '/walkers');
        });
    })
}

function _walk_to() {
     function map() {
        path = {
            steps: this.points,
            steps: this.points.length,
            id: this._id
        };
        emit(this.last, {
            paths: [path]
        });
    };

    function reduce(key, values) {
        var out = {
            paths: []
        };

        values.forEach(function(value) {
            out.paths = out.paths.concat(value.paths);
        });

        return out;
    }

    function finalize(key, value) {
        var tiers = [];

        fvalue.paths.forEach(function(path) {
            var data = {
                points: path.points,
                id: points.id
            };
            if (tiers.indexOf(path.steps) == -1) {
                tiers[path.steps] = [data];
            } else {
                tiers[path.steps].push(data);
            }
        });
    }

    return {
        mapreduce: "randomwalks",
        map: map.toString(),
        reduce: reduce.toString(),
        finalize: finalize.toString(),
        out: "randomwalks_to",
        verbose: true
    };
}