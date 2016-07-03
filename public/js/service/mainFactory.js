
angular.module('MainCtrl')


.factory('mainFactory',  ['$http', 'mainUrl', '$compile', '$rootScope', '$timeout', '$interval', 'socket',  function($http, mainUrl, $compile, $rootScope, $timeout, $interval, socket) {
	'use strict';

	function replaceForvardSlashCreateArr(result, triggerSlashForvard) {
		var newArr;
		var arr;
		var prop;
		newArr = [];
		for(prop in result) {
			if (!triggerSlashForvard) {
				result[prop].path = (result[prop].path).replace(/\\/g, "/")
			}
			newArr.push(result[prop])	
		}
		return newArr;
	};

	function createNewListElement(idParent, scope, arr, triggerOperation) {
		'use strict';
		var newElementString;
		var allElementsString;
		var thisItem;
		var ngClick;
		var id;
		var ngShow;
		var i;
		var icon;
		for (i = 0; i < arr.length; i++) {
			thisItem = arr[i];
			//create element
			id = "id = '" + thisItem.id + "'";
			ngClick = " ng-click = 'showChild(\"" + thisItem.path + "\", \"" + thisItem.id + "\", $event)' "; 
			ngShow =" ng-show = \"'" + thisItem.type + "'=== 'dir'\"";
			icon = "<i class='fa fa-folder-o' aria-hidden='true'></i>"
			newElementString = 	"<li " +  id + " " + ngClick + ngShow + ">" + icon + "<span>" + thisItem.name + "</span>" + "</li>";						
			if (!allElementsString) {
				allElementsString = newElementString
			}
			else {
				allElementsString += newElementString
			}
		}
		// two variant operation : get li elements or get ul + li
		if (!triggerOperation) {
			return "<ul class = '" + idParent + "-child-wrap wrap_for_child'>" + allElementsString + "</ul>"
		}
		else {
			return allElementsString
		}
	};

	return {

		getStartTree : function(scope) {
			$http.get(mainUrl.url + '/getStartTree')
				.success(function(result) {
					'use strict';
					var arr;
					arr = replaceForvardSlashCreateArr(result);
					scope.mainParent = arr
					scope.vidjet = arr
				})
				.error(function(err) {console.log(err)})
		},
		
		showChild : function(path, id, event, scope) {
			'use strict';
			event.stopPropagation();
			event.preventDefault();
			var arr;
			var currentElement;
			var newElement;
			currentElement = event.currentTarget;
			// close current dir
			if ($(currentElement).attr('data-open')) {
				$(currentElement).removeAttr('data-open')
				$(currentElement).removeClass('open_triangle')	
				$(currentElement).children('ul').remove()	
				scope.vidjet = undefined;			
				socket.emit('destroyWatcher', {'id' : id, 'path' : path})
			}
			//open current dir
			else {
				$(currentElement).attr('data-open', 'true')
				$('li').removeClass('open_triangle')	
				$(currentElement).addClass('open_triangle')	
				$http.post(mainUrl.url + '/getCurrentTree', {"id": id, "path" : path})
					.success(function(result) {
						// emptyDir (show in vidget)
						if (result.emptyDir) {
							$("#v-" + id).find('b').remove()
							$("#v-" + id).append('<b> директория пустая</b>')
						}
						// full dir
						else {
							arr = replaceForvardSlashCreateArr(result);
							scope[id] = arr;
							scope.vidjet = arr;
							newElement = $compile( createNewListElement(id, scope, arr) )( scope ) 
							angular.element(currentElement).append(newElement)
							$(currentElement).addClass('open_triangle')
						}
					})
					.error(function(err) {	console.log(err)	})		
			}	
		},
		changeViewDirectoryThenChangeServerTree : function(newTree, scope) {
			'use strict';
			var prop;
			var thisElement;
			var parentId;
			var idElementsServer = [];
			var idElementsDom = [];
			var parentElemDom;
			var elementsDom;
			var arrLiDom;
			var i;
			var j;
			var newElement;
			var mainObj = {};
			var parentIdVidget;
			// get id directory that now in vidget
			for (i = 0; i < scope.vidjet.length; i++) {
				parentIdVidget = scope.vidjet[i].parentId;
				break;
			}
			//get id parent directory (two variants : main directory or other )
			if (newTree.startPath === newTree.parentPath) {
				parentId = 'mainParent'
			}
			else {
				for(prop in newTree.newTreeDirectory) { 
					parentId = newTree.newTreeDirectory[prop].parentId
				}
			}
			//create array with id from server 
			for(prop in newTree.newTreeDirectory) { 
				mainObj[newTree.newTreeDirectory[prop].id] = newTree.newTreeDirectory[prop];
				idElementsServer.push(newTree.newTreeDirectory[prop].id)
			}
			//create array with id from dom 	
			elementsDom = $('#' + String(parentId)).children('ul').children('li') 	
			for (i = 0; i < elementsDom.length; i++) {
				idElementsDom.push(+ $(elementsDom[i]).attr('id'))
			}
			//BEGIN COMPARE=======================================
					// +++++++++++++++++test - delete================================
			for (i = 0; i < idElementsDom.length; i++) { 
				if (idElementsServer.indexOf(idElementsDom[i]) == -1) {
					$('#' + idElementsDom[i]).remove(); // delete from dom
					if (parentIdVidget === parentId) {
						for (j = 0; j < scope.vidjet.length; j++) { //delete from scope
							if (scope.vidjet[j].id == idElementsDom[i]) {
								scope.vidjet.splice(j, 1)
							}
						}
					}
				}
			}
					//++++++++++++++++++++test add=====================================
			for (i = 0; i < idElementsServer.length; i++) { 
				if (idElementsDom.indexOf(idElementsServer[i]) == -1) {
					for(prop in mainObj) {
						if (prop == idElementsServer[i]) {
							newElement = $compile( createNewListElement(parentId, scope, [mainObj[prop]], true) )( scope )
							// add main scope
							if (parentId === 'mainParent') {
								scope[parentId].push(mainObj[prop])
							}
							// add dom
							else {
								$('#' + String(parentId)).children('ul').append(newElement)
							}
							//add to vidget
							if (parentIdVidget === parentId) {
								scope.vidjet.push(mainObj[prop])
							}
						}
					}
				}
			}
					// +++++++++++++++++++++++++++test rename===================================
			for(prop in mainObj) {  
				for (i = 0; i < scope[parentId].length; i++) { //find scope
					if (scope[parentId][i].id === +prop) {
						if (scope[parentId][i].name !== mainObj[prop].name) {
							// change main scope
							if (parentId === 'mainParent') {						
								scope[parentId].push(mainObj[prop])
							}
							// change dom
							else {								
								$('#'+String(prop)).children('span').text(mainObj[prop].name)
							}
							//change vidget
							if (parentIdVidget === parentId) {
								for (j = 0; j < scope.vidjet.length; j++) {
									if (scope.vidjet[j].id === +prop) {
										if (scope[parentId][i].name !== mainObj[prop].name) {
											scope[parentId][i].name = mainObj[prop].name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}]);
