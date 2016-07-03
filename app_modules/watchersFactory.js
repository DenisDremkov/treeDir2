
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



















	// мониторит директорию на количество элементов если изменилось 
	// то считываетинфу про директорию и отправляет соккет на клиента



	// if (!watchers[id]) {
	// 	watchers[id] = setInterval(function() {
	// 		//watcher delete/rename 
	// 		fs.access(path, fs.F_OK, function(err) {
	// 			if (!err) {} 
	// 			else {
	// 				// scan Dir
	// 				// say client that catalog remove
	// 				io.emit(id, {'id':id})
	// 				//delete interval
	// 				watchers[id]
	// 				clearInterval(watchers[id])
	// 				delete watchers[id]
	// 			}
	// 		});
	// 	},1000)
	// }


// 	'destroyWatcher' : destroyWatcher
// var destroyWatcher = function() {
// //в основной обьект  вотчеров мы записываем под ино новый обьект у которого 
// // два свойства - путь и сам вотчер при удалении папки запускается функция 
// // которая проходит по всем вотчерам берет путь каждого берет путь удаленного
//  // и смотрит содержит ли путь текущего в цикле путь удаляемого, если да 
//  // то удаляем текущий  
// }


//rename, delete
// var createWatcherInnerElements = function (pathChild, mainPath, parentPath, ino, io, fs, getInfoForInnerElements) {
// 	if (!allWatchers[ino] ) {
// 		allWatchers[ino] = {}
// 		allWatchers[ino].path = pathChild;
// 		allWatchers[ino].pathParent = parentPath;
// 		childArr = fs.readdirSync(parentPath);
// 		allWatchers[ino].watcher = setInterval(function() {
// 			fs.access(pathChild, fs.F_OK, function(err) {
// 				if (err) {
// 					getInfoForInnerElements(null, parentPath, fs, mainPath, io);	
					
// 						clearInterval(allWatchers[ino].watcher)
					
// 					console.log('!:' + ino)
// 					setTimeout(function() {
// 						delete allWatchers[ino]
// 					},700)
					
// 					// console.log('da')
// 					// УДАЛЕНИЕ
// 					// ЭТО ВСЕ НА УДАЛЕНИЕ!!!!!!!!!!!  а переименование???????????????????
// 					// ЦИКЛОМ ПРОЙТИСЬ ПО ОБЬЕКТУ ВОТЧЕРА И УДАЛИТЬ ВСЕ СОДЕРЖАЩЕЕ путь

// 					// ПЕРЕИМЕНОВАНИЕ
// 					//watcher delete/rename 
// 					// scan Dir
// 					// // say client that catalog remove
// 					// io.emit(id, {'id':id})
// 					// //delete interval
// 					// allWatchers[id]
// 					// clearInterval(allWatchers[id])
// 					// delete allWatchers[id]
// 					} 
// 				});
// 			},500)
// 		}
	
// 	// console.log(thisLinkInObject)
// 	// for (var i = 0; i < pathRequestObject_.length; i++) {
// 	// 	console.log(pathRequestObject_[i])
// 	// }
// 	// // console.log(pathRequestObject)
// 	// console.log(ino)
// 	// console.log(io)

// 	// if (!watchers[id]) {
// 	// 	watchers[id] = setInterval(function() {
// 	// 		//watcher delete/rename 
// 	// 		fs.access(path, fs.F_OK, function(err) {
// 	// 			if (!err) {} 
// 	// 			else {
// 	// 				// scan Dir
// 	// 				// say client that catalog remove
// 	// 				io.emit(id, {'id':id})
// 	// 				//delete interval
// 	// 				watchers[id]
// 	// 				clearInterval(watchers[id])
// 	// 				delete watchers[id]
// 	// 			}
// 	// 		});
// 	// 	},1000)
// 	// }
// }