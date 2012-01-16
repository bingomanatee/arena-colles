var util = require('util');

module.exports = {
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
            header:'Arena Colles Members'
        },

        list:{
            count:30,
            page:0,
            sort:'name',
            name:'foo',
            email:'foo@bar.com',
            id:'penny',
            created:''
        }
    },

    load_req_params:true,

    execute:function (req_state, callback) {
        console.log('executing');


        function _on_list_params(err, list_params) {
            var form_params = list_params.hasOwnProperty('form') ? list_params.form.list : {};
            delete list_params.form;
            _.extend(list_params, form_params);
           // console.log('admin list render params: %s', util.inspect(list_params));

            function _on_members(err, members) {
                console.log('on members');
                if (err) {
                    return req_state.put_flash('Error on list: ' + err.message, 'error', '/admin');
                } else {
                    req_state.framework.menu(req_state, function (err, menu) {
                        _.extend(list_params, list_params.render, {members:members, menu:menu});
                        console.log('===================  list params: %s'
                            , util.inspect(list_params));
                        callback(err, list_params);
                    });
                }
            }

            var vp = _valid_params(list_params);
          //  console.log('vp: %s', util.inspect(vp));
            req_state.controller.model.find(vp, _on_members);
        }

        req_state.get_params([
            {what:['list', 'count'], as:'count', absent:30},
            {what:['list', 'page'], as:'page', absent:0},
            {what:['list', 'id'], as:'id', absent:''},
            {what:['list', 'email'], as:'email', absent:''},
            {what:['list', 'name'], as:'name', absent:''},
            {what:['list', 'created'], as:'created', absent:''},
            {what:['list', 'sort'], as:'sort', absent:'name'},
            'form',
            'render'
        ], _on_list_params);

    },

    route:'/admin/members',

    method:['get', 'post']

}

function _valid_params(params) {
    var out = {};

    ['id', 'name', 'email'].forEach(function (p) {

        if (params[p] != '') {
            out[p] = params[p];
        }

    });

    return out;
}