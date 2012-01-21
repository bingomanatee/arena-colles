var util = require('util');

module.exports = {
    route: '/',

    params: {
        layout_id: 'ac',
        render: {header: 'Welcome to Arena Colles'}
    },

    execute: function (req_state, callback){
        callback();

    }
}