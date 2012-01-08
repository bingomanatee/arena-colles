var express = require('./node_modules/nuby-express/node_modules/express');
var ejs     = require('./node_modules/nuby-express/node_modules/ejs');

var session_secret = "scooby doo";

var app = express.createServer();

//app.use(express.logger(...));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: session_secret}));

app.set('view_engne', 'ejs');
app.register('.html', ejs);
app.set('view options', {layout: true});
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
//app.use(express.errorHandler(...));


module.exports = {

     params: {
         session_secret: session_secret,
         flash_keys: ['info', 'error']
     },

    app: app

}