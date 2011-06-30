var models_module = require(MVC_MODELS);
var context_module = require('mvc/controller/context');

module.exports = {
    collection: 'randomwalks',

    mixins: {
        _as_oid: function(f){return f;}
    }
}
