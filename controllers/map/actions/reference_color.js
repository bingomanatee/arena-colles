module.exports = function(context) {
    var id = context.request.params.id;
    id = this.model._as_oid(id);
    console.log(__filename, ': *********** ');
    var self = this;

    this.model.get(id, function(err, map) {
        console.log('map: ', map);
        var color = context.req_params().rc;
        console.log(__filename, ': color:', color, 'params: ', context.req_params());

        if (!map.hasOwnProperty('rc')) {
            map.rc = [];
        }

        map.rc.push(color);

        self.model.put(map, function(err, result) {
            if (err) {
                throw err;
            }
            console.log(__filename, ': put ', map, ', result: ', result);
            context.flash('Added reference color', 'info', '/maps/' + id);

        });

    });
}