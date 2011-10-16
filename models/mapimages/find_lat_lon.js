

module.exports = function(lat, lon, callback){

    var q = {east: {"$gte": lon}, west: {"$lt": lon}, north: {"$gt": lat}, south: {"$gte": lat}};

    this.model.find(q).next(callback);
    
}