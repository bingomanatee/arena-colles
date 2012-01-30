var util = require('util');

module.exports = {

    load_req_params:true,

    params:{
        layout:'ac_admin',
        render:{
            header:'Admin: Mars: Mapimage',

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

    route:'/admin/mapimage/:id',

    execute:function (req_state, callback) {

        function _on_id(err, id) {

            function _on_mapimage(err, mi) {

                function _on_ticket(err, on_ticket) {
                    callback(null, {ticket:on_ticket, mapimage: mi});
                }

                var mi_ticket = require(req_state.framework.app_root + '/app/mars/views/tickets/mapimage_ticket');

                mi_ticket(_on_ticket, mi);
            }

            req_state.framework.models.mapimages.get(id, _on_mapimage);
        }

        req_state.get_param('id', _on_id);
    }

}