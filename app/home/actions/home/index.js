

module.exports = {
    route: '/',

    params: {
        layout_id: 'ac',
        render: {header: 'Welcome to Arena Colles'}
    },

    execute: function (req_state, callback){

        this.framework.menu(req_state, function(err, menu){
            callback(err, {menu: menu});
        })

    }
}