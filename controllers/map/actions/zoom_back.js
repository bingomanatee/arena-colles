var models_module = require(MVC_MODELS);

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;

    function _after_zoom() {
        context.flash('Zoomed back ============ for map ' + id, 'info', '/maps/' + id);
    }

    console.log(__filename, ': zooming back ==================== from ', id);

    models_module.model('map_coords', function(err, mc_model){
        mc_model.zoom_back(id, _after_zoom);
    });
    
}