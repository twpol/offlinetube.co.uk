define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.network = _.first(data, {key: $routeParams.network});
		$scope.line = $scope.network.lines[$routeParams.line];
		$scope.stations = _($scope.network.stations).values().filter(function(station) {
			return _.contains(station.lines, $scope.line.key);
		}).value();
		$scope.routes = _($scope.network.routes).values().filter(function(route) {
			return route.line === $routeParams.line;
		}).value();
	}];
});