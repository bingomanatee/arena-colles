var mongoose = require('mongoose');

module.exports = {
    _schema: null,

    _schema_def: {
        name: String
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def);
        }

        return module.exports._schema;
    }

}