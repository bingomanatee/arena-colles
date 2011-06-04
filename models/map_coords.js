var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'map_coords',

    mixins: {
        on_load: function(model, callback) {
            function _on_index(err, iname) {
                console.log(__filename, ': created index ', iname);
                callback(null, model);
            }
        //    console.log(__filename, ': indexing ', model);
            // currently - index not working
           // model.config.coll.createIndex([{'position' : "2d" }], _on_index);
            callback(null, model);
        }
    }
}