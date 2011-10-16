

module.exports = function(context){

    var req_params = context.req_params(true);

    var lat = req_params.lat;
    var lon = req_params.lon;

    var self = this;

    function _on_find(err, tile){

    }

    var q = {east: {"$gte": lon}, west: {"$lt": lon}, north: {"$gt": lat}, south: {"$gte": lat}};

    this.model.find(q).next(_on_find);
}