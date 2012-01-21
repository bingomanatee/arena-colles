module.exports = {
    name:'ac_admin',
    prefix:'/ac_admin',
    static:'public',

    on_render:function (req_state, params, done) {
        if (!params.hasOwnProperty('menu')) {
            req_state.framework.menu(req_state, function (err, menu) {
                params.menu = menu;
                done();
            });

        } else {
            done();
        }
    }
}