var menu = require('./node_modules/nuby-express/lib/support/menu');

module.exports = function (req_state, callback) {
    var menu_config = {
        title:'Home',
        link:'/',
        children:[
            {
                title:'Mars',
                link:'/mars'
            },

            {
                title:'Admin',
                link:'/admin'
            }
        ]
    };

    function _on_member(err, member) {
        if (member) {
            menu_config.children.unshift(
                {
                    title:'Account',
                    link:'/account'
                },
                {
                    title:'Sign Out',
                    link:'/signout'
                }
            );
        } else {
            menu_config.children.unshift({
                    title:'Join',
                    link:'/join'
                },
                {
                    title:'Sign In',
                    link:'/signin'
                });
        }
        var menu_obj = menu.create(menu_config);

        callback(null, menu_obj.render());
    }

    req_state.framework.resources.active_member(req_state, _on_member);

}