var mongoose = require('mongoose');
var util = require('util');

module.exports = {
    params:{
        port:27017,
        host:'localhost',
        db:'ac2'
    },
    connect:function (mongo_params, callback) {
        if (!mongo_params) {
            mongo_params = module.exports.params;
        }
        var conn_string = util.format('mongodb://%s:%s/%s',
            mongo_params.host, mongo_params.port, mongo_params.db);

        console.log('conn string: %s', conn_string);
        mongoose.connect(conn_string);
        mongoose.connection.on('open', callback);
    }
}