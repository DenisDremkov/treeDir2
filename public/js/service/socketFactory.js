
angular.module('treeDir')

.factory('socket', ['socketFactory',  function(socketFactory) {
	return socketFactory()
}]);
