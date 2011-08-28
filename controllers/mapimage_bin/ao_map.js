var mm = require(MVC_MODELS);

var Gate = require('util/gate');

module.exports = function(context) {
    var req_params = context.req_params(true);
    var id = req_params.id;

    var self = this;

    this.model.ao_map(id, function(err, canvas){
       canvas.createPNGStream().pipe(context.response);
    })
    
}