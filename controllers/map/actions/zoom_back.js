module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;

    function _after_zoom() {
        context.flash('Zoomed back ============ for map ' + id, 'info', '/maps/' + id);
    }

    console.log(__filename, ': zooming back ==================== from ', id);

    this.model.get(id, function(err, map) {
        self.model.zoom_back(id, _after_zoom);
    })

}