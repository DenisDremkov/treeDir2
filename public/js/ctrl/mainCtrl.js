

angular.module('MainCtrl',[])

.controller('mainCtrl', ['$http', '$compile', '$scope', 'mainFactory', 'socket', 'mainUrl', function($http, $compile, $scope, mainFactory, socket, mainUrl) {
	
	$scope.mainParent = undefined;
	$scope.vidjet = undefined;

	mainFactory.getStartTree($scope)

	$scope.showChild = function(path, id, event) {
		mainFactory.showChild(path, id, event, $scope)
	}

	socket.on('changeDirectory', function(newTree) {
		if (newTree.emptyDir) {
			console.log('empty')
		} 
		else {
			mainFactory.changeViewDirectoryThenChangeServerTree(newTree, $scope)
		}
	})

}]);


