'use strict';

var watcherFactory = require('./../app_modules/watchersFactory.js')

 var getCurrentElementTree = function (res, parentPath, fs, io, __dirname_) {
	'use strict';
	var objThisDir;
	var childArr;
	var counter;
	var pathChild;
	var nameChild;
	var parentId;
	var childId;
	objThisDir = {};
	childArr = fs.readdirSync(parentPath);
	counter = childArr.length;
	// empty dir
	if (counter == 0) {
		if (res) {
			res.send({'emptyDir' : true})
			// if add new dir/file they send to client
		}
		else {
			io.emit('changeDirectory', {'emptyDir':true})
		}
	}
	//full dir
	else {
		fs.stat(parentPath, function(err, stats) {
			if (err) throw err;
			if (stats) {
				parentId = stats.ino;
				//recursive read property for child elements
				function childInfo() {
					nameChild = childArr[ counter - 1 ]
					pathChild = parentPath + '\\' + nameChild;
					fs.stat(pathChild, function(err, stats) {
						if (err) throw err;
						if (stats) {
							childId = stats.ino;
							objThisDir[nameChild] = {};
							objThisDir[nameChild].name = nameChild;
							objThisDir[nameChild].path = pathChild;
							objThisDir[nameChild].parentId = parentId;
							objThisDir[nameChild].id = childId;
							if (stats.isFile()) { objThisDir[nameChild].type = 'file' }
							if (stats.isDirectory()) {	objThisDir[nameChild].type = 'dir'	}
							counter--;
							if (counter != 0) {
								childInfo()
							}
							else {
								//then user open new directory 
								if (res) {
									// create watcher for monitoring change inner dir ( events : add file/dir, rename file/dir, remove file/dir)
									watcherFactory.createWatcherParentElement(parentPath, childArr, parentId, io, fs, getCurrentElementTree, __dirname_)
									res.send(objThisDir);
								}
								//then change tree directory on server  send socket  objThisDir
								else {
									// create new watcher for new tree directory - monitoring change inner dir ( events : add file/dir, rename file/dir, remove file/dir)
									watcherFactory.createWatcherParentElement(parentPath, childArr, parentId, io, fs, getCurrentElementTree, __dirname_)
									io.emit('changeDirectory', {
										'newTreeDirectory':objThisDir,
										'startPath' : (__dirname_).replace(/\\/g, "/"),
										'parentPath' : parentPath
									})
								}
							}
						}
					})
				}
				childInfo()
			}
		})
	}
}


module.exports = { 'getCurrentElementTree' : getCurrentElementTree }
