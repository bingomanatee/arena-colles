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
        callback();
    }

}