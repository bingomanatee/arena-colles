var nuby_strata =require('nuby-strata');

module.exports = {
    prefix: '/ac',
    static: __dirname + '/public'/*,

    _init: function(context, callback){
        var menu_data = require('./menu');

        this.menu = nuby_strata.menu.create(menu_data);

        callback(null, this);
    },

    on_render: function(env, body, callback){
        env._render_params.menu = this.menu.render(env);
        callback(null, env, body);
    } */

}