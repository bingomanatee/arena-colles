module.exports = function(context){
    var self = this;
    var id = context.request.params.id;
    var lat = context.request.params.lat;
    var lon = context.request.params.long;
    var zoom = 1;
    
    function _after_tiles(err, tiles){
        context.flash('Renedered coordinates of map ' + id, 'info', '/maps/' + id);
        
        if(context.request.params.format == 'json'){
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.end(JSON.stringify(tiles));
        } else {
            context.render({tiles: tiles});
        }
        
    }
    
    var query = {lat: lat, lon: lon, zoom: 1};
    self.model.tile(id, query, _after_tiles);
    
    this.model.get(id, _get_map);
    
}