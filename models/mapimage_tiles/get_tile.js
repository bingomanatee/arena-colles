
module.exports = function(lat, lon, callback){
    this.find_one({lat: parseInt(lat), lon: parseInt(lon)}, callback);
}