module.exports = function(context) {
    var req_params = context.req_params(true);
    this.model.get(req_params.id, function(err, map) {
        var params = context.params({map: map});
        context.render('map/animate.html', params);
    });
}