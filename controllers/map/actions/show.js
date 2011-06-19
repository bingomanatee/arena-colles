var params_module = require('mvc/params');

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;
    var params = context.params();
    this.model.get(id, function(err, item) {
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        } else if (item) {
            params[self.name] = params.item = item;
            self.model.point_count(id, function(err, counts){
                params.point_count = counts;
                context.render(params);
            });
        } else {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        };
    })
}