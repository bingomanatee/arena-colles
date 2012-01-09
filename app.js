var express = require('./node_modules/nuby-express/node_modules/express');
var ejs = require('./node_modules/nuby-express/node_modules/ejs');
var ne_static = require('./node_modules/nuby-express/lib/ne_static');
var ne = require('./node_modules/nuby-express');
var app_menu_config = require('./menu');
var menu = require('./node_modules/nuby-express/lib/support/menu');
var app_menu = menu.create(app_menu_config);

var session_secret = "scooby doo";
var static_contexts = [
    {root:__dirname + '/public', prefix:''}
];
var app = express.createServer();

//app.use(express.logger(...));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:session_secret}));

app.set('view_engne', 'ejs');
app.register('.html', ejs);
app.set('view options', {layout:true});
app.set('views', __dirname + '/views');
app.set('static contexts', static_contexts);
app.use(ne_static({contexts:static_contexts}));
//app.use(express.errorHandler(...));

var port = 3000;

var fw_configs = {

    params:{
        session_secret:session_secret,
        flash_keys:['info', 'error']
    },

    menu: function(req_state, callback){
       callback(null, app_menu.render());
    },

    app:app
}

var framework = new ne.Framework(fw_configs);

framework.add_layouts(__dirname + '/layouts', function () {
    var loader = new ne.Loader();

    loader.load(framework, function () {
        console.log('loaded ... listening on %s', port);
        app.listen(port);
    }, [__dirname + '/admin', __dirname + '/app']);

});

