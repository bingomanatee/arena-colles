var param_module = require('mvc/params');
var model_module = require(MVC_MODELS);
var Random_Walker = require('walker/random');

var coverage = require('walker/random/coverage');

module.exports = function(context) {
    var self = this;
    var params = param_module(this.name);

    function _coverage_model(err, coverage_model) {
        coverage_model.all(function(err, records) {
            var coverage_matrix = [];
            for (var i = -12; i < 13; ++i) {
                coverage_matrix[i + 15] = [];
                for (var j = -12; j < 13; ++j) {
                    coverage_matrix[i + 15][j + 15] = {i: i, j: j, count: 0};
                }

            }
            records.forEach(function(record) {
                coverage_matrix[record._id.i + 15][record._id.j + 15].count = record.value.count;
            });

            params.matrix = coverage_matrix;
            context.render(params);
        });
    };

    model_module.model('randomwalks_coverage', _coverage_model);

}

function recreate_coverage_model(err, coverage_model) {
    coverage_model.all(function(err, records) {
        var coverage_matrix = [];
        for (var i = -12; i < 13; ++i) {
            coverage_matrix[i] = [];
            for (var j = -12; j < 13; ++j) {
                coverage_matrix[i][j] = 0;
            }

        }
        records.forEach(function(record) {
            coverage_matrix[record._id.i][record._id.j] = record.value;
        });

        params.matrix = coverage_matrix;
        context.render(params);
    });
};