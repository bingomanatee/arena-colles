var io = require('socket.io');
var fs = require('fs');
var util = require('util');
var express = require('../../../../node_modules/nuby-express/node_modules/express');
var connect = require('../../../../node_modules/nuby-express/node_modules/express/node_modules/connect');
var parse_cookie = connect.utils.parseCookie;
var app;
var mars_web_socket;
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

var session_ids = {};

function handler(req, res) {
    res.end(util.format("<html><body>Hello, your session ID is %s</body></html>", req.sessionID));
}


module.exports = function (controller, callback) {

    function _on_port(err, params) {
        console.log('socket params: %s', util.inspect(params));
/*
        app = express.createServer();

        app.configure(function () {
            app.use(express.cookieParser());
            app.use(express.session({secret:params.session_secret, key:params.sid}));
            app.use(handler);
        });
        app.listen(params.port); */

        /*
        var Session = connect.middleware.session.Session;

        function socket_auth(data, auth_callback) {
            console.log('socket data: %s', util.inspect(data));

            if (data.headers.cookie) {
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
                console.log('socket - data has no cookie %s', util.inspect(data));
                return auth_callback('No Cookie', false);
            }
        }
       */

        mars_web_socket = io.listen(params.port);
       // mars_web_socket.set('authorization', socket_auth);


        var intervalId;

        function _on_socket_conn(socket) {
            console.log('socket connected: %s', util.inspect(socket, null, 0));
                    var nid = 0;
            setInterval( function (){
                      nid = nid + 1;
                      socket.emit('news', {news: 'news ' + nid});
                  }, 5000);
            /*
            var handshake = socket.handshake;

            function _refresh_session() {
                handshake.session.reload(
                    function () {
                        handshake.session.touch().save();
                    }
                )
            }

            intervalId = setInterval(_refresh_session, 60 * 1000); */



            function _on_socket_done() {
                console.log('socket done');
            }

            mars_web_socket.sockets.on('disconnect', _on_socket_done);
        }


        mars_web_socket.sockets.on('connection', _on_socket_conn);
        console.log('returning mars web socket');
        callback(null, mars_web_socket);
    }

    controller.get_params(
        [
            {what:'mars_ws_port', absent:4000, 'as':'port'},
            {what:'session_key', absent:'sid'},
            {what: 'session_secret', absent: 'foo bar'}
        ],
        _on_port);
}