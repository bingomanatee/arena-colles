
module.exports = function(context){
    var tile_id = context.req_params(true)['tile_id'];
    console.log(__filename, ': getting tile ', tile_id);
    this.model.tile(tile_id, function(err, tile){
        context.response.write(JSON.stringify(tile));
        context.response.end();
    });
    
}