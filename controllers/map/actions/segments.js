var util = require('util');
var mm = require(MVC_MODELS);

module.exports = function(context) {
    context.render( 'map/segments.html', context.req_params(true));
};
