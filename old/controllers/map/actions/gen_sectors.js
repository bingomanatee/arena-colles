

module.exports = function(context){
    var self = this;
    var id = context.request.params.id;
    
    function _after_gen(err, map){
        console.log(__filename, "_after_gen: retrieved map ", map._id, ': ', map.name);
        context.flash('Renedered sectors of map ' + id, 'info', '/maps/' + id);
    }
    
    function _get_map(err, map){
        console.log(__filename, "_get_map: retrieved map ", map._id, ': ', map.name);
        self.model.gen_sectors(map, _after_gen);
    }
    
    this.model.get(id, _get_map);
    
}