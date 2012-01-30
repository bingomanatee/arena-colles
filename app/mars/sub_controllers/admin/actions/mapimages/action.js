var util = require('util');

module.exports = {

    params:{
        layout:'ac_admin',
        render:{
            header:'Admin: Mars: Mapimages',

            breadcrumb:[
                {
                    link:'/',
                    title:'Home'
                },
                {
                    link:'/admin',
                    title:'Admin'
                },
                {
                    link:'/admin/mars',
                    title:'Mars'
                }
            ]
        }
    },

    route:'/admin/mars/mapimages',

    execute:function (req_state, callback) {
        var jui_ticket = require(req_state.framework.app_root + '/app/views/jui_ticket');
        var datagrid = require( req_state.framework.app_root + '/app/views/datagrid');

        function _on_mi(err, mi) {

            function _on_render_dg(err, mi_table) {
                    callback(null, {mapimages:mi_table, mapimage_data: mi, jui_ticket: jui_ticket});
            }

            function _irv(record) {
                var if_path = record.image_file;
                return if_path.replace('/Users/dave/Documents/Arena_Colles/resources/', '');
            }

            function _idv(record){
                return util.format('<a href="/admin/mapimage/%s">%s</a>', record._id, record._id);
            }

            var columns = [
                new datagrid.Column('_id', 'ID', {row_value: _idv }),
                new datagrid.Column('image_file', 'Image File', {row_value:_irv, cell_class: 'tt'}),
                //  new datagrid.Column('manifest.name', 'Name', {out_key:'name'}),
                new datagrid.Column('manifest.maximum_latitude', 'North Lat', {out_key:'n_lat', cell_class:'nm'}),
                new datagrid.Column('manifest.minimum_latitude', 'South Lat', {out_key:'s_lat', cell_class:'nm'}),
                new datagrid.Column('manifest.easternmost_longitude', 'East Long', {out_key:'e_long', cell_class:'nm'}),
                new datagrid.Column('manifest.westernmost_longitude', 'West Long', {out_key:'w_long', cell_class:'nm'})
            ];

            datagrid.render(columns, mi, _on_render_dg);

        }

        var mapimages_model = req_state.framework.models.mapimages;

        var fields = ['image_file',
            'manifest.maximum_latitude',
            'manifest.minimum_latitude',
            'manifest.easternmost_longitude',
            'manifest.westernmost_longitude'];

        mapimages_model.find({"manifest.name":'MEDIAN_TOPOGRAPHY'}, fields).sort('manifest.name', 1, 'manifest.easternmost_longitude', 1, 'manifest.maximum_latitude', 1).run(_on_mi);

    }
}
