module.exports = function(context){
    console.log(__filename, ': loading from context ', context);
    
    var self = this;
    var id = context.request.params.id;
    var lat = parseInt(context.request.params.lat);
    var lon = parseInt(context.request.params.lon);
    var zoom = 1;
    
    function _after_tiles(err, tiles){
       // console.log(__filename, ': tiles = ', tiles);
        //context.flash('Renedered coordinates of map ' + id, 'info', '/maps/' + id);
        
        if(context.request.params.format == 'json'){
            context.response.writeHead(200, {'Content-Type': 'application/json'});
            context.response.end(JSON.stringify(tiles));
        } else {
           context.render('map/tiles.html', {tiles: tiles, layout: false});
       }
        
    }
    
    var query = {zoom: 1, lat: lat, long: lon};
    
    console.log(__filename, ': getting query ', query);
    
    this.model.tiles(query, _after_tiles);
    
   // this.model.get(id, _get_map);
    
}