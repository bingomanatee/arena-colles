models_module = require(MVC_MODELS);

module.exports = function(context) {
    
    console.log(__filename, 'recieved ', context.req_params());
    
    var self = this;
    var params = context.params();

    var query = context.req_params().walkto;
    for (var p in query){ query[p] = parseInt(query[p]); }
    console.log('looking for paths that end at ', query);

    models_module.model('randomwalks', function(err, rw_model) {
       // console.log(rw_model.config.coll);
       function _on_find(err, walks) {
            console.log(__filename, ': found walks ', walks.length);
            
            if (err) {
                console.log(__filename, ': _on_find error ', err);
                context.flash('Cannot find walks', 'error', '/walkers');
            } else {
                params.walks =  walks;
                params.dest_string = query['last.i'] + ',' + query['last.j'];
                context.render(params);
            };
        };
        rw_model.find(query, _on_find, {sort: {point_count: 1}});

    })
    
}