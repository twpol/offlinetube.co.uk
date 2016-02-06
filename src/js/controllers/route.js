define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.network = _.first(data, { key: $routeParams.network });
		$scope.route = $scope.network.routes[$routeParams.route];
		$scope.line = $scope.network.lines[$routeParams.line];
		$scope.stations = _.map($scope.route.stations, function (station) {
			return $scope.network.stations[station];
		});
	}];
});