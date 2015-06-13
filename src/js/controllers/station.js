define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.network = _.first(data, {key: $routeParams.network});
		$scope.line = $scope.network.lines[$routeParams.line];
		$scope.station = $scope.network.stations[$routeParams.station];
		$scope.lines = _.map($scope.station.lines, function(line) {
			return $scope.network.lines[line];
		});
		$scope.routes = _.map($scope.station.routes, function(route) {
			return $scope.network.routes[route];
		});
	}];
});