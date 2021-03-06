var param_module = require('mvc/params');

module.exports = function(context) {
	var self = this;
    var params = param_module(this.name);
    params.keys = require('./keys');
    
    self.model.all(function(err, items) {
         // console.log(__filename, ': ', items);
        params[params.plural] = params.items = items;
        if (!self._index_view) {
             // console.log(__filename, ': no view in module', self);
        } else {
             // console.log(__filename, ': index view: ', self._index_view);
        }
        context.render(self._views.index, params);
    });
}