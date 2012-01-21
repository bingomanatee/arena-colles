module.exports = {
    name:'ac',
    prefix:'/ac',
    static:'public',

    on_render:function (req_state, params, done) {
        if (!params.hasOwnProperty('menu')) {
            req_state.framework.resources.menu(req_state, function (err, menu) {
                params.menu = menu;
                done();
            });

        } else {
            done();
        }
    }

}