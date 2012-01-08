/**
 //mvc_mongo = require('mvc/model/mongo');
 var mongo = require('mongodb');
 
 module.exports = {
 _db: null,
 
 open: function(callback) {
 self = module.exports;
 if (typeof (callback) != 'function'){
 throw new Error(__filename + ": no callback");
 } else if (self._db) {            
 callback(null, self._db);
 } else {
 var database = new mongo.Db(MONGODB_DB_NAME, new mongo.Server(MONGODB_SERVER_NAME, MONGODB_PORT, {}), {
 native_parser: false
 });
 database.open(function(err, db) {
 if (err) {
 callback(err);
 } else {
 //     // console.log(__filename + ':: returning database ');
 self._db = db;
 callback(null, db);
 };
 });
 }
 }
 
 }
 
 */

var Mongolian = require('mongolian');

module.exports = {
    _db: null,
    _server: null,

    db: function() {
        if (!module.exports._db){
        module.exports._db = module.exports.server().db(MONGODB_DB_NAME);
        }
        return module.exports._db;
    },
    
    open: function(callback){
        return callback(null, module.exports.db());  
    },

    server: function() {
        if (!module.exports._server) {
            module.exports._server = new Mongolian();
        }
        return module.exports._server;
    }
}