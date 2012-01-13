var member_model = require('./model/member');

module.exports = {

    params:{
        layout_id:'ac'
    },

    model: member_model(),

    manifest:[
        {
            path:'rest',
            type:'rest'
        },
        {
            path:'actions',
            type:'default'
        }
    ]

}