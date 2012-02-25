var util = require('util');
var _ = require('underscore');

module.exports = {
    cell_format:function (cell) {
        return util.format('(c %s, r %s): h %s',
            module.exports.column_block(cell.col),
            module.exports.column_block(cell.row),
            _.pad(cell.height, 6, ' ', 'left'));
    },
    column_block: function (n) {
        return _.pad(n, 3, ' ', 'left');
    }
}