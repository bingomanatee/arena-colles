var member_model = require('./model/member');
var task_model = require('./model/task');
var path = require('path');

module.exports = {

    params:{
        layout_id:'ac',
        task_form_view:path.resolve(__dirname, 'views/forms/task.html')
    },

    model:member_model(),

    task_model:task_model(),

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