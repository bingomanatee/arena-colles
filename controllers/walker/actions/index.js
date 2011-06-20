var Walker = require('walker');
var param_module = require('mvc/params');

module.exports = function(context) {
    var self = this;
    var params = param_module(this.name);
    var walker = params.walker = new Walker();
    walker.init(5, 5);
    //console.log(__filename, ': walker: ', walker);
    
    context.render(self._views.index, params);
}