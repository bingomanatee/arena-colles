var member_model = require('./models/member');
var task_model = require('./models/task');
var path = require('path');
var ne = require('./../../node_modules/nuby-express');

module.exports = {

    params:{
        layout_id:'ac'
    },

    manifest:[
        {
            path:'rest',
            type:'rest'
        },
        {
            path:'actions',
            type:'default'
        },
        {
            path:'sub_controllers',
            type:'sub_controllers'
        }
    ]

}