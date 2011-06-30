var params_module = require('mvc/params');
var model_module = require(MVC_MODELS);

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;
    var params = context.params();
    this.model.get(id, function(err, map) {
        if (err) {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        } else if (map) {
            params.map = params.item = map;

            model_module.model('map_sectors', function(err, ms_model) {
                ms_model.find({
                    map: map._id,
                    zoom: 1
                }, function(err, data) {

                    var sectors = [];
                    //params.sector_data = data;
                    
                    data.forEach(function(sector){
                        if (!sectors[sector.lat_i]){
                            sectors[sector.lat_i] = [];
                        }
                        
                        sectors[sector.lat_i][sector.lon_i] = sector;
                    })
                    
                    params.sectors = sectors;
                    
                    context.render(params);
                });
            });

        } else {
            context.flash('Cannot find ' + self.name + ' ' + id, 'error', '/' + params.plural);
        };
    });
};