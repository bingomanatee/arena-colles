require('./config');

require('connect');
var express = require('express');
var form = require('connect-form');
var mvc = require('mvc');

var app = express.createServer(
express.logger({format: ':method :url :status'}), 
express.bodyParser(), 
express.methodOverride(), 
express.cookieParser(), 
express.session({secret: MVC_SESSION_KEY}),
express.static(MVC_PUBLIC), 
form({ keepExtensions: true, uploadDir: __dirname + '/resources/file_uploads'})
);

require('launch').init(app, function() {
    mvc.load(app);
    require('./route').route(app);
    // static tokens
    app.helpers(
        { site_name:  MVC_SITE_NAME }
    );
    // view functions
    app.dynamicHelpers({
        messages: require('express-messages'),
        acl: function(req, res){
            if (req.hasOwnProperty('session') && req.session.hasOwnProperty('member')) {
                var member = req.session.member;
            } else {
                var member = false;
            }
            return function(can){
                return member ?  member.hasOwnProperty('actions') ? member.actions.indexOf(can) > -1 : false : false;
            }
        },
        session_member: function(req, res) {
            if (req.hasOwnProperty('session') && req.session.hasOwnProperty('member')) {
                return req.session.member;
            } else {
                return false;
            }
        }
    });
    console.log('starting to listen...');
    try {
        app.listen(MVC_PORT);
        console.log('MVC started on port ' + MVC_PORT);

    } catch (err) {
        console.log('error starting app listen ', err);

    }
});