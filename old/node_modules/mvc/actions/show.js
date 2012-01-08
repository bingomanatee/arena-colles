var params_module = require('mvc/params');

module.exports = function(context) {
    var self = this;
    var params = context.params();
    this.model.get(context.request.params.id, function(err, item) {
        if (err) {
            context.next(err);
        } else if (item) {
            params[self.name] = params.item = item;
            context.render(params);
        } else {
            context.flash('Cannot find ' + self.name + ' ' + context.request.params.id, 'error');
            context.response.redirect('/' + params.plural);
        };
    })
}