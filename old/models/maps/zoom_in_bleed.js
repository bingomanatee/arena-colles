var Gate = require('util/gate');
var models_module = require(MVC_MODELS);
var bleed_mr = require('./zoom_in_bleed_mr');

module.exports = function(id, zoom, callback) {
    var self = this;
    
    id = this._as_oid(id);

    models_module.model('map_coords', function(err, mc_model) {
        
        function _agg_bleed() {
            gate = new Gate(callback);

            function _zoom_in_model(err, zi_model) {
                function _zim_record(err, cursor) {
                    cursor.each(function(err, doc) {
                        if (doc) {
                            gate.task_start();
                            doc.i = doc._id.i;
                            doc.j = doc._id.j;
                            delete doc._id;
                            self.put(doc, function() {
                                gate.task_done();
                            });
                        }
                    });
                }

                zi_model.all(_zim_record, {
                    cursor: true
                });
            }

            models_module('gen_coords_zoom_in', _zoom_in_model, {}, true);
        }

        self.command(bleed_mr(id, zoom), callback);

    });

}