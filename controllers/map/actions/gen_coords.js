

module.exports = function(context){
    var self = this;
    var id = context.request.params.id;
    
    function _after_gen(err, map){
        context.flash('Renedered coordinates of map ' + id, 'info', '/maps/' + id);
    }
    
    function _get_map(err, map){
        self.model.gen_coords(map, _after_gen);
    }
    
    this.model.get(id, _get_map);
    
}