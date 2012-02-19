module.exports = {

    params:{
        mars_ws_port:3456
    },

    manifest:[
        'actions',
        {type:'rest', path:'rest'},
        {type:'rest', path:'rest_lg'}
    ]

}