var mongoose = require('mongoose');

/**
 * NOTE: _id == the "resource ID" of the rest resource. Can be local or absolute. 
 */
var db = require('./db');
db.init();

module.exports = {
    _schema: null,
    
    _schema_def: {
         hours:          { type: Number, set: function (v) { return Math.round(v) ;}} 
       , minutes:        { type: Number, set: function (v) { return Math.round(v) ;}} 
       , seconds:        { type: Number, set: function (v) { return Math.round(v) ;}} 
       , time:           { type: Number, set: function (v) { return Math.round(v) ;}} 
    },
    
    schema: function(){
        if (!module.exports._schema){
            module.exports._schema = new mongoose.Schema(module.exports._schema_def);
        }
        
        return module.exports._schema;
    },
    
    time: function(s, m, h){
        if (!h){
            h = 0;
        }
        if (!m){
            m = 0;
        }
        if (!s){
            s = 0;
        }
        var t = {
            time: (s + (60 * m) + (60 * 60 * h))
        };
        t.seconds = t.time % 60;
        t.minutes = t.seconds % 60;
        t.hours   = t.minutes % 60; 
        return t;
    }
    
}