module.exports = function(context) {
    var req_params = context.req_params(true);

    this.model.color_map(req_params, function(err, canvas) {
        var stream = canvas.createPNGStream();
        stream.pipe(context.response);
    });

}