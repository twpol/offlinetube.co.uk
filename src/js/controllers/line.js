define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.contributor = !!localStorage.contributor;
		$scope.network = _.find(data, { key: $routeParams.network });
		$scope.line = _.find($scope.network.lines, { key: $routeParams.line });
		$scope.stations = _.filter($scope.network.stations, function (station) {
			return _.includes(station.lines, $scope.line.index);
		});
		$scope.routes = _.filter($scope.network.routes, function (route) {
			return route.line === $scope.line.index;
		});
	}];
});