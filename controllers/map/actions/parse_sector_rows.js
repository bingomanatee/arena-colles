var model_module = require(MVC_MODELS);

module.exports = function(context) {
    var self = this;
    var map_id = context.request.params.id;
    var sector_id = context.request.params.sector_id;
    var sid = sector_id;
    var params = context.params();

    this.model.get(map_id, function(err, map) {
        params.map = map;
        console.log(__filename, ', parsing sector ', sector_id, ' of  map ', map_id);
        model_module.model('map_sectors', function(err, ms_model) {
            sector_id = ms_model._as_oid(sector_id);
            ms_model.get(sector_id, function(err, sector) {
                if (sector) {
                    params.sector = sector;
                    console.log(__filename, ': parsing sector ', sector);
                    sector.parsed = true;
                    ms_model.update(sector, function() {
                        console.log('sector updated.');
                        context.flash('parsed ' + sid, 'info', '/maps/' + map_id + '?sid = ' + sid);
                    });
                    console.log('parsing rows.... ');
                    ms_model.parse_rows(sector, function(e) {
                        console.log(__filename, ': @@@@@@@@@@@@ done parsing rows');
                    });
                } else {
                    props.sector = false;
                    console.render(params);
                }


            }); // end get sector
        }); // end model   
    });
}