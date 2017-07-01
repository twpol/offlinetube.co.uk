define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.contributor = !!localStorage.contributor;
		$scope.network = _.find(data, { key: $routeParams.network });
		$scope.line = _.find($scope.network.lines, { key: $routeParams.line });
		$scope.station = _.find($scope.network.stations, { key: $routeParams.station });
		$scope.lines = _.map($scope.station.lines, function (line) {
			return $scope.network.lines[line];
		});
		$scope.routes = _.map($scope.station.routes, function (route) {
			return _.defaults({
				line: $scope.network.lines[$scope.network.routes[route].line]
			}, $scope.network.routes[route]);
		});
	}];
});