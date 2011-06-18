var models_module = require(MVC_MODELS);
var Gate = require('util/gate');
var map_reduce = require('./zoom_back_map_reduce');

/* -------------- MAIN --------------------- */

    function _insert_row(err, doc, map_id, map_coords_model) {
        if (doc) {
            console.log(__filename, ': _insert_row from ', doc);
            if (doc.hasOwnProperty('value') && doc.value.hasOwnProperty('height') && doc.value.hasOwnProperty('position')){
                var new_point = doc.value;
                new_point.zoom = 1;
                _.defaults(new_point, doc._id);
                console.log('inserting new row: ', doc, '>>', new_point);
                gate.task_start();
                map_coords_model.insert(new_point, function() {
                    gate.task_done();
                });
            } else {
                console.log('ignoring document ', doc);
            }
        } else {
            console.log('no doc - starting gate');
            gate.start();
        }
    }

    function _insert_rows(err, mz_model, map_coords_model, map_id) {
        function _insert(err, cursor) {
            cursor.each(function(err, row){ _insert_row(err, row, map_id, map_coords_model); });
        }
        mz_model.all(
            function(err, cursor) {
            _insert(err, cursor, map_coords_model, map_id); },
            {
            cursor: true
        });
    }
    
//THIRD ACTION: put the zoom points back to the map_coords collection

function _insert_new_data(map_coords_model, map_id, callback) {
    console.log(__filename, ': _insert_new_data(', map_id, ')');
    gate = new Gate(callback);


    models_module.gen_model('map_zoom', function(err, mz_model) {
        _insert_rows(err, mz_model, map_coords_model, map_id);
    }, {}, true);
}

//SECOND ACTION: note the zooms into a temporary collection

function _create_zoombacks(map_coords_model, map_id, callback) {

    var mr = map_reduce(map_id, "map_zoom");
    console.log(__filename, ': _create_zoombacks for map ', map_id, mr);
    map_coords_model.config.db.command(mr, function() {
        console.log('executed command ', mr);
        
        _insert_new_data(map_coords_model, map_id, callback);
    });
}

module.exports = function(map_id, callback) {
    map_id = this._as_oid(map_id);
    var self = this;
    console.log(__filename, ': _zoom() ################## map =', map_id);
    //  var args = Array.prototype.slice.call(arguments, 0);
    //  console.log('arguments: ', args);
    //FIRST ACTION : knock all the zooms back one 
    try {
        //    console.log(__filename, ': _zoom: map_coords_model = ', map_coords_model, ': map_id: ', map_id);

        //FIRST ACTION UPDATE:
        var zoominc = {
            "$inc": {
                zoom: 1
            }
        };
        var filter = {
            map: map_id
        };

       self.update(zoominc, function() {
            _create_zoombacks(self, map_id, callback);
        }, filter, {multi: true});
   
    } catch (err) {
        if (err) {
            console.log(__filename, ': err ', err);
        }
        throw err;
    }
} // end _zoom