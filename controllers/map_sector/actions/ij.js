var mm = require(MVC_MODELS);

module.exports = function(context) {

    var self = this;
    var params = context.req_params(true);
    console.log('params: ', params);

    var map_id = params.map_id;
    var i = parseInt(params.i);
    var j = parseInt(params.j);

    console.log(__filename, ', i: ', i, ', j: ', j, 'map_id: ', map_id);

    var q = {
        map: map_id, i: i, j: j
    };

    this.model.find(q, {
        heights: 0
    }).toArray(function(err, sectors) {
        if (sectors.length) {
            var id = sectors[0]._id;
            console.log('fund sector ' + id);
            console.log('found sector; redirecting to ', id);
            context.redirect('/map_sectors/' + id);
        } else {
            context.flash('Cannot find sector ' + i + '/' + j + ' of map ', map_id, 'error', '/');
        }
    });


}