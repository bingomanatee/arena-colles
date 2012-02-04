var util = require('util');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var express = require('./node_modules/nuby-express/node_modules/express');
var ejs = require('./node_modules/nuby-express/node_modules/ejs');
var ne_static = require('./node_modules/nuby-express/lib/ne_static');
var ne = require('./node_modules/nuby-express');
var mongoose = require('./node_modules/mongoose');
var mongoose_init = require('./mongoose');

var session_secret = "scooby doo";
var static_contexts = [
    {root:__dirname + '/public', prefix:''}
];
var app = express.createServer();

//app.use(express.logger(...));
app.use(express.bodyParser());
app.use(express.cookieParser());

var MemoryStore = express.session.MemoryStore;
var session_store = new MemoryStore();
var session = express.session({secret:session_secret, store: session_store});

app.use(session);

app.set('view_engne', 'ejs');
app.register('.html', ejs);
app.set('view options', {layout:true});
app.set('views', __dirname + '/views');
app.set('static contexts', static_contexts);
app.set('session', session);
app.set('session_store', session_store);
app.use(ne_static({contexts:static_contexts}));

//app.use(express.errorHandler(...));

var port = 3000;

var fw_configs = {

    params:{
        session_secret:session_secret,
        flash_keys:['info', 'error'],
        mongo_params: mongoose_init.params,
        layout_id:'ac'
    },

    resources:{menu: require('./menu')},

    app_root:__dirname,

    app:app,

    _mongoose:null
}

var framework = new ne.Framework(fw_configs);

framework.add_layouts(__dirname + '/layouts', function () {
    var loader = new ne.Loader();
    // @TODO: put some timeout incase mongoose is not active.
    function _after_load() {

        function _on_mongoose_connected() {
            console.log('loaded ... listening on %s', port);
            app.listen(port);
        }

        framework.get_param({}, 'mongo_params', function (err, mongo_params) {
            mongoose_init.connect(mongo_params, _on_mongoose_connected);

        });
    }

    loader.load(framework, _after_load, [__dirname + '/admin', __dirname + '/app']);

});

