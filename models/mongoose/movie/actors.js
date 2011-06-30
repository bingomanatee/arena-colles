var mongoose = require('mongoose');

module.exports = {
    _schema: null,
    _sample_movie: {
        _id: 0,
        title: "Movie",
        scene: {
            actors: [{
                id: 0,
                offset: {
                    left: 200,
                    top: 580
                }
            }, {
                id: 1,
                offset: {
                    left: 300,
                    top: 580
                }
            }],
            props: [{}],
            setting: 1
        },
        lines: [{
            actor_number: '1',
            line: "hi",
            wait: true
        }, {
            actor_number: '2',
            line: "Hey there",
            wait: true
        }]
    },
    
    _schema_def: {
        id: String,
        offset_x: Number,
        offset_y: Number
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def);
        }

        return module.exports._schema;
    }
}