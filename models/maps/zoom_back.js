var models_module = require(MVC_MODELS);
var Gate = require('util/gate');
var map_reduce = require('./zoom_back_map_reduce');

function _zoom(err, map_coords_model, map_id, map_data, map_mode, callback) {
    console.log(__filename, ': _zoom() ##################');
  //  var args = Array.prototype.slice.call(arguments, 0);
  //  console.log('arguments: ', args);
    //FIRST ACTION : knock all the zooms back one 
    try {
    //    console.log(__filename, ': _zoom: map_coords_model = ', map_coords_model, ': map_id: ', map_id);
        //THIRD ACTION: put the zoom points back to the map_coords collection

        function _insert_new_data() {
            console.log(__filename, ': _insert_new_data');
            gate = new Gate(callback);

            function _insert_row(err, doc) {
                if (doc) {
                    var new_point = {
                        map: map_id,
                        i: doc._id.i,
                        j: doc._id.j,
                        height: doc.height,
                        position: new Array()
                    };

                    new_point.position.push(doc.position[0]);
                    new_point.posiiton.push(doc.position[1])

                    gate.task_start();
                    map_coords_model.insert(new_point, function() {
                        gate.task_done();
                    });
                } else {
                    gate.start();
                }
            }

            function _insert_rows(err, cursor) {
                cursor.each(_insert_row);
            }

            models_module.model('map_zoom', function(err, mz_model) {
                mz_model.all(_insert_rows, {
                    cursor: true
                });
            })
        }
        //SECOND ACTION: note the zooms into a temporary collection

        function _create_zoombacks() {
            console.log(__filename, ': _create_zoombacks');

            var mr = map_reduce(map_id);
            map_coords_model.config.db.runCommand(mr, _insert_new_data);
        }

        //FIRST ACTION UPDATE:
        var zoominc = { "$inc": { zoom: 1 } };
        var filter = { map: map_id };
        
        if (!map_coords_model){
            map_coords_model = arguments[1];
        }
        
        console.log(__filename,' : MAPCOOORDSMODEL:');
        console.log(map_coords_model);
        map_coords_model.update(zoominc, _create_zoombacks, filter);
        
    } catch (err) {
        if (err) {
            console.log(__filename, ': err ', err);
        }
        throw err;
    }
} // end _zoom
/* -------------- MAIN --------------------- */

module.exports = function(id, callback) {
    var self = this;
    var oid = this._as_oid(id);
    console.log(__filename, ': id: ', id, ', oid: ', oid, ': zoom back start');
    this.get(oid, function(err, map) {
        models_module.model('map_coords', function(err, map_coords_model) {
            _zoom(err, map_coords_model, oid, map, self, callback);
        });
    });
}