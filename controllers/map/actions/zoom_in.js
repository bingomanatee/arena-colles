var models_module = require(MVC_MODELS);

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;

    function _after_zoom() {
        context.flash('Zoomed in ============ for map ' + id, 'info', '/maps/' + id);
    }

    console.log(__filename, ': zooming in ==================== from ', id);

    this.model.get(id, function(err, map){
        self.model.zoom_in(id, map.zoom, _after_zoom);
    });
}