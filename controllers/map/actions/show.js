var params_module = require('mvc/params');
var model_module = require(MVC_MODELS);

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;
    var params = context.params();
    var result = this.model.get(id, function(err, map) {
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        } else if (map) {
            params.map = params.item = map;

            model_module.model('map_sectors', function(err, ms_model) {
                var sector_options = {
                    sort: [['min_lat', 1], ['east_long', 1]]
                };

                function _on_find(err, sectors) {
                    console.log(__filename, ': found sectors ', sectors);
                    params.sectors = sectors;
                    context.render(params);
                }

                ms_model.find({
                    map: map._id
                }, _on_find, sector_options);
            });

        } else {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        };
    });
    console.log(__filename, 'get returns now? ', result);
};