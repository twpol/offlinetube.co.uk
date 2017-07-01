define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.contributor = !!localStorage.contributor;
		$scope.network = _.find(data, { key: $routeParams.network });
		$scope.route = _.find($scope.network.routes, { key: $routeParams.route });
		$scope.line = _.find($scope.network.lines, { key: $routeParams.line });
		$scope.stations = _.map($scope.route.stations, function (station) {
			return $scope.network.stations[station];
		});
	}];
});