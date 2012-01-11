var util = require('util');

module.exports = {
    route: '/',

    params: {
        layout_id: 'ac',
        render: {header: 'Welcome to Arena Colles'}
    },

    execute: function (req_state, callback){

        this.framework.menu(req_state, function(err, menu){
         //   console.log('menu: %s', util.inspect(menu))
            callback(err, {menu: menu});
        })

    }
}