var util = require('util');

var express = require('./node_modules/nuby-express/node_modules/express');
var ejs = require('./node_modules/nuby-express/node_modules/ejs');
var ne_static = require('./node_modules/nuby-express/lib/ne_static');
var ne = require('./node_modules/nuby-express');
var app_menu_config = require('./menu');
var menu = require('./node_modules/nuby-express/lib/support/menu');
var app_menu = menu.create(app_menu_config);
var mongoose = require('./node_modules/mongoose');

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
        flash_keys:['info', 'error'],
        mongo_params:{
            port:27017,
            host:'localhost',
            db:'ac2'
        },
        layout_id: 'ac'
    },

    menu:function (req_state, callback) {
        callback(null, app_menu.render());
    },

    app:app,

    _mongoose:null,

    after_load:function (callback) {
        var self = this;

        this.get_param({}, 'mongo_params', function (err, mongo_params) {
        //    console.log('err: %s, prams: %s', util.inspect(err), util.inspect(mongo_params));
            mongoose.connect(util.format('mongodb://%s:%s/%s',
                mongo_params.host,
                mongo_params.port, mongo_params.db));
            mongoose.connection.on('open', callback);
        });
    }
}

var framework = new ne.Framework(fw_configs);

framework.add_layouts(__dirname + '/layouts', function () {
    var loader = new ne.Loader();

    loader.load(framework, function () {
        console.log('loaded ... listening on %s', port);

        framework.after_load(function () {
            app.listen(port);
        });

    }, [__dirname + '/admin', __dirname + '/app']);

});

