_ = require('underscore');

module.exports = {

    route:'/admin',

    params:{
        render:{
            breadcrumb:[
                {link:'/',
                    title:'Home'},
                {
                    link:'/admin',
                    title:'Admin'
                }
            ],
            header:'Arena Colles Admin'
        }
    },

    execute:function (req_state, callback) {
        req_state.get_param('render', function (err, params) {
            console.log('get param - get render params');
            req_state.framework.menu(req_state, function (err, menu) {
                _.extend(params, {menu:menu});
                callback(err, params);
            });

        }, 'no render params');
    }

}