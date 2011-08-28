module.exports = function(context) {
    var self = this;
    var params = context.params();
    this.model.get(context.request.params.id, function(err, item) {
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + context.request.params.id, 'error');
            context.response.redirect('/' + params.plural);
        } else if (item) {

            self.model.deref(item.image_ref, function(err, image) {
                params.image = image;
                params[self.name] = params.item = item;
                context.render(params);
            });
        } else {
            context.flash('Cannot find ' + self.name + ' ' + context.request.params.id, 'error');
            context.response.redirect('/' + params.plural);
        }
    })
}