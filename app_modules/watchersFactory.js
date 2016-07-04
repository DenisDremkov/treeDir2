
'use strict';

var allWatchers = {}

var createWatcherParentElement = function (parentPath, childArr, parentId, io, fs, getCurrentElementTree, __dirname_) {
	var newChildArr;
	var i;
	if (allWatchers[parentPath]) {
		clearInterval(allWatchers[parentPath])
		delete allWatchers[parentPath];
	}
	parentPath = parentPath.replace(/\\/g, "/")
	allWatchers[parentPath] = setInterval(function() {
		newChildArr = fs.readdirSync(parentPath);
		// add/delete file or directory 
		if (newChildArr.length != childArr.length) {
			clearInterval(allWatchers[parentPath])
			getCurrentElementTree(null, parentPath, fs, io, __dirname_);
		}
		else {
			if (newChildArr.length != 0 && childArr.length != 0) {}
			// rename file or directory - compare arrays for values
			for (i = 0; i < newChildArr.length; i++) {
				if (childArr.indexOf(newChildArr[i]) == -1) {
					clearInterval(allWatchers[parentPath])
					getCurrentElementTree(null, parentPath, fs, io, __dirname_);
				}
			}
		}
	},100)
}
// destroy all watchers that include path of this element	
var destroyAllWatchersForChildrens = function(objParent) {
	var prop; // path
	for(prop in allWatchers) {
		if (allWatchers.hasOwnProperty(prop)) {
			if (prop.indexOf(objParent.path) != -1 ) {
				clearInterval(allWatchers[prop])
			}
		}
	}
}
module.exports = {
	'createWatcherParentElement' : createWatcherParentElement,
	'destroyWatcher' : destroyAllWatchersForChildrens
}

