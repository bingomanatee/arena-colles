var Gate = require('util/gate');
/*
 * reduces a quartet of points to a parent point
 * Zoomer is designed to iterate over a limited quadrant of points.
 * Note that the increment_zoom function has to be called ONCE for the map
 * - not once for a quadrant
*/

var debug_inc = 50;

function Zoomer(mc_model, map_id, i, j, extent) {
    this.mc_model = mc_model;
    this.start_i = i;
    this.start_j = j;
    this.extent = extent;
    this.map_id = map_id;
    this.children = NULL;
}

Zoomer.prototype = {

    _inc_set: {
        "$inc": {
            zoom: 1
        }
    },

    _increment_query: function() {
        var increment_query = {
            zoom: 1,
            map: this.map_id            
        };
        
        return increment_query;
    },

    /**
     * set the previous set of zooms to one deeper
     */
    
    increment_zooms: function(callback) {
        this._mc_model.update(this._inc_set, callback, this._increment_query());
    },

    _i_j_query: function() {

        var query = {
            map: this.map_id,
            zoom: 2,
            i: {
                "$gte": this.start_i,
                "$lte": this.start_i + this.extent
            },
            j: {
                "$gte": this.start_j,
                "$lte": this.start_j + this.extent
            }
        }

        return query;
    },
    
    /**
     * pull a slice of data into the oblect
     * for later processing
     */
    
    get_children: function(callback){
        var self = this;
        
        function _gc(err, data){
            self.children = data;
            callback(err, data);
        }
        
        this.mc_model.find(this._i_j_query(), _gc);
    },

    _new_point: function(docs, i, j) {
        if (docs.length > 0) {
            var height = 0;
            var count = 0;
            var lon = 0;
            var lat = 0;
    
            docs.forEach(function(doc) {
                height += doc.height;
                lon += doc.position[0];
                lat += doc.position[1];
                ++count;
            });
            height /= count;
            lon /= count;
            lat /= count;

            var parent = {
                zoom: 1,
                i: i,
                j: j,
                map: this.map_id,
                height: Math.round(height),
                position: new Array()
            }

            parent.position.push(lon);
            parent.position.push(lat);

            return parent;
        } else {
            console.log(__filename, ': _new_point(', i, ', ', j, ') has no docs');
            return false;
        }
    },

    _add_parent_reference_to_docs: function(err, new_parent, docs, mc_model, self, gate) {
        docs.forEach(function(doc) {
            doc.parent = new_parent._id;
            gate.task_start();
            mc_model.put(doc, function() {
                gate.task_done();
            });
        });
    },

    _process_subpoints: function(i, j, ij_children, callback) {
        var new_point = _new_point(ij_children, i/2, j/2);

        if (new_point) {
            this.mc_model.put(new_point, callback);
        } else {
            callback(new Error('no points'));
        }
    },

    _get_ij_children: function(i, j){
        return _.select(this.children,
            function(child){
                 if (child.i < i) return false;
                 if (child.i > i + 2) return false;
                 if (child.j < j) return false;
                 if (child.j > j + 2) return false;
                 return true;
            }
        );
    },
    
    _parents_from_children: function(callback){
        var self = this;
        
        var gate = new Gate(callback);
        
        for (var i = this.i; i <= this.i + this.extent; i += 2){
            for (var i = this.j; i <= this.j + this.extent; j += 2){
                var ij_children = this._get_ij_children(i, j);
                gate.task_start();
                self._process_subpoints(i, j, ij_children, function(){
                    gate.task_done();
                })
            }
        }
        gate.start();
    },

    make_parents: function(callback) {
        var self = this;
        
        this.get_children(function(){self._parents_from_children.call(self, this._parents_from_children, callback); });
    }
}

module.exports = Zoomer;