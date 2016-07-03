'use strict';

var express = require("express");
var appServer = express();
var port = process.env.PORT || 3000;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require('fs');
var fse = require('fs-extra');
var mkdirp = require('mkdirp');
var server = require('http').Server(appServer);
var io = require('socket.io')(server);
var objTreeServer = require('./app_modules/getTreeServer.js')
var watcherFactory = require('./app_modules/watchersFactory.js')
appServer.use(express.static(path.join(__dirname, "public")));
appServer.use(cookieParser());
appServer.use(bodyParser.json());


io.on('connection', function(socket) {
  socket.on('destroyWatcher', function(obj) {
  		watcherFactory.destroyWatcher(obj)
  });
});

appServer.get('/getStartTree', function(req, res) {

	objTreeServer.getCurrentElementTree(res, __dirname, fs, io, __dirname)	
});	

appServer.post('/getCurrentTree', function(req, res) {
	objTreeServer.getCurrentElementTree(res, req.body.path, fs, io, __dirname)	
});	


server.listen(port);
console.log('server port - 3000');


