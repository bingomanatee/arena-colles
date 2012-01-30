var io = require('socket.io');
var fs = require('fs');
var util = require('util');

var express = require('nuby-express/node_modules/express');
var connect = require('nuby-express/node_modules/express/node_modules/connect');

var app;
var mars_web_socket;
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

function _on_port(err, params) {

    function handler(req, res) {
        res.end(util.format("<html><body>Hello, your session ID is %s</body></html>", req.sessionID));
    }

    app = express.createServer();

    app.configure(function () {
        app.use(express.cookieParser());
        app.use(express.session({secret:params.session_secret, key:params.sid}));
        app.use(handler);
    });
    app.listen(params.port);

    var Session = connect.middleware.session.Session;

    function socket_auth(data, auth_callback) {
        if (data.hasOwnProperty('headers') && data.headers.cookie) {
            data.cookie = parseCookie(data.headers.cookie);
            data.sessionID = data.cookie[params.sid];
            data.sessionStore = sessionStore;
            sessionStore.get(data.sessionID, function (err, session) {
                if (err || !session) {
                    auth_callback('Error' || err, false);
                } else {
                    data.session = new Session(data, session);
                    auth_callback(null, true);
                }
            });

        } else {
            return auth_callback('No Cookie', false);
        }
    }

    mars_web_socket = io.listen(app);
    mars_web_socket.set('authorization', socket_auth);
    var intervalId;

    function _on_socket_conn(socket) {
        console.log('socket with sessionID %s connected', handshake.sessionID);

        var handshake = socket.handshake;

        function _refresh_session() {
            handshake.session.reload(
                function () {
                    handshake.session.touch().save();
                }
            )
        }

        intervalId = setInterval(_refresh_session, 60 * 1000);

        function _on_socket_done() {
            console.log('closing socket');
            clearInterval(intervalId);
        }

        mars_web_socket.sockets.on('disconnect', _on_socket_done);

        var newsinc = 0;
        setInterval(function(){
            mars_web_socket.emit('news', 'news ' + newsinc++);
        }, 5000);
    }


    mars_web_socket.sockets.on('connection', _on_socket_conn);

    callback(null, mars_web_socket);
}

callback = function(){
    console.log('socket loaded');
}
_on_port(null, {session_secret: 'foo bar', port: 1000, key: 'express.sid'});