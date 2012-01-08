var param_module = require('mvc/params');
var models_module = require(MVC_MODELS);

module.exports = function(context) {
	var self = this;
    var params = param_module(this.name);
    
    models_module.model('randomwalks', function(err, rw_model){
        rw_model.all(function(err, items){
        params.randomwalks = params.items = _.map(items, _parse_ids);
        context.render(self._views.index, params);
        }, {sort: '_id'});        
    });
    
    
    self.model.all(function(err, items) {
         // console.log(__filename, ': ', items);
    });
}

function _parse_ids(item){
    item.moves = item._id.split('');
    return item;
}