var models_module = require(MVC_MODELS);
var Gate = require('util/gate');
var map_reduce = require('./zoom_back_map_reduce');

/* -------------- MAIN --------------------- */

    function _insert_row(err, doc, map_id, map_coords_model, gate) {
        if (doc) {
            console.log(__filename, ': _insert_row from ', doc);
            if (doc.hasOwnProperty('value') && doc.value.hasOwnProperty('height') && doc.value.hasOwnProperty('position')){
                var new_point = doc.value;
                new_point.zoom = 1;
                _.defaults(new_point, doc._id);
             //   console.log('inserting new row: ', doc, '>>', new_point);
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

    function _insert_rows(err, mz_model, map_coords_model, map_id, gate) {
        function _insert(err, cursor) {
            cursor.each(function(err, row){ _insert_row(err, row, map_id, map_coords_model, gate); });
        }
        mz_model.all(
            function(err, cursor) {
            _insert(err, cursor, map_coords_model, map_id); },
            {
            cursor: true
        });
    }

//FOURTH ACTION: adjust the lat/long count at zoom 1, then call callback

function half_ll(map_id, callback){
    
    function _with_maps(err, maps_model){
        function _with_map(err, map){
            if (!map){
                console.log(__filename, ': error getting map ', map_id,': ', err);
                throw err;
            }
            map.lat = parseInt(parseInt(map.lat) / 2);
            map.long = parseInt(parseInt(map.long) / 2);
            if (map.hasOwnProperty("height_data_taken_at")){
                map.height_data_taken_at = 1 + map.height_data_taken_at;
            } else {
                map.height_data_taken_at = 2;
            }
            map.km_per_pixel = 2 * (new Number(map.km_per_pixel).valueOf());
            maps_model.put(map, callback);
            delete map.height_data;
            console.log(__filename, ': puting map (height data omitted): ', map);
        }
        maps_model.get(map_id, _with_map);
    }
    
    models_module.model('maps', _with_maps);
}
    
//THIRD ACTION: put the zoom points back to the map_coords collection

function _insert_new_data(map_coords_model, map_id, callback) {
    console.log(__filename, ': _insert_new_data(', map_id, ')');
    
    
    gate = new Gate(function(){ _half_ll(map_id, callback) });

    models_module.gen_model('map_zoom', function(err, mz_model) {
        _insert_rows(err, mz_model, map_coords_model, map_id, gate);
    }, {}, true);
}

//SECOND ACTION: note the zooms into a temporary collection

function _create_zoombacks(map_coords_model, map_id, callback) {

    var mr = map_reduce(map_id, "map_zoom");
    console.log(__filename, ': _create_zoombacks for map ', map_id, mr);
    map_coords_model.command(mr, function() {
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